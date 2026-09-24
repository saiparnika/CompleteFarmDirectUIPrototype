-- ============================================================
-- Phase 5: Farmer Order Management
-- ============================================================

-- Grant SELECT permissions to authenticated users for orders and order_items (in case it's not already handled cleanly or for clarity, though it's in the previous migration, we rely on the previous migration for the base SELECT grant).

-- Order Items RLS: Farmers can read their own order items
CREATE POLICY "Farmers can view their own order items"
    ON public.order_items FOR SELECT
    USING (auth.uid() = farmer_id);

-- Orders RLS: Farmers can read orders that contain their order items
CREATE POLICY "Farmers can view orders containing their products"
    ON public.orders FOR SELECT
    USING (
        id IN (
            SELECT order_id FROM public.order_items WHERE farmer_id = auth.uid()
        )
    );

-- Create RPC function to handle order status updates securely by the farmer
CREATE OR REPLACE FUNCTION public.update_farmer_order_status(
    p_order_id uuid,
    p_new_status text
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_farmer_id uuid;
    v_order record;
    v_is_authorized boolean;
BEGIN
    v_farmer_id := auth.uid();
    IF v_farmer_id IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;

    -- Validate transition
    IF p_new_status NOT IN ('pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid status';
    END IF;

    -- Verify the order exists and get current status. Lock the row to prevent race conditions on status transition.
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    -- Verify farmer is part of this order
    SELECT EXISTS (
        SELECT 1 FROM public.order_items 
        WHERE order_id = p_order_id AND farmer_id = v_farmer_id
    ) INTO v_is_authorized;

    IF NOT v_is_authorized THEN
        RAISE EXCEPTION 'Unauthorized: You are not a part of this order';
    END IF;

    -- Validate state transitions
    IF v_order.status = 'pending' AND p_new_status NOT IN ('confirmed', 'cancelled') THEN
        RAISE EXCEPTION 'Invalid transition from pending to %', p_new_status;
    ELSIF v_order.status = 'confirmed' AND p_new_status != 'processing' THEN
        RAISE EXCEPTION 'Invalid transition from confirmed to %', p_new_status;
    ELSIF v_order.status = 'processing' AND p_new_status != 'out_for_delivery' THEN
        RAISE EXCEPTION 'Invalid transition from processing to %', p_new_status;
    ELSIF v_order.status = 'out_for_delivery' AND p_new_status != 'delivered' THEN
        RAISE EXCEPTION 'Invalid transition from out_for_delivery to %', p_new_status;
    ELSIF v_order.status IN ('delivered', 'cancelled') THEN
        RAISE EXCEPTION 'Order is already in a terminal state';
    END IF;

    -- Update status
    UPDATE public.orders
    SET status = p_new_status
    WHERE id = p_order_id;

    RETURN true;
END;
$$;

-- Restrict execution to authenticated users
REVOKE EXECUTE ON FUNCTION public.update_farmer_order_status(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_farmer_order_status(uuid, text) TO authenticated;
