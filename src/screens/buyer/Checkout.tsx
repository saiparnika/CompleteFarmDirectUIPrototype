import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn } from '../../components/ui';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getCartSubtotal, clearCart } = useCart();
  const [payment, setPayment] = useState('cash_on_delivery');
  
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('9876543210');
  const [address, setAddress] = useState('42 Indiranagar, 1st Cross');
  const [city, setCity] = useState('Bengaluru');
  const [state, setState] = useState('Karnataka');
  const [pincode, setPincode] = useState('560038');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = getCartSubtotal();
  const delivery = items.length > 0 ? 40 : 0;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <BuyerLayout>
        <div className="py-12 text-center text-gray-500">Your cart is empty.</div>
        <div className="text-center">
          <Btn onClick={() => navigate('/buyer/marketplace')}>Back to Marketplace</Btn>
        </div>
      </BuyerLayout>
    );
  }

  const handlePlaceOrder = async () => {
    if (!name || !phone || !address || !city || !state || !pincode) {
      setError("Please fill all delivery fields.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderItems = items.map(item => ({
        product_id: item.product.id,
        quantity_kg: item.quantity_kg
      }));

      const { data, error: rpcError } = await supabase.rpc('create_order', {
        p_delivery_name: name,
        p_delivery_phone: phone,
        p_delivery_address: address,
        p_delivery_city: city,
        p_delivery_state: state,
        p_delivery_pincode: pincode,
        p_payment_method: payment,
        p_items: orderItems
      });

      if (rpcError) throw rpcError;

      clearCart();
      navigate(`/buyer/confirmation?order_id=${data}`);
    } catch (err: any) {
      setError(err.message || "Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BuyerLayout>
      <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">← Back</button>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 font-medium">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Address */}
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">📍 Delivery Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">State</label>
                <input type="text" value={state} onChange={e => setState(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Pincode</label>
                <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} className="w-full border border-gray-200 rounded-lg p-2" />
              </div>
            </div>
          </Card>

          {/* Payment */}
          <Card className="p-5">
            <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">💳 Payment Method</h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition border-[#2E7D32] bg-green-50">
                <input type="radio" name="payment" checked={payment === 'cash_on_delivery'} onChange={() => setPayment('cash_on_delivery')} className="accent-[#2E7D32]" />
                <span className="text-2xl">💵</span>
                <div>
                  <p className="font-semibold text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when you receive</p>
                </div>
              </label>
            </div>
          </Card>
        </div>

        {/* Summary */}
        <div>
          <Card className="p-5 sticky top-20">
            <h2 className="font-bold text-gray-900 mb-4">Order Summary</h2>
            
            <div className="mb-4 max-h-60 overflow-y-auto">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-3 mb-3 pb-3 border-b border-gray-50">
                  <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center text-xl overflow-hidden">
                    {item.product.image_url ? (
                      <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">{item.product.name}</p>
                    <p className="text-xs text-gray-500">{item.quantity_kg} {item.product.unit} × ₹{item.product.price_per_kg}/{item.product.unit}</p>
                  </div>
                  <div className="font-medium text-sm text-gray-900">
                    ₹{item.product.price_per_kg * item.quantity_kg}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-2 text-sm mb-4">
              <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>₹{subtotal}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Delivery</span><span>₹{delivery}</span></div>
              <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-base">
                <span>Total</span><span className="text-[#2E7D32]">₹{total}</span>
              </div>
            </div>
            <Btn full size="lg" onClick={handlePlaceOrder} disabled={loading}>
              {loading ? 'Processing...' : '🛒 Place Order'}
            </Btn>
          </Card>
        </div>
      </div>
    </BuyerLayout>
  );
}
