-- ============================================================
-- Fix: Grant table-level privileges on public.products
--
-- The Phase 2 migration created the products table and RLS
-- policies, but did not grant the underlying table privileges.
-- PostgreSQL requires GRANT before RLS policies take effect.
-- Without this, the authenticated role gets "permission denied"
-- at the table privilege layer before RLS is even evaluated.
-- ============================================================

-- Authenticated users: full CRUD (rows filtered by RLS policies)
GRANT SELECT, INSERT, UPDATE, DELETE
ON TABLE public.products
TO authenticated;

-- Anon users: read-only (RLS restricts to active products only)
GRANT SELECT
ON TABLE public.products
TO anon;
