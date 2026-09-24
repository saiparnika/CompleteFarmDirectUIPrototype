import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/Layout';
import { Card, Badge } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const tabs = ['Pending', 'Confirmed', 'Processing', 'Out for Delivery', 'Completed'];

const statusVariant: Record<string, string> = {
  pending: 'pending', confirmed: 'active', processing: 'preparing', out_for_delivery: 'transit', delivered: 'delivered', cancelled: 'danger'
};

export default function FarmerOrders() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState('Pending');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      
      const { data } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (data) {
        // Filter out order_items that don't belong to this farmer and calculate farmer total
        const processedOrders = data.map(order => {
          const myItems = order.order_items.filter((item: any) => item.farmer_id === user.id);
          const myTotal = myItems.reduce((sum: number, item: any) => sum + item.subtotal, 0);
          return {
            ...order,
            myItems,
            myTotal
          };
        }).filter(order => order.myItems.length > 0); // Only keep orders where they have items
        
        setOrders(processedOrders);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  // Map tabs to statuses
  const getTabStatuses = (tabName: string) => {
    switch (tabName) {
      case 'Pending': return ['pending'];
      case 'Confirmed': return ['confirmed'];
      case 'Processing': return ['processing'];
      case 'Out for Delivery': return ['out_for_delivery'];
      case 'Completed': return ['delivered', 'cancelled'];
      default: return [];
    }
  };

  const currentStatuses = getTabStatuses(tab);
  const filtered = orders.filter(o => currentStatuses.includes(o.status));
  const pendingCount = orders.filter(o => o.status === 'pending').length;

  return (
    <FarmerLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${tab === t ? 'bg-[#2E7D32] text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
            {t}
            {t === 'Pending' && pendingCount > 0 && <span className="ml-1.5 bg-amber-400 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="py-12 text-center text-gray-500">Loading orders...</div>
        ) : filtered.length === 0 ? (
          <Card className="p-10 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No {tab.toLowerCase()} orders.</p>
          </Card>
        ) : (
          filtered.map(order => (
            <Card key={order.id} className="p-5">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  📦
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-gray-900">Order #{order.id.split('-')[0]}</span>
                    <Badge variant={statusVariant[order.status] || 'pending'}>
                      {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{order.delivery_name}</p>
                  <p className="text-sm text-gray-500">
                    {order.myItems.map((i: any) => `${i.product_name} (${i.quantity_kg}kg)`).join(', ')} · {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-gray-400">Your Items Total</p>
                  <p className="text-lg font-bold text-[#2E7D32]">₹{order.myTotal}</p>
                  <button onClick={() => navigate(`/farmer/orders/${order.id}`)}
                    className="mt-2 text-sm text-[#2E7D32] font-medium px-4 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition">
                    View Order →
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </FarmerLayout>
  );
}
