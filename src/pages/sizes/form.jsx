import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { sizesApi } from 'api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
});

const sizeValidationSchema = yup.object({
  sizeType: yup.string().required('Size Type is required'),
  label: yup.string().required('Label is required'),
});

export default function SizeFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isEdit = !!id;
  const isSizeType = searchParams.get('type') === 'size-type';
  const [sizeTypes, setSizeTypes] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    loadData();
    if (isEdit) {
      loadItem();
    }
  }, [id]);

  const loadData = async () => {
    try {
      if (!isSizeType) {
        const sizeTypesData = await sizesApi.getSizeTypes();
        setSizeTypes(sizeTypesData);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadItem = async () => {
    try {
      setLoading(true);
      if (isSizeType) {
        // Size types might not have a getById, so we'll handle it differently
        alert('Size type editing not fully implemented');
        navigate('/sizes');
      } else {
        const size = await sizesApi.getById(id);
        formik.setValues({
          sizeType: size.sizeType?._id || size.sizeType || '',
          label: size.label || '',
          sortOrder: size.sortOrder || 0,
        });
      }
    } catch (error) {
      console.error('Error loading item:', error);
      alert('Error loading item: ' + error.message);
      navigate('/sizes');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      sizeType: '',
      label: '',
      sortOrder: 0,
    },
    validationSchema: isSizeType ? validationSchema : sizeValidationSchema,
    onSubmit: async (values) => {
      try {
        if (isSizeType) {
          // For size types, only send 'name'
          const sizeTypeData = { name: values.name };
          if (isEdit) {
            // Update size type if API supports it
            await sizesApi.createSizeType(sizeTypeData);
          } else {
            await sizesApi.createSizeType(sizeTypeData);
          }
        } else {
          // For sizes, only send sizeType, label, and sortOrder
          const sizeData = {
            sizeType: values.sizeType,
            label: values.label,
            sortOrder: values.sortOrder || 0,
          };
          if (isEdit) {
            await sizesApi.update(id, sizeData);
          } else {
            await sizesApi.create(sizeData);
          }
        }
        navigate('/sizes');
      } catch (error) {
        console.error('Error saving:', error);
        alert('Error saving: ' + error.message);
      }
    },
  });

  if (loading) {
    return (
      <MainCard title={isEdit ? `Edit ${isSizeType ? 'Size Type' : 'Size'}` : `Add ${isSizeType ? 'Size Type' : 'Size'}`}>
        <Typography>Loading...</Typography>
      </MainCard>
    );
  }

  return (
    <MainCard title={isEdit ? `Edit ${isSizeType ? 'Size Type' : 'Size'}` : `Add ${isSizeType ? 'Size Type' : 'Size'}`}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/sizes')}
        >
          Back to Sizes
        </Button>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              {isSizeType ? (
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                  helperText={formik.touched.name && formik.errors.name}
                  placeholder="UK, EU, Alpha, Free"
                  required
                />
              ) : (
                <>
                  <TextField
                    fullWidth
                    select
                    label="Size Type"
                    name="sizeType"
                    value={formik.values.sizeType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.sizeType && Boolean(formik.errors.sizeType)}
                    helperText={formik.touched.sizeType && formik.errors.sizeType}
                    required
                  >
                    {sizeTypes.map((st) => (
                      <MenuItem key={st._id} value={st._id}>
                        {st.name}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    fullWidth
                    label="Label"
                    name="label"
                    value={formik.values.label}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.label && Boolean(formik.errors.label)}
                    helperText={formik.touched.label && formik.errors.label}
                    placeholder="7, 42, S, M, L, Free"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Sort Order"
                    name="sortOrder"
                    type="number"
                    value={formik.values.sortOrder}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </>
              )}
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/sizes')}
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
