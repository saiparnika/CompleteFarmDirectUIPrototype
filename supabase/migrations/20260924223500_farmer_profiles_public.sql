-- ============================================================
-- Phase 3: Public access to farmer profiles
--
-- Buyers need to be able to see farmer names and avatars
-- in the marketplace. This policy allows anyone to read 
-- profiles that have the role 'farmer'.
-- ============================================================

CREATE POLICY "Anyone can view farmer profiles"
ON public.profiles FOR SELECT
USING (role = 'farmer');
