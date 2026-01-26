import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add, Image as ImageIcon } from '@mui/icons-material';
import MainCard from '../../../components/MainCard';
import { productsApi, categoriesApi, brandsApi } from '../../../api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
  category: yup.string().required('Category is required'),
  price: yup.number().positive('Price must be positive').required('Price is required'),
});

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, brandsData] = await Promise.all([
        productsApi.getAll(),
        categoriesApi.getAll(),
        brandsApi.getAll(),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setBrands(brandsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      category: '',
      brand: '',
      price: '',
      images: [],
      isActive: true,
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        const data = {
          ...values,
          price: parseFloat(values.price),
          brand: values.brand || undefined,
        };
        if (editingProduct) {
          await productsApi.update(editingProduct._id, data);
        } else {
          await productsApi.create(data);
        }
        formik.resetForm();
        setOpen(false);
        setEditingProduct(null);
        loadData();
      } catch (error) {
        console.error('Error saving product:', error);
        alert('Error saving product: ' + error.message);
      }
    },
  });

  const handleEdit = (product) => {
    setEditingProduct(product);
    formik.setValues({
      name: product.name || '',
      description: product.description || '',
      category: product.category?._id || product.category || '',
      brand: product.brand?._id || product.brand || '',
      price: product.price || '',
      images: product.images || [],
      isActive: product.isActive !== false,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsApi.delete(id);
        loadData();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + error.message);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    formik.resetForm();
  };

  return (
    <MainCard title="Products">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Product
        </Button>
      </Box>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || 'N/A'}</TableCell>
                  <TableCell>{product.brand?.name || 'N/A'}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.isActive ? 'Active' : 'Inactive'}
                      color={product.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(product._id)}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              label="Name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formik.values.description}
              onChange={formik.handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              select
              label="Category"
              name="category"
              value={formik.values.category}
              onChange={formik.handleChange}
              error={formik.touched.category && Boolean(formik.errors.category)}
              helperText={formik.touched.category && formik.errors.category}
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              select
              label="Brand (Optional)"
              name="brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
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
              margin="normal"
              label="Price"
              name="price"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
            <TextField
              fullWidth
              margin="normal"
              select
              label="Status"
              name="isActive"
              value={formik.values.isActive}
              onChange={formik.handleChange}
            >
              <MenuItem value={true}>Active</MenuItem>
              <MenuItem value={false}>Inactive</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingProduct ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainCard>
  );
}
