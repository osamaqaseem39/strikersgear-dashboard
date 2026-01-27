import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Card,
  CardContent,
  Stack,
  Grid,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { brandsApi } from 'api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
});

export default function BrandFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadBrand();
    }
  }, [id]);

  const loadBrand = async () => {
    try {
      setLoading(true);
      const brand = await brandsApi.getById(id);
      formik.setValues({
        name: brand.name || '',
        slug: brand.slug || '',
        isActive: brand.isActive !== false,
      });
    } catch (error) {
      console.error('Error loading brand:', error);
      alert('Error loading brand: ' + error.message);
      navigate('/brands');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await brandsApi.update(id, values);
        } else {
          await brandsApi.create(values);
        }
        navigate('/brands');
      } catch (error) {
        console.error('Error saving brand:', error);
        alert('Error saving brand: ' + error.message);
      }
    },
  });

  if (loading) {
    return (
      <MainCard title={isEdit ? 'Edit Brand' : 'Add Brand'}>
        <Typography>Loading...</Typography>
      </MainCard>
    );
  }

  return (
    <MainCard title={isEdit ? 'Edit Brand' : 'Add Brand'}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/brands')}
        >
          Back to Brands
        </Button>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Slug (Optional)"
                    name="slug"
                    value={formik.values.slug}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    helperText="Leave empty to auto-generate from name."
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Status"
                    name="isActive"
                    value={formik.values.isActive}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  >
                    <MenuItem value={true}>Active</MenuItem>
                    <MenuItem value={false}>Inactive</MenuItem>
                  </TextField>
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/brands')}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  {isEdit ? 'Update' : 'Create'}
                </Button>
              </Box>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </MainCard>
  );
}
