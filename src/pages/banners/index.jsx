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
  Typography,
  IconButton,
  Chip,
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import MainCard from 'components/MainCard';
import { bannersApi } from 'api/api';

export default function BannersPage() {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const data = await bannersApi.getAll();
      setBanners(data);
    } catch (error) {
      console.error('Error loading banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (banner) => {
    navigate(`/banners/${banner._id}/edit`);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this banner?')) {
      try {
        await bannersApi.delete(id);
        loadBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Error deleting banner: ' + error.message);
      }
    }
  };

  return (
    <MainCard title="Banners">
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/banners/new')}
        >
          Add Banner
        </Button>
      </Box>

      <Card>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Preview</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Button text</TableCell>
              <TableCell>Button link</TableCell>
              <TableCell>Position</TableCell>
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
            ) : banners.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No banners found
                </TableCell>
              </TableRow>
            ) : (
              banners.map((banner) => (
                <TableRow key={banner._id}>
                  <TableCell>
                    {banner.image ? (
                      <Box
                        component="img"
                        src={banner.image}
                        alt={banner.title || 'Banner'}
                        sx={{
                          width: 80,
                          height: 40,
                          objectFit: 'cover',
                          borderRadius: 0.5,
                          border: '1px solid',
                          borderColor: 'divider',
                        }}
                      />
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        No image
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>{banner.title || '-'}</TableCell>
                  <TableCell>{banner.buttonText || '-'}</TableCell>
                  <TableCell>{banner.buttonLink || '-'}</TableCell>
                  <TableCell>{banner.sortOrder ?? '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={banner.isActive ? 'Active' : 'Inactive'}
                      color={banner.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" onClick={() => handleEdit(banner)}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(banner._id)}
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
    </MainCard>
  );
}

