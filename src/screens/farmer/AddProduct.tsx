import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/Layout';
import { Card, Btn, Input, Select } from '../../components/ui';

export default function AddProduct() {
  const navigate = useNavigate();
  const [published, setPublished] = useState(false);
  const [form, setForm] = useState({
    name: 'Tomato', category: 'Vegetables', qty: '500', unit: 'kg',
    price: '28', quality: 'Grade A', harvest: '2026-09-18', location: 'Doddaballapur',
  });

  if (published) {
    return (
      <FarmerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-10 text-center max-w-md w-full">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Published!</h2>
            <p className="text-gray-500 mb-6">Your product is now live on the marketplace.</p>
            <div className="bg-green-50 rounded-xl p-4 mb-6 text-left">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🍅</span>
                <div>
                  <p className="font-bold text-gray-900">{form.name}</p>
                  <p className="text-sm text-gray-500">{form.qty} {form.unit} · ₹{form.price}/kg · {form.quality}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Btn full onClick={() => navigate('/farmer/products')}>View My Products</Btn>
              <Btn full variant="outline" onClick={() => { setPublished(false); }}>Add Another Product</Btn>
            </div>
          </Card>
        </div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-3">← Back</button>
          <h1 className="text-2xl font-bold text-gray-900">Add New Produce</h1>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to list your produce on the marketplace.</p>
        </div>

        <Card className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input label="Product Name" placeholder="e.g. Tomato" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
            <Select label="Category" options={['Vegetables', 'Fruits', 'Grains', 'Pulses', 'Organic']} value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} />
            <Input label="Quantity" placeholder="e.g. 500" value={form.qty} onChange={v => setForm(f => ({ ...f, qty: v }))} />
            <Select label="Unit" options={['kg', 'quintal', 'ton', 'dozen']} value={form.unit} onChange={v => setForm(f => ({ ...f, unit: v }))} />
            <Input label="Price per kg (₹)" placeholder="e.g. 28" value={form.price} onChange={v => setForm(f => ({ ...f, price: v }))} />
            <Select label="Quality Grade" options={['Grade A', 'Grade B', 'Grade C', 'Organic']} value={form.quality} onChange={v => setForm(f => ({ ...f, quality: v }))} />
            <Input label="Harvest Date" type="date" value={form.harvest} onChange={v => setForm(f => ({ ...f, harvest: v }))} />
            <Input label="Location" placeholder="e.g. Doddaballapur" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} />
          </div>

          <div className="mt-5">
            <label className="text-sm font-medium text-gray-700 block mb-1.5">Product Image</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#2E7D32]/50 transition cursor-pointer">
              <div className="text-3xl mb-2">📷</div>
              <p className="text-sm text-gray-500">Click to upload product image</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          {/* Price insight */}
          <div className="mt-5 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl">💡</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">Price Recommendation</p>
              <p className="text-xs text-amber-700 mt-0.5">Current market suggests ₹27–₹30/kg for Tomato. Your price of ₹{form.price}/kg is within range.</p>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Btn full onClick={() => setPublished(true)} size="lg">🚀 Publish Product</Btn>
            <Btn variant="outline" onClick={() => navigate('/farmer/products')}>Save Draft</Btn>
          </div>
        </Card>
      </div>
    </FarmerLayout>
  );
}
