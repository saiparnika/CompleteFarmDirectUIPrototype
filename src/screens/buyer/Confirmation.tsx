import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('order_id');

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
      }
      setLoading(false);
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <BuyerLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <p className="text-gray-500">Loading order details...</p>
        </div>
      </BuyerLayout>
    );
  }

  if (error || !order) {
    return (
      <BuyerLayout>
        <div className="flex items-center justify-center min-h-[70vh]">
          <Card className="p-10 text-center max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Error</h1>
            <p className="text-gray-500 mb-6">{error}</p>
            <Btn onClick={() => navigate('/buyer/marketplace')}>Continue Shopping</Btn>
          </Card>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-6">Your order has been placed and the farmer has been notified.</p>

          <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-gray-900" title={order.id}>#{order.id.split('-')[0]}</span>
            </div>
            
            {order.order_items?.map((item: any) => (
              <div key={item.id} className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500">{item.product_name}</span>
                <span className="font-medium">{item.quantity_kg} kg</span>
              </div>
            ))}
            
            <div className="flex items-center justify-between text-sm mb-3 border-t border-gray-200 pt-3">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-[#2E7D32]">₹{order.total}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Btn full size="lg" onClick={() => navigate(`/buyer/tracking?order_id=${order.id}`)}>📍 Track Order</Btn>
            <Btn full variant="outline" onClick={() => navigate('/buyer/marketplace')}>Continue Shopping</Btn>
          </div>
        </Card>
      </div>
    </BuyerLayout>
  );
}
