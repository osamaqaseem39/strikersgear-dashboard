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
  Chip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import MainCard from '../../../components/MainCard';
import { brandsApi } from '../../../api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
});

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await brandsApi.getAll();
      setBrands(data);
    } catch (error) {
      console.error('Error loading brands:', error);
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
        if (editingBrand) {
          await brandsApi.update(editingBrand._id, values);
        } else {
          await brandsApi.create(values);
        }
        formik.resetForm();
        setOpen(false);
        setEditingBrand(null);
        loadBrands();
      } catch (error) {
        console.error('Error saving brand:', error);
        alert('Error saving brand: ' + error.message);
      }
    },
  });

  const handleEdit = (brand) => {
    setEditingBrand(brand);
    formik.setValues({
      name: brand.name || '',
      slug: brand.slug || '',
      isActive: brand.isActive !== false,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await brandsApi.delete(id);
        loadBrands();
      } catch (error) {
        console.error('Error deleting brand:', error);
        alert('Error deleting brand: ' + error.message);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBrand(null);
    formik.resetForm();
  };

  return (
    <MainCard title="Brands">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Brand
        </Button>
      </Box>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Slug</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand._id}>
                <TableCell>{brand.name}</TableCell>
                <TableCell>{brand.slug || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={brand.isActive ? 'Active' : 'Inactive'}
                    color={brand.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(brand)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(brand._id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
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
              label="Slug (Optional)"
              name="slug"
              value={formik.values.slug}
              onChange={formik.handleChange}
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
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingBrand ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainCard>
  );
}
