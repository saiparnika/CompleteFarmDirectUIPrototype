import { FarmerLayout } from '../../components/Layout';
import { Card } from '../../components/ui';

const insights = [
  { crop: 'Tomato', icon: '🍅', current: 28, min: 27, max: 30, demand: 'High', trend: '+12%' },
  { crop: 'Onion', icon: '🧅', current: 22, min: 20, max: 25, demand: 'Medium', trend: '+4%' },
  { crop: 'Potato', icon: '🥔', current: 18, min: 16, max: 22, demand: 'Low', trend: '-3%' },
];

export default function FarmerInsights() {
  return (
    <FarmerLayout>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Smart Market Insights</h1>
      <p className="text-gray-500 text-sm mb-6">Prototype visualizations based on marketplace trends. Not real-time AI.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {insights.map(i => (
          <Card key={i.crop} className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{i.icon}</span>
              <div>
                <p className="font-bold text-gray-900">{i.crop}</p>
                <span className={`text-xs font-semibold ${i.demand === 'High' ? 'text-green-600' : i.demand === 'Medium' ? 'text-amber-600' : 'text-gray-400'}`}>
                  Demand: {i.demand}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 mb-3">
              <p className="text-xs text-gray-500">Current Price</p>
              <p className="text-2xl font-bold text-gray-900">₹{i.current}/kg</p>
              <p className="text-xs text-green-600 font-medium mt-0.5">{i.trend} this week</p>
            </div>
            <div className="bg-green-50 rounded-xl p-3">
              <p className="text-xs text-gray-500 mb-1">Recommended Range</p>
              <p className="text-sm font-bold text-[#2E7D32]">₹{i.min}–₹{i.max}/kg</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <h3 className="font-bold text-gray-900 mb-4">📈 Weekly Demand Forecast</h3>
        <div className="flex flex-col gap-4">
          {insights.map(i => (
            <div key={i.crop}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700 flex items-center gap-2">{i.icon} {i.crop}</span>
                <span className={`font-semibold ${i.demand === 'High' ? 'text-green-600' : i.demand === 'Medium' ? 'text-amber-600' : 'text-gray-400'}`}>
                  {i.demand}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${i.demand === 'High' ? 'bg-[#66BB6A]' : i.demand === 'Medium' ? 'bg-amber-400' : 'bg-gray-300'}`}
                  style={{ width: i.demand === 'High' ? '85%' : i.demand === 'Medium' ? '55%' : '30%' }}
                />
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">⚠ Prototype data only. Not real-time market data.</p>
      </Card>
    </FarmerLayout>
  );
}
