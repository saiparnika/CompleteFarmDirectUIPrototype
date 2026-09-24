import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/Layout';
import { Card } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const { data: orders, error: oError } = await supabase.from('orders').select('*');
      if (oError) throw oError;

      const { data: users, error: uError } = await supabase.from('profiles').select('role, is_verified');
      if (uError) throw uError;

      const totalSales = orders?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
      const completedOrders = orders?.filter(o => o.status === 'delivered').length || 0;
      
      const roleCounts = users?.reduce((acc: any, user) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      const verifiedFarmers = users?.filter(u => u.role === 'farmer' && u.is_verified).length || 0;

      setStats({
        totalSales,
        completedOrders,
        roleCounts,
        verifiedFarmers,
        totalUsers: users?.length || 0
      });
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
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
        <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">User Distribution</h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Farmers</span>
              <span className="font-semibold">{stats.roleCounts?.farmer || 0}</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Verified Farmers</span>
              <span className="font-semibold text-green-600">{stats.verifiedFarmers}</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Buyers</span>
              <span className="font-semibold">{stats.roleCounts?.buyer || 0}</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Bulk Buyers</span>
              <span className="font-semibold">{stats.roleCounts?.bulk_buyer || 0}</span>
            </li>
            <li className="flex justify-between items-center text-sm border-t pt-2 mt-2">
              <span className="text-gray-900 font-bold">Total Users</span>
              <span className="font-bold text-gray-900">{stats.totalUsers}</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-gray-900 mb-4">Sales Performance</h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Revenue Generated</span>
              <span className="font-semibold text-green-600">₹{stats.totalSales.toLocaleString()}</span>
            </li>
            <li className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Delivered Orders</span>
              <span className="font-semibold">{stats.completedOrders}</span>
            </li>
            <li className="flex justify-between items-center text-sm text-gray-400 mt-4">
              <p>More detailed reports coming soon.</p>
            </li>
          </ul>
        </Card>
      </div>
    </AdminLayout>
  );
}
