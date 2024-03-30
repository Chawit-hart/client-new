import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ClothingProduct = ({ product }) => {
  const navigate = useNavigate();

  const handleProductClick = () => {
    navigate("/confirmation", { state: { productId: product._id } });
  };

  return (
    <Card
      sx={{
        maxWidth: 345,
        width: '100%',
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        m: 2,
      }}
      onClick={handleProductClick}
    >
      <CardActionArea>
        <CardMedia
          component="img"
          sx={{
            height: "300px",
            width: "100%",
            p: 2,
            objectFit: "contain",
            borderRadius: "10px",
          }}
          image={`http://localhost:3001/posts/images/${product._id}`}
          alt={product.name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {product.name}
          </Typography>
          <Typography gutterBottom variant="h6" component="div" sx={{ mt: 1 }}>
            {product.price.toLocaleString()} บาท
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default ClothingProduct;
