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
} from "@mui/material";
import axios from "axios";

const OrderContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 20px;
  margin-left: 300px;
  margin-top: 50px;
  height: 100vh;
  display: flex;
  text-align: center;
`;

const BodyWrapper = styled.div`
  margin-top: 30px;
`;

const OrderList = () => {
  const [Orders, setOrders] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [slipUrl, setSlipUrl] = useState("");

  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:3001/order");
      setOrders(response.data);
      console.log(Orders);
    } catch (error) {
      console.error("There was an error fetching the order data:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchSlip = async (postId) => {
    try {
      const response = await axios.get(`http://localhost:3001/order/slip/${postId}`, {
        responseType: "blob",
      });
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
    setSelectedOrder(order);
    fetchSlip(order._id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <OrderContainer>
      <h2>Order Management</h2>
      <BodyWrapper>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Prduct ID</TableCell>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Time</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Orders.map((order, index) => (
                <TableRow
                  key={index}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
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
                  <TableCell>{formatTimeToBangkok(order.ordertime)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      onClick={() => handleClickOpen(order)}
                    >
                      ดูสลิป
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </BodyWrapper>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Order Details</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ marginBottom: "10px" }}>สลิปการสั่งซื้อ:</DialogContentText>
          {slipUrl && (
            <img src={slipUrl} alt="Order Slip" style={{ width: "100%" }} />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>ปิด</Button>
        </DialogActions>
      </Dialog>
    </OrderContainer>
  );
};

export default OrderList;