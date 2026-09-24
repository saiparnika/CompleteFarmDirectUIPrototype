import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const farmerNav = [
  { path: '/farmer/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/farmer/products', icon: '🌿', label: 'Products' },
  { path: '/farmer/orders', icon: '📦', label: 'Orders' },
  { path: '/farmer/insights', icon: '📊', label: 'Insights' },
  { path: '/farmer/profile', icon: '👤', label: 'Profile' },
];

const buyerNav = [
  { path: '/buyer/home', icon: '🏠', label: 'Home' },
  { path: '/buyer/marketplace', icon: '🛒', label: 'Marketplace' },
  { path: '/buyer/orders', icon: '📦', label: 'Orders' },
  { path: '/buyer/favorites', icon: '❤️', label: 'Favorites' },
  { path: '/buyer/profile', icon: '👤', label: 'Profile' },
];

const adminNav = [
  { path: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
  { path: '/admin/farmers', icon: '🌾', label: 'Farmers' },
  { path: '/admin/products', icon: '🌿', label: 'Products' },
  { path: '/admin/orders', icon: '📦', label: 'Orders' },
  { path: '/admin/analytics', icon: '📈', label: 'Analytics' },
];

function NavBar({ items, role }: { items: typeof farmerNav; role: string }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { getCartItemCount } = useCart();
  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
        <button onClick={() => navigate('/')} className="flex items-center gap-2">
          <span className="text-2xl">🌾</span>
          <span className="font-bold text-[#2E7D32] text-lg">FarmDirect</span>
        </button>
        <div className="hidden md:flex items-center gap-1">
          {items.map(item => (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
                ${location.pathname.startsWith(item.path)
                  ? 'bg-green-50 text-[#2E7D32]'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {role === 'buyer' && (
            <button onClick={() => navigate('/buyer/bulk')}
              className="hidden md:flex items-center gap-1.5 bg-[#2E7D32] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#256427] transition">
              <span>📋</span> Post Bulk Req.
            </button>
          )}
          {role === 'buyer' && (
            <button onClick={() => navigate('/buyer/cart')}
              className="relative w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center hover:bg-gray-100 transition text-lg">
              🛒
              {getCartItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#2E7D32] text-white text-[10px] font-bold rounded-full flex items-center justify-center">{getCartItemCount()}</span>
              )}
            </button>
          )}
          <button onClick={async () => {
              try {
                await signOut();
                navigate('/login');
              } catch (e) {
                console.error(e);
              }
            }}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition">
            Sign out
          </button>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-gray-100 overflow-x-auto">
        {items.map(item => (
          <button key={item.path} onClick={() => navigate(item.path)}
            className={`flex-1 flex flex-col items-center py-2 gap-0.5 min-w-0 text-xs font-medium transition-all
              ${location.pathname.startsWith(item.path)
                ? 'text-[#2E7D32] border-t-2 border-[#2E7D32] -mt-px'
                : 'text-gray-500'}`}>
            <span className="text-base">{item.icon}</span>
            <span className="truncate">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export function FarmerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8F2]">
      <NavBar items={farmerNav} role="farmer" />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export function BuyerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8F2]">
      <NavBar items={buyerNav} role="buyer" />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F8F2]">
      <NavBar items={adminNav} role="admin" />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
