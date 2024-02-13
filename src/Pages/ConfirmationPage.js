import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import axios from "axios";
import { useAuth } from '../Component/service/AuthContext';


const ConfirmationPage = () => {
  const { state } = useLocation();
  const [product, setProduct] = useState(null);
  const [Amount, setAmount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [file, setFile] = useState(null);

  const { currentUser } = useAuth();

  useEffect(() => {
    if (product) {
      updateTotalPrice(product.price, Amount);
    }
  }, [product, Amount]);

  const handleFileSelect = (event) => {
    setFile(event.target.files[0]);
  };

  const handleConfirmOrder = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('productName', product.name);
    formData.append('productPrice', product.price);
    formData.append('amount', Amount);
    formData.append('totalPrice', totalPrice);
    formData.append('email', currentUser?.email);


    try {
      await axios.post('http://localhost:3001/order/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data; boundary=<calculated when request is sent>',
        },
      });
      console.log('Order has been confirmed and data sent to server.');
    } catch (error) {
      console.error('Error uploading order data:', error);
    }
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/posts/${state.productId}`)
      .then((response) => {
        setProduct(response.data);
        // คำนวณราคารวมเริ่มต้น
        updateTotalPrice(response.data.price, 1);
      })
      .catch((error) => console.error("Error:", error));
  }, [state.productId]);

  const updateTotalPrice = (price, quantity) => {
    const numericPrice = parseFloat(price.replace(/,/g, ''));
    const newTotalPrice = numericPrice * Number(quantity);
    setTotalPrice(newTotalPrice);
  };

  const handleAmountChange = (event) => {
    const newAmount = parseInt(event.target.value, 10);
    if (!isNaN(newAmount) && newAmount >= 1 && newAmount <= product.amount) {
      setAmount(newAmount);
      updateTotalPrice(product.price, newAmount);
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            marginTop: "-150px",
          }}
        >
          ยืนยันคำสั่งซื้อ
        </Typography>
        <Divider />
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: "20px",
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{ padding: 3, height: 500, width: 1000 }}
          >
            <Grid item xs={12} sm={4}>
              <img
                src={`http://localhost:3001/posts/images/${state.productId}`}
                alt={state.productId}
                style={{
                  maxWidth: "100%",
                  borderRadius: "20px",
                  width: "auto",
                  height: "250px",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={8}>
              {product && (
                <>
                  <Typography variant="h3" gutterBottom>
                    {product.name}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    รายละเอียด: {product.detail}
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    ราคา: {product.price} บาท
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    จำนวนคงเหลือ: {product.amount} ตัว
                  </Typography>
                  <TextField
                    label="จำนวน"
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: product.amount } }}
                    value={Amount}
                    onChange={handleAmountChange}
                    margin="normal"
                    fullWidth
                  />
                  <Typography variant="h6" gutterBottom>
                    ราคารวม: {totalPrice} บาท
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Grid container justifyContent="center">
          <input
            type="file"
            accept="image/jpeg, image/png, image/gif, image/jpg"
            style={{ display: "none" }}
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmOrder}
          >
            ยืนยันคำสั่งซื้อ
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ConfirmationPage;
