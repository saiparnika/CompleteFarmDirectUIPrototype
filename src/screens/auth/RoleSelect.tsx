import { useNavigate } from 'react-router-dom';

const roles = [
  {
    icon: '🌾',
    title: 'Farmer',
    desc: 'Sell your produce directly to buyers and get fair prices.',
    path: '/farmer/dashboard',
    color: 'from-green-50 to-green-100',
    border: 'border-green-200',
    btn: 'bg-[#2E7D32] text-white',
  },
  {
    icon: '🛒',
    title: 'Buyer',
    desc: 'Buy fresh produce directly from verified local farmers.',
    path: '/buyer/home',
    color: 'from-blue-50 to-blue-100',
    border: 'border-blue-200',
    btn: 'bg-blue-600 text-white',
  },
  {
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
  return (
    <div className="min-h-screen bg-[#F7F8F2] flex flex-col items-center justify-center p-6">
      <div className="flex items-center gap-2 mb-10">
        <span className="text-3xl">🌾</span>
        <span className="text-2xl font-bold text-[#2E7D32]">FarmDirect</span>
      </div>
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">How do you want to use FarmDirect?</h1>
        <p className="text-gray-500">Choose your role to get started with the right experience.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        {roles.map(role => (
          <button key={role.title} onClick={() => navigate(role.path)}
            className={`flex flex-col items-center text-center p-8 rounded-2xl border-2 bg-gradient-to-b ${role.color} ${role.border} hover:shadow-md transition-all group`}>
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-5 text-4xl group-hover:scale-110 transition-transform">
              {role.icon}
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">{role.title}</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">{role.desc}</p>
            <span className={`px-6 py-2.5 rounded-xl text-sm font-semibold ${role.btn} hover:opacity-90 transition`}>
              Get Started
            </span>
          </button>
        ))}
      </div>
      <button onClick={() => navigate('/admin/dashboard')}
        className="mt-8 text-xs text-gray-400 hover:text-gray-600 underline">
        Admin access
      </button>
    </div>
  );
}
