import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';

// We also need farmer info for the UI
export interface ProductWithFarmer extends Product {
  farmer: {
    full_name: string;
    avatar_url: string | null;
    is_verified: boolean;
    location?: string | null;
  } | null;
}

export function useBuyerProducts() {
  const [products, setProducts] = useState<ProductWithFarmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    // 1. Fetch active products
    const { data: productsData, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setProducts([]);
      setLoading(false);
      return;
    }

    if (!productsData || productsData.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    // 2. Extract unique farmer IDs
    const farmerIds = [...new Set(productsData.map(p => p.farmer_id))];

    // 3. Fetch farmer details securely from the view
    const { data: farmersData } = await supabase
      .from('farmer_profiles')
      .select('*')
      .in('id', farmerIds);

    // 4. Map them together
    const merged = productsData.map(p => ({
      ...p,
      farmer: (farmersData || []).find(f => f.id === p.farmer_id) || null
    }));

    setProducts(merged);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refresh: fetchProducts,
  };
}

export function useBuyerProduct(productId: string | undefined) {
  const [product, setProduct] = useState<ProductWithFarmer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setProduct(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // 1. Fetch the single product
    const { data: productData, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_active', true)
      .single();

    if (fetchError) {
      setError(fetchError.message);
      setProduct(null);
      setLoading(false);
      return;
    }

    // 2. Fetch the farmer profile securely from the view
    let farmer = null;
    if (productData?.farmer_id) {
      const { data: farmerData } = await supabase
        .from('farmer_profiles')
        .select('*')
        .eq('id', productData.farmer_id)
        .single();
        
      farmer = farmerData;
    }

    setProduct({
      ...productData,
      farmer
    });
    setLoading(false);
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
  };
}
