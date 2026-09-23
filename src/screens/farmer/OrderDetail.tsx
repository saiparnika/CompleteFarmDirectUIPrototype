import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FarmerLayout } from '../../components/Layout';
import { Card, Btn, Badge, StatusTimeline } from '../../components/ui';

const orderSteps = ['Order Placed', 'Accepted', 'Preparing', 'In Transit', 'Delivered'];

export default function FarmerOrderDetail() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAccept = () => {
    setStep(1);
    setAccepted(true);
    showToast('Order accepted successfully!');
  };

  const handleProgress = () => {
    if (step < 4) {
      setStep(s => s + 1);
      showToast(`Status updated to: ${orderSteps[step + 1]}`);
    }
  };

  return (
    <FarmerLayout>
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#2E7D32] text-white px-6 py-3 rounded-xl shadow-lg text-sm font-medium animate-bounce">
          ✓ {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate('/farmer/orders')} className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">← Back to Orders</button>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order #FD1024</h1>
            <p className="text-gray-500 text-sm mt-1">Placed on 20 Sep 2026</p>
          </div>
          <Badge variant={step === 0 ? 'pending' : step === 4 ? 'delivered' : step === 3 ? 'transit' : step === 2 ? 'preparing' : 'active'}>
            {orderSteps[step]}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Buyer Details</h3>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-xl">🏪</div>
              <div>
                <p className="font-bold text-gray-900">Green Leaf Restaurant</p>
                <p className="text-xs text-gray-500">📍 Bengaluru, Karnataka</p>
              </div>
            </div>
          </Card>
          <Card className="p-5">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">Payment</h3>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-xs">✓</span>
              <span className="font-medium text-green-700">Demo Payment Confirmed</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">UPI · Demo mode — no real charge</p>
          </Card>
        </div>

        <Card className="p-5 mb-4">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Order Details</h3>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-3xl">🍅</div>
            <div className="flex-1">
              <p className="font-bold text-gray-900">Fresh Tomatoes</p>
              <p className="text-sm text-gray-500">Grade A · Doddaballapur</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Quantity', value: '300 kg' },
              { label: 'Price/kg', value: '₹28' },
              { label: 'Total', value: '₹8,400' },
            ].map(d => (
              <div key={d.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-400">{d.label}</p>
                <p className="text-base font-bold text-gray-900">{d.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-500 mb-4">Order Status</h3>
          <StatusTimeline steps={orderSteps} current={step} />
        </Card>

        {!accepted ? (
          <div className="flex gap-3">
            <Btn full size="lg" onClick={handleAccept}>✓ Accept Order</Btn>
            <Btn variant="danger" size="lg" onClick={() => navigate('/farmer/orders')}>Reject</Btn>
          </div>
        ) : step < 4 ? (
          <Btn full size="lg" onClick={handleProgress}>
            Mark as: {orderSteps[step + 1]} →
          </Btn>
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-bold text-green-800">Order Delivered Successfully!</p>
            <p className="text-sm text-green-600 mt-1">Payment of ₹8,400 has been credited.</p>
          </div>
        )}
      </div>
    </FarmerLayout>
  );
}
