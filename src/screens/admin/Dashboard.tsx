import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { AdminLayout } from '../../components/Layout';
import { Card, StatCard, Badge } from '../../components/ui';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalFarmers: 0,
    activeProducts: 0,
    totalOrders: 0,
    marketplaceValue: 0,
  });
  const [recentFarmers, setRecentFarmers] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [catData, setCatData] = useState<any[]>([]);
  const [chartData, setChartData] = useState<{label: string, count: number, key: string}[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch profiles
      const { data: farmers, error: pError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'farmer')
        .order('created_at', { ascending: false });
      
      if (pError) throw pError;

      // Fetch products
      const { data: products, error: prError } = await supabase
        .from('products')
        .select('*');

      if (prError) throw prError;

      // Fetch orders
      const { data: orders, error: oError } = await supabase
        .from('orders')
        .select(`
          *,
          buyer:profiles!orders_buyer_id_fkey(full_name),
          order_items(product_name)
        `)
        .order('created_at', { ascending: false });

      if (oError) throw oError;

      // Calculate Stats
      const totalFarmers = farmers?.length || 0;
      const activeProducts = products?.filter(p => p.is_active).length || 0;
      const totalOrders = orders?.length || 0;
      const marketplaceValue = orders?.reduce((acc, order) => acc + (Number(order.total) || 0), 0) || 0;

      setStats({
        totalFarmers,
        activeProducts,
        totalOrders,
        marketplaceValue,
      });

      setRecentFarmers((farmers || []).slice(0, 5));
      setRecentOrders((orders || []).slice(0, 5));

      // Calculate category distribution
      if (products) {
        const catCounts: Record<string, number> = {};
        products.forEach(p => {
          catCounts[p.category] = (catCounts[p.category] || 0) + 1;
        });
        const total = products.length;
        const mappedCatData = Object.entries(catCounts).map(([label, count]) => ({
          label,
          pct: total > 0 ? Math.round((count / total) * 100) : 0
        })).sort((a, b) => b.pct - a.pct).slice(0, 4);
        setCatData(mappedCatData);
      }

      // Calculate chart data (Last 6 months)
      const last6Months = Array.from({ length: 6 }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
          label: d.toLocaleDateString('en-GB', { month: 'short' }),
          key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
          count: 0
        };
      });

      if (orders) {
        orders.forEach(o => {
          const date = new Date(o.created_at);
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          const monthData = last6Months.find(m => m.key === key);
          if (monthData) {
            monthData.count++;
          }
        });
      }
      setChartData(last6Months);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin text-4xl">⏳</div>
        </div>
      </AdminLayout>
    );
  }

  const pendingFarmersCount = recentFarmers.filter(f => !f.is_verified).length;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Farmers" value={stats.totalFarmers.toString()} icon="👨‍🌾" color="green" />
        <StatCard label="Active Products" value={stats.activeProducts.toString()} icon="🌿" color="blue" />
        <StatCard label="Total Orders" value={stats.totalOrders.toString()} icon="📦" color="amber" />
        <StatCard label="Marketplace Value" value={`₹${stats.marketplaceValue.toLocaleString()}`} icon="₹" color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Orders chart */}
        <Card className="lg:col-span-2 p-5">
          <h3 className="font-bold text-gray-900 mb-4">Orders Over Time</h3>
          {chartData.length === 0 || chartData.every(d => d.count === 0) ? (
            <div className="flex items-center justify-center h-32 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400">No order data available for the last 6 months.</p>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-2 h-32 mt-6">
              {chartData.map((d) => {
                const maxCount = Math.max(...chartData.map(c => c.count), 1);
                const heightPct = (d.count / maxCount) * 100;
                return (
                  <div key={d.key} className="flex-1 flex flex-col items-center gap-2 group relative h-full justify-end">
                    <div 
                      className="w-full max-w-[40px] rounded-t bg-[#66BB6A] group-hover:bg-[#2E7D32] transition-colors relative"
                      style={{ height: `${Math.max(heightPct, 2)}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 font-medium shadow-sm">
                        {d.count} {d.count === 1 ? 'order' : 'orders'}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">{d.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Categories */}
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 mb-4">Product Categories</h3>
          {catData.length === 0 ? (
            <p className="text-sm text-gray-500">No products found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {catData.map(c => (
                <div key={c.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600 font-medium">{c.label}</span>
                    <span className="text-gray-500">{c.pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full">
                    <div className="h-full bg-[#66BB6A] rounded-full" style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending verifications */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Farmers</h3>
            {pendingFarmersCount > 0 && (
               <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{pendingFarmersCount} pending</span>
            )}
          </div>
          {recentFarmers.length === 0 ? (
            <p className="text-sm text-gray-500">No farmers found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentFarmers.map(f => (
                <div key={f.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-sm">👨‍🌾</div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{f.full_name || 'Unknown Farmer'}</p>
                      <p className="text-xs text-gray-500">📍 {f.location || 'Unknown'} · {new Date(f.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</p>
                    </div>
                  </div>
                  <Badge variant={f.is_verified ? 'verified' : 'pending'}>
                    {f.is_verified ? 'Verified' : 'Pending'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Recent orders */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900">Recent Orders</h3>
            <button onClick={() => navigate('/admin/orders')} className="text-sm text-[#2E7D32] font-medium hover:underline">View All</button>
          </div>
          {recentOrders.length === 0 ? (
             <p className="text-sm text-gray-500">No orders found.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map(o => (
                <div key={o.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-900">#{o.id.split('-')[0]} · {o.order_items?.[0]?.product_name || 'Multiple items'}</p>
                    <p className="text-xs text-gray-500">{o.buyer?.full_name || 'Unknown Buyer'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">₹{Number(o.total).toLocaleString()}</p>
                    <Badge variant={o.status === 'delivered' ? 'delivered' : o.status === 'transit' ? 'transit' : 'preparing'}>
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </AdminLayout>
  );
}
