import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn, VerifiedBadge, Stars } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import type { Product } from '../../types/product';

export default function FarmerProfileBuyer() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [farmer, setFarmer] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFarmerData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    
    // Fetch farmer profile
    const { data: profileData, error: profileError } = await supabase
      .from('farmer_profiles')
      .select('*')
      .eq('id', id)
      .single();

    if (profileError) {
      setError('Farmer not found');
      setLoading(false);
      return;
    }

    setFarmer(profileData);

    // Fetch farmer's active products
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('*')
      .eq('farmer_id', id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (!productsError && productsData) {
      setProducts(productsData);
    }
    
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchFarmerData();
  }, [fetchFarmerData]);

  if (loading) {
    return (
      <BuyerLayout>
        <div className="py-12 text-center text-gray-500">Loading farmer profile...</div>
      </BuyerLayout>
    );
  }

  if (error || !farmer) {
    return (
      <BuyerLayout>
        <div className="py-12 text-center text-red-500">{error || 'Farmer not found'}</div>
        <div className="text-center">
          <Btn onClick={() => navigate('/buyer/marketplace')}>Back to Marketplace</Btn>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">← Back</button>
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 mb-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 overflow-hidden">
            {farmer.avatar_url ? (
              <img src={farmer.avatar_url} alt={farmer.full_name} className="w-full h-full object-cover" />
            ) : (
              <span>👨‍🌾</span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{farmer.full_name}</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            {farmer.is_verified && <VerifiedBadge />}
            <Stars rating={4.8} />
          </div>
          <p className="text-gray-500 text-sm mt-2">
            {farmer.location ? `📍 ${farmer.location}` : 'Location not specified'}
          </p>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold text-gray-900">{products.length}</p>
              <p className="text-xs text-gray-500">Products</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold text-gray-900">-</p>
              <p className="text-xs text-gray-500">Orders</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold text-gray-900">-</p>
              <p className="text-xs text-gray-500">Experience</p>
            </div>
          </div>
        </Card>

        {farmer.is_verified && (
          <Card className="p-5 mb-4">
            <h2 className="font-bold text-gray-900 mb-3">Verification</h2>
            <div className="flex flex-col gap-2">
              {['Identity Verified', 'Farm Details Verified', 'Bank Linked'].map(v => (
                <div key={v} className="flex items-center gap-2 text-sm text-green-700">
                  <span className="text-green-600">✓</span> {v}
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card className="p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">Products from {farmer.full_name}</h2>
          {products.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No active products available.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {products.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.quantity_kg} {p.unit} available</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#2E7D32]">₹{p.price_per_kg}/{p.unit}</p>
                    <button onClick={() => navigate(`/buyer/product/${p.id}`)} className="text-xs text-[#2E7D32] hover:underline">View →</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </BuyerLayout>
  );
}
