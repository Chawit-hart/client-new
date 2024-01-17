import React from 'react';
import Grid from '@mui/material/Grid';
import ClothingProduct from './ClothingProduct';
import { useNavigate } from 'react-router-dom';

const ClothingCategoryPage = ({ products }) => {
  
  return (
    <div style={{ marginTop: '300px', marginLeft: '200px', marginBottom: '70px' }}>
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
