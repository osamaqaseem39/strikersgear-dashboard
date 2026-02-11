import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  Stack,
  FormControlLabel,
  Switch,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import ImageUpload from 'components/ImageUpload';
import { bannersApi } from 'api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  title: yup.string().required('Title is required'),
  image: yup.string().required('Hero banner image is required'),
});

export default function BannerFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      loadBanner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadBanner = async () => {
    try {
      setLoading(true);
      const banner = await bannersApi.getById(id);
      formik.setValues({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        image: banner.image || '',
        buttonText: banner.buttonText || '',
        buttonLink: banner.buttonLink || '',
        sortOrder: banner.sortOrder ?? '',
        isActive: banner.isActive !== false,
      });
    } catch (error) {
      console.error('Error loading banner:', error);
      alert('Error loading banner: ' + error.message);
      navigate('/banners');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      title: '',
      subtitle: '',
      image: '',
      buttonText: '',
      buttonLink: '',
      sortOrder: '',
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          image: values.image || undefined,
          buttonText: values.buttonText || undefined,
          buttonLink: values.buttonLink || undefined,
          sortOrder:
            values.sortOrder === '' || values.sortOrder === null
              ? undefined
              : Number(values.sortOrder),
        };
        if (isEdit) {
          await bannersApi.update(id, payload);
        } else {
          await bannersApi.create(payload);
        }
        navigate('/banners');
      } catch (error) {
        console.error('Error saving banner:', error);
        alert('Error saving banner: ' + error.message);
      }
    },
  });

  if (loading) {
    return (
      <MainCard title={isEdit ? 'Edit Hero Banner' : 'Add Hero Banner'}>
        <Typography>Loading...</Typography>
      </MainCard>
    );
  }

  return (
    <MainCard title={isEdit ? 'Edit Hero Banner' : 'Add Hero Banner'}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          onClick={() => navigate('/banners')}
        >
          Back to Banners
        </Button>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <Card variant="outlined" sx={{ overflow: 'visible' }}>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" color="text.primary">
                  Hero banner content
                </Typography>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formik.values.title}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.title && Boolean(formik.errors.title)}
                  helperText={formik.touched.title && formik.errors.title}
                  required
                />
                <TextField
                  fullWidth
                  label="Subtitle"
                  name="subtitle"
                  value={formik.values.subtitle}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText="Optional supporting text shown on the hero."
                />
                <TextField
                  fullWidth
                  label="Button text"
                  name="buttonText"
                  value={formik.values.buttonText}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText="Optional text for the hero call-to-action button."
                />
                <TextField
                  fullWidth
                  label="Button link URL"
                  name="buttonLink"
                  value={formik.values.buttonLink}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText="Optional. Where to send users when they click the hero banner button."
                />
                <TextField
                  fullWidth
                  type="number"
                  label="Position"
                  name="sortOrder"
                  value={formik.values.sortOrder}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText="Optional sort order for hero rotation (lower numbers show first)."
                />
                <FormControlLabel
                  control={
                    <Switch
                      name="isActive"
                      checked={formik.values.isActive}
                      onChange={formik.handleChange}
                      color="primary"
                    />
                  }
                  label="Active"
                />
              </Stack>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ overflow: 'visible' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6" color="text.primary">
                  Hero banner image
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload the main visual for this hero banner (homepage hero).
                </Typography>
                <ImageUpload
                  label="Hero banner image"
                  value={formik.values.image}
                  onChange={(url) => formik.setFieldValue('image', url)}
                />
                {formik.touched.image && formik.errors.image && (
                  <Typography variant="caption" color="error">
                    {formik.errors.image}
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/banners')}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </Box>
        </Stack>
      </form>
    </MainCard>
  );
}

