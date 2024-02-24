import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Grid,
  Typography,
  Paper,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import axios from "axios";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Dialog,
  DialogContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Box,
} from "@mui/material";
import { auth } from "../Config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
  const [profileData, setProfileData] = useState({
    name: "",
    address: "",
    tel: "",
    email: "",
  });

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
  }, []); // กำหนดว่า useEffect ควรเรียกเมื่อ Component ถูก mount โดยใส่ dependencies เป็น array ว่าง

  useEffect(() => {
    const fetchImageAndSendToAPI = async () => {
      try {
        const imageUrl = `http://localhost:3001/posts/images/${state.productId}`;
        const response = await axios.get(imageUrl, { responseType: "blob" });

        setProductImg(response.data);

        // ทำอะไรกับ response จาก API ต่อไปได้ตามต้องการ
        // console.log("Response from API:", response.data);
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

  const handleConfirmOrder = async () => {
    const formData = new FormData();
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
      })
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
        setProduct(response.data);
        updateTotalPrice(response.data.price, 1);
      })
      .catch((error) => console.error("Error:", error));
  }, [state.productId]);

  const updateTotalPrice = (price, quantity) => {
    const numericPrice = parseFloat(price.replace(/,/g, ""));
    const newTotalPrice = numericPrice * Number(quantity);
    setTotalPrice(newTotalPrice);
  };

  const handleAmountChange = (event) => {
    const value = event.target.value.replace(/,/g, ""); // ลบลูกน้ำออกจากค่าที่ป้อน
    const number = parseInt(value, 10);

    if (!isNaN(number) && number >= 1) {
      setAmount(number);
      updateTotalPrice(product.price, number);
    } else if (value === "") {
      setAmount("");
    }
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
                    ราคา: {product.price} บาท
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    จำนวนคงเหลือ: {product.amount} ตัว
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
                    ราคารวม: {totalPrice} บาท
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
            color="primary"
            onClick={handleConfirmOrder}
            startIcon={<CheckCircleIcon />}
          >
            ยืนยันคำสั่งซื้อ
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ConfirmationPage;
