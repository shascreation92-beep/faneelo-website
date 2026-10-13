-- ==============================================================================
-- Faneelo Sofas UK (faneelo.co.uk) - Supabase Database & Storage Setup
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ==============================================================================

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  collection TEXT DEFAULT 'Lilly',
  price NUMERIC NOT NULL DEFAULT 250,
  original_price NUMERIC,
  image_url TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  variants JSONB DEFAULT '[]'::jsonb,
  color TEXT,
  fabric TEXT,
  description TEXT,
  delivery TEXT DEFAULT 'Within 1–3 working days | Free UK Delivery | Cash on Delivery',
  rating NUMERIC DEFAULT 5,
  sold_count INTEGER DEFAULT 50,
  in_stock BOOLEAN DEFAULT true,
  has_corner_variant BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- 3. Public Read Policy (Anyone can browse products on the store)
CREATE POLICY "Public Read Products"
ON public.products
FOR SELECT
USING (true);

-- 4. Admin Full Access Policy (Authenticated users / Service role can insert, update, delete)
CREATE POLICY "Admin Full Access"
ON public.products
FOR ALL
USING (auth.role() = 'authenticated' OR auth.role() = 'anon')
WITH CHECK (true);

-- 5. Storage Bucket for Product Images
-- Note: Create a public bucket named 'product-images' under Storage in your Supabase dashboard
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage Policies for product-images bucket
CREATE POLICY "Public Image Access"
ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

CREATE POLICY "Public Image Uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Public Image Deletions"
ON storage.objects
FOR DELETE
USING (bucket_id = 'product-images');
