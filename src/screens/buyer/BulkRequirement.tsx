import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn, Input, Select } from '../../components/ui';

export default function BulkRequirement() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    product: 'Tomato', qty: '300', maxPrice: '30', date: '2026-09-25', location: 'Bengaluru',
  });

  return (
    <BuyerLayout>
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Post Bulk Requirement</h1>
          <p className="text-gray-500 text-sm mt-1">Tell farmers what you need and get matched instantly.</p>
        </div>

        <Card className="p-6 mb-4">
          <div className="flex flex-col gap-5">
            <Select label="Product" options={['Tomato', 'Onion', 'Potato', 'Green Chilli', 'Brinjal', 'Cabbage']}
              value={form.product} onChange={v => setForm(f => ({ ...f, product: v }))} />
            <Input label="Quantity (kg)" placeholder="e.g. 300" value={form.qty} onChange={v => setForm(f => ({ ...f, qty: v }))} />
            <Input label="Maximum Price (₹/kg)" placeholder="e.g. 30" value={form.maxPrice} onChange={v => setForm(f => ({ ...f, maxPrice: v }))} />
            <Input label="Required Date" type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
            <Input label="Delivery Location" placeholder="e.g. Bengaluru" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} />
          </div>
        </Card>

        <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6 flex items-start gap-3">
          <span className="text-xl">🎯</span>
          <div>
            <p className="text-sm font-semibold text-green-800">How it works</p>
            <p className="text-xs text-green-700 mt-0.5">FarmDirect matches your requirements with nearby verified farmers who can fulfill your order.</p>
          </div>
        </div>

        <Btn full size="lg" onClick={() => navigate('/buyer/bulk-match')}>🔍 Find Matching Farmers</Btn>
      </div>
    </BuyerLayout>
  );
}
