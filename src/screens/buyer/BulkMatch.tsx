import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn, VerifiedBadge, Stars } from '../../components/ui';

const farmers = [
  { name: 'Ravi Kumar', farm: 'Green Valley Farm', qty: 500, price: 28, distance: '12 km', rating: 4.8, match: 92, checks: ['Quantity available', 'Price within budget', 'Nearby', 'Date available'] },
  { name: 'Priya Farms', farm: 'Priya Agro', qty: 350, price: 30, distance: '18 km', rating: 4.7, match: 85, checks: ['Quantity available', 'Price within budget', 'Date available'] },
  { name: 'Green Valley Farm', farm: 'GVF Exports', qty: 700, price: 27, distance: '25 km', rating: 4.6, match: 78, checks: ['Quantity available', 'Price within budget', 'Nearby'] },
];

export default function BulkMatch() {
  const navigate = useNavigate();
  return (
    <BuyerLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Matching Farmers</h1>
        <p className="text-gray-500 text-sm mt-1">Farmers matching your requirement · Tomato · 300 kg · max ₹30/kg · Bengaluru</p>
      </div>

      <div className="flex flex-col gap-4">
        {farmers.map((f, i) => (
          <Card key={f.name} className={`p-5 ${i === 0 ? 'ring-2 ring-[#2E7D32]' : ''}`}>
            {i === 0 && (
              <div className="bg-[#2E7D32] text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">Best Match</div>
            )}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">👨‍🌾</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-bold text-gray-900">{f.name}</span>
                  <VerifiedBadge />
                  <Stars rating={f.rating} />
                </div>
                <p className="text-sm text-gray-500">{f.farm} · 📍 {f.distance}</p>
                <p className="text-sm font-bold text-[#2E7D32] mt-1">₹{f.price}/kg · {f.qty} kg available</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {f.checks.map(c => (
                    <span key={c} className="text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">✓ {c}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end justify-between gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2E7D32]">{f.match}%</div>
                  <div className="text-xs text-gray-400">Match</div>
                </div>
                <Btn size="sm" onClick={() => navigate('/buyer/product')}>Contact / Order</Btn>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </BuyerLayout>
  );
}
