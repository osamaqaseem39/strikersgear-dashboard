import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/AuthLogin';
import Loader from 'components/Loader';
import { authApi } from 'api/api';

export default function Login() {
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
        if (!r.hasAdmin) navigate('/register', { replace: true });
      })
      .catch(() => {
        if (cancelled) return;
        navigate('/register', { replace: true });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [navigate]);

  if (loading || !hasAdmin) {
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
            <Typography variant="h3">Login</Typography>
          </Stack>
        </Grid>
        <Grid size={12}>
          <AuthLogin />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
