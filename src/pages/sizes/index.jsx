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
  Tabs,
  Tab,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { sizesApi } from 'api/api';

export default function SizesPage() {
  const navigate = useNavigate();
  const [sizeTypes, setSizeTypes] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [tab, setTab] = useState(0);

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

  const handleEdit = (item, isType) => {
    if (isType) {
      navigate(`/sizes/${item._id}/edit?type=size-type`);
    } else {
      navigate(`/sizes/${item._id}/edit`);
    }
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

  const handleAdd = (isType) => {
    if (isType) {
      navigate('/sizes/new?type=size-type');
    } else {
      navigate('/sizes/new');
    }
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
              onClick={() => navigate('/sizes/new?type=size-type')}
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
              onClick={() => navigate('/sizes/new')}
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
    </MainCard>
  );
}
