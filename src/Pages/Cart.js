import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Box,
  Typography,
  Paper,
  Container,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Modal,
  RadioGroup,
  FormControlLabel,
  Radio,
  IconButton,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import CloseIcon from "@mui/icons-material/Close";
import { auth } from "../Config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { useCart } from "../Component/service/CartContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: "15px",
};

export default function Cart() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const { setCartCount } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("");
  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [openAddress, setOpenAddress] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [slipImage, setSlipImage] = useState("");

  useEffect(() => {
    const fetchData = async (currentUser) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/cart/?email=${currentUser.email}`
        );
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      fetchData(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/usersinfo/address?email=${user.email}`
        );
        setAddresses(response.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleRemoveItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3001/cart/${itemId}`);
      setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
      const response = await axios.get(
        `http://localhost:3001/cart/?email=${user.email}`
      );
      const orderData = response.data;
      setCartCount(orderData.length);
      Swal.fire({
        icon: "success",
        title: "Product successfully removed from cart.",
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
        title: "Problem removing product from cart. Please try again.",
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

  const handleCloseAddress = () => {
    setOpenAddress(false);
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
    setPaymentMethod("");
    setSlipImage("");
  };

  const handleGobackToAddress = () => {
    setOpenPayment(false);
    setOpenAddress(true);
  };

  const handleSelectAddress = (selectedAddress) => {
    goToPayment(selectedAddress);
    console.log("select", selectedAddress);
  };

  const goToPayment = (selectedAddress) => {
    if (selectedAddress) {
      setOpenAddress(false);
      setOpenPayment(true);
      setPaymentMethod("");
      setSelectedAddress(selectedAddress);
    } else {
      Swal.fire({
        icon: "warning",
        title: "Please select an address.",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
    }
  };

  const handleSubmit = async () => {
    const body = {
      items: items.filter((item) => item.checked),
      email: user.email,
      name: selectedAddress.name,
      tel: selectedAddress.tel,
      address: selectedAddress.address,
      payment: paymentMethod,
    };
    try {
      const response = await axios.post(
        "http://localhost:3001/order/upload-image",
        body
      );

      if (response.status === 200) {
        // วนลูปในรายการ items เพื่อส่ง items._id เป็นพารามิเตอร์ในการลบ
        for (const item of body.items) {
          await axios.delete(`http://localhost:3001/cart/${item._id}`);
        }
      }

      // หากสั่งซื้อสำเร็จ ก็ลบเฉพาะสินค้าที่สั่งซื้อออกจากตะกร้า
      const filteredItems = items.filter((item) => !item.checked);
      setItems(filteredItems);
      setCartCount(filteredItems.length);
      setOpenPayment(false);
      Swal.fire({
        icon: "success",
        title: "การสั่งซื้อสำเร็จ",
        text: "ขอบคุณที่ทำการสั่งซื้อสินค้า",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
    } catch {
      // แสดงข้อความจาก Swal2 เมื่อเกิดข้อผิดพลาดในการ Submit
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "มีปัญหาในการสั่งซื้อสินค้า กรุณาลองใหม่ภายหลัง",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
      console.log("🚀 ~ error");
    }
  };

  const handlePaymentChange = (event) => {
    setPaymentMethod(event.target.value);
  };

  const handleCheck = (id) => {
    setItems(
      items.map((item) =>
        item._id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleCheckAll = (checked) => {
    setItems(items.map((item) => ({ ...item, checked })));
  };

  const getTotalPrice = () => {
    return items
      .filter((item) => item.checked)
      .reduce((total, item) => parseInt(total) + item.price, 0)
      .toLocaleString();
  };

  const goToSelectAddress = () => {
    setOpenAddress(true);
    setOpenPayment(false);
    setPaymentMethod("");
  };

  const handleSlipUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const totalPrice = getTotalPrice();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Container className="mt-5">
        <Paper elevation={3} sx={{ padding: 3 }}>
          <Typography variant="h4" gutterBottom className="mb-3">
            ตะกร้าสินค้า
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <input
              type="checkbox"
              className="form-check-input"
              checked={items.length > 0 && items.every((item) => item.checked)}
              onChange={(e) => handleCheckAll(e.target.checked)}
            />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>
              เลือกทั้งหมด
            </Typography>
          </Box>
          <Divider />
          <List>
            {items.map((item) => (
              <ListItem key={item._id} divider className="align-items-center">
                <ListItemAvatar>
                  <Avatar
                    alt={item.name}
                    src={`http://localhost:3001/posts/images/${item.productid}`}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                </ListItemAvatar>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={item.checked}
                  onChange={() => handleCheck(item._id)}
                />
                <ListItemText
                  primary={item.productname}
                  secondary={
                    <>
                      <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                      >
                        ราคา: {item.price.toLocaleString()} บาท
                      </Typography>
                      <Typography component="div" variant="body2">
                        จำนวน: {item.amount.toLocaleString()}
                      </Typography>
                    </>
                  }
                  sx={{ ml: 2 }}
                />
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={() => handleRemoveItem(item._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography variant="h6">
              ราคารวมทั้งหมด: {getTotalPrice()} บาท
            </Typography>
            <Button
              variant="contained"
              color="primary"
              className="btn btn-primary"
              onClick={goToSelectAddress}
              disabled={items.filter((item) => item.checked).length === 0}
              sx={{
                opacity:
                  items.filter((item) => item.checked).length === 0 ? 0.5 : 1,
              }}
            >
              ขั้นตอนต่อไป
            </Button>
          </Box>
          <Modal
            open={openAddress}
            onClose={handleCloseAddress}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <IconButton
                aria-label="close"
                onClick={handleCloseAddress}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                  เลือกที่อยู่
                </Typography>
                <List>
                  {addresses.map((address) => (
                    <ListItem
                      key={address.id}
                      button
                      onClick={() => handleSelectAddress(address)}
                      sx={{ flexDirection: "column", textAlign: "left" }}
                    >
                      <ListItemText
                        primary={address.name}
                        secondary={
                          <>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textPrimary"
                              sx={{ display: "block" }}
                            >
                              {address.address}
                            </Typography>
                            <Typography
                              component="span"
                              variant="body2"
                              color="textSecondary"
                              sx={{ display: "block" }}
                            >
                              {address.tel}
                            </Typography>
                          </>
                        }
                        sx={{ whiteSpace: "normal", textAlign: "left" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </>
            </Box>
          </Modal>
          <Modal
            open={openPayment && !openAddress}
            onClose={handleClosePayment}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <IconButton
                aria-label="close"
                onClick={handleGobackToAddress}
                sx={{
                  position: "absolute",
                  left: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <IconButton
                aria-label="close"
                onClick={handleClosePayment}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography sx={{ marginTop: '20px'}}>เลือกวิธีการชำระเงิน</Typography>
              <ListItemText
                secondary={
                  <>
                    <Typography
                      component="div"
                      variant="body2"
                      color="textPrimary"
                    >
                      <div>ชื่อ: {selectedAddress.name}</div>
                      <div>ที่อยู่: {selectedAddress.address}</div>
                      <div>เบอร์โทร: {selectedAddress.tel}</div>
                    </Typography>
                  </>
                }
                sx={{ ml: 2 }}
              />
              <Typography>ราคารวมทั้งหมด : {totalPrice} บาท</Typography>
              <RadioGroup
                aria-label="payment-method"
                defaultValue="delivery"
                name="radio-buttons-group"
                onChange={handlePaymentChange}
              >
                <FormControlLabel
                  value="ชำระเงินปลายทาง"
                  control={<Radio />}
                  label="ชำระเงินปลายทาง"
                />
                <FormControlLabel
                  value="โอนเงิน"
                  control={<Radio />}
                  label="โอนเงิน"
                />
              </RadioGroup>
              {paymentMethod === "โอนเงิน" && (
                <>
                  <Button variant="contained" component="label">
                    อัปโหลดสลิป
                    <input
                      type="file"
                      accept="image/jpeg, image/png"
                      hidden
                      onChange={handleSlipUpload}
                    />
                  </Button>
                  <Typography style={{ marginTop: "15px" }}>
                    ชื่อบัญชี: ชวิศ ธนชูเชาวน์
                  </Typography>
                  <Typography>ธนาคาร: กสิกรไทย</Typography>
                  <Typography>เลขที่บัญชี: 036-376-4835</Typography>
                  {slipImage && (
                    <Box mt={2} sx={{ textAlign: "center" }}>
                      <img
                        src={slipImage}
                        alt="Uploaded Slip"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </Box>
                  )}
                </>
              )}
              <Button
                variant="contained"
                color="primary"
                className="btn btn-primary"
                onClick={handleSubmit}
                style={{ marginTop: "20px" }}
              >
                ยืนยันคำสั่งซื้อ
              </Button>
            </Box>
          </Modal>
        </Paper>
      </Container>
    </Box>
  );
}
