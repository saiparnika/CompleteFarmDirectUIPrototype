import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Btn, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, user, profile, needsRoleSelection } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle OAuth error params that Supabase returns in the URL hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const oauthError = params.get('error_description') || params.get('error');
      if (oauthError) {
        setError(decodeURIComponent(oauthError.replace(/\+/g, ' ')));
        // Clean up URL hash
        window.history.replaceState(null, '', window.location.pathname);
      }
    }
  }, []);

  // If Google user needs to pick a role, send to role-select
  if (needsRoleSelection) {
    return <Navigate to="/role-select" replace />;
  }

  // If already logged in with a valid role, redirect based on role
  if (user && profile) {
    if (profile.role === 'farmer') return <Navigate to="/farmer/dashboard" replace />;
    if (profile.role === 'buyer' || profile.role === 'bulk_buyer') return <Navigate to="/buyer/home" replace />;
    if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const { data, error: signInError } = await signIn(email, password);
    
    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    // Explicitly fetch profile and navigate after successful sign-in
    if (data?.user) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) {
          setError('Unable to determine account role. Please contact support.');
          setLoading(false);
          return;
        }

        if (!profileData || !profileData.role) {
          setError('Unable to determine account role.');
          setLoading(false);
          return;
        }

        let targetPath = '/login';
        if (profileData.role === 'farmer') {
          targetPath = '/farmer/dashboard';
        } else if (profileData.role === 'buyer' || profileData.role === 'bulk_buyer') {
          targetPath = '/buyer/home';
        } else if (profileData.role === 'admin') {
          targetPath = '/admin/dashboard';
        } else {
          setError('Unable to determine account role.');
          setLoading(false);
          return;
        }

        navigate(targetPath, { replace: true });
      } catch (err: any) {
        setError('Failed to load profile. Please try again.');
        setLoading(false);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    
    const { error: googleError } = await signInWithGoogle();
    
    if (googleError) {
      setError(googleError.message || 'Google sign-in failed. Please try again.');
      setGoogleLoading(false);
    }
    // On success, Supabase redirects to Google, so no need to handle navigation here.
    // The page will reload and onAuthStateChange will pick up the new session.
  };

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
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
            <Input label="Mobile Number / Email" placeholder="Enter your email or mobile" value={email} onChange={setEmail} />
            <Input label="Password" placeholder="Enter your password" type="password" value={password} onChange={setPassword} />
            <Btn full onClick={handleLogin} size="lg" disabled={loading || googleLoading}>
              {loading ? 'Logging in...' : 'Login'}
            </Btn>
            <Btn full variant="outline" onClick={() => navigate('/role-select')} size="lg" disabled={loading || googleLoading}>Create Account</Btn>

            {/* Divider */}
            <div className="flex items-center gap-3 my-1">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium uppercase">or</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Google OAuth button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {googleLoading ? 'Redirecting to Google...' : 'Continue with Google'}
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
