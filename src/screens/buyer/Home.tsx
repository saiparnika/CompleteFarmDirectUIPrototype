import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn } from '../../components/ui';

const categories = [
  { icon: '🥬', label: 'Vegetables' },
  { icon: '🍎', label: 'Fruits' },
  { icon: '🌾', label: 'Grains' },
  { icon: '🫘', label: 'Pulses' },
  { icon: '🌿', label: 'Organic' },
];

const nearbyProducts = [
  { name: 'Tomatoes', price: 28, qty: 500, location: 'Doddaballapur', rating: 4.8, distance: '12 km', farmer: 'Ravi Kumar', icon: '🍅', img: 'photo-1607305387299-a3d9611cd469' },
  { name: 'Onions', price: 22, qty: 300, location: 'Tumkur', rating: 4.6, distance: '18 km', farmer: 'Meera Devi', icon: '🧅', img: 'photo-1582284540020-8acbe03f4924' },
  { name: 'Potatoes', price: 18, qty: 600, location: 'Kolar', rating: 4.7, distance: '24 km', farmer: 'Suresh Farms', icon: '🥔', img: 'photo-1518977676405-19faf41c2035' },
  { name: 'Green Chilli', price: 45, qty: 120, location: 'Doddaballapur', rating: 4.5, distance: '12 km', farmer: 'Ravi Kumar', icon: '🌶️', img: 'photo-1583454110551-21f2fa2afe61' },
];

export default function BuyerHome() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  return (
    <BuyerLayout>
      {/* Hero */}
      <div className="relative bg-[#2E7D32] rounded-2xl overflow-hidden mb-8 p-8">
        <div className="relative z-10">
          <p className="text-green-200 text-sm font-medium mb-2">📍 Bengaluru</p>
          <h1 className="text-3xl font-bold text-white mb-2">Fresh produce,<br />directly from farmers.</h1>
          <p className="text-green-200 mb-6">Buy directly from verified local farmers near you.</p>
          <div className="flex gap-3">
            <Btn variant="white" onClick={() => navigate('/buyer/marketplace')}>🛒 Explore Marketplace</Btn>
            <Btn variant="secondary" onClick={() => navigate('/buyer/bulk')}>📋 Post Bulk Req.</Btn>
          </div>
        </div>
        <div className="absolute right-6 top-4 text-8xl opacity-20">🌾</div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && navigate('/buyer/marketplace')}
          placeholder="Search tomatoes, onions, potatoes…"
          className="w-full pl-10 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32]"
        />
        <button onClick={() => navigate('/buyer/marketplace')}
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#2E7D32] text-white px-4 py-1.5 rounded-xl text-sm font-medium hover:bg-[#256427] transition">
          Search
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Browse by Category</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map(c => (
            <button key={c.label} onClick={() => navigate('/buyer/marketplace')}
              className="flex-shrink-0 flex flex-col items-center gap-2 bg-white p-4 rounded-2xl border border-gray-100 hover:border-[#2E7D32]/30 hover:shadow-sm transition w-20">
              <span className="text-3xl">{c.icon}</span>
              <span className="text-xs font-medium text-gray-700">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Nearby */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">Fresh Near You</h2>
          <button onClick={() => navigate('/buyer/marketplace')} className="text-sm text-[#2E7D32] font-medium hover:underline">View all →</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {nearbyProducts.map(p => (
            <button key={p.name} onClick={() => navigate('/buyer/product')}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all text-left group">
              <div className="h-36 bg-green-50 flex items-center justify-center text-5xl relative overflow-hidden">
                <img
                  src={`https://images.unsplash.com/${p.img}?w=300&h=180&fit=crop&auto=format`}
                  alt={p.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="relative z-10">{p.icon}</span>
              </div>
              <div className="p-4">
                <p className="font-bold text-gray-900">{p.name}</p>
                <p className="text-[#2E7D32] font-bold text-lg">₹{p.price}/kg</p>
                <p className="text-xs text-gray-500 mt-0.5">{p.qty} kg available</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">📍 {p.distance}</span>
                  <span className="text-xs text-amber-500 font-medium">⭐ {p.rating}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <span className="text-green-600">✓</span> {p.farmer}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </BuyerLayout>
  );
}
