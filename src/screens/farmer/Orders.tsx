import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/Layout';
import { Card, Badge } from '../../components/ui';

const orders = [
  { id: 'FD1024', buyer: 'Green Leaf Restaurant', product: 'Tomato', qty: 300, total: 8400, date: '20 Sep 2026', status: 'pending', icon: '🍅' },
  { id: 'FD1023', buyer: 'Fresh Mart Superstore', product: 'Onion', qty: 150, total: 3300, date: '19 Sep 2026', status: 'accepted', icon: '🧅' },
  { id: 'FD1022', buyer: 'Hotel Saaveria', product: 'Tomato', qty: 100, total: 2800, date: '18 Sep 2026', status: 'preparing', icon: '🍅' },
  { id: 'FD1021', buyer: 'City Grocery', product: 'Potato', qty: 200, total: 3600, date: '17 Sep 2026', status: 'completed', icon: '🥔' },
];

const tabs = ['Pending', 'Accepted', 'Preparing', 'Completed'];

const statusVariant: Record<string, string> = {
  pending: 'pending', accepted: 'active', preparing: 'preparing', completed: 'delivered',
};

export default function FarmerOrders() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Pending');

  const filtered = orders.filter(o => o.status === tab.toLowerCase() || (tab === 'Preparing' && o.status === 'preparing'));

  return (
    <FarmerLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${tab === t ? 'bg-[#2E7D32] text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
            {t}
            {t === 'Pending' && <span className="ml-1.5 bg-amber-400 text-white text-xs px-1.5 py-0.5 rounded-full">4</span>}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.length === 0 && (
          <Card className="p-10 text-center text-gray-400">
            <div className="text-4xl mb-3">📭</div>
            <p>No {tab.toLowerCase()} orders.</p>
          </Card>
        )}
        {orders.filter(o => tab === 'Pending' ? o.status === 'pending' : tab === 'Accepted' ? o.status === 'accepted' : tab === 'Preparing' ? o.status === 'preparing' : o.status === 'completed').map(order => (
          <Card key={order.id} className="p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                {order.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-gray-900">Order #{order.id}</span>
                  <Badge variant={statusVariant[order.status]}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 font-medium">{order.buyer}</p>
                <p className="text-sm text-gray-500">{order.product} · {order.qty} kg · {order.date}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-lg font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                <button onClick={() => navigate(`/farmer/orders/${order.id}`)}
                  className="mt-2 text-sm text-[#2E7D32] font-medium px-4 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition">
                  View Order →
                </button>
              </div>
            </div>
          </Card>
        ))}
        {/* Always show all pending if tab is Pending */}
        {tab === 'Pending' && (
          <>
            {orders.filter(o => o.status !== 'pending').slice(0, 1).map(order => (
              <Card key={order.id + '-extra'} className="p-5 opacity-50">
                <div className="text-sm text-gray-400 text-center">Showing {orders.filter(o => o.status === 'pending').length} pending orders</div>
              </Card>
            ))}
          </>
        )}
      </div>
    </FarmerLayout>
  );
}
