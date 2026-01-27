import { Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

/**
 * Use for /login, /register. If user is authenticated, redirect to dashboard.
 */
export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('admin_token');

  if (isAuthenticated || token) {
    return <Navigate to="/dashboard/default" replace />;
  }

  return children;
}
