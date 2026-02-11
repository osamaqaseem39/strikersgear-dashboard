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
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import ImageUpload from 'components/ImageUpload';
import ImageGalleryUpload from 'components/ImageGalleryUpload';
import { productsApi, categoriesApi, brandsApi, sizesApi } from 'api/api';
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
  const [sizes, setSizes] = useState([]);
  const [tab, setTab] = useState(0);

  useEffect(() => {
    loadData();
    if (isEdit) {
      loadProduct();
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [categoriesData, brandsData, sizesData] = await Promise.all([
        categoriesApi.getAll(),
        brandsApi.getAll(),
        sizesApi.getAll(),
      ]);
      setCategories(categoriesData);
      setBrands(brandsData);
      setSizes(sizesData || []);
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
        slug: product.slug || '',
        shortDescription: product.shortDescription || '',
        description: product.description || '',
        sizeInfo: product.sizeInfo || '',
        sizeChartImageUrl: product.sizeChartImageUrl || '',
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
        originalPrice:
          typeof product.originalPrice === 'number'
            ? String(product.originalPrice)
            : '',
        salePrice:
          typeof product.salePrice === 'number'
            ? String(product.salePrice)
            : '',
        isSale: product.isSale || false,
        isNew: product.isNew || false,
        rating:
          typeof product.rating === 'number' ? String(product.rating) : '',
        reviews:
          typeof product.reviews === 'number' ? String(product.reviews) : '',
        availableSizes: Array.isArray(product.availableSizes)
        ? product.availableSizes
        : [],
        colors: Array.isArray(product.colors)
          ? product.colors.join(', ')
          : '',
        bodyType: Array.isArray(product.bodyType)
          ? product.bodyType.join(', ')
          : '',
        tags: Array.isArray(product.tags) ? product.tags.join(', ') : '',
        status: product.status || 'published',
        inStock: product.inStock !== false,
        stockQuantity:
          typeof product.stockQuantity === 'number'
            ? String(product.stockQuantity)
            : '',
        stockCount:
          typeof product.stockCount === 'number'
            ? String(product.stockCount)
            : '',
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
      slug: '',
      shortDescription: '',
      description: '',
      sizeInfo: '',
      sizeChartImageUrl: '',
      discountPercentage: '',
      attributes: [],
      featuresText: '',
      category: '',
      brand: '',
      price: '',
      originalPrice: '',
      salePrice: '',
      isSale: false,
      isNew: false,
      rating: '',
      reviews: '',
      availableSizes: [],
      colors: '',
      bodyType: '',
      tags: '',
      status: 'published',
      inStock: true,
      stockQuantity: '',
      stockCount: '',
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
          slug: rest.slug || undefined,
          price: parseFloat(rest.price),
          originalPrice:
            rest.originalPrice !== '' ? parseFloat(rest.originalPrice) : undefined,
          salePrice:
            rest.salePrice !== '' ? parseFloat(rest.salePrice) : undefined,
          rating: rest.rating !== '' ? parseFloat(rest.rating) : undefined,
          reviews:
            rest.reviews !== '' ? parseInt(rest.reviews, 10) : undefined,
          discountPercentage:
            rest.discountPercentage !== ''
              ? parseFloat(rest.discountPercentage)
              : undefined,
          brand: rest.brand || undefined,
          featuredImage: rest.featuredImage || undefined,
          gallery: rest.gallery?.length ? rest.gallery : undefined,
          sizeInfo: rest.sizeInfo || undefined,
          sizeChartImageUrl: rest.sizeChartImageUrl || undefined,
          availableSizes:
            Array.isArray(rest.availableSizes) && rest.availableSizes.length
              ? rest.availableSizes
              : undefined,
          colors: rest.colors
            ? rest.colors
                .split(',')
                .map((c) => c.trim())
                .filter(Boolean)
            : undefined,
          bodyType: rest.bodyType
            ? rest.bodyType
                .split(',')
                .map((b) => b.trim())
                .filter(Boolean)
            : undefined,
          tags: rest.tags
            ? rest.tags
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            : undefined,
          inStock: rest.inStock,
          stockQuantity:
            rest.stockQuantity !== ''
              ? parseInt(rest.stockQuantity, 10)
              : undefined,
          stockCount:
            rest.stockCount !== ''
              ? parseInt(rest.stockCount, 10)
              : undefined,
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

      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Basics" />
        <Tab label="Images" />
        <Tab label="Pricing & status" />
        <Tab label="Inventory & badges" />
        <Tab label="Sizes & tags" />
      </Tabs>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={3}>
          <Card sx={{ display: tab === 0 ? 'block' : 'none' }}>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6">Product details</Typography>
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
                  helperText="Leave empty to auto-generate from name or keep URL internal."
                />
                <TextField
                  fullWidth
                  label="Short description"
                  name="shortDescription"
                  placeholder="Brief summary (e.g. for listings, meta)"
                  value={formik.values.shortDescription}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
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
                <TextField
                  fullWidth
                  label="Size info / fit notes"
                  name="sizeInfo"
                  placeholder="e.g. Regular fit, model is 180cm wearing size M"
                  value={formik.values.sizeInfo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    Size chart image
                  </Typography>
                  <ImageUpload
                    label="Size chart"
                    value={formik.values.sizeChartImageUrl}
                    onChange={(url) =>
                      formik.setFieldValue('sizeChartImageUrl', url)
                    }
                  />
                </Box>
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
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ display: tab === 0 ? 'block' : 'none' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Attributes</Typography>
                <Typography variant="body2" color="text.secondary">
                  Add extra info like color, material, collection, etc.
                </Typography>
                <Stack spacing={2}>
                  {(formik.values.attributes || []).map((attr, index) => (
                    <Box key={index} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                      <Stack spacing={2}>
                        <TextField
                          fullWidth
                          label="Attribute name"
                          placeholder="Color"
                          value={attr.name || ''}
                          onChange={(e) =>
                            formik.setFieldValue(
                              `attributes[${index}].name`,
                              e.target.value,
                            )
                          }
                        />
                        <TextField
                          fullWidth
                          label="Attribute value"
                          placeholder="Black"
                          value={attr.value || ''}
                          onChange={(e) =>
                            formik.setFieldValue(
                              `attributes[${index}].value`,
                              e.target.value,
                            )
                          }
                        />
                        <Box>
                          <Button
                            color="error"
                            variant="outlined"
                            onClick={() => {
                              const next = [...(formik.values.attributes || [])];
                              next.splice(index, 1);
                              formik.setFieldValue('attributes', next);
                            }}
                          >
                            Remove attribute
                          </Button>
                        </Box>
                      </Stack>
                    </Box>
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

          <Card sx={{ display: tab === 1 ? 'block' : 'none' }}>
            <CardContent>
              <Stack spacing={3}>
                <Typography variant="h6">Images</Typography>
                <ImageUpload
                  label="Featured image"
                  value={formik.values.featuredImage}
                  onChange={(url) => formik.setFieldValue('featuredImage', url)}
                />
                <ImageGalleryUpload
                  label="Product gallery"
                  value={formik.values.gallery}
                  onChange={(urls) => formik.setFieldValue('gallery', urls)}
                  max={10}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ display: tab === 2 ? 'block' : 'none' }}>
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
                  label="Original price (optional)"
                  name="originalPrice"
                  type="number"
                  value={formik.values.originalPrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText="If set higher than price, shows as crossed-out compare-at price."
                />
                <TextField
                  fullWidth
                  label="Sale price (optional)"
                  name="salePrice"
                  type="number"
                  value={formik.values.salePrice}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText="Optional explicit sale price."
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
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  helperText="Draft products are hidden from the storefront."
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  select
                  label="Active"
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

          <Card sx={{ display: tab === 3 ? 'block' : 'none' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Badges, ratings & inventory</Typography>
                <TextField
                  fullWidth
                  select
                  label="Mark as new"
                  name="isNew"
                  value={formik.values.isNew}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  select
                  label="Mark as on sale"
                  name="isSale"
                  value={formik.values.isSale}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </TextField>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Rating (0–5)"
                      name="rating"
                      type="number"
                      inputProps={{ min: 0, max: 5, step: 0.1 }}
                      value={formik.values.rating}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled
                      helperText="Read-only; calculated from customer reviews on the storefront."
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Reviews count"
                      name="reviews"
                      type="number"
                      inputProps={{ min: 0, step: 1 }}
                      value={formik.values.reviews}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      disabled
                      helperText="Read-only; number of customer reviews."
                    />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="In stock"
                      name="inStock"
                      value={formik.values.inStock}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    >
                      <MenuItem value={true}>Yes</MenuItem>
                      <MenuItem value={false}>No</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Stock quantity (optional)"
                      name="stockQuantity"
                      type="number"
                      inputProps={{ min: 0, step: 1 }}
                      value={formik.values.stockQuantity}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </Grid>
                </Grid>
                <TextField
                  fullWidth
                  label="Stock count override (optional)"
                  name="stockCount"
                  type="number"
                  inputProps={{ min: 0, step: 1 }}
                  value={formik.values.stockCount}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Stack>
            </CardContent>
          </Card>

          <Card sx={{ display: tab === 4 ? 'block' : 'none' }}>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">Variants & tags</Typography>
                <FormControl fullWidth>
                  <InputLabel id="available-sizes-label">Available sizes</InputLabel>
                  <Select
                    labelId="available-sizes-label"
                    multiple
                    value={formik.values.availableSizes}
                    onChange={(event) =>
                      formik.setFieldValue('availableSizes', event.target.value)
                    }
                    label="Available sizes"
                    renderValue={(selected) => (selected || []).join(', ')}
                  >
                    {sizes.map((size) => (
                      <MenuItem key={size._id} value={size.name}>
                        <Checkbox
                          checked={
                            (formik.values.availableSizes || []).indexOf(size.name) > -1
                          }
                        />
                        <ListItemText primary={size.name} />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Colors (comma separated)"
                  name="colors"
                  placeholder="Black, White, Navy"
                  value={formik.values.colors}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <TextField
                  fullWidth
                  label="Body type tags (comma separated)"
                  name="bodyType"
                  placeholder="Petite, Tall, Plus"
                  value={formik.values.bodyType}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <TextField
                  fullWidth
                  label="Search tags (comma separated)"
                  name="tags"
                  placeholder="summer, casual, office"
                  value={formik.values.tags}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
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
      </form>
    </MainCard>
  );
}
