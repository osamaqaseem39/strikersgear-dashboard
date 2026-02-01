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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import ImageUpload from 'components/ImageUpload';
import { categoriesApi } from 'api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
});

export default function CategoryFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(isEdit);
  const [parentOptions, setParentOptions] = useState([]);

  useEffect(() => {
    loadParentOptions();
    if (isEdit) {
      loadCategory();
    }
  }, [id]);

  const loadParentOptions = async () => {
    try {
      const data = await categoriesApi.getAll();
      setParentOptions(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadCategory = async () => {
    try {
      setLoading(true);
      const category = await categoriesApi.getById(id);
      formik.setValues({
        name: category.name || '',
        slug: category.slug || '',
        parent: category.parent?._id || category.parent || '',
        image: category.image || '',
        isActive: category.isActive !== false,
      });
    } catch (error) {
      console.error('Error loading category:', error);
      alert('Error loading category: ' + error.message);
      navigate('/categories');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      slug: '',
      parent: '',
      image: '',
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          parent: values.parent || null,
          image: values.image || undefined,
        };
        if (isEdit) {
          await categoriesApi.update(id, payload);
        } else {
          await categoriesApi.create(payload);
        }
        navigate('/categories');
      } catch (error) {
        console.error('Error saving category:', error);
        alert('Error saving category: ' + error.message);
      }
    },
  });

  // Exclude current category from parent options to avoid self-reference
  const parentChoices = parentOptions.filter((c) => c._id !== id);

  if (loading) {
    return (
      <MainCard title={isEdit ? 'Edit Category' : 'Add Category'}>
        <Typography>Loading...</Typography>
      </MainCard>
    );
  }

  return (
    <MainCard title={isEdit ? 'Edit Category' : 'Add Category'}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          variant="outlined"
          onClick={() => navigate('/categories')}
        >
          Back to Categories
        </Button>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <Card variant="outlined" sx={{ overflow: 'visible' }}>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6" color="text.primary">
                  Category details
                </Typography>
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
                <TextField
                  fullWidth
                  label="Slug (optional)"
                  name="slug"
                  value={formik.values.slug}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText="Leave empty to auto-generate from name."
                />
                <TextField
                  fullWidth
                  select
                  label="Parent category"
                  name="parent"
                  value={formik.values.parent}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText="Leave as None for a top-level category."
                >
                  <MenuItem value="">None (top-level)</MenuItem>
                  {parentChoices.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.parent?.name ? `${cat.parent.name} › ` : ''}
                      {cat.name}
                    </MenuItem>
                  ))}
                </TextField>
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
                  Category image
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Optional thumbnail or hero image for this category.
                </Typography>
                <ImageUpload
                  label="Category image"
                  value={formik.values.image}
                  onChange={(url) => formik.setFieldValue('image', url)}
                />
              </Stack>
            </CardContent>
          </Card>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={() => navigate('/categories')}>
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
