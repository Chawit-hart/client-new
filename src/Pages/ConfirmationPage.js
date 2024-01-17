import React from 'react';
import { useLocation } from 'react-router-dom';
import { Grid, Typography, Paper, Button, Divider } from '@mui/material';

const ConfirmationPage = () => {
  const location = useLocation();
  const orderDetails = location.state || {};

  const {
    imageUrl,
    productName,
    price,
    quantity,
    paymentMethods = [],
  } = orderDetails;

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log(file);
  };

  const handleConfirmOrder = () => {
    console.log('Order Confirmed');
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4" align="center" gutterBottom>
          ยืนยันคำสั่งซื้อ
        </Typography>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Paper elevation={3}>
          <Grid container spacing={2} justifyContent="center" alignItems="center" sx={{ padding: 3 }}>
            <Grid item xs={12} sm={4}>
              <img src={imageUrl} alt={productName} style={{ maxWidth: '100%' }} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Typography variant="h6" gutterBottom>
                {productName}
              </Typography>
              <Typography variant="body1" gutterBottom>
                ราคา: {price} บาท
              </Typography>
              <Typography variant="body1" gutterBottom>
                จำนวน: {quantity}
              </Typography>
              <Typography variant="body1" gutterBottom>
                วิธีการชำระเงิน:
                {paymentMethods.map((method, index) => (
                  <span key={index}>{`${method}${index !== paymentMethods.length - 1 ? ', ' : ''}`}</span>
                ))}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          <input
            type="file"
            accept="image/jpeg, image/png, image/gif, image/jpg"
            style={{ display: 'none' }}
            id="upload-receipt"
            onChange={handleFileSelect}
          />
          <label htmlFor="upload-receipt">
            <Button variant="contained" color="primary" component="span">
              อัปโหลดสลิป
            </Button>
          </label>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleConfirmOrder}>
            ยืนยันคำสั่งซื้อ
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ConfirmationPage;
