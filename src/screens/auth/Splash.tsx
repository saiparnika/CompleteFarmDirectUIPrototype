import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Splash() {
  const navigate = useNavigate();
  const { user, profile, loading, needsRoleSelection } = useAuth();
  
  useEffect(() => {
    const t = setTimeout(() => {
      if (!loading) {
        if (needsRoleSelection) {
          // Authenticated (e.g. Google OAuth) but hasn't chosen a role yet
          navigate('/role-select');
        } else if (user && profile) {
          if (profile.role === 'farmer') navigate('/farmer/dashboard');
          else if (profile.role === 'buyer' || profile.role === 'bulk_buyer') navigate('/buyer/home');
          else if (profile.role === 'admin') navigate('/admin/dashboard');
          else navigate('/login');
        } else {
          navigate('/login');
        }
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [navigate, user, profile, loading, needsRoleSelection]);

  return (
    <div className="min-h-screen bg-[#2E7D32] flex flex-col items-center justify-center gap-6">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center">
          <span className="text-6xl">🌾</span>
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white tracking-tight">FarmDirect</h1>
          <p className="text-green-200 text-lg mt-2 font-medium">From Farm to Buyer, Direct.</p>
        </div>
      </div>
      <div className="mt-8 flex gap-1.5">
        {[0,1,2].map(i => (
          <div key={i} className={`w-2 h-2 rounded-full bg-white/40 ${i === 0 ? 'bg-white' : ''}`} />
        ))}
      </div>
    </div>
  );
}
