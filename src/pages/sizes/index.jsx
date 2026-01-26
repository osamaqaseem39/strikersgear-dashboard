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
  Tabs,
  Tab,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import MainCard from '../../../components/MainCard';
import { sizesApi } from '../../../api/api';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  name: yup.string().required('Name is required'),
});

const sizeValidationSchema = yup.object({
  sizeType: yup.string().required('Size Type is required'),
  label: yup.string().required('Label is required'),
});

export default function SizesPage() {
  const [sizeTypes, setSizeTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSizeType, setIsSizeType] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sizeTypesData, sizesData] = await Promise.all([
        sizesApi.getSizeTypes(),
        sizesApi.getAll(),
      ]);
      setSizeTypes(sizeTypesData);
      setSizes(sizesData);
    } catch (error) {
      console.error('Error loading data:', error);
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
          if (editingItem) {
            // Update size type if needed
            await sizesApi.createSizeType(values);
          } else {
            await sizesApi.createSizeType(values);
          }
        } else {
          if (editingItem) {
            await sizesApi.update(editingItem._id, values);
          } else {
            await sizesApi.create(values);
          }
        }
        formik.resetForm();
        setOpen(false);
        setEditingItem(null);
        loadData();
      } catch (error) {
        console.error('Error saving:', error);
        alert('Error saving: ' + error.message);
      }
    },
  });

  const handleEdit = (item, isType) => {
    setEditingItem(item);
    setIsSizeType(isType);
    if (isType) {
      formik.setValues({
        name: item.name || '',
      });
    } else {
      formik.setValues({
        sizeType: item.sizeType?._id || item.sizeType || '',
        label: item.label || '',
        sortOrder: item.sortOrder || 0,
      });
    }
    setOpen(true);
  };

  const handleDelete = async (id, isType) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        if (isType) {
          // Handle size type deletion if API supports it
          alert('Size type deletion not implemented in API');
        } else {
          await sizesApi.delete(id);
        }
        loadData();
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Error deleting: ' + error.message);
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingItem(null);
    formik.resetForm();
  };

  const handleAdd = (isType) => {
    setIsSizeType(isType);
    formik.resetForm();
    setOpen(true);
  };

  return (
    <MainCard title="Sizes Management">
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Size Types" />
          <Tab label="Sizes" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleAdd(true)}
            >
              Add Size Type
            </Button>
          </Box>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sizeTypes.map((sizeType) => (
                  <TableRow key={sizeType._id}>
                    <TableCell>{sizeType.name}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(sizeType, true)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(sizeType._id, true)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      {tab === 1 && (
        <>
          <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => handleAdd(false)}
            >
              Add Size
            </Button>
          </Box>
          <Card>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Size Type</TableCell>
                  <TableCell>Label</TableCell>
                  <TableCell>Sort Order</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sizes.map((size) => (
                  <TableRow key={size._id}>
                    <TableCell>{size.sizeType?.name || 'N/A'}</TableCell>
                    <TableCell>{size.label}</TableCell>
                    <TableCell>{size.sortOrder}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(size, false)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(size._id, false)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </>
      )}

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>
            {editingItem
              ? `Edit ${isSizeType ? 'Size Type' : 'Size'}`
              : `Add ${isSizeType ? 'Size Type' : 'Size'}`}
          </DialogTitle>
          <DialogContent>
            {isSizeType ? (
              <TextField
                fullWidth
                margin="normal"
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                placeholder="UK, EU, Alpha, Free"
              />
            ) : (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  select
                  label="Size Type"
                  name="sizeType"
                  value={formik.values.sizeType}
                  onChange={formik.handleChange}
                  error={formik.touched.sizeType && Boolean(formik.errors.sizeType)}
                  helperText={formik.touched.sizeType && formik.errors.sizeType}
                >
                  {sizeTypes.map((st) => (
                    <MenuItem key={st._id} value={st._id}>
                      {st.name}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Label"
                  name="label"
                  value={formik.values.label}
                  onChange={formik.handleChange}
                  error={formik.touched.label && Boolean(formik.errors.label)}
                  helperText={formik.touched.label && formik.errors.label}
                  placeholder="7, 42, S, M, L, Free"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Sort Order"
                  name="sortOrder"
                  type="number"
                  value={formik.values.sortOrder}
                  onChange={formik.handleChange}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </MainCard>
  );
}
