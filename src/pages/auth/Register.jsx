import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthAdminRegister from 'sections/auth/AuthAdminRegister';
import Loader from 'components/Loader';
import { authApi } from 'api/api';

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    authApi
      .getStatus()
      .then((r) => {
        if (cancelled) return;
        setHasAdmin(!!r.hasAdmin);
        if (r.hasAdmin) navigate('/login', { replace: true });
      })
      .catch(() => {
        if (cancelled) return;
        setHasAdmin(false);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [navigate]);

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

  if (hasAdmin) {
    return null;
  }

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={12}>
          <Stack direction="row" sx={{ alignItems: 'baseline', justifyContent: 'space-between', mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Create admin</Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            One-time setup. Choose a password for the dashboard.
          </Typography>
        </Grid>
        <Grid size={12}>
          <AuthAdminRegister />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
