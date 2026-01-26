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
import MainCard from 'components/MainCard';
import { categoriesApi } from 'api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
});

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
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
        if (editingCategory) {
          await categoriesApi.update(editingCategory._id, values);
        } else {
          await categoriesApi.create(values);
        }
        formik.resetForm();
        setOpen(false);
        setEditingCategory(null);
        loadCategories();
      } catch (error) {
        console.error('Error saving category:', error);
        alert('Error saving category: ' + error.message);
      }
    },
  });

  const handleEdit = (category) => {
    setEditingCategory(category);
    formik.setValues({
      name: category.name || '',
      slug: category.slug || '',
      isActive: category.isActive !== false,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await categoriesApi.delete(id);
        loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category: ' + error.message);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingCategory(null);
    formik.resetForm();
  };

  return (
    <MainCard title="Categories">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Category
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
            {categories.map((category) => (
              <TableRow key={category._id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.slug || 'N/A'}</TableCell>
                <TableCell>
                  <Chip
                    label={category.isActive ? 'Active' : 'Inactive'}
                    color={category.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleEdit(category)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" color="error" onClick={() => handleDelete(category._id)}>
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
          <DialogTitle>{editingCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
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
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainCard>
  );
}
