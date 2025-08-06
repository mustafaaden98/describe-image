import { Box, Typography } from '@mui/material';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        py: 2,
        textAlign: 'center',
        mt: 'auto',
        bgcolor: '#f5f5f5',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        © Mustafa Adenwala {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}