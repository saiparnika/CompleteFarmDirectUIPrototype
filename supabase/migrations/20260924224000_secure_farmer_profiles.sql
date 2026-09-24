-- ============================================================
-- Phase 3 Fix: Secure Public Farmer Profiles
--
-- The previous policy (20260924223500) exposed the entire 
-- profiles row (including phone number) to the public.
-- This migration drops that policy and replaces it with a 
-- secure VIEW that only exposes non-sensitive columns.
-- ============================================================

-- 1. Remove the broad table-level policy
DROP POLICY IF EXISTS "Anyone can view farmer profiles" ON public.profiles;

-- 2. Create a secure view that exposes only necessary fields
-- (By default in PostgreSQL, views execute with the privileges 
-- of their owner, allowing us to safely bypass RLS to expose 
-- specific columns while keeping the underlying table locked down).
CREATE OR REPLACE VIEW public.farmer_profiles AS
SELECT 
  id,
  full_name,
  avatar_url,
  location,
  is_verified
FROM public.profiles
WHERE role = 'farmer';

-- 3. Grant access to the view
GRANT SELECT ON public.farmer_profiles TO authenticated;
GRANT SELECT ON public.farmer_profiles TO anon;
