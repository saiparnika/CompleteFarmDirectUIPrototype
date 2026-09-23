import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn } from '../../components/ui';

export default function Cart() {
  const navigate = useNavigate();
  const [qty, setQty] = useState(10);
  const price = 28;
  const subtotal = qty * price;
  const delivery = 40;
  const total = subtotal + delivery;

  return (
    <BuyerLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="p-5">
            <div className="flex gap-4">
              <div className="w-20 h-20 bg-green-50 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">🍅</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900">Fresh Tomatoes</p>
                    <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">✓ <span className="text-green-600">Ravi Kumar</span> · 500 kg available</p>
                    <p className="text-xs text-gray-400 mt-0.5">Grade A · Doddaballapur</p>
                  </div>
                  <button className="text-gray-300 hover:text-red-400 text-xl transition">✕</button>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                    <button onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm font-bold hover:border-[#2E7D32] transition">−</button>
                    <span className="w-12 text-center text-sm font-bold">{qty} kg</span>
                    <button onClick={() => setQty(q => Math.min(500, q + 1))}
                      className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm font-bold hover:border-[#2E7D32] transition">+</button>
                  </div>
                  <p className="text-lg font-bold text-gray-900">₹{subtotal}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-3">
            <span>🌱</span>
            <p className="text-sm text-green-700">You're buying directly from a verified farmer. No middlemen.</p>
          </div>

          <button onClick={() => navigate('/buyer/marketplace')} className="text-sm text-[#2E7D32] font-medium hover:underline">+ Add more products</button>
        </div>

        <div>
          <Card className="p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Tomatoes × {qty} kg</span>
                <span className="font-medium">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Delivery</span>
                <span className="font-medium">₹{delivery}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-[#2E7D32]">₹{total}</span>
              </div>
            </div>
            <div className="mt-5"><Btn full size="lg" onClick={() => navigate('/buyer/checkout')}>Proceed to Checkout →</Btn></div>
            <p className="text-xs text-gray-400 text-center mt-3">Free cancellation before dispatch</p>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}
