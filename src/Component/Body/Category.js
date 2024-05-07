import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

const Category = ({ categories }) => {
  return (
    <div style={{ marginTop: "100px", borderTop: "2px solid rgba(0, 0, 0, 0.1)", paddingTop: "20px",}}>
      <h3 style={{ marginLeft: '200px', marginTop: '20px' }}>Category</h3>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "70px",
          marginBottom: "20px",
        }}
      >
        {categories.map((category, index) => (
          <Link
            to={`/category/${category.name}`}
            key={index}
            style={{ textDecoration: "none" }}
          >
            <Card style={{ width: 350, marginTop: "50px" }}>
              <CardActionArea>
                <CardMedia
                  sx={{
                    objectFit: "contain",
                    width: "50%",
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginTop: "20px",
                  }}
                  component="img"
                  image={category.imageUrl}
                  alt={category.name}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                    style={{ textAlign: "center" }}
                  >
                    {category.name}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Category;
