import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Badge } from '../../components/ui';

const orders = [
  { id: 'FD1024', product: 'Tomatoes', qty: 10, total: 320, date: '20 Sep 2026', status: 'preparing', farmer: 'Ravi Kumar' },
  { id: 'FD1018', product: 'Onions', qty: 5, total: 150, date: '15 Sep 2026', status: 'delivered', farmer: 'Meera Devi' },
  { id: 'FD1012', product: 'Potatoes', qty: 8, total: 184, date: '10 Sep 2026', status: 'delivered', farmer: 'Suresh Farms' },
];

const statusVariant: Record<string, string> = {
  preparing: 'preparing', delivered: 'delivered', transit: 'transit', pending: 'pending',
};

export default function BuyerOrders() {
  const navigate = useNavigate();
  return (
    <BuyerLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Orders</h1>
      <div className="flex flex-col gap-4">
        {orders.map(o => (
          <Card key={o.id} className="p-5">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-gray-900">Order #{o.id}</span>
                  <Badge variant={statusVariant[o.status]}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{o.product} · {o.qty} kg · ✓ {o.farmer}</p>
                <p className="text-xs text-gray-400 mt-0.5">{o.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <p className="font-bold text-gray-900">₹{o.total}</p>
                {o.status === 'preparing' ? (
                  <button onClick={() => navigate('/buyer/tracking')}
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
    </BuyerLayout>
  );
}
