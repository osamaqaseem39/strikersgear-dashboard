import { Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import Loader from 'components/Loader';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('admin_token');

  // Show loader while checking authentication
  if (token === null && !isAuthenticated) {
    // No token found, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render children
  if (isAuthenticated || token) {
    return children;
  }

  // Default: show loader (shouldn't reach here, but just in case)
  return <Loader />;
}
