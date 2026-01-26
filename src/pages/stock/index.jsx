import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  TextField,
  MenuItem,
  Chip,
  Typography,
} from '@mui/material';
import { Edit, Add } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { stockApi, productsApi, sizesApi } from 'api/api';

export default function StockPage() {
  const navigate = useNavigate();
  const [stock, setStock] = useState([]);
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
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

  const handleEdit = (stockItem) => {
    navigate(`/stock/${stockItem._id}/edit`);
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
          onClick={() => navigate('/stock/new')}
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
    </MainCard>
  );
}
