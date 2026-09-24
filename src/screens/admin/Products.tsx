import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/Layout';
import { Card, Badge } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          farmer:profiles!products_farmer_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (productId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.rpc('admin_toggle_product', {
        p_product_id: productId,
        p_is_active: !currentStatus
      });
      if (error) throw error;
      fetchProducts();
    } catch (err) {
      console.error('Error updating product status:', err);
      alert('Failed to update product status.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Products</h1>
      </div>

      <Card className="p-6">
        {products.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No products found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Product</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Farmer</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Category</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Price</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Stock</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{product.farmer?.full_name || 'Unknown'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{product.category}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">₹{product.price_per_kg}/kg</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{product.quantity_kg} kg</td>
                    <td className="py-4 px-4">
                      <Badge variant={product.is_active ? 'verified' : 'pending'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${product.is_active ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-[#2E7D32] text-white hover:bg-[#256427]'}`}
                        onClick={() => handleToggleActive(product.id, product.is_active)}
                      >
                        {product.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
