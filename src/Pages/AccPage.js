import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import AccProduct from "./AccProduct";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import axios from "axios";

const ClothingCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ใช้ Axios เพื่อดึงข้อมูลจาก API
    axios
      .get("http://localhost:3001/posts")
      .then((response) => {
        const filteredProducts = response.data.filter(
          (product) => product.category === "Accessories"
        );
        setProducts(filteredProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        marginTop: "100px",
        marginLeft: "200px",
        marginBottom: "70px",
        width: "80%",
        justifyContent: "center",
      }}
    >
      <h3 style={{ marginLeft: "15px" }}>Accessories</h3>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      ) : products.length === 0 ? (
        <Typography style={{ textAlign: "center" }}>
          No products available
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid
              sx={{ display: "flex", justifyContent: "center" }}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              key={product._id}
            >
              <AccProduct product={product} />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default ClothingCategoryPage;
