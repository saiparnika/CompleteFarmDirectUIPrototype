-- ============================================================
-- Phase 6: Admin Dashboard & Permissions
-- ============================================================

-- 1. Helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$;

-- Restrict execution to authenticated users
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- 2. Update Profile Trigger to allow admins to bypass role/verification restrictions
-- We use CREATE OR REPLACE to update the logic without modifying the original migration file.
CREATE OR REPLACE FUNCTION public.handle_profile_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent normal users from changing role or verification status
  -- If public.is_admin() is true, this restriction is bypassed.
  IF NOT public.is_admin() THEN
      NEW.role = OLD.role;
      NEW.is_verified = OLD.is_verified;
  END IF;
  
  -- Automatically update the updated_at timestamp
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Secure Admin RPCs for mutations

-- Verify / Revoke Farmer Verification
CREATE OR REPLACE FUNCTION public.admin_verify_farmer(p_farmer_id uuid, p_is_verified boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    UPDATE public.profiles
    SET is_verified = p_is_verified
    WHERE id = p_farmer_id AND role = 'farmer';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_verify_farmer(uuid, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_verify_farmer(uuid, boolean) TO authenticated;

-- Toggle Product Active Status
CREATE OR REPLACE FUNCTION public.admin_toggle_product(p_product_id uuid, p_is_active boolean)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    UPDATE public.products
    SET is_active = p_is_active
    WHERE id = p_product_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_toggle_product(uuid, boolean) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_toggle_product(uuid, boolean) TO authenticated;

-- Update Order Status
CREATE OR REPLACE FUNCTION public.admin_update_order_status(p_order_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Access denied';
    END IF;

    UPDATE public.orders
    SET status = p_status
    WHERE id = p_order_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_update_order_status(uuid, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_order_status(uuid, text) TO authenticated;

-- 4. Explicit Table Grants for Admin Access
-- Ensure authenticated users have table-level SELECT privileges so RLS can take over.
GRANT SELECT ON public.profiles TO authenticated;
GRANT SELECT ON public.products TO authenticated;
GRANT SELECT ON public.orders TO authenticated;
GRANT SELECT ON public.order_items TO authenticated;

-- 5. Admin RLS Policies

-- Profiles: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

-- Products: Admins can view all products
CREATE POLICY "Admins can view all products"
    ON public.products FOR SELECT
    USING (public.is_admin());

-- Orders: Admins can view all orders
CREATE POLICY "Admins can view all orders"
    ON public.orders FOR SELECT
    USING (public.is_admin());

-- Order Items: Admins can view all order items
CREATE POLICY "Admins can view all order items"
    ON public.order_items FOR SELECT
    USING (public.is_admin());
