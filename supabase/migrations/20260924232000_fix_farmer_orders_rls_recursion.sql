-- ============================================================
-- Phase 5 Hotfix: Fix Infinite Recursion in Orders RLS
-- ============================================================

-- Issue: 
-- "Farmers can view orders containing their products" queries `order_items`.
-- "Buyers can view their own order items" queries `orders`.
-- This creates a circular dependency causing infinite recursion (error 42P17).

-- Fix: 
-- Use a SECURITY DEFINER function for the farmer check to bypass RLS during the evaluation, breaking the cycle.

CREATE OR REPLACE FUNCTION public.is_farmer_for_order(p_order_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.order_items 
        WHERE order_id = p_order_id AND farmer_id = auth.uid()
    );
END;
$$;

-- Restrict execution to authenticated users
REVOKE EXECUTE ON FUNCTION public.is_farmer_for_order(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_farmer_for_order(uuid) TO authenticated;

-- Drop the recursive policy from the previous migration
DROP POLICY IF EXISTS "Farmers can view orders containing their products" ON public.orders;

-- Recreate it using the secure function
CREATE POLICY "Farmers can view orders containing their products"
    ON public.orders FOR SELECT
    USING (public.is_farmer_for_order(id));
