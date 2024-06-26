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
  TextField,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import CloseIcon from "@mui/icons-material/Close";
import { auth } from "../Config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { useCart } from "../Component/service/CartContext";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
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
  const [openAddAddress, setOpenAddAddress] = useState(false);
  const [openPayment, setOpenPayment] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [slipImage, setSlipImage] = useState("");
  const [slipFileName, setSlipFileName] = useState("");
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [slip, setSlip] = useState(null);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    tel: "",
  });

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
    setOpenAddAddress(false);
    setOpenPayment(false);
  };

  const handleCloseAddAddress = () => {
    setOpenAddAddress(false);
    setNewAddress({ name: "", address: "", tel: "" });
  };

  const handleOpenAddAddress = () => {
    setOpenAddAddress(true);
  };

  const handleGobackToAddressFromAdd = () => {
    setOpenAddAddress(false);
    setOpenAddress(true);
  };

  const handleClosePayment = () => {
    setOpenPayment(false);
    setPaymentMethod("");
    setSlipImage("");
    setSlipFileName("");
    setPreviewImage(null);
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
    const formData = new FormData();
    let filteredItems = items.filter((item) => item.checked);

    filteredItems.forEach((item, index) => {
      formData.append(`items[${index}][productid]`, item.productid);
      formData.append(`items[${index}][productname]`, item.productname);
      formData.append(`items[${index}][category]`, item.category);
      formData.append(`items[${index}][size]`, item.size);
      formData.append(`items[${index}][price]`, item.price);
      formData.append(`items[${index}][amount]`, item.amount);
    });

    formData.append("email", user.email);
    formData.append("name", selectedAddress.name);
    formData.append("tel", selectedAddress.tel);
    formData.append("address", selectedAddress.address);
    formData.append("payment", paymentMethod);

    if (paymentMethod === "โอนเงิน") {
      formData.append("slip", slip);
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/order/upload-image",
        formData
      );

      if (response.status === 200) {
        // วนลูปในรายการ items เพื่อส่ง items._id เป็นพารามิเตอร์ในการลบ
        for (const item of filteredItems) {
          await axios.delete(`http://localhost:3001/cart/${item._id}`);
        }

        // หากสั่งซื้อสำเร็จ ก็ลบเฉพาะสินค้าที่สั่งซื้อออกจากตะกร้า
        const filteredItems1 = items.filter((item) => !item.checked);
        setItems(filteredItems1);
        setCartCount(filteredItems1.length);
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
      }
    } catch (error) {
      console.log("🚀 ~ file: Cart.js:230 ~ handleSubmit ~ error:", error);
      const errorMessage = error.response
        ? error.response.data.message
        : "มีปัญหาในการสั่งซื้อสินค้า กรุณาลองใหม่ภายหลัง";
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: errorMessage,
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
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
        setSlip(file);
        setUploadedImage(reader.result);
        setSlipFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewAddress = async () => {
    if (!newAddress.name || !newAddress.address || !newAddress.tel) {
      Swal.fire({
        icon: "warning",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 2000,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/usersinfo/", {
        ...newAddress,
        email: user.email,
      });
      setAddresses((prevAddresses) => [...prevAddresses, response.data]);
      handleCloseAddAddress();
      Swal.fire({
        icon: "success",
        title: "เพิ่มที่อยู่สำเร็จ",
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
      console.error("Error adding new address:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการเพิ่มที่อยู่",
        text: error.response?.data?.message || "กรุณาลองใหม่ภายหลัง",
        position: "top-end",
        toast: true,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 3000,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
    }
  };

  const totalPrice = getTotalPrice();

  useEffect(() => {
    if (!openPayment) {
      setSlipFileName("");
    }
  }, [openPayment]);

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
                      <Typography
                        component="div"
                        variant="body2"
                        color="textPrimary"
                      >
                        ไซส์: {item.size}
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
                      sx={{
                        flexDirection: "column",
                        textAlign: "left",
                        alignItems: "flex-start",
                      }}
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
                  <ListItem
                    button
                    sx={{ flexDirection: "row", alignItems: "center" }}
                    onClick={handleOpenAddAddress}
                  >
                    <AddCircleOutlineIcon />
                    <ListItemText
                      primary="เพิ่มที่อยู่"
                      sx={{ whiteSpace: "normal", textAlign: "left", ml: 2 }}
                    />
                  </ListItem>
                </List>
              </>
            </Box>
          </Modal>
          <Modal
            open={openAddAddress}
            onClose={handleCloseAddAddress}
            aria-labelledby="modal-add-address-title"
            aria-describedby="modal-add-address-description"
          >
            <Box sx={style}>
              <IconButton
                aria-label="close"
                onClick={handleGobackToAddressFromAdd}
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
              <Typography
                id="modal-add-address-title"
                variant="h6"
                component="h2"
                sx={{ marginTop: "20px" }}
              >
                เพิ่มที่อยู่ใหม่
              </Typography>
              <TextField
                fullWidth
                label="ชื่อ"
                value={newAddress.name}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, name: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="ที่อยู่"
                value={newAddress.address}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, address: e.target.value })
                }
                margin="normal"
              />
              <TextField
                fullWidth
                label="เบอร์โทร"
                value={newAddress.tel}
                onChange={(e) =>
                  setNewAddress({ ...newAddress, tel: e.target.value })
                }
                margin="normal"
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddNewAddress}
                >
                  บันทึก
                </Button>
              </Box>
            </Box>
          </Modal>
          <Modal
            open={openPayment && !openAddress}
            onClose={handleClosePayment}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            style={{ overflowY: slipImage ? "scroll" : "auto" }}
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
              <Typography sx={{ marginTop: "20px" }}>
                เลือกวิธีการชำระเงิน
              </Typography>
              <ListItemText
                secondary={
                  selectedAddress && (
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
                  )
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
                <Box>
                  <Typography style={{ marginTop: "15px" }}>
                    ชื่อบัญชี: ชวิศ ธนชูเชาวน์
                  </Typography>
                  <Typography>ธนาคาร: กสิกรไทย</Typography>
                  <Typography>เลขที่บัญชี: 036-376-4835</Typography>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginTop: "10px",
                    }}
                  >
                    <Button variant="contained" component="label">
                      อัปโหลดสลิป
                      <input
                        type="file"
                        accept="image/jpeg, image/png"
                        hidden
                        onChange={handleSlipUpload}
                      />
                    </Button>
                    <Typography
                      variant="body2"
                      style={{ color: "red", marginRight: "25px" }}
                    >
                      **ถ้าต้องการเปลี่ยนภาพให้อัปโหลดภาพที่ต้องการเปลี่ยนทับได้เลยครับ
                    </Typography>
                  </div>
                  {slipFileName && (
                    <div style={{ marginTop: "15px" }}>
                      <Button
                        component="label"
                        onClick={() => setPreviewImage(uploadedImage)}
                      >
                        <Typography>{slipFileName}</Typography>
                      </Button>
                    </div>
                  )}
                  {previewImage && (
                    <div
                      style={{ display: "flex", justifyContent: "flex-end" }}
                    >
                      <IconButton onClick={() => setPreviewImage(null)}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                  )}
                  {previewImage && (
                    <img
                      src={previewImage}
                      alt="Uploaded Slip"
                      style={{ maxWidth: "100%" }}
                    />
                  )}
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                >
                  ยืนยันคำสั่งซื้อ
                </Button>
              </Box>
            </Box>
          </Modal>
        </Paper>
      </Container>
    </Box>
  );
}
