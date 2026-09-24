import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Badge } from '../../components/ui';
import { supabase } from '../../lib/supabase';

const statusVariant: Record<string, string> = {
  preparing: 'preparing', delivered: 'delivered', transit: 'transit', pending: 'pending',
};

export default function BuyerOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });
        
      if (data) {
        setOrders(data);
      }
      setLoading(false);
    }
    fetchOrders();
  }, []);

  return (
    <BuyerLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">You haven't placed any orders.</p>
          <button onClick={() => navigate('/buyer/marketplace')} className="bg-[#2E7D32] text-white px-4 py-2 rounded-xl font-semibold">Browse Marketplace</button>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map(o => (
            <Card key={o.id} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900">Order #{o.id.split('-')[0]}</span>
                    <Badge variant={statusVariant[o.status] || 'pending'}>
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-700">
                    {o.order_items?.map((item: any, i: number) => (
                      <span key={item.id}>
                        {item.product_name} ({item.quantity_kg} kg)
                        {i < o.order_items.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(o.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-gray-900">₹{o.total}</p>
                  {['pending', 'preparing', 'transit'].includes(o.status) ? (
                    <button onClick={() => navigate(`/buyer/tracking?order_id=${o.id}`)}
                      className="text-sm text-[#2E7D32] font-medium px-4 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition">
                      Track →
                    </button>
                  ) : (
                    <button onClick={() => navigate('/buyer/review')}
                      className="text-sm text-gray-500 font-medium px-4 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
                      Review
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </BuyerLayout>
  );
}
