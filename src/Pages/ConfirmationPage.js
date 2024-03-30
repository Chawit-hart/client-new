import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
  Radio,
  FormControlLabel,
  FormLabel,
  ButtonGroup,
} from "@mui/material";
import axios from "axios";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { auth } from "../Config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";

import { useCart } from "../Component/service/CartContext";

const ConfirmationPage = () => {
  const { state } = useLocation();
  const [product, setProduct] = useState(null);
  const [Amount, setAmount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [productImg, setProductImg] = useState(null);
  // const [sizes, setSizes] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    address: "",
    tel: "",
    email: "",
  });

  const { setCartCount } = useCart();

  const [user, setUser] = useState(null);

  useEffect(() => {
    if (product) {
      updateTotalPrice(product.price, Amount);
    }
  }, [product, Amount]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Endpoint สำหรับดึงข้อมูลโปรไฟล์โดยใช้ email
        const fetchProfileEndpoint = `http://localhost:3001/usersinfo/address?email=${currentUser.email}`;

        // เรียก API เพื่อดึงข้อมูลโปรไฟล์
        axios
          .get(fetchProfileEndpoint)
          .then((response) => {
            const profileInfo = response.data;
            setProfileData({
              name: profileInfo.name,
              address: profileInfo.address,
              tel: profileInfo.tel,
              email: currentUser.email,
            });
          })
          .catch((error) => {
            console.error("Error fetching profile data:", error);
          });
      } else {
        setUser(null);
        setProfileData({
          name: "",
          address: "",
          tel: "",
          email: "",
        });
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchImageAndSendToAPI = async () => {
      try {
        const imageUrl = `http://localhost:3001/posts/images/${state.productId}`;
        const response = await axios.get(imageUrl, { responseType: "blob" });
        setProductImg(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    return fetchImageAndSendToAPI;
  }, []);

  const handleSizeSelect = (size) => {
    console.log("selectedSize--->", selectedSize);
    console.log(
      "🚀 ~ file: ConfirmationPage.js:100 ~ handleSizeSelect ~ size:",
      size
    );
    setSelectedSize(size);
  };

  useEffect(() => {
    axios
      .get(`http://localhost:3001/posts/${state.productId}`)
      .then((response) => {
        const productData = response.data;
        setProduct(response.data);
        updateTotalPrice(response.data.price, 1);
        // const productSizes = Array.isArray(productData.size)
        //   ? productData.size
        //   : [];
        // setSizes(productSizes);
        // setSelectedSize(productSizes[0] || "");
      })
      .catch((error) => console.error("Error:", error));
  }, [state.productId]);

  const updateTotalPrice = (price, quantity) => {
    const newTotalPrice = price * quantity;
    setTotalPrice(newTotalPrice);
  };

  const handleAddToCart = async () => {
    if (!user) {
      Swal.fire("กรุณาล็อกอินก่อนทำการเพิ่มสินค้าลงในตะกร้า");
      return;
    }

    try {
      const cartItem = {
        productid: product._id,
        email: user.email,
        productname: product.name,
        detail: product.detail,
        size: selectedSize,
        category: product.category,
        price: product.price,
        amount: Amount,
      };
      console.log(
        "🚀 ~ file: ConfirmationPage.js:142 ~ handleAddToCart ~ cartItem:",
        cartItem
      );

      await axios.post("http://localhost:3001/cart/upload-image", cartItem);

      const response = await axios.get(
        `http://localhost:3001/cart/?email=${user.email}`
      );
      const orderData = response.data;
      setCartCount(orderData.length);

      Swal.fire({
        icon: "success",
        title: "Product added to cart successfully!",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Unable to add product to cart. Please try again.",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
    }
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    let number = parseInt(value, 10);
    const max = product.amount;
    console.log("🚀 ~ handleAmountChange ~ max:", max);

    if (!value) {
      setAmount("");
      return;
    }

    if (max === "สินค้าหมด") {
      number = 1;
      setAmount(0);
    }

    if (number > max) {
      number = max;
    } else if (number < 1) {
      number = 1;
    }

    setAmount(number);
    updateTotalPrice(product.price, number);
  };

  return (
    <Grid container spacing={3}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "100px",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            borderRadius: "20px",
            maxWidth: "1400px",
            width: "100%",
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent="center"
            alignItems="center"
            sx={{
              padding: 3,
              height: "700px",
            }}
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
                  marginLeft: "30px",
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
                    ราคา: {product.price.toLocaleString()} บาท
                  </Typography>
                  <FormLabel component="legend">Size</FormLabel>
                  <ButtonGroup
                    row
                    name="size"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    sx={{
                      ".MuiButton-root": {
                        border: "1px solid black",
                        "&:hover": {
                          backgroundColor: "black",
                          borderColor: "dark",
                          color: "white",
                        },
                      },
                    }}
                  >
                    {/* {sizes.map((size) => (
                      <FormControlLabel
                        value={size}
                        control={<Radio />}
                        label={size}
                        key={size}
                      />
                    ))} */}
                    {["XS", "S", "M", "L", "XL"].map((size, index, array) => (
                      <Button
                        key={size}
                        variant={
                          selectedSize === size ? "contained" : "outlined"
                        }
                        onClick={() => handleSizeSelect(size)}
                        sx={{
                          typography: "body1",
                          width: 60,
                          height: 40,
                          "&:not(:first-of-type)": {
                            ml: -1,
                          },
                          ...(index === 0 && {
                            borderTopLeftRadius: 8,
                            borderBottomLeftRadius: 8,
                          }),
                          ...(index === array.length - 1 && {
                            borderTopRightRadius: 8,
                            borderBottomRightRadius: 8,
                          }),
                          // เส้นขอบเป็นสีดำเมื่อไม่ได้เลือก
                          border: "1px solid rgba(0, 0, 0, 0.23)",
                          // สีของข้อความเป็นสีดำเมื่อไม่ได้เลือก
                          color: "black",
                          // พื้นหลังสีขาวเมื่อไม่ได้เลือก
                          bgcolor: "white",
                          // เมื่อเลือกหรือวางเมาส์เหนือ (hover) ของปุ่มที่เลือกแล้ว
                          ...(selectedSize === size && {
                            bgcolor: "black",
                            color: "white",
                            "&:hover": {
                              bgcolor: "black",
                              color: "white",
                              // เส้นขอบเป็นสีดำเมื่อ hover
                              border: "1px solid black",
                            },
                          }),
                          // เมื่อวางเมาส์เหนือ (hover) และปุ่มไม่ได้ถูกเลือก
                          "&:hover": {
                            bgcolor: (theme) => theme.palette.action.hover,
                            // สีของข้อความเป็นสีดำเมื่อ hover
                            color: "black",
                            // เส้นขอบเป็นสีดำเมื่อ hover
                            border: "1px solid black",
                          },
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </ButtonGroup>
                  <Typography
                    color="textSecondary"
                    gutterBottom
                    sx={{
                      display: "block",
                      marginTop: "15px",
                      color: (theme) => theme.palette.grey[600],
                      fontSize: "0.95rem",
                    }}
                  >
                    จำนวนคงเหลือ:{" "}
                    {product.amount === "สินค้าหมด"
                      ? product.amount
                      : `${product.amount} ชิ้น`}
                  </Typography>
                  <TextField
                    label="จำนวน"
                    type="number"
                    InputProps={{ inputProps: { min: 1, max: product.amount } }}
                    value={Amount}
                    onChange={handleAmountChange}
                    margin="normal"
                    sx={{
                      width: "150px",
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    ราคารวม: {totalPrice.toLocaleString()} บาท
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Grid container justifyContent="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleAddToCart}
            startIcon={<AddShoppingCartIcon />}
            disabled={!product || product.amount === "สินค้าหมด"}
          >
            เพิ่มลงตะกร้า
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ConfirmationPage;
