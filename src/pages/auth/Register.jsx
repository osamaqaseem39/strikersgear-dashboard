import { Navigate } from 'react-router-dom';

/**
 * Register is no longer a separate step. The app checks the database on /login:
 * if an admin exists, it shows password-only login; if not, it shows create-admin.
 * Redirect /register to /login so one URL handles both cases.
 */
export default function Register() {
  return <Navigate to="/login" replace />;
}
