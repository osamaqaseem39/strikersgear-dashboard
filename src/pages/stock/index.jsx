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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Chip,
  Typography,
} from '@mui/material';
import { Edit, Add } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { stockApi, productsApi, sizesApi } from 'api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  product: yup.string().required('Product is required'),
  size: yup.string().required('Size is required'),
  stockQty: yup.number().min(0, 'Stock must be 0 or greater').required('Stock quantity is required'),
});

export default function StockPage() {
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      loadStockForProduct(selectedProduct);
    } else {
      loadAllStock();
    }
  }, [selectedProduct]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, sizesData] = await Promise.all([
        productsApi.getAll(),
        sizesApi.getAll(),
      ]);
      setProducts(productsData);
      setSizes(sizesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAllStock = async () => {
    try {
      const stockData = await stockApi.getAll();
      setStock(stockData);
    } catch (error) {
      console.error('Error loading stock:', error);
    }
  };

  const loadStockForProduct = async (productId) => {
    try {
      const stockData = await stockApi.getAll(productId);
      setStock(stockData);
    } catch (error) {
      console.error('Error loading stock:', error);
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
        if (editingStock) {
          await stockApi.update(editingStock._id, { stockQty: values.stockQty });
        } else {
          await stockApi.create(values);
        }
        formik.resetForm();
        setOpen(false);
        setEditingStock(null);
        if (selectedProduct) {
          loadStockForProduct(selectedProduct);
        } else {
          loadAllStock();
        }
      } catch (error) {
        console.error('Error saving stock:', error);
        alert('Error saving stock: ' + error.message);
      }
    },
  });

  const handleEdit = (stockItem) => {
    setEditingStock(stockItem);
    formik.setValues({
      product: stockItem.product?._id || stockItem.product || '',
      size: stockItem.size?._id || stockItem.size || '',
      stockQty: stockItem.stockQty || 0,
    });
    setOpen(true);
  };

  const handleQuickUpdate = async (stockItem, newQty) => {
    try {
      await stockApi.updateStock(
        stockItem.product?._id || stockItem.product,
        stockItem.size?._id || stockItem.size,
        newQty
      );
      if (selectedProduct) {
        loadStockForProduct(selectedProduct);
      } else {
        loadAllStock();
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Error updating stock: ' + error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStock(null);
    formik.resetForm();
  };

  return (
    <MainCard title="Stock Management">
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          select
          label="Filter by Product"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">All Products</MenuItem>
          {products.map((product) => (
            <MenuItem key={product._id} value={product._id}>
              {product.name}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => setOpen(true)}
        >
          Add Stock
        </Button>
      </Box>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Stock Quantity</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : stock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No stock records found
                </TableCell>
              </TableRow>
            ) : (
              stock.map((stockItem) => (
                <TableRow key={stockItem._id}>
                  <TableCell>
                    {stockItem.product?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    {stockItem.size?.label || 'N/A'} ({stockItem.size?.sizeType?.name || ''})
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography>{stockItem.stockQty}</Typography>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleQuickUpdate(stockItem, stockItem.stockQty + 1)}
                      >
                        +1
                      </Button>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleQuickUpdate(stockItem, Math.max(0, stockItem.stockQty - 1))}
                      >
                        -1
                      </Button>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={stockItem.stockQty > 0 ? 'In Stock' : 'Out of Stock'}
                      color={stockItem.stockQty > 0 ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(stockItem)}
                    >
                      <Edit />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingStock ? 'Edit Stock' : 'Add Stock'}
          </DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              select
              label="Product"
              name="product"
              value={formik.values.product}
              onChange={formik.handleChange}
              error={formik.touched.product && Boolean(formik.errors.product)}
              helperText={formik.touched.product && formik.errors.product}
              disabled={!!editingStock}
            >
              {products.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              select
              label="Size"
              name="size"
              value={formik.values.size}
              onChange={formik.handleChange}
              error={formik.touched.size && Boolean(formik.errors.size)}
              helperText={formik.touched.size && formik.errors.size}
              disabled={!!editingStock}
            >
              {sizes.map((size) => (
                <MenuItem key={size._id} value={size._id}>
                  {size.label} ({size.sizeType?.name || ''})
                </MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              margin="normal"
              label="Stock Quantity"
              name="stockQty"
              type="number"
              value={formik.values.stockQty}
              onChange={formik.handleChange}
              error={formik.touched.stockQty && Boolean(formik.errors.stockQty)}
              helperText={formik.touched.stockQty && formik.errors.stockQty}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingStock ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainCard>
  );
}
