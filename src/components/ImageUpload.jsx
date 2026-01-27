import { useRef, useState } from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { uploadImage } from 'api/api';

/**
 * Single image upload: file input, upload to upload.php, preview, optional clear.
 * Props: value (url string), onChange(url), label, accept, disabled
 */
export default function ImageUpload({ value, onChange, label = 'Image', accept = 'image/*', disabled = false }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);
    try {
      const url = await uploadImage(file);
      onChange?.(url);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleClear = () => {
    onChange?.('');
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}
      </Typography>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleSelect}
        disabled={disabled || uploading}
        style={{ display: 'none' }}
      />
      {value ? (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, flexWrap: 'wrap' }}>
          <Box
            component="img"
            src={value}
            alt="Preview"
            sx={{
              width: 160,
              height: 160,
              objectFit: 'cover',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<CloudUpload />}
              onClick={() => inputRef.current?.click()}
              disabled={disabled || uploading}
            >
              {uploading ? <CircularProgress size={20} /> : 'Replace'}
            </Button>
            <Button variant="outlined" size="small" color="error" startIcon={<Delete />} onClick={handleClear} disabled={disabled}>
              Remove
            </Button>
          </Box>
        </Box>
      ) : (
        <Box
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
          sx={{
            width: 160,
            height: 160,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: disabled || uploading ? 'default' : 'pointer',
            bgcolor: 'action.hover',
            '&:hover': (disabled || uploading) ? {} : { borderColor: 'primary.main', bgcolor: 'action.selected' },
          }}
        >
          {uploading ? (
            <CircularProgress size={32} />
          ) : (
            <>
              <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 0.5 }} />
              <Typography variant="caption" color="text.secondary">
                Click to upload
              </Typography>
            </>
          )}
        </Box>
      )}
      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
