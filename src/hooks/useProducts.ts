import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Product } from '../types/product';

export function useProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    if (!user) {
      setProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      setError(fetchError.message);
      setProducts([]);
    } else {
      setProducts(data ?? []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const createProduct = async (
    productData: Omit<Product, 'id' | 'farmer_id' | 'created_at' | 'updated_at'>,
    imageFile?: File | null
  ): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };

    let imageUrl: string | null = null;

    // Upload image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()?.toLowerCase();
      const allowed = ['jpg', 'jpeg', 'png', 'webp'];
      if (!fileExt || !allowed.includes(fileExt)) {
        return { error: 'Only JPG, PNG, and WebP images are allowed.' };
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: 'Image must be smaller than 5MB.' };
      }

      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        return { error: `Image upload failed: ${uploadError.message}` };
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      imageUrl = urlData.publicUrl;
    }

    const { error: insertError } = await supabase
      .from('products')
      .insert({
        farmer_id: user.id,
        name: productData.name,
        category: productData.category,
        description: productData.description || null,
        price_per_kg: productData.price_per_kg,
        quantity_kg: productData.quantity_kg,
        grade: productData.grade || null,
        unit: productData.unit,
        harvest_date: productData.harvest_date || null,
        location: productData.location || null,
        image_url: imageUrl,
        is_active: productData.is_active,
      });

    if (insertError) {
      return { error: insertError.message };
    }

    await fetchProducts();
    return { error: null };
  };

  const updateProduct = async (
    productId: string,
    updates: Partial<Omit<Product, 'id' | 'farmer_id' | 'created_at' | 'updated_at'>>,
    imageFile?: File | null
  ): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };

    // Upload new image if provided
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()?.toLowerCase();
      const allowed = ['jpg', 'jpeg', 'png', 'webp'];
      if (!fileExt || !allowed.includes(fileExt)) {
        return { error: 'Only JPG, PNG, and WebP images are allowed.' };
      }
      if (imageFile.size > 5 * 1024 * 1024) {
        return { error: 'Image must be smaller than 5MB.' };
      }

      const filePath = `${user.id}/${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile);

      if (uploadError) {
        return { error: `Image upload failed: ${uploadError.message}` };
      }

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);
      updates.image_url = urlData.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('products')
      .update(updates)
      .eq('id', productId)
      .eq('farmer_id', user.id);

    if (updateError) {
      return { error: updateError.message };
    }

    await fetchProducts();
    return { error: null };
  };

  const deleteProduct = async (productId: string): Promise<{ error: string | null }> => {
    if (!user) return { error: 'Not authenticated' };

    // Find the product to get its image URL for cleanup
    const product = products.find(p => p.id === productId);

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('farmer_id', user.id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    // Clean up storage image if it exists
    if (product?.image_url) {
      try {
        const url = new URL(product.image_url);
        const pathParts = url.pathname.split('/product-images/');
        if (pathParts[1]) {
          await supabase.storage
            .from('product-images')
            .remove([pathParts[1]]);
        }
      } catch {
        // Image cleanup is best-effort
      }
    }

    await fetchProducts();
    return { error: null };
  };

  return {
    products,
    loading,
    error,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
