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
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { stockApi, productsApi, sizesApi } from 'api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  product: yup.string().required('Product is required'),
  size: yup.string().required('Size is required'),
  stockQty: yup.number().min(0, 'Stock must be 0 or greater').required('Stock quantity is required'),
});

export default function StockFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    if (isEdit) {
      loadStock();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadData = async () => {
    try {
      const [productsData, sizesData] = await Promise.all([
        productsApi.getAll(),
        sizesApi.getAll(),
      ]);
      setProducts(productsData);
      setSizes(sizesData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const loadStock = async () => {
    try {
      setLoading(true);
      const stockItem = await stockApi.getById(id);
      formik.setValues({
        product: stockItem.product?._id || stockItem.product || '',
        size: stockItem.size?._id || stockItem.size || '',
        stockQty: stockItem.stockQty || 0,
      });
    } catch (error) {
      console.error('Error loading stock:', error);
      alert('Error loading stock: ' + error.message);
      navigate('/stock');
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      product: '',
      size: '',
      stockQty: 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          await stockApi.update(id, { stockQty: values.stockQty });
        } else {
          await stockApi.create(values);
        }
        navigate('/stock');
      } catch (error) {
        console.error('Error saving stock:', error);
        alert('Error saving stock: ' + error.message);
      }
    },
  });

  if (loading) {
    return (
      <MainCard title={isEdit ? 'Edit Stock' : 'Add Stock'}>
        <Typography>Loading...</Typography>
      </MainCard>
    );
  }

  return (
    <MainCard title={isEdit ? 'Edit Stock' : 'Add Stock'}>
      <Box sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/stock')}
        >
          Back to Stock
        </Button>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                select
                label="Product"
                name="product"
                value={formik.values.product}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.product && Boolean(formik.errors.product)}
                helperText={formik.touched.product && formik.errors.product}
                disabled={!!isEdit}
                required
              >
                {products.map((product) => (
                  <MenuItem key={product._id} value={product._id}>
                    {product.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                select
                label="Size"
                name="size"
                value={formik.values.size}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.size && Boolean(formik.errors.size)}
                helperText={formik.touched.size && formik.errors.size}
                disabled={!!isEdit}
                required
              >
                {sizes.map((size) => (
                  <MenuItem key={size._id} value={size._id}>
                    {size.label} ({size.sizeType?.name || ''})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Stock Quantity"
                name="stockQty"
                type="number"
                value={formik.values.stockQty}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.stockQty && Boolean(formik.errors.stockQty)}
                helperText={formik.touched.stockQty && formik.errors.stockQty}
                required
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/stock')}
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
