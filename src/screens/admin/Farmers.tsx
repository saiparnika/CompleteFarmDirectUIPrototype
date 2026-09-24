import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/Layout';
import { Card, Badge } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export default function AdminFarmers() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchFarmers();
  }, []);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'farmer')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFarmers(data || []);
    } catch (err) {
      console.error('Error fetching farmers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (farmerId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase.rpc('admin_verify_farmer', {
        p_farmer_id: farmerId,
        p_is_verified: !currentStatus
      });
      if (error) throw error;
      fetchFarmers();
    } catch (err) {
      console.error('Error updating verification status:', err);
      alert('Failed to update verification status.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Farmers</h1>
      </div>

      <Card className="p-6">
        {farmers.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No farmers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Farmer</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Location</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Joined</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="py-3 px-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map(farmer => (
                  <tr key={farmer.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">
                          👨‍🌾
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{farmer.full_name || 'Unknown'}</p>
                          <p className="text-xs text-gray-500">{farmer.phone || 'No phone'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">{farmer.location || 'N/A'}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(farmer.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={farmer.is_verified ? 'verified' : 'pending'}>
                        {farmer.is_verified ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button 
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${farmer.is_verified ? 'border border-gray-300 text-gray-700 hover:bg-gray-50' : 'bg-[#2E7D32] text-white hover:bg-[#256427]'}`}
                        onClick={() => handleVerify(farmer.id, farmer.is_verified)}
                      >
                        {farmer.is_verified ? 'Revoke' : 'Verify'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminLayout>
  );
}
