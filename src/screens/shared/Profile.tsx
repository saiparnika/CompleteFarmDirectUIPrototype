import { useAuth } from '../../context/AuthContext';
import { FarmerLayout, BuyerLayout, AdminLayout } from '../../components/Layout';
import { Card, VerifiedBadge, Stars } from '../../components/ui';

export default function Profile() {
  const { profile } = useAuth();

  const Layout = profile?.role === 'farmer' ? FarmerLayout : (profile?.role === 'admin' ? AdminLayout : BuyerLayout);

  if (!profile) {
    return (
      <Layout>
        <div className="py-12 text-center text-gray-500">Loading profile...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 mb-4">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-4 overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name || 'User'} className="w-full h-full object-cover" />
              ) : (
                <span>{profile.role === 'farmer' ? '👨‍🌾' : '👤'}</span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.full_name || 'Unknown User'}</h1>
            {profile.role === 'farmer' && (
              <div className="flex items-center justify-center gap-2 mt-1">
                {profile.is_verified && <VerifiedBadge />}
                <Stars rating={4.8} />
              </div>
            )}
            <p className="text-gray-500 text-sm mt-2 font-medium capitalize">
              {profile.role.replace('_', ' ')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            {[
              { icon: '📍', label: 'Location', value: profile.location || 'Not specified' },
              { icon: '📱', label: 'Contact', value: profile.phone || 'Not specified' },
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

        {profile.is_verified && (
          <Card className="p-6 mb-4">
            <h2 className="font-bold text-gray-900 mb-4">Verification Status</h2>
            <div className="flex flex-col gap-3">
              {[
                { icon: '🪪', label: 'Identity Verified', sub: 'Verified account' },
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
        )}

        <Card className="p-6">
          <h2 className="font-bold text-gray-900 mb-3">About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            {profile.role === 'farmer' 
              ? 'This is a verified farmer profile on FarmDirect.' 
              : 'This is a verified buyer profile on FarmDirect.'}
          </p>
        </Card>
      </div>
    </Layout>
  );
}
