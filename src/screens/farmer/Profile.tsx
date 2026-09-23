import { FarmerLayout } from '../../components/Layout';
import { Card, VerifiedBadge, Stars } from '../../components/ui';

export default function FarmerProfile() {
  return (
    <FarmerLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 mb-4">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mb-4">👨‍🌾</div>
            <h1 className="text-2xl font-bold text-gray-900">Ravi Kumar</h1>
            <div className="flex items-center gap-2 mt-1">
              <VerifiedBadge />
              <Stars rating={4.8} />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Products', value: '8' },
              { label: 'Total Sales', value: '₹1.2L' },
              { label: 'Orders', value: '124' },
              { label: 'Experience', value: '8 yrs' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              { icon: '🌿', label: 'Farm', value: 'Green Valley Farm' },
              { icon: '📍', label: 'Location', value: 'Doddaballapur, Karnataka' },
              { icon: '🗓', label: 'Member since', value: 'January 2022' },
              { icon: '📱', label: 'Contact', value: '+91 98765 43210' },
            ].map(d => (
              <div key={d.label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <span className="text-xl">{d.icon}</span>
                <div>
                  <p className="text-xs text-gray-400">{d.label}</p>
                  <p className="font-medium text-gray-800">{d.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 mb-4">
          <h2 className="font-bold text-gray-900 mb-4">Verification Status</h2>
          <div className="flex flex-col gap-3">
            {[
              { icon: '🪪', label: 'Identity Verified', sub: 'Aadhaar linked · Verified on 12 Jan 2022' },
              { icon: '🌾', label: 'Farm Details Verified', sub: 'Land records confirmed · Doddaballapur' },
              { icon: '🏦', label: 'Bank Account Linked', sub: 'SBI Account · Direct payment enabled' },
            ].map(v => (
              <div key={v.label} className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-lg">{v.icon}</div>
                <div>
                  <p className="font-semibold text-green-800 text-sm flex items-center gap-1">{v.label} <span className="text-green-600">✓</span></p>
                  <p className="text-xs text-green-600 mt-0.5">{v.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-bold text-gray-900 mb-3">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Ravi Kumar has been farming for over 8 years at Green Valley Farm in Doddaballapur. Specializing in fresh vegetables, particularly tomatoes, onions, and potatoes. Known for Grade A quality produce and timely deliveries.
          </p>
        </Card>
      </div>
    </FarmerLayout>
  );
}
