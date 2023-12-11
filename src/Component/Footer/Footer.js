import React from 'react';
import { Box, Container, Grid, Link, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: '#282c34', color: 'white', py: 3 }}>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">เกี่ยวกับเรา</Typography>
            <Typography variant="body1">รายละเอียดของบริษัทหรือเว็บไซต์</Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6">ลิงก์</Typography>
            <Link href="#" color="inherit">หน้าหลัก</Link><br />
            <Link href="#" color="inherit">ผลิตภัณฑ์</Link><br />
            <Link href="#" color="inherit">ติดต่อเรา</Link>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6">ติดต่อเรา</Typography>
            <Typography variant="body1">ที่อยู่บริษัท</Typography>
            <Typography variant="body1">info@example.com</Typography>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ mt: 3 }}>© 2023 Adshop</Typography>
      </Container>
    </Box>
  );
};

export default Footer;
