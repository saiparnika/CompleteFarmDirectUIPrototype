import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FarmerLayout } from '../../components/Layout';
import { Card, Btn, Badge, StatusTimeline } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

const orderSteps = ['Order Placed', 'Confirmed', 'Processing', 'In Transit', 'Delivered'];
const statusMap: Record<string, number> = {
  'pending': 0,
  'confirmed': 1,
  'processing': 2,
  'out_for_delivery': 3,
  'delivered': 4,
  'cancelled': -1
};

export default function FarmerOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    async function fetchOrder() {
      if (!user || !id) return;
      
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', id)
        .single();

      if (data) {
        const myItems = data.order_items.filter((item: any) => item.farmer_id === user.id);
        const myTotal = myItems.reduce((sum: number, item: any) => sum + item.subtotal, 0);
        setOrder({
          ...data,
          myItems,
          myTotal
        });
      }
      setLoading(false);
    }
    fetchOrder();
  }, [id, user]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!order) return;
    setUpdating(true);
    
    const { error } = await supabase.rpc('update_farmer_order_status', {
      p_order_id: order.id,
      p_new_status: newStatus
    });

    if (error) {
      showToast(`Error: ${error.message}`);
    } else {
      setOrder({ ...order, status: newStatus });
      showToast(`Status updated to: ${newStatus.replace('_', ' ')}`);
    }
    
    setUpdating(false);
  };

  if (loading) {
    return <FarmerLayout><div className="py-12 text-center text-gray-500">Loading order details...</div></FarmerLayout>;
  }

  if (!order || order.myItems.length === 0) {
    return <FarmerLayout><div className="py-12 text-center text-red-500">Order not found or unauthorized.</div></FarmerLayout>;
  }

  const step = statusMap[order.status] ?? 0;

  return (
    <FarmerLayout>
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2E7D32] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium animate-bounce">
          ✓ {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/farmer/orders')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">← Back to Orders</button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #{order.id.split('-')[0]}</h1>
            <p className="text-gray-500 text-sm mt-1">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <Badge variant={step === 0 ? 'pending' : step === 4 ? 'delivered' : step === 3 ? 'transit' : step === 2 ? 'preparing' : step === -1 ? 'danger' : 'active'}>
            {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Delivery Details</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">🏠</div>
              <div>
                <p className="font-bold text-gray-900">{order.delivery_name}</p>
                <p className="text-xs text-gray-500">{order.delivery_phone}</p>
                <p className="text-xs text-gray-500 mt-1">{order.delivery_address}</p>
                <p className="text-xs text-gray-500">{order.delivery_city}, {order.delivery_state} {order.delivery_pincode}</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Payment</h3>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs">ℹ</span>
              <span className="font-medium text-gray-700">Cash on Delivery</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Status: {order.payment_status}</p>
          </Card>
        </div>

        <Card className="p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Your Ordered Products</h3>
          
          {order.myItems.map((item: any) => (
            <div key={item.id} className="border-b border-gray-100 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-xl">📦</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{item.product_name}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">Quantity</p>
                  <p className="text-base font-bold text-gray-900">{item.quantity_kg} kg</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">Price/kg</p>
                  <p className="text-base font-bold text-gray-900">₹{item.price_per_kg}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-xs text-gray-400">Subtotal</p>
                  <p className="text-base font-bold text-gray-900">₹{item.subtotal}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-gray-500 font-medium">Your Total Revenue</span>
            <span className="text-xl font-bold text-[#2E7D32]">₹{order.myTotal}</span>
          </div>
        </Card>

        <Card className="p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Order Status</h3>
          <StatusTimeline steps={orderSteps} current={step >= 0 ? step : 0} />
        </Card>

        {order.status === 'pending' && (
          <div className="flex gap-3">
            <Btn full size="lg" disabled={updating} onClick={() => handleUpdateStatus('confirmed')}>✓ Accept Order</Btn>
            <Btn variant="danger" disabled={updating} size="lg" onClick={() => handleUpdateStatus('cancelled')}>Reject</Btn>
          </div>
        )}
        {order.status === 'confirmed' && (
          <Btn full size="lg" disabled={updating} onClick={() => handleUpdateStatus('processing')}>Start Processing →</Btn>
        )}
        {order.status === 'processing' && (
          <Btn full size="lg" disabled={updating} onClick={() => handleUpdateStatus('out_for_delivery')}>Mark Out for Delivery →</Btn>
        )}
        {order.status === 'out_for_delivery' && (
          <Btn full size="lg" disabled={updating} onClick={() => handleUpdateStatus('delivered')}>Mark as Delivered ✓</Btn>
        )}
        
        {order.status === 'delivered' && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-bold text-green-800">Order Delivered Successfully!</p>
          </div>
        )}
        {order.status === 'cancelled' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center">
            <p className="font-bold text-red-800">Order Cancelled</p>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
