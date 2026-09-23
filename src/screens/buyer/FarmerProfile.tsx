import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn, VerifiedBadge, Stars } from '../../components/ui';

const products = [
  { name: 'Tomatoes', price: 28, qty: 480, icon: '🍅' },
  { name: 'Green Chilli', price: 45, qty: 120, icon: '🌶️' },
  { name: 'Onion', price: 22, qty: 200, icon: '🧅' },
];

export default function FarmerProfileBuyer() {
  const navigate = useNavigate();
  return (
    <BuyerLayout>
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">← Back</button>
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 mb-4 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4">👨‍🌾</div>
          <h1 className="text-2xl font-bold text-gray-900">Ravi Kumar</h1>
          <div className="flex items-center justify-center gap-2 mt-2">
            <VerifiedBadge />
            <Stars rating={4.8} />
          </div>
          <p className="text-gray-500 text-sm mt-2">🌿 Green Valley Farm · 📍 Doddaballapur</p>
          <div className="grid grid-cols-3 gap-3 mt-6">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold text-gray-900">8</p>
              <p className="text-xs text-gray-500">Products</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold text-gray-900">124</p>
              <p className="text-xs text-gray-500">Orders</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xl font-bold text-gray-900">8 yrs</p>
              <p className="text-xs text-gray-500">Experience</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-3">Verification</h2>
          <div className="flex flex-col gap-2">
            {['Identity Verified', 'Farm Details Verified', 'Bank Linked'].map(v => (
              <div key={v} className="flex items-center gap-2 text-sm text-green-700">
                <span className="text-green-600">✓</span> {v}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">Products from Ravi Kumar</h2>
          <div className="flex flex-col gap-3">
            {products.map(p => (
              <div key={p.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.qty} kg available</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#2E7D32]">₹{p.price}/kg</p>
                  <button onClick={() => navigate('/buyer/product')} className="text-xs text-[#2E7D32] hover:underline">View →</button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Btn full size="lg" onClick={() => navigate('/buyer/product')}>Browse Products</Btn>
      </div>
    </BuyerLayout>
  );
}
