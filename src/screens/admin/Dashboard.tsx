import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '../../components/Layout';
import { Card, StatCard, Badge } from '../../components/ui';

const recentFarmers = [
  { name: 'Kavya Reddy', location: 'Hassan', status: 'pending', date: '21 Sep' },
  { name: 'Mohan Gowda', location: 'Tumkur', status: 'verified', date: '20 Sep' },
  { name: 'Sita Devi', location: 'Kolar', status: 'pending', date: '19 Sep' },
];

const recentOrders = [
  { id: 'FD1024', buyer: 'Green Leaf Restaurant', product: 'Tomato', total: 8400, status: 'preparing' },
  { id: 'FD1023', buyer: 'Fresh Mart', product: 'Onion', total: 3300, status: 'delivered' },
  { id: 'FD1022', buyer: 'Hotel Saaveria', product: 'Tomato', total: 2800, status: 'transit' },
];

const catData = [
  { label: 'Vegetables', pct: 58 },
  { label: 'Fruits', pct: 22 },
  { label: 'Grains', pct: 12 },
  { label: 'Pulses', pct: 8 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">23 Sep 2026</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Farmers" value="1,248" icon="👨‍🌾" color="green" />
        <StatCard label="Active Products" value="3,820" icon="🌿" color="blue" />
        <StatCard label="Total Orders" value="8,540" icon="📦" color="amber" />
        <StatCard label="Marketplace Value" value="₹24.5L" icon="₹" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Orders chart */}
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Orders Over Time</h3>
          <div className="flex items-end gap-2 h-32">
            {[120, 185, 160, 220, 190, 280, 310, 295, 340, 410, 380, 450].map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm bg-[#66BB6A] hover:bg-[#2E7D32] transition-colors"
                  style={{ height: `${(v / 450) * 100}%` }} />
                {i % 3 === 0 && <span className="text-[9px] text-gray-400">{['Jul', 'Aug', 'Sep', ''][Math.floor(i / 3)]}</span>}
              </div>
            ))}
          </div>
        </Card>

        {/* Categories */}
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 mb-4">Product Categories</h3>
          <div className="flex flex-col gap-3">
            {catData.map(c => (
              <div key={c.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600 font-medium">{c.label}</span>
                  <span className="text-gray-500">{c.pct}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div className="h-full bg-[#66BB6A] rounded-full" style={{ width: `${c.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending verifications */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Verification Requests</h3>
            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">2 pending</span>
          </div>
          <div className="flex flex-col gap-3">
            {recentFarmers.map(f => (
              <div key={f.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">👨‍🌾</div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{f.name}</p>
                    <p className="text-xs text-gray-500">📍 {f.location} · {f.date}</p>
                  </div>
                </div>
                <Badge variant={f.status === 'verified' ? 'verified' : 'pending'}>
                  {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent orders */}
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 mb-4">Recent Orders</h3>
          <div className="flex flex-col gap-3">
            {recentOrders.map(o => (
              <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">#{o.id} · {o.product}</p>
                  <p className="text-xs text-gray-500">{o.buyer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">₹{o.total.toLocaleString()}</p>
                  <Badge variant={o.status === 'delivered' ? 'delivered' : o.status === 'transit' ? 'transit' : 'preparing'}>
                    {o.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
}
