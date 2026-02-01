import { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/AuthLogin';
import AuthAdminRegister from 'sections/auth/AuthAdminRegister';
import Loader from 'components/Loader';
import { authApi } from 'api/api';

/**
 * Single auth entry: checks DB for existing admin.
 * - If admin exists → show password-only login.
 * - If no admin → show one-time create-admin (register) form.
 * No separate register route; DB decides which form to show every session.
 */
export default function Login() {
  const [loading, setLoading] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authApi
      .getStatus()
      .then((r) => {
        if (cancelled) return;
        setHasAdmin(!!r.hasAdmin);
      })
      .catch(() => {
        if (cancelled) return;
        setHasAdmin(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <AuthWrapper>
        <Grid container spacing={3} justifyContent="center">
          <Grid size={12}>
            <Loader />
          </Grid>
        </Grid>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">
              {hasAdmin ? 'Login' : 'Create admin'}
            </Typography>
          </Stack>
          {!hasAdmin && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              One-time setup. Choose a password for the dashboard.
            </Typography>
          )}
        </Grid>
        <Grid size={12}>
          {hasAdmin ? <AuthLogin /> : <AuthAdminRegister />}
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
