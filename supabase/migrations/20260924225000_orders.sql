-- ============================================================
-- Phase 4: Orders & Cart
-- ============================================================

-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    status text NOT NULL DEFAULT 'pending',
    subtotal numeric NOT NULL,
    delivery_fee numeric NOT NULL DEFAULT 0,
    total numeric NOT NULL,
    delivery_name text NOT NULL,
    delivery_phone text NOT NULL,
    delivery_address text NOT NULL,
    delivery_city text NOT NULL,
    delivery_state text NOT NULL,
    delivery_pincode text NOT NULL,
    payment_method text NOT NULL DEFAULT 'cash_on_delivery',
    payment_status text NOT NULL DEFAULT 'pending',
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    farmer_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    product_name text NOT NULL,
    price_per_kg numeric NOT NULL,
    quantity_kg numeric NOT NULL,
    subtotal numeric NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- Auto-update updated_at timestamp on order changes
CREATE OR REPLACE FUNCTION public.handle_order_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_order_update
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE PROCEDURE public.handle_order_update();

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Orders RLS: Buyers can read and create their own orders
CREATE POLICY "Buyers can view their own orders"
    ON public.orders FOR SELECT
    USING (auth.uid() = buyer_id);


-- Order Items RLS: Buyers can read items of their own orders
CREATE POLICY "Buyers can view their own order items"
    ON public.order_items FOR SELECT
    USING (
        order_id IN (
            SELECT id FROM public.orders WHERE buyer_id = auth.uid()
        )
    );

-- We do not allow buyers to directly insert into order_items.
-- Order creation will be handled atomically by an RPC function.

-- Create RPC function to handle order creation securely
CREATE OR REPLACE FUNCTION public.create_order(
    p_delivery_name text,
    p_delivery_phone text,
    p_delivery_address text,
    p_delivery_city text,
    p_delivery_state text,
    p_delivery_pincode text,
    p_payment_method text,
    p_items jsonb -- Array of { product_id, quantity_kg }
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER -- Runs as database owner so it can insert order_items and update products
SET search_path = public
AS $$
DECLARE
    v_buyer_id uuid;
    v_order_id uuid;
    v_item jsonb;
    v_product record;
    v_order_subtotal numeric := 0;
    v_item_subtotal numeric;
BEGIN
    -- Get the authenticated user
    v_buyer_id := auth.uid();
    IF v_buyer_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Create the initial order record
    INSERT INTO public.orders (
        buyer_id, status, subtotal, delivery_fee, total,
        delivery_name, delivery_phone, delivery_address, delivery_city, delivery_state, delivery_pincode,
        payment_method, payment_status
    ) VALUES (
        v_buyer_id, 'pending', 0, 0, 0, -- Subtotal and total will be updated later
        p_delivery_name, p_delivery_phone, p_delivery_address, p_delivery_city, p_delivery_state, p_delivery_pincode,
        p_payment_method, 'pending'
    ) RETURNING id INTO v_order_id;

    -- Process each item
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        -- Fetch the product details and lock the row for update
        SELECT * INTO v_product
        FROM public.products
        WHERE id = (v_item->>'product_id')::uuid AND is_active = true
        FOR UPDATE;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product not found or inactive: %', v_item->>'product_id';
        END IF;

        IF v_product.quantity_kg < (v_item->>'quantity_kg')::numeric THEN
            RAISE EXCEPTION 'Insufficient quantity for product: %', v_product.name;
        END IF;

        IF (v_item->>'quantity_kg')::numeric <= 0 THEN
             RAISE EXCEPTION 'Invalid quantity for product: %', v_product.name;
        END IF;

        -- Calculate subtotal based on DB price
        v_item_subtotal := v_product.price_per_kg * (v_item->>'quantity_kg')::numeric;
        v_order_subtotal := v_order_subtotal + v_item_subtotal;

        -- Insert order item
        INSERT INTO public.order_items (
            order_id, product_id, farmer_id, product_name, price_per_kg, quantity_kg, subtotal
        ) VALUES (
            v_order_id, v_product.id, v_product.farmer_id, v_product.name, v_product.price_per_kg, (v_item->>'quantity_kg')::numeric, v_item_subtotal
        );

        -- Reduce product quantity
        UPDATE public.products
        SET quantity_kg = quantity_kg - (v_item->>'quantity_kg')::numeric
        WHERE id = v_product.id;
    END LOOP;

    -- Update the order total
    -- For prototype, we assume delivery fee is 40
    UPDATE public.orders
    SET subtotal = v_order_subtotal,
        delivery_fee = 40,
        total = v_order_subtotal + 40
    WHERE id = v_order_id;

    RETURN v_order_id;
END;
$$;

-- Restrict execution to authenticated users
REVOKE EXECUTE ON FUNCTION public.create_order(text, text, text, text, text, text, text, jsonb) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, text, text, text, jsonb) TO authenticated;
