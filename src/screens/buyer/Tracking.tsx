import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn, StatusTimeline, VerifiedBadge } from '../../components/ui';
import { supabase } from '../../lib/supabase';

const steps = ['Order Placed', 'Confirmed', 'Processing', 'In Transit', 'Delivered'];
const statusMap: Record<string, number> = {
  'pending': 0,
  'confirmed': 1,
  'processing': 2,
  'out_for_delivery': 3,
  'delivered': 4,
  'cancelled': -1
};

export default function Tracking() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('order_id');

  const [step, setStep] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrder() {
      if (!orderId) {
        setLoading(false);
        setError("No order ID provided.");
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', orderId)
        .single();

      if (error) {
        setError("Order not found.");
      } else {
        setOrder(data);
        
        setStep(statusMap[data.status] ?? 0);
      }
      setLoading(false);
    }
    
    fetchOrder();
    
    // Optionally setup realtime subscription if we wanted to auto-update
    const channel = supabase
      .channel(`public:orders:id=eq.${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      }, (payload) => {
        setOrder(payload.new);
        setStep(statusMap[payload.new.status] ?? 0);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) {
    return (
      <BuyerLayout>
        <div className="py-12 text-center text-gray-500">Loading tracking information...</div>
      </BuyerLayout>
    );
  }

  if (error || !order) {
    return (
      <BuyerLayout>
        <div className="py-12 text-center text-red-500">{error || 'Order not found'}</div>
        <div className="text-center">
          <Btn onClick={() => navigate('/buyer/orders')}>Back to Orders</Btn>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-500 text-sm mb-6">Order #{order.id.split('-')[0]}</p>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <Card className="p-5">
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex gap-4 items-center border-b border-gray-100 last:border-0 pb-3 last:pb-0 mb-3 last:mb-0">
                <div className="text-3xl">📦</div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{item.product_name} · {item.quantity_kg} kg</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-sm text-gray-500">Farmer ID:</span>
                    <span className="text-sm font-medium text-gray-800" title={item.farmer_id}>{item.farmer_id.split('-')[0]}</span>
                    <VerifiedBadge />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-bold text-[#2E7D32]">₹{item.subtotal}</p>
                </div>
              </div>
            ))}
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-gray-900 mb-4">Order Status</h3>
            {step === -1 ? (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl text-center font-medium border border-red-200">
                This order was cancelled.
              </div>
            ) : (
              <StatusTimeline steps={steps} current={step} />
            )}
          </Card>

          {/* Location card */}
          <Card className="p-5">
            <h3 className="font-bold text-gray-900 mb-3">Location</h3>
            <div className="bg-[#F7F8F2] rounded-xl p-4 flex items-start gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">🌾</div>
                <div className="w-0.5 h-10 bg-dashed bg-gray-300 border-l-2 border-dashed border-gray-300" />
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">🏠</div>
              </div>
              <div className="flex flex-col gap-5 pt-1">
                <div>
                  <p className="text-xs text-gray-400">Pickup</p>
                  <p className="font-semibold text-gray-800">Farm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Delivery</p>
                  <p className="font-semibold text-gray-800">{order.delivery_city}</p>
                  <p className="text-xs text-gray-500">{order.delivery_address}</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">Status updated directly by the farmer fulfilling your order.</p>
          </Card>
        </div>

        {step === 4 && !confirmed ? (
          <Btn full size="lg" onClick={() => { setConfirmed(true); navigate('/buyer/review'); }}>
            ✓ Confirm Delivery & Review
          </Btn>
        ) : step === 4 && confirmed ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <p className="font-bold text-green-800">Delivery Confirmed!</p>
            <button onClick={() => navigate('/buyer/review')} className="text-sm text-[#2E7D32] underline mt-1">Leave a review</button>
          </div>
        ) : step !== -1 ? (
          <p className="text-center text-sm text-gray-400">Waiting for delivery to confirm receipt.</p>
        ) : null}
      </div>
    </BuyerLayout>
  );
}
