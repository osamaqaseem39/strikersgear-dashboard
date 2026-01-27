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
  Divider,
  Grid,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import ImageUpload from 'components/ImageUpload';
import ImageGalleryUpload from 'components/ImageGalleryUpload';
import { productsApi, categoriesApi, brandsApi } from 'api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  category: yup.string().required('Category is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
});

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    loadData();
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [categoriesData, brandsData] = await Promise.all([
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const product = await productsApi.getById(id);
      formik.setValues({
        name: product.name || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        sizeInfo: product.sizeInfo || '',
        sizeChart: product.sizeChart || '',
        discountPercentage:
          typeof product.discountPercentage === 'number'
            ? String(product.discountPercentage)
            : '',
        attributes: product.attributes || [],
        featuresText: Array.isArray(product.features)
          ? product.features.join('\n')
          : '',
        category: product.category?._id || product.category || '',
        brand: product.brand?._id || product.brand || '',
        price: product.price || '',
        featuredImage: product.featuredImage || '',
        gallery: product.gallery || [],
        isActive: product.isActive !== false,
      });
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Error loading product: ' + error.message);
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      shortDescription: '',
      description: '',
      sizeInfo: '',
      sizeChart: '',
      discountPercentage: '',
      attributes: [],
      featuresText: '',
      category: '',
      brand: '',
      price: '',
      featuredImage: '',
      gallery: [],
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const { featuresText, ...rest } = values;
        const features = (featuresText || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean);

        const data = {
          ...rest,
          price: parseFloat(rest.price),
          discountPercentage:
            rest.discountPercentage !== ''
              ? parseFloat(rest.discountPercentage)
              : undefined,
          brand: rest.brand || undefined,
          featuredImage: rest.featuredImage || undefined,
          gallery: rest.gallery?.length ? rest.gallery : undefined,
          sizeInfo: rest.sizeInfo || undefined,
          sizeChart: rest.sizeChart || undefined,
          attributes:
            rest.attributes && rest.attributes.length
              ? rest.attributes.filter(
                  (attr) => attr.name?.trim() && attr.value?.trim(),
                )
              : undefined,
          features: features.length ? features : undefined,
        };
        if (isEdit) {
          await productsApi.update(id, data);
        } else {
          await productsApi.create(data);
        }
        navigate('/products');
      } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product: ' + error.message);
      }
    },
  });

  if (loading) {
    return (
      <MainCard title={isEdit ? 'Edit Product' : 'Add Product'}>
        <Typography>Loading...</Typography>
      </MainCard>
    );
  }

  return (
    <MainCard title={isEdit ? 'Edit Product' : 'Add Product'}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
        >
          Back to Products
        </Button>
      </Box>

      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Card>
              <CardContent>
                <Stack spacing={3}>
                  <Typography variant="h6">Product details</Typography>
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
                        label="Short description"
                        name="shortDescription"
                        placeholder="Brief summary (e.g. for listings, meta)"
                        value={formik.values.shortDescription}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Long description"
                        name="description"
                        multiline
                        rows={4}
                        placeholder="Full product description"
                        value={formik.values.description}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Size info / fit notes"
                        name="sizeInfo"
                        placeholder="e.g. Regular fit, model is 180cm wearing size M"
                        value={formik.values.sizeInfo}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Size chart image
                      </Typography>
                      <ImageUpload
                        label="Size chart"
                        value={formik.values.sizeChart}
                        onChange={(url) => formik.setFieldValue('sizeChart', url)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Features (one per line)"
                        name="featuresText"
                        multiline
                        rows={3}
                        placeholder={'Breathable fabric\nMoisture-wicking\nDurable stitching'}
                        value={formik.values.featuresText}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </Grid>
                  </Grid>
                </Stack>
              </CardContent>
            </Card>

            <Box sx={{ mt: 3 }}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">Attributes</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add extra info like color, material, collection, etc.
                    </Typography>
                    <Stack spacing={1}>
                      {(formik.values.attributes || []).map((attr, index) => (
                        <Grid container spacing={2} key={index}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Name"
                              placeholder="Color"
                              value={attr.name || ''}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `attributes[${index}].name`,
                                  e.target.value,
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <TextField
                              fullWidth
                              label="Value"
                              placeholder="Black"
                              value={attr.value || ''}
                              onChange={(e) =>
                                formik.setFieldValue(
                                  `attributes[${index}].value`,
                                  e.target.value,
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                              color="error"
                              fullWidth
                              onClick={() => {
                                const next = [...(formik.values.attributes || [])];
                                next.splice(index, 1);
                                formik.setFieldValue('attributes', next);
                              }}
                            >
                              Remove
                            </Button>
                          </Grid>
                        </Grid>
                      ))}
                      <Box>
                        <Button
                          variant="outlined"
                          onClick={() =>
                            formik.setFieldValue('attributes', [
                              ...(formik.values.attributes || []),
                              { name: '', value: '' },
                            ])
                          }
                        >
                          Add attribute
                        </Button>
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">Images</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <ImageUpload
                          label="Featured image"
                          value={formik.values.featuredImage}
                          onChange={(url) => formik.setFieldValue('featuredImage', url)}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <ImageGalleryUpload
                          label="Product gallery"
                          value={formik.values.gallery}
                          onChange={(urls) => formik.setFieldValue('gallery', urls)}
                          max={10}
                        />
                      </Grid>
                    </Grid>
                  </Stack>
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Typography variant="h6">Pricing & status</Typography>
                    <TextField
                      fullWidth
                      select
                      label="Category"
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.category && Boolean(formik.errors.category)}
                      helperText={formik.touched.category && formik.errors.category}
                      required
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      select
                      label="Brand (Optional)"
                      name="brand"
                      value={formik.values.brand}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value="">None</MenuItem>
                      {brands.map((brand) => (
                        <MenuItem key={brand._id} value={brand._id}>
                          {brand.name}
                        </MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      fullWidth
                      label="Price"
                      name="price"
                      type="number"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.price && Boolean(formik.errors.price)}
                      helperText={formik.touched.price && formik.errors.price}
                      required
                    />
                    <TextField
                      fullWidth
                      label="Discount (%)"
                      name="discountPercentage"
                      type="number"
                      inputProps={{ min: 0, max: 100, step: 1 }}
                      value={formik.values.discountPercentage}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      helperText="Optional. Leave empty for no discount."
                    />
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
                  </Stack>
                </CardContent>
              </Card>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/products')}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  {isEdit ? 'Update' : 'Create'}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </form>
    </MainCard>
  );
}
