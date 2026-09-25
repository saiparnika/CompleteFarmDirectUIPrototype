import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, profile, loading, needsRoleSelection } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8F2] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="text-4xl animate-bounce">🌾</span>
          <p className="text-gray-500 font-medium">Loading FarmDirect...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (needsRoleSelection) {
    // Authenticated but hasn't chosen a role (e.g. new Google OAuth user)
    return <Navigate to="/role-select" replace />;
  }

  if (!profile) {
    // Shouldn't happen (handle_new_user always creates a profile), but fallback safely
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    // Redirect user to their respective dashboard based on their actual role
    if (profile.role === 'farmer') return <Navigate to="/farmer/dashboard" replace />;
    if (profile.role === 'buyer' || profile.role === 'bulk_buyer') return <Navigate to="/buyer/home" replace />;
    if (profile.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    
    // Fallback if role is not recognized
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
