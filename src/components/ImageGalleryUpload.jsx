import { useRef, useState } from 'react';
import { Box, Button, Typography, IconButton, CircularProgress } from '@mui/material';
import { CloudUpload, Delete } from '@mui/icons-material';
import { uploadImage } from 'api/api';

/**
 * Gallery upload: multiple images, add/remove, preview grid.
 * Props: value (string[]), onChange(urls), label, max, disabled
 */
export default function ImageGalleryUpload({ value = [], onChange, label = 'Gallery', max = 10, disabled = false }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleSelect = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const remaining = Math.max(0, max - (value?.length || 0));
    const toAdd = files.slice(0, remaining);
    if (!toAdd.length) {
      setError(`Maximum ${max} images allowed.`);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    setError('');
    setUploading(true);
    const newUrls = [];
    try {
      for (const file of toAdd) {
        const url = await uploadImage(file);
        newUrls.push(url);
      }
      onChange?.([...(value || []), ...newUrls]);
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const remove = (index) => {
    const next = [...(value || [])];
    next.splice(index, 1);
    onChange?.(next);
    setError('');
  };

  const current = value || [];
  const canAdd = current.length < max;

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label} ({current.length} / {max})
      </Typography>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleSelect}
        disabled={disabled || uploading || !canAdd}
        style={{ display: 'none' }}
      />
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {current.map((url, i) => (
          <Box
            key={i}
            sx={{
              position: 'relative',
              width: 100,
              height: 100,
            }}
          >
            <Box
              component="img"
              src={url}
              alt={`Gallery ${i + 1}`}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: 1,
                border: '1px solid',
                borderColor: 'divider',
              }}
            />
            {!disabled && (
              <IconButton
                size="small"
                onClick={() => remove(i)}
                sx={{
                  position: 'absolute',
                  top: 4,
                  right: 4,
                  bgcolor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  '&:hover': { bgcolor: 'error.main' },
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}
        {canAdd && (
          <Box
            onClick={() => !disabled && !uploading && inputRef.current?.click()}
            sx={{
              width: 100,
              height: 100,
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
              <CircularProgress size={28} />
            ) : (
              <>
                <CloudUpload sx={{ fontSize: 28, color: 'text.secondary' }} />
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.25 }}>
                  Add
                </Typography>
              </>
            )}
          </Box>
        )}
      </Box>
      {error && (
        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
}
