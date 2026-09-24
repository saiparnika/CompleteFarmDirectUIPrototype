import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn, Badge } from '../../components/ui';
import { useBuyerProducts } from '../../hooks/useBuyerProducts';

export default function Marketplace() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Newest');
  const [filterCat, setFilterCat] = useState('All');
  const { products, loading, error } = useBuyerProducts();

  const filtered = products.filter(p =>
    (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())) &&
    (filterCat === 'All' || p.category.toLowerCase() === filterCat.toLowerCase())
  );

  // Sorting
  filtered.sort((a, b) => {
    if (sort === 'Price (Low-High)') return a.price_per_kg - b.price_per_kg;
    if (sort === 'Price (High-Low)') return b.price_per_kg - a.price_per_kg;
    // Newest is default based on fetch order, but we can enforce it:
    if (sort === 'Newest') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    return 0;
  });

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Organic'];

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
                {categories.map(c => (
                  <button key={c} onClick={() => setFilterCat(c)}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${filterCat === c ? 'bg-green-50 text-[#2E7D32] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sort by</p>
                {['Newest', 'Price (Low-High)', 'Price (High-Low)'].map(s => (
                  <button key={s} onClick={() => setSort(s)}
                    className={`block w-full text-left px-3 py-1.5 rounded-lg text-sm transition ${sort === s ? 'bg-green-50 text-[#2E7D32] font-medium' : 'text-gray-600 hover:bg-gray-50'}`}>
                    {s}
                  </button>
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

          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">{filtered.length} products found</p>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading products...</div>
          ) : error ? (
            <div className="py-12 text-center text-red-500">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No products found matching your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p) => (
                <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
                  <div className="h-40 bg-green-50 flex items-center justify-center text-5xl relative overflow-hidden">
                    {p.image_url ? (
                      <img src={p.image_url} alt={p.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    ) : (
                      <span className="relative z-10">📦</span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-bold text-gray-900">{p.name}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <span className="text-green-600 font-medium">✓ {p.farmer?.full_name || 'Farmer'}</span>
                        </p>
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-[#2E7D32] mb-1">₹{p.price_per_kg}/{p.unit}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {p.grade && <Badge variant="grade">{p.grade}</Badge>}
                      {p.location && <span className="text-xs text-gray-400 py-0.5">📍 {p.location}</span>}
                    </div>
                    <p className="text-xs text-gray-400 mb-3">
                      {p.harvest_date && `🌾 Harvested ${new Date(p.harvest_date).toLocaleDateString()} · `}
                      {p.quantity_kg} {p.unit} available
                    </p>
                    <div className="flex gap-2">
                      <Btn size="sm" full onClick={() => navigate(`/buyer/product/${p.id}`)}>View Details</Btn>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BuyerLayout>
  );
}
