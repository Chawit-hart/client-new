import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Grid, Typography, Paper, Button, Divider } from "@mui/material";
import axios from "axios";

const ConfirmationPage = () => {
  const { state } = useLocation();
  const [product, setProduct] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log(file);
  };

  const handleConfirmOrder = () => {
    console.log("Order Confirmed");
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/posts/${state.productId}`)
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => console.error("Error:", error));
  }, [state]);

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
