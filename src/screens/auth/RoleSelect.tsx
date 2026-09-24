import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Btn, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

const roles = [
  {
    id: 'farmer',
    icon: '🌾',
    title: 'Farmer',
    desc: 'Sell your produce directly to buyers and get fair prices.',
    path: '/farmer/dashboard',
    color: 'from-green-50 to-green-100',
    border: 'border-green-200',
    btn: 'bg-[#2E7D32] text-white',
  },
  {
    id: 'buyer',
    icon: '🛒',
    title: 'Buyer',
    desc: 'Buy fresh produce directly from verified local farmers.',
    path: '/buyer/home',
    color: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    btn: 'bg-blue-600 text-white',
  },
  {
    id: 'bulk_buyer',
    icon: '📦',
    title: 'Bulk Buyer',
    desc: 'Source large quantities of produce for your business.',
    path: '/buyer/bulk',
    color: 'from-amber-50 to-amber-100',
    border: 'border-amber-200',
    btn: 'bg-[#F59E0B] text-white',
  },
];

export default function RoleSelect() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !email || !password || !selectedRole) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    const { error: signUpError } = await signUp(email, password, fullName, selectedRole);

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
    } else {
      setSuccess(true);
      // Wait a moment before redirecting to login to allow user to read success message if email confirmation is required
      setTimeout(() => navigate('/login'), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F2] flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-10">
        <span className="text-3xl">🌾</span>
        <span className="text-2xl font-bold text-[#2E7D32]">FarmDirect</span>
      </div>
      
      {!selectedRole ? (
        <>
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">How do you want to use FarmDirect?</h1>
            <p className="text-gray-500">Choose your role to get started with the right experience.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
            {roles.map(role => (
              <button key={role.title} onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col items-center text-center p-8 rounded-2xl border-2 bg-gradient-to-b ${role.color} ${role.border} hover:shadow-md transition-all group`}>
                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-5 text-4xl group-hover:scale-110 transition-transform">
                  {role.icon}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h2>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">{role.desc}</p>
                <span className={`px-6 py-2.5 rounded-xl text-sm font-semibold ${role.btn} hover:opacity-90 transition`}>
                  Select Role
                </span>
              </button>
            ))}
          </div>
          <button onClick={() => navigate('/login')}
            className="mt-8 text-sm text-[#2E7D32] font-medium hover:underline py-2">
            Already have an account? Login
          </button>
        </>
      ) : (
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <button onClick={() => { setSelectedRole(null); setError(''); setSuccess(false); }} className="text-sm text-gray-500 hover:text-gray-700 mb-6 flex items-center gap-1">
            ← Back to Roles
          </button>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create {roles.find(r => r.id === selectedRole)?.title} Account</h2>
          <p className="text-gray-500 mb-6 text-sm">Join FarmDirect today to connect and trade.</p>

          {success ? (
            <div className="bg-green-50 border border-green-200 text-[#2E7D32] p-4 rounded-xl text-center">
              <span className="text-2xl mb-2 block">🎉</span>
              <p className="font-bold">Account created successfully!</p>
              <p className="text-sm mt-1">Redirecting to login...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {error && <div className="text-red-500 text-sm">{error}</div>}
              <Input label="Full Name" placeholder="Enter your full name" value={fullName} onChange={setFullName} />
              <Input label="Email" placeholder="Enter your email" type="email" value={email} onChange={setEmail} />
              <Input label="Password" placeholder="Create a password" type="password" value={password} onChange={setPassword} />
              
              <div className="mt-2">
                <Btn full onClick={handleSignup} size="lg" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Btn>
              </div>
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}
