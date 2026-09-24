-- ============================================================
-- Phase 2: Products table, RLS policies, and storage bucket
-- ============================================================

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  price_per_kg NUMERIC NOT NULL CHECK (price_per_kg > 0),
  quantity_kg NUMERIC NOT NULL DEFAULT 0 CHECK (quantity_kg >= 0),
  grade TEXT,
  unit TEXT DEFAULT 'kg',
  harvest_date DATE,
  location TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- FARMER policies: full CRUD on own products
-- ============================================================

-- Farmer can view their own products (active and inactive)
CREATE POLICY "Farmers can view own products"
ON public.products FOR SELECT
USING (auth.uid() = farmer_id);

-- Farmer can insert products only as themselves
CREATE POLICY "Farmers can insert own products"
ON public.products FOR INSERT
WITH CHECK (auth.uid() = farmer_id);

-- Farmer can update only their own products
CREATE POLICY "Farmers can update own products"
ON public.products FOR UPDATE
USING (auth.uid() = farmer_id)
WITH CHECK (auth.uid() = farmer_id);

-- Farmer can delete only their own products
CREATE POLICY "Farmers can delete own products"
ON public.products FOR DELETE
USING (auth.uid() = farmer_id);

-- ============================================================
-- BUYER / PUBLIC policies: read-only access to active products
-- ============================================================

-- Anyone authenticated can view active products (for marketplace)
CREATE POLICY "Anyone can view active products"
ON public.products FOR SELECT
USING (is_active = true);

-- ============================================================
-- Auto-update updated_at timestamp on product changes
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_product_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_product_update
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE PROCEDURE public.handle_product_update();

-- ============================================================
-- Storage bucket for product images
-- ============================================================

-- Create the storage bucket (public so images can be viewed)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: farmers can upload to their own folder
CREATE POLICY "Farmers can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Farmers can update/replace their own images
CREATE POLICY "Farmers can update own product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Farmers can delete their own images
CREATE POLICY "Farmers can delete own product images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Anyone can view product images (public bucket)
CREATE POLICY "Anyone can view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
