import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn, StatusTimeline, VerifiedBadge } from '../../components/ui';

const steps = ['Order Placed', 'Accepted by Farmer', 'Preparing', 'In Transit', 'Delivered'];

export default function Tracking() {
  const navigate = useNavigate();
  const [step, setStep] = useState(2);
  const [confirmed, setConfirmed] = useState(false);

  return (
    <BuyerLayout>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Track Your Order</h1>
        <p className="text-gray-500 text-sm mb-6">Order #FD1024</p>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <Card className="p-5">
            <div className="flex gap-4 items-center">
              <div className="text-3xl">🍅</div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">Fresh Tomatoes · 10 kg</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-gray-500">Farmer:</span>
                  <span className="text-sm font-medium text-gray-800">Ravi Kumar</span>
                  <VerifiedBadge />
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Total</p>
                <p className="font-bold text-[#2E7D32]">₹320</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="font-bold text-gray-900 mb-4">Order Status</h3>
            <StatusTimeline steps={steps} current={step} />
          </Card>

          {/* Location card */}
          <Card className="p-5">
            <h3 className="font-bold text-gray-900 mb-3">Location</h3>
            <div className="bg-[#F7F8F2] rounded-xl p-4 flex items-start gap-4">
              <div className="flex flex-col items-center gap-1">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">🌾</div>
                <div className="w-0.5 h-10 bg-dashed bg-gray-300 border-l-2 border-dashed border-gray-300" />
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">🏠</div>
              </div>
              <div className="flex flex-col gap-5 pt-1">
                <div>
                  <p className="text-xs text-gray-400">Pickup</p>
                  <p className="font-semibold text-gray-800">Doddaballapur, Karnataka</p>
                  <p className="text-xs text-gray-500">Green Valley Farm</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Delivery</p>
                  <p className="font-semibold text-gray-800">Indiranagar, Bengaluru</p>
                  <p className="text-xs text-gray-500">~12 km · Est. tomorrow by 2 PM</p>
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">⚠ Prototype: No real GPS tracking. Status updated by farmer.</p>
          </Card>

          {/* Demo controls */}
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-bold text-amber-700 mb-2">🎯 Demo Controls</p>
            <div className="flex flex-wrap gap-2">
              {steps.map((s, i) => (
                <button key={s} onClick={() => setStep(i)}
                  className={`text-xs px-3 py-1.5 rounded-full font-medium transition ${step === i ? 'bg-amber-500 text-white' : 'bg-white text-amber-700 border border-amber-200 hover:bg-amber-50'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {step === 4 && !confirmed ? (
          <Btn full size="lg" onClick={() => { setConfirmed(true); navigate('/buyer/review'); }}>
            ✓ Confirm Delivery & Review
          </Btn>
        ) : step === 4 && confirmed ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 text-center">
            <p className="font-bold text-green-800">Delivery Confirmed!</p>
            <button onClick={() => navigate('/buyer/review')} className="text-sm text-[#2E7D32] underline mt-1">Leave a review</button>
          </div>
        ) : (
          <p className="text-center text-sm text-gray-400">Waiting for delivery to confirm receipt.</p>
        )}
      </div>
    </BuyerLayout>
  );
}
