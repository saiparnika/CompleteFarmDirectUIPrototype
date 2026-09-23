import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/Layout';
import { Card, Btn, Badge } from '../../components/ui';

const allProducts = [
  { name: 'Tomato', qty: 480, price: 28, quality: 'Grade A', status: 'active', harvest: '18 Sep 2026', icon: '🍅' },
  { name: 'Onion', qty: 200, price: 22, quality: 'Grade B', status: 'low', harvest: '15 Sep 2026', icon: '🧅' },
  { name: 'Potato', qty: 0, price: 18, quality: 'Grade A', status: 'sold', harvest: '10 Sep 2026', icon: '🥔' },
  { name: 'Green Chilli', qty: 120, price: 45, quality: 'Grade A', status: 'active', harvest: '19 Sep 2026', icon: '🌶️' },
  { name: 'Brinjal', qty: 80, price: 30, quality: 'Grade B', status: 'active', harvest: '17 Sep 2026', icon: '🍆' },
  { name: 'Cabbage', qty: 50, price: 20, quality: 'Grade A', status: 'low', harvest: '16 Sep 2026', icon: '🥬' },
];

const tabs = ['All', 'Active', 'Low Stock', 'Sold Out'];

export default function FarmerProducts() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('All');

  const filtered = allProducts.filter(p =>
    tab === 'All' ? true
    : tab === 'Active' ? p.status === 'active'
    : tab === 'Low Stock' ? p.status === 'low'
    : p.status === 'sold'
  );

  return (
    <FarmerLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        <Btn onClick={() => navigate('/farmer/add-product')}>+ Add Product</Btn>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${tab === t ? 'bg-[#2E7D32] text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <Card key={p.name} className="p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-3xl">
                {p.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900">{p.name}</span>
                  <Badge variant={p.status === 'active' ? 'active' : p.status === 'low' ? 'low' : 'sold'}>
                    {p.status === 'active' ? 'Active' : p.status === 'low' ? 'Low Stock' : 'Sold Out'}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{p.quality}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400">Quantity</p>
                <p className="text-sm font-semibold text-gray-900">{p.qty} kg</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-xs text-gray-400">Price</p>
                <p className="text-sm font-semibold text-gray-900">₹{p.price}/kg</p>
              </div>
              <div className="bg-gray-50 rounded-lg px-3 py-2 col-span-2">
                <p className="text-xs text-gray-400">Harvested</p>
                <p className="text-sm font-semibold text-gray-900">{p.harvest}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 text-xs font-medium text-[#2E7D32] py-2 px-3 rounded-lg bg-green-50 hover:bg-green-100 transition">Edit</button>
              <button className="flex-1 text-xs font-medium text-blue-600 py-2 px-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition">Manage Stock</button>
              <button className="flex-1 text-xs font-medium text-gray-600 py-2 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition">View</button>
            </div>
          </Card>
        ))}
      </div>
    </FarmerLayout>
  );
}
