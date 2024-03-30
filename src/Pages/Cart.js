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

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setPaymentMethod("");
    setSlipImage("");
  };
  const [slipImage, setSlipImage] = useState("");

  const goToConfirmation = () => {
    handleOpen();
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
      .reduce(
        (total, item) =>
          parseInt(total) + parseInt(item.price.replace(/,/g, "")),
        0
      )
      .toLocaleString();
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
                        ราคา: {item.price} บาท
                      </Typography>
                      <Typography component="div" variant="body2">
                        จำนวน: {item.amount}
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
              onClick={goToConfirmation}
            >
              ชำระเงิน
            </Button>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                เลือกวิธีการชำระเงิน
              </Typography>
              <Typography>ราคารวมทั้งหมด : {totalPrice} บาท</Typography>
              <RadioGroup
                aria-label="payment-method"
                defaultValue="delivery"
                name="radio-buttons-group"
                onChange={handlePaymentChange}
              >
                <FormControlLabel
                  value="delivery"
                  control={<Radio />}
                  label="ชำระเงินปลายทาง"
                />
                <FormControlLabel
                  value="transfer"
                  control={<Radio />}
                  label="โอนเงิน"
                />
              </RadioGroup>
              {paymentMethod === "transfer" && (
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
                onClick={goToConfirmation}
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
