import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/Layout';
import { Card, Badge } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          buyer:profiles!orders_buyer_id_fkey(full_name),
          order_items(
            product_name,
            quantity_kg,
            price_per_kg,
            farmer:profiles!order_items_farmer_id_fkey(full_name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    // Basic status toggle for admin (e.g. pending -> confirmed -> processing)
    const statuses = ['pending', 'confirmed', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];
    const nextStatus = statuses[(statuses.indexOf(currentStatus) + 1) % statuses.length];
    
    try {
      const { error } = await supabase.rpc('admin_update_order_status', {
        p_order_id: orderId,
        p_status: nextStatus
      });
      if (error) throw error;
      fetchOrders();
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status.');
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
        <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
      </div>

      <Card className="p-6">
        {orders.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Buyer</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Items / Farmers</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="text-sm font-medium text-gray-900">#{order.id.split('-')[0]}</p>
                      <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{order.buyer?.full_name || 'Unknown'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      <ul className="list-disc pl-4 text-xs">
                        {order.order_items?.map((item: any, idx: number) => (
                           <li key={idx}>
                             {item.quantity_kg}kg {item.product_name} (from {item.farmer?.full_name})
                           </li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-900">₹{order.total}</td>
                    <td className="py-4 px-4">
                      <Badge variant={
                        order.status === 'delivered' ? 'delivered' : 
                        order.status === 'cancelled' ? 'cancelled' : 
                        ['confirmed', 'processing', 'out_for_delivery'].includes(order.status) ? 'transit' : 'pending'
                      }>
                        {order.status.replace(/_/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        className="px-3 py-1.5 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium transition"
                        onClick={() => handleStatusUpdate(order.id, order.status)}
                      >
                        Advance Status
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
