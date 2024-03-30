import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
  ButtonGroup,
} from "@mui/material";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { auth } from "../Config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import { useCart } from "../Component/service/CartContext";

const ConfirmationPage = () => {
  const { state } = useLocation();
  const [product, setProduct] = useState(null);
  const [Amount, setAmount] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [file, setFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cashOnDelivery");
  const [productImg, setProductImg] = useState(null);
  const [sizes, setSizes] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [profileData, setProfileData] = useState({
    name: "",
    address: "",
    tel: "",
    email: "",
  });

  const { setCartCount } = useCart();

  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      const uploadedFile = files[0];
      setFile(uploadedFile);
      const uploadedImageUrl = URL.createObjectURL(uploadedFile);
      setUploadedImageUrl(uploadedImageUrl);
    } else {
    }
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleConfirmOrder = async () => {
    const formData = new FormData();
    formData.append("productid", product._id);
    formData.append("productname", product.name);
    formData.append("category", product.category);
    formData.append("detail", product.detail);
    formData.append("price", product.price);
    formData.append("amount", Amount);
    formData.append("email", profileData.email);
    formData.append("name", profileData.name);
    formData.append("tel", profileData.tel);
    formData.append("address", profileData.address);
    formData.append("image", productImg);
    formData.append("slip", file);
    let paymentMode = paymentMethod;
    if (paymentMode === "bankTransfer") {
      paymentMode = "โอนเงิน";
    } else if (paymentMode === "cashOnDelivery") {
      paymentMode = "ชำระเงินปลายทาง";
    }
    formData.append("payment", paymentMode);
    console.log("🚀 ~ handleConfirmOrder ~ paymentMethod:", paymentMode);

    if (paymentMethod === "bankTransfer" && !file) {
      Swal.fire({
        icon: "warning",
        title: "Please upload the payment slip",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
      return;
    }

    try {
      await axios.post("http://localhost:3001/order/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        icon: "success",
        title: "Your order has been placed successfully!",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
      navigate("/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed to place your order! Please try again later.",
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

  useEffect(() => {
    axios
      .get(`http://localhost:3001/posts/${state.productId}`)
      .then((response) => {
        const productData = response.data;
        setProduct(response.data);
        updateTotalPrice(response.data.price, 1);
        const productSizes = Array.isArray(productData.size)
          ? productData.size
          : [];
        setSizes(productSizes);
        setSelectedSize(productSizes[0] || "");
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
        productname: product.name,
        price: product.price,
        amount: Amount,
        category: product.category,
        email: user.email,
        detail: product.detail,
      };

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

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handlePaymentMethodChange = (event) => {
    setPaymentMethod(event.target.value);
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
          marginTop: "100px",
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
            sx={{
              padding: 3,
              height: uploadedImageUrl ? "900px" : "700px",
              width: 1000,
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
                    {sizes.map((size) => (
                      <FormControlLabel
                        value={size}
                        control={<Radio />}
                        label={size}
                        key={size}
                      />
                    ))}
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
                  <Typography variant="h6" gutterBottom>
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
                    fullWidth
                  />
                  <Typography variant="h6" gutterBottom>
                    ราคารวม: {totalPrice.toLocaleString()} บาท
                  </Typography>
                  <Box>
                    <Typography variant="body1" gutterBottom>
                      ธนาคาร: กสิกรไทย
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      เลขที่บัญชี: 036-3764-835
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      ชื่อ: นายชวิศ ธนชูเชาวน์
                    </Typography>
                  </Box>
                </>
              )}
              <FormControl
                component="fieldset"
                sx={{ width: "100%", marginTop: "5px" }}
              >
                <FormLabel component="legend">วิธีการชำระเงิน</FormLabel>
                <RadioGroup
                  row
                  aria-label="paymentMethod"
                  name="paymentMethod"
                  value={paymentMethod}
                  onChange={handlePaymentMethodChange}
                >
                  <FormControlLabel
                    value="cashOnDelivery"
                    control={<Radio />}
                    label="ชำระเงินปลายทาง"
                  />
                  <FormControlLabel
                    value="bankTransfer"
                    control={<Radio />}
                    label="โอนเงิน"
                  />
                </RadioGroup>
              </FormControl>
              {paymentMethod === "bankTransfer" && (
                <>
                  <Grid item xs={12}>
                    <label htmlFor="upload-receipt">
                      <input
                        type="file"
                        accept="image/jpeg, image/png, image/gif, image/jpg"
                        style={{ display: "none" }}
                        id="upload-receipt"
                        onChange={handleFileSelect}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                      >
                        อัปโหลดสลิป
                      </Button>
                    </label>
                  </Grid>
                  {uploadedImageUrl && (
                    <Grid
                      item
                      xs={12}
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    >
                      <Box
                        sx={{
                          maxWidth: 200,
                          maxHeight: 300,
                          overflow: "hidden",
                          borderRadius: "10px",
                          boxShadow: 3,
                          cursor: "pointer",
                          "&:hover": {
                            boxShadow: 6,
                          },
                        }}
                        onClick={handleClickOpen}
                      >
                        <img
                          src={uploadedImageUrl}
                          alt="Uploaded"
                          style={{
                            width: "100%",
                            height: "auto",
                          }}
                        />
                      </Box>
                    </Grid>
                  )}
                </>
              )}
            </Grid>

            <Dialog open={openDialog} onClose={handleClose} maxWidth="md">
              <DialogContent>
                <img
                  src={uploadedImageUrl}
                  alt="Uploaded"
                  style={{ width: "100%", height: "auto" }}
                />
              </DialogContent>
            </Dialog>
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmOrder}
            startIcon={<CheckCircleIcon />}
            style={{ marginLeft: "10px" }}
            disabled={!product || product.amount === "สินค้าหมด"}
          >
            ยืนยันคำสั่งซื้อ
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ConfirmationPage;
