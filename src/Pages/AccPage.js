import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import AccProduct from './AccProduct';
import axios from 'axios';

const ClothingCategoryPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // ใช้ Axios เพื่อดึงข้อมูลจาก API
    axios.get('http://localhost:3001/posts')
      .then(response => {
        const filteredProducts = response.data.filter(product => product.category === 'Accessories');
        setProducts(filteredProducts);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);
  
  return (
    <div style={{ marginTop: '100px', marginLeft: '200px', marginBottom: '70px', width: '80%', justifyContent: "center" }}>
      <h3 style={{marginLeft: "15px"}}>Accessories</h3>
    <Grid container spacing={4}>
      {products.map((product) => (
        <Grid sx={{ display: 'flex', justifyContent: 'center' }} item xs={12} sm={6} md={4} lg={3} key={product._id}>
          <AccProduct product={product} />
        </Grid>
      ))}
    </Grid>
    </div>
  );
};

export default ClothingCategoryPage;
