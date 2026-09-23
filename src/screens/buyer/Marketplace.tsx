import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn, Badge } from '../../components/ui';

const products = [
  { name: 'Tomatoes', price: 28, qty: 500, quality: 'Grade A', harvest: '18 Sep', location: 'Doddaballapur', distance: '12 km', farmer: 'Ravi Kumar', rating: 4.8, img: 'photo-1607305387299-a3d9611cd469', icon: '🍅' },
  { name: 'Tomatoes', price: 30, qty: 350, quality: 'Grade A', harvest: '17 Sep', location: 'Tumkur', distance: '18 km', farmer: 'Priya Farms', rating: 4.7, img: 'photo-1607305387299-a3d9611cd469', icon: '🍅' },
  { name: 'Tomatoes', price: 27, qty: 700, quality: 'Grade B', harvest: '16 Sep', location: 'Kolar', distance: '25 km', farmer: 'Green Valley Farm', rating: 4.6, img: 'photo-1607305387299-a3d9611cd469', icon: '🍅' },
  { name: 'Onions', price: 22, qty: 300, quality: 'Grade A', harvest: '15 Sep', location: 'Tumkur', distance: '18 km', farmer: 'Meera Devi', rating: 4.6, img: 'photo-1582284540020-8acbe03f4924', icon: '🧅' },
  { name: 'Potatoes', price: 18, qty: 600, quality: 'Grade A', harvest: '10 Sep', location: 'Kolar', distance: '24 km', farmer: 'Suresh Farms', rating: 4.7, img: 'photo-1518977676405-19faf41c2035', icon: '🥔' },
  { name: 'Green Chilli', price: 45, qty: 120, quality: 'Grade A', harvest: '19 Sep', location: 'Doddaballapur', distance: '12 km', farmer: 'Ravi Kumar', rating: 4.8, img: 'photo-1583454110551-21f2fa2afe61', icon: '🌶️' },
];

export default function Marketplace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Price');
  const [filterCat, setFilterCat] = useState('All');

  const filtered = products.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase())) &&
    (filterCat === 'All' || p.name === filterCat)
  );

  const tomatoCount = products.filter(p => p.name === 'Tomatoes').length;

  return (
    <BuyerLayout>
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar filters */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <Card className="p-4 sticky top-20">
            <h3 className="font-bold text-gray-900 mb-3">Filters</h3>
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
                {['All', 'Tomatoes', 'Onions', 'Potatoes', 'Green Chilli'].map(c => (
                  <button key={c} onClick={() => setFilterCat(c)}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${filterCat === c ? 'bg-green-50 text-[#2E7D32] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sort by</p>
                {['Price', 'Distance', 'Newest', 'Popular'].map(s => (
                  <button key={s} onClick={() => setSort(s)}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${sort === s ? 'bg-green-50 text-[#2E7D32] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {s}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quality</p>
                {['Any', 'Grade A', 'Grade B', 'Organic'].map(q => (
                  <label key={q} className="flex items-center gap-2 px-1 py-1 text-sm text-gray-600 cursor-pointer hover:text-gray-900">
                    <input type="checkbox" className="accent-[#2E7D32] rounded" defaultChecked={q === 'Any'} />
                    {q}
                  </label>
                ))}
              </div>
            </div>
          </Card>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="relative mb-4">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tomatoes, onions…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32]" />
          </div>

          {search.toLowerCase().includes('tomato') && (
            <div className="mb-4 bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-[#2E7D32]">Tomato available from {tomatoCount} farmers</p>
              <button className="text-xs text-[#2E7D32] font-medium underline">Compare Prices</button>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{filtered.length} products found</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                <div className="h-40 bg-green-50 flex items-center justify-center text-5xl relative overflow-hidden">
                  <img src={`https://images.unsplash.com/${p.img}?w=300&h=200&fit=crop&auto=format`}
                    alt={p.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <span className="relative z-10">{p.icon}</span>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        <span className="text-green-600 font-medium">✓ {p.farmer}</span>
                      </p>
                    </div>
                    <span className="text-amber-500 text-xs font-medium">⭐ {p.rating}</span>
                  </div>
                  <p className="text-2xl font-bold text-[#2E7D32] mb-1">₹{p.price}/kg</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <Badge variant="grade">{p.quality}</Badge>
                    <span className="text-xs text-gray-400 py-0.5">📍 {p.distance}</span>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">🌾 Harvested {p.harvest} · {p.qty} kg available</p>
                  <div className="flex gap-2">
                    <Btn size="sm" full onClick={() => navigate('/buyer/product')}>View Details</Btn>
                    <Btn size="sm" variant="outline" onClick={() => navigate('/buyer/cart')}>Add to Cart</Btn>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BuyerLayout>
  );
}
