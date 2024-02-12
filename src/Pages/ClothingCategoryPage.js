import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import ClothingProduct from './ClothingProduct';
import axios from 'axios'; 

const ClothingCategoryPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ใช้ Axios เพื่อดึงข้อมูลจาก API
    axios.get('http://localhost:3001/posts') // แทนที่ '/api/products' ด้วย URL ของ API ของคุณ
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  
  return (
    <div style={{ marginTop: '100px', marginLeft: '200px', marginBottom: '70px' }}>
    <Grid container spacing={1}>
      {products.map((product, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <ClothingProduct product={product} />
        </Grid>
      ))}
    </Grid>
    </div>
  );
};

export default ClothingCategoryPage;
