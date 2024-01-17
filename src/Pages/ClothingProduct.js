import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';


const ClothingProduct = ({ product }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate('/confirmation', { state: { productId: product.id } });
  };

  return (
    <Card sx={{ maxWidth: 345 }} onClick={handleProductClick}>
      <CardActionArea>
        <CardMedia
          component="img"
          sx={{
            height: 'auto',
            maxHeight: 140,
            width: '100%',
            objectFit: 'contain'
          }}
          image={product.imageUrl}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {product.description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ClothingProduct;
