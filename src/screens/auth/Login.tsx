import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Btn, Input } from '../../components/ui';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="min-h-screen bg-[#F7F8F2] flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#2E7D32] p-12">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌾</span>
          <span className="text-2xl font-bold text-white">FarmDirect</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Connecting farmers<br />with fresh opportunities.
          </h2>
          <p className="text-green-200 text-lg">
            Direct trade, transparent prices, verified farmers.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { icon: '🌱', label: '1,248 Verified Farmers' },
              { icon: '🛒', label: '8,540+ Orders Placed' },
              { icon: '₹', label: '₹24.5L Trade Value' },
              { icon: '⭐', label: '4.8 Avg. Rating' },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-2xl p-4">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-white text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-green-300 text-sm">© 2026 FarmDirect · From Farm to Buyer, Direct.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8 justify-center">
            <span className="text-3xl">🌾</span>
            <span className="text-2xl font-bold text-[#2E7D32]">FarmDirect</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back 👋</h1>
          <p className="text-gray-500 mb-8">Connect directly with farmers and fresh produce.</p>

          <div className="flex flex-col gap-4">
            <Input label="Mobile Number / Email" placeholder="Enter your email or mobile" value={email} onChange={setEmail} />
            <Input label="Password" placeholder="Enter your password" type="password" value={password} onChange={setPassword} />
            <Btn full onClick={() => navigate('/role-select')} size="lg">Login</Btn>
            <Btn full variant="outline" onClick={() => navigate('/role-select')} size="lg">Create Account</Btn>
            <button onClick={() => navigate('/role-select')}
              className="text-center text-sm text-[#2E7D32] font-medium hover:underline py-2">
              Continue as Demo User →
            </button>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            New to FarmDirect?{' '}
            <button onClick={() => navigate('/role-select')} className="text-[#2E7D32] font-medium hover:underline">
              Create an account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
