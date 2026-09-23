import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/Layout';
import { StatCard, Card, Btn, Badge } from '../../components/ui';

const products = [
  { name: 'Tomato', qty: '480 kg', price: '₹28/kg', quality: 'Grade A', status: 'active', img: 'https://images.unsplash.com/photo-1561136594-7f68813d8-image' },
  { name: 'Onion', qty: '200 kg', price: '₹22/kg', quality: 'Grade B', status: 'low', img: '' },
  { name: 'Potato', qty: '0 kg', price: '₹18/kg', quality: 'Grade A', status: 'sold', img: '' },
];

export default function FarmerDashboard() {
  const navigate = useNavigate();
  return (
    <FarmerLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Good morning, Ravi 👋</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-gray-500 text-sm">🌿 Green Valley Farm</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 text-sm">📍 Doddaballapur</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">✓ Verified</span>
            </div>
          </div>
          <Btn onClick={() => navigate('/farmer/add-product')}>+ Add Product</Btn>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Sales" value="₹42,500" icon="₹" color="green" />
          <StatCard label="Active Products" value="8" icon="🌿" color="blue" />
          <StatCard label="Pending Orders" value="4" icon="📦" color="amber" />
          <StatCard label="Rating" value="4.8 ⭐" icon="⭐" color="purple" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Your Products</h2>
              <button onClick={() => navigate('/farmer/products')} className="text-sm text-[#2E7D32] font-medium hover:underline">View all →</button>
            </div>
            <div className="flex flex-col gap-3">
              {products.map(p => (
                <Card key={p.name} className="p-4 flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                    {p.name === 'Tomato' ? '🍅' : p.name === 'Onion' ? '🧅' : '🥔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{p.name}</span>
                      <Badge variant={p.status === 'active' ? 'active' : p.status === 'low' ? 'low' : 'sold'}>
                        {p.status === 'active' ? 'Active' : p.status === 'low' ? 'Low Stock' : 'Sold Out'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{p.qty} · {p.price} · {p.quality}</p>
                  </div>
                  <button onClick={() => navigate('/farmer/products')} className="text-xs text-[#2E7D32] font-medium px-3 py-1.5 rounded-lg bg-green-50 hover:bg-green-100 transition whitespace-nowrap">
                    Manage
                  </button>
                </Card>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="flex flex-col gap-4">
            <Card className="p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">📊 Smart Price Recommendation</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="text-2xl">🍅</div>
                <div>
                  <p className="font-semibold text-gray-900">Tomato</p>
                  <p className="text-xs text-gray-500">Current: ₹28/kg</p>
                </div>
              </div>
              <div className="bg-green-50 rounded-xl p-3 mb-3">
                <p className="text-sm font-semibold text-[#2E7D32]">Recommended: ₹27–₹30/kg</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="w-2 h-2 bg-[#2E7D32] rounded-full" />
                  <span className="text-xs text-green-700 font-medium">Demand: High</span>
                </div>
              </div>
              <p className="text-xs text-gray-400">Based on recent marketplace demand and listing trends.</p>
            </Card>

            <Card className="p-5">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">📈 Today's Demand</h3>
              {[
                { name: 'Tomato', demand: 85, level: 'High' },
                { name: 'Onion', demand: 60, level: 'Medium' },
                { name: 'Potato', demand: 40, level: 'Low' },
              ].map(d => (
                <div key={d.name} className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-gray-700">{d.name}</span>
                    <span className={`font-semibold ${d.level === 'High' ? 'text-[#2E7D32]' : d.level === 'Medium' ? 'text-amber-600' : 'text-gray-400'}`}>{d.level}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${d.level === 'High' ? 'bg-[#66BB6A]' : d.level === 'Medium' ? 'bg-amber-400' : 'bg-gray-300'}`}
                      style={{ width: `${d.demand}%` }} />
                  </div>
                </div>
              ))}
            </Card>

            <Card className="p-5 bg-[#2E7D32] border-0">
              <h3 className="font-bold text-white mb-1">Pending Orders</h3>
              <p className="text-green-200 text-sm mb-3">4 orders waiting for your action.</p>
              <Btn variant="white" full onClick={() => navigate('/farmer/orders')}>View Orders →</Btn>
            </Card>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}
