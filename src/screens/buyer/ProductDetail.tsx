import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn, Badge, VerifiedBadge, Stars } from '../../components/ui';

export default function ProductDetail() {
  const navigate = useNavigate();
  const [qty, setQty] = useState(10);
  const total = qty * 28;

  return (
    <BuyerLayout>
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">← Back to Marketplace</button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div>
          <div className="h-80 bg-green-50 rounded-2xl overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600&h=400&fit=crop&auto=format"
              alt="Tomatoes" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <div className="absolute top-4 left-4">
              <Badge variant="active">Available</Badge>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            {['🍅', '🍅', '🍅'].map((_, i) => (
              <div key={i} className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center text-2xl border-2 border-transparent hover:border-[#2E7D32] cursor-pointer transition">🍅</div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between mb-3">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Fresh Tomatoes</h1>
              <p className="text-gray-500 text-sm mt-1">Harvested 18 Sep 2026 · Doddaballapur</p>
            </div>
            <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl hover:bg-red-50 hover:text-red-500 transition">♡</button>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl font-bold text-[#2E7D32]">₹28/kg</span>
            <Badge variant="grade">Grade A</Badge>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Available</p>
              <p className="font-bold text-gray-900">500 kg</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Distance</p>
              <p className="font-bold text-gray-900">12 km</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-xs text-gray-400">Quality</p>
              <p className="font-bold text-gray-900">Grade A</p>
            </div>
          </div>

          {/* Farmer */}
          <Card className="p-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">👨‍🌾</div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900">Ravi Kumar</span>
                  <VerifiedBadge />
                </div>
                <p className="text-xs text-gray-500">Green Valley Farm · Doddaballapur</p>
              </div>
              <div className="text-right">
                <Stars rating={4.8} />
                <button onClick={() => navigate('/buyer/farmer-profile')} className="text-xs text-[#2E7D32] hover:underline block mt-1">View Profile</button>
              </div>
            </div>
          </Card>

          {/* Qty selector */}
          <div className="flex items-center gap-4 mb-5">
            <span className="text-sm font-medium text-gray-700">Quantity:</span>
            <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1">
              <button onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-[#2E7D32] transition">−</button>
              <span className="w-12 text-center font-bold text-gray-900">{qty} kg</span>
              <button onClick={() => setQty(q => Math.min(500, q + 1))}
                className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center font-bold text-gray-600 hover:border-[#2E7D32] transition">+</button>
            </div>
            <span className="text-sm text-gray-500">Total: <span className="font-bold text-gray-900">₹{total}</span></span>
          </div>

          <div className="flex gap-3">
            <Btn full size="lg" onClick={() => navigate('/buyer/cart')}>🛒 Add to Cart</Btn>
            <Btn variant="secondary" size="lg" onClick={() => navigate('/buyer/checkout')}>Buy Now</Btn>
          </div>
        </div>
      </div>

      {/* Details sections */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: 'About this Produce', content: 'Fresh tomatoes grown without synthetic pesticides. Ideal for cooking, salads, and restaurants. Consistent size and deep red color.' },
          { title: 'Harvest Information', content: 'Harvested on 18 Sep 2026. Post-harvest handling follows food safety standards. Delivered within 24–48 hours of harvest.' },
          { title: 'Quality Information', content: 'Grade A quality — uniform size, no blemishes. Direct from farm to reduce spoilage. Tested for pesticide residue.' },
        ].map(s => (
          <Card key={s.title} className="p-5">
            <h3 className="font-bold text-gray-900 mb-2">{s.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{s.content}</p>
          </Card>
        ))}
      </div>
    </BuyerLayout>
  );
}
