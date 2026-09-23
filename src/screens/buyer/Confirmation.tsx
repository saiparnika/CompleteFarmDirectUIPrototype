import { useNavigate } from 'react-router-dom';
import { BuyerLayout } from '../../components/Layout';
import { Card, Btn } from '../../components/ui';

export default function Confirmation() {
  const navigate = useNavigate();
  return (
    <BuyerLayout>
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="p-10 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5 text-4xl">✓</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-500 mb-6">Your order has been placed and the farmer has been notified.</p>

          <div className="bg-gray-50 rounded-2xl p-5 mb-6 text-left">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-500">Order ID</span>
              <span className="font-bold text-gray-900">#FD1024</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-500">Product</span>
              <span className="font-medium">Fresh Tomatoes</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-500">Quantity</span>
              <span className="font-medium">10 kg</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="text-gray-500">Total</span>
              <span className="font-bold text-[#2E7D32]">₹320</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Est. Delivery</span>
              <span className="font-semibold text-gray-900">Tomorrow, 24 Sep 2026</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Btn full size="lg" onClick={() => navigate('/buyer/tracking')}>📍 Track Order</Btn>
            <Btn full variant="outline" onClick={() => navigate('/buyer/marketplace')}>Continue Shopping</Btn>
          </div>
        </Card>
      </div>
    </BuyerLayout>
  );
}
