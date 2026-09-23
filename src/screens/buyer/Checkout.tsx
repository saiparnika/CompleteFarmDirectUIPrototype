import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn } from '../../components/ui';

export default function Checkout() {
  const navigate = useNavigate();
  const [payment, setPayment] = useState('UPI');

  return (
    <BuyerLayout>
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">← Back</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Address */}
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">📍 Delivery Address</h2>
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-[#2E7D32]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Home</p>
                  <p className="text-sm text-gray-600 mt-1">42 Indiranagar, 1st Cross, Bengaluru, Karnataka – 560038</p>
                </div>
                <span className="text-xs bg-[#2E7D32] text-white px-2 py-0.5 rounded-full">Default</span>
              </div>
            </div>
            <button className="text-sm text-[#2E7D32] font-medium mt-3 hover:underline">+ Add new address</button>
          </Card>

          {/* Payment */}
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">💳 Payment Method</h2>
            <div className="flex flex-col gap-3">
              {[
                { id: 'UPI', icon: '📱', label: 'UPI', sub: 'Google Pay, PhonePe, Paytm' },
                { id: 'Card', icon: '💳', label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
                { id: 'COD', icon: '💵', label: 'Cash on Delivery', sub: 'Pay when you receive' },
              ].map(p => (
                <label key={p.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition ${payment === p.id ? 'border-[#2E7D32] bg-green-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" checked={payment === p.id} onChange={() => setPayment(p.id)} className="accent-[#2E7D32]" />
                  <span className="text-2xl">{p.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{p.label}</p>
                    <p className="text-xs text-gray-500">{p.sub}</p>
                  </div>
                </label>
              ))}
            </div>
            <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-3 flex items-center gap-2">
              <span>⚠️</span>
              <p className="text-xs text-amber-700">Demo payment — no real money will be charged.</p>
            </div>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card className="p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex gap-3 mb-4 pb-4 border-b border-gray-100">
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">🍅</div>
              <div>
                <p className="font-semibold text-gray-900">Fresh Tomatoes</p>
                <p className="text-xs text-gray-500">10 kg × ₹28/kg</p>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹280</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>₹40</span></div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base">
                <span>Total</span><span className="text-[#2E7D32]">₹320</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-4">Estimated delivery: Tomorrow, 24 Sep 2026</p>
            <Btn full size="lg" onClick={() => navigate('/buyer/confirmation')}>🛒 Place Order</Btn>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}
