import React from 'react';

export function Badge({ variant = 'default', children }: { variant?: string; children: React.ReactNode }) {
  const styles: Record<string, string> = {
    verified: 'badge-verified',
    pending: 'badge-pending',
    preparing: 'badge-preparing',
    transit: 'badge-transit',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
    low: 'badge-low',
    sold: 'badge-sold',
    default: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-800',
    grade: 'bg-blue-50 text-blue-700',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant] || styles.default}`}>
      {children}
    </span>
  );
}

export function Btn({
  children, onClick, variant = 'primary', full = false, size = 'md', disabled = false, type = 'button'
}: {
  children: React.ReactNode; onClick?: () => void; variant?: string;
  full?: boolean; size?: string; disabled?: boolean; type?: 'button' | 'submit';
}) {
  const base = `inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 ${full ? 'w-full' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`;
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variants: Record<string, string> = {
    primary: 'bg-[#2E7D32] text-white hover:bg-[#256427] active:scale-[0.98]',
    secondary: 'bg-[#66BB6A] text-white hover:bg-[#57a65b] active:scale-[0.98]',
    outline: 'border-2 border-[#2E7D32] text-[#2E7D32] bg-white hover:bg-green-50 active:scale-[0.98]',
    danger: 'bg-[#DC2626] text-white hover:bg-red-700 active:scale-[0.98]',
    ghost: 'text-[#2E7D32] hover:bg-green-50 active:scale-[0.98]',
    white: 'bg-white text-[#2E7D32] border border-gray-200 hover:bg-gray-50 active:scale-[0.98]',
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${sizes[size] || sizes.md} ${variants[variant] || variants.primary}`}>
      {children}
    </button>
  );
}

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

export function StatCard({ label, value, icon, color = 'green' }: {
  label: string; value: string; icon: string; color?: string;
}) {
  const colors: Record<string, string> = {
    green: 'bg-green-50 text-green-700',
    amber: 'bg-amber-50 text-amber-700',
    blue: 'bg-blue-50 text-blue-700',
    purple: 'bg-purple-50 text-purple-700',
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color]}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}

export function Input({ label, placeholder, value, onChange, type = 'text' }: {
  label?: string; placeholder?: string; value?: string;
  onChange?: (v: string) => void; type?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange?.(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] transition"
      />
    </div>
  );
}

export function Select({ label, options, value, onChange }: {
  label?: string; options: string[]; value?: string; onChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select value={value} onChange={e => onChange?.(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2E7D32]/30 focus:border-[#2E7D32] transition">
        {options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
      <span>✓</span> Verified
    </span>
  );
}

export function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-500">
      ⭐ {rating}
    </span>
  );
}

export function StatusTimeline({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={step} className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
              ${i < current ? 'bg-[#2E7D32] border-[#2E7D32] text-white'
                : i === current ? 'bg-white border-[#2E7D32] text-[#2E7D32]'
                : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
              {i < current ? '✓' : i === current ? '●' : '○'}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 h-8 ${i < current ? 'bg-[#2E7D32]' : 'bg-gray-200'}`} />
            )}
          </div>
          <div className="pt-1.5 pb-6">
            <p className={`text-sm font-semibold ${i <= current ? 'text-gray-900' : 'text-gray-400'}`}>{step}</p>
            {i === current && <p className="text-xs text-[#2E7D32] mt-0.5">Current status</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
