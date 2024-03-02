import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { auth } from "../Config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const Container = styled.div`
  margin: 20px;
`;

const Image = styled.img`
  width: 60px;
  height: auto;
`;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser ] = useState();

  useEffect(() => {
    const fetchOrders = async (email) => {
      try {
        const response = await axios.get(`http://localhost:3001/order/email/?email=${email}`);
        setOrders(response.data);
      } catch (error) {
        console.error("There was an error fetching the orders:", error);
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        fetchOrders(currentUser.email);
      } else {
        setUser(null);
        setOrders([]);
      }
    });
  
    return () => unsubscribe();
  }, []);

  const formatTimeToBangkok = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Asia/Bangkok'
    }).format(date);
  };
  

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Order List
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple order table">
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Image</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Order Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow
                key={order._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{order._id}</TableCell>
                <TableCell>
                  <Image src={`http://localhost:3001/posts/images/${order.productid}`} alt="product" />
                </TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.productname}</TableCell>
                <TableCell>{order.amount}</TableCell>
                <TableCell>{order.totalprice}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.payment}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{formatTimeToBangkok(order.ordertime)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Order;
