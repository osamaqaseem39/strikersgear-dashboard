import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import AuthLayout from 'layout/Auth';
import GuestRoute from 'components/GuestRoute';
import ErrorPage from 'pages/ErrorPage';

// jwt auth
const LoginPage = Loadable(lazy(() => import('pages/auth/Login')));
const RegisterPage = Loadable(lazy(() => import('pages/auth/Register')));

// ==============================|| AUTH ROUTING ||============================== //

const LoginRoutes = {
  element: (
    <GuestRoute>
      <AuthLayout />
    </GuestRoute>
  ),
  errorElement: <ErrorPage />,
  children: [
    {
      path: '/login',
      element: <LoginPage />
    },
    {
      path: '/register',
      element: <RegisterPage />
    }
  ]
};

export default LoginRoutes;
