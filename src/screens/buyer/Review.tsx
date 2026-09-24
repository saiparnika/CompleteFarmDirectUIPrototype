import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn } from '../../components/ui';

export default function Review() {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <BuyerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-10 text-center max-w-md w-full">
            <div className="text-5xl mb-4">🙏</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your feedback!</h2>
            <p className="text-gray-500 mb-6">Your review helps other buyers make informed choices.</p>
            <Btn full onClick={() => navigate('/buyer/home')}>Back to Home</Btn>
          </Card>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">How was your experience?</h1>
        <p className="text-gray-500 mb-6">Share your feedback about your order from Ravi Kumar.</p>

        <Card className="p-6">
          {/* Farmer */}
          <div className="flex items-center gap-4 mb-6 pb-5 border-b border-gray-100">
            <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-3xl">👨‍🌾</div>
            <div>
              <p className="font-bold text-gray-900">Ravi Kumar</p>
              <p className="text-sm text-gray-500">Green Valley Farm · Doddaballapur</p>
              <p className="text-xs text-gray-400 mt-0.5">Order #FD1024 · Fresh Tomatoes · 10 kg</p>
            </div>
          </div>

          {/* Stars */}
          <div className="text-center mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Rate your experience</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s}
                  onMouseEnter={() => setHover(s)}
                  onMouseLeave={() => setHover(0)}
                  onClick={() => setRating(s)}
                  className={`text-4xl transition-transform hover:scale-110 ${s <= (hover || rating) ? 'text-amber-400' : 'text-gray-200'}`}>
                  ★
                </button>
              ))}
            </div>
            {(hover || rating) > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {[, 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][hover || rating]}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="text-sm font-medium text-gray-700 block mb-2">Share your experience</label>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              placeholder="Tomatoes were very fresh! Great packaging and on-time delivery…"
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] transition resize-none"
            />
          </div>

          <Btn full size="lg" disabled={rating === 0} onClick={() => setSubmitted(true)}>
            Submit Review
          </Btn>
        </Card>
      </div>
    </BuyerLayout>
  );
}
