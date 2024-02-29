import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  Menu,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import UpdateIcon from "@mui/icons-material/Update";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import axios from "axios";
import { InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const OrderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 20px;
  margin-left: 300px;
  margin-top: 50px;
  height: 100vh;
  text-align: center;
`;

const BodyWrapper = styled.div`
  margin-top: 30px;
`;

const StyledTextField = styled(TextField)`
  width: 50%;
  & .MuiOutlinedInput-root {
    border-radius: 20px;
    &:hover {
      border: 0.5px solid #blue;
    }
    &.Mui-focused {
      border: 0.5px solid #blue;
      box-shadow: 0 0 0 1px rgba(0, 0, 255, 0.2);
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  margin-top: 20px;
`;

const DeleteButtonContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
`;

const OrderList = () => {
  const [Orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [slipUrl, setSlipUrl] = useState("");
  const [selected, setSelected] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/order");
      setOrders(response.data);
    } catch (error) {
      console.error("There was an error fetching the order data:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchSlip = async (postId) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/order/slip/${postId}`,
        {
          responseType: "blob",
        }
      );
      const url = URL.createObjectURL(response.data);
      setSlipUrl(url);
    } catch (error) {
      console.error("There was an error fetching the slip:", error);
    }
  };

  const formatTimeToBangkok = (dateString) => {
    const date = new Date(dateString);
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Bangkok",
    };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const handleClickOpen = (order) => {
    handleCloseMenu();
    setSelectedOrder(order);
    fetchSlip(order._id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = Orders.map((n) => n._id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleStatusClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setCurrentOrder(order);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleUpdateStatus = async (status) => {
    if (currentOrder && currentOrder._id) {
      try {
        const response = await axios.put(
          `http://localhost:3001/order/update/${currentOrder._id}`,
          {
            status: status,
          }
        );
        console.log(response.data.message);
        setStatusDialogOpen(false);
        fetchOrders();
        Swal.fire({
          icon: "success",
          title: "Order status updated successfully.",
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
        console.error("There was an error updating the order status:", error);
        Swal.fire({
          icon: "error",
          title: "Failed to update order status.",
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
    }
  };

  const handleOpenStatusDialog = (order) => {
    handleCloseMenu();
    setCurrentOrder(order);
    setStatusDialogOpen(true);
  };

  const handleCloseStatusDialog = () => {
    setStatusDialogOpen(false);
  };

  const handleStatusChange = (event) => {
    setOrderStatus(event.target.value);
  };

  const handleDeleteOrder = async (order) => {
    handleCloseMenu();
    // แสดงข้อความยืนยันก่อนการลบ
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you really want to delete this order?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (result.isConfirmed) {
      // ผู้ใช้คลิกที่ "Yes, delete it!"
      try {
        await axios.delete(`http://localhost:3001/order/${order._id}`);
        Swal.fire({
          icon: "success",
          title: "Order deleted successfully",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1500,
          didOpen: (toast) => {
            toast.style.marginTop = "70px";
          },
        });
        setOrders(Orders.filter((o) => o._id !== order._id));
      } catch (error) {
        console.error("Error deleting order:", error);
      }
      Swal.fire({
        icon: "error",
        title: "Failed to delete order",
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

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOrders = Orders.filter((order) => {
    const searchFields = ["email", "productid", "productname", "name"];
    return searchFields.some((field) =>
      order[field].toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleDeleteSelectedOrders = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });
  
    if (result.isConfirmed) {
      try {
        await Promise.all(selected.map(orderId => axios.delete(`http://localhost:3001/order/${orderId}`)));
        
        setOrders(Orders.filter(order => !selected.includes(order._id)));
        setSelected([]);
  
        Swal.fire({
          icon: "success",
          title: "Your selected orders have been deleted.",
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
        console.error("Error deleting orders:", error);
        Swal.fire({
          icon: "error",
          title: "There was a problem deleting your orders.",
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
    }
  };

  return (
    <OrderContainer>
      <h2>Order Management</h2>
      <SearchContainer>
        <StyledTextField
          label="Search Orders"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>
      <DeleteButtonContainer>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleDeleteSelectedOrders}
        disabled={selected.length === 0}
      >
        Delete Selected
      </Button>
    </DeleteButtonContainer>
      <BodyWrapper>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < Orders.length
                    }
                    checked={
                      Orders.length > 0 && selected.length === Orders.length
                    }
                    onChange={handleSelectAllClick}
                    inputProps={{
                      "aria-label": "select all orders",
                    }}
                  />
                </TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Product ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Action</TableCell>{" "}
                {/* Added Action column for the button */}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order, index) => {
                const isItemSelected = isSelected(order._id);
                const isCOD = order.payment === "ชำระเงินปลายทาง";
                return (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    selected={isItemSelected}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isItemSelected}
                        onChange={(event) => handleClick(event, order._id)}
                        inputProps={{
                          "aria-labelledby": `enhanced-table-checkbox-${index}`,
                        }}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {order.email}
                    </TableCell>
                    <TableCell>{order.name}</TableCell>
                    <TableCell>{order.productid}</TableCell>
                    <TableCell>{order.productname}</TableCell>
                    <TableCell>{order.category}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>{order.totalprice} บาท</TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>{order.tel}</TableCell>
                    <TableCell>{order.payment}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell>
                      {formatTimeToBangkok(order.ordertime)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        onClick={(event) => handleStatusClick(event, order)}
                        startIcon={<SettingsIcon />}
                      >
                        Manage
                      </Button>
                      <Menu
                        id="status-menu"
                        anchorEl={anchorEl}
                        open={
                          Boolean(anchorEl) &&
                          currentOrder &&
                          currentOrder._id === order._id
                        }
                        onClose={handleCloseMenu}
                      >
                        <MenuItem onClick={() => handleOpenStatusDialog(order)}>
                          <UpdateIcon
                            fontSize="small"
                            style={{ marginRight: 8 }}
                          />{" "}
                          Update status
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleClickOpen(order)}
                          disabled={isCOD}
                        >
                          <VisibilityIcon
                            fontSize="small"
                            style={{ marginRight: 8 }}
                          />{" "}
                          Check slip
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteOrder(order)}>
                          <DeleteIcon
                            fontSize="small"
                            style={{ marginRight: 8 }}
                          />
                          Delete
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </BodyWrapper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "10px" }}>
            สลิปการสั่งซื้อ:
          </DialogContentText>
          {slipUrl && (
            <img src={slipUrl} alt="Order Slip" style={{ width: "100%" }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ปิด</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={statusDialogOpen} onClose={handleCloseStatusDialog}>
        <DialogTitle>Update Order Status</DialogTitle>
        <DialogContent>
          <RadioGroup value={orderStatus} onChange={handleStatusChange}>
            <FormControlLabel
              value="กำลังดำเนินการ"
              control={<Radio />}
              label="กำลังดำเนินการ"
            />
            <FormControlLabel
              value="ปฏิเสธ"
              control={<Radio />}
              label="ปฏิเสธ"
            />
            <FormControlLabel
              value="สำเร็จ"
              control={<Radio />}
              label="สำเร็จ"
            />
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseStatusDialog}>Cancel</Button>
          <Button onClick={() => handleUpdateStatus(orderStatus)}>Save</Button>
        </DialogActions>
      </Dialog>
    </OrderContainer>
  );
};

export default OrderList;
