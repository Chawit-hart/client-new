import React, { useState, useEffect, Fragment } from "react";
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
  IconButton,
} from "@mui/material";
import { auth } from "../Config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Pagination } from "antd";

const Container = styled.div`
  margin: 20px;
`;

const Image = styled.img`
  width: 60px;
  height: auto;
`;

const CircleBadge = styled.span`
  position: absolute;
  top: -10px;
  right: -10px;
  width: 20px;
  height: 20px;
  background-color: #ffeb3b;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333;
  font-size: 12px;
  font-weight: bold;
`;

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState();
  const [open, setOpen] = useState({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    const fetchOrders = async (email) => {
      try {
        const response = await axios.get(
          `http://localhost:3001/order/email/?email=${email}`
        );
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

  const handleToggle = (id) => {
    setOpen((prevOpen) => {
      const updatedOpen = { ...prevOpen };
      Object.keys(updatedOpen).forEach((orderId) => {
        if (orderId !== id) {
          updatedOpen[orderId] = false; // ปิด DropDown ที่ไม่ใช่ DropDown ที่เปิดอยู่
        }
      });
      return {
        ...updatedOpen,
        [id]: !prevOpen[id],
      };
    });
  };

  const formatTimeToBangkok = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Bangkok",
    }).format(date);
  };

  const getTrackingUrl = (provider, trackingNumber) => {
    switch (provider) {
      case "Thai Post":
        return `https://track.thailandpost.co.th/?trackNumber=${trackingNumber}`;
      case "DHL":
        return `https://www.dhl.com/th-en/home/tracking.html?tracking-id=${trackingNumber}`;
      case "Kerry Express":
        return `https://th.kerryexpress.com/th/track/?track=${trackingNumber}`;
      case "J&T Express":
        return `https://www.jtexpress.co.th/index/query/gzquery.html?billcode=${trackingNumber}`;
      case "Flash Express":
        return `https://flashexpress.com/fle/tracking?se=${trackingNumber}`;
      default:
        return "#";
    }
  };

  const handleChangePage = (pageNumber, pageSize) => {
    setPage(pageNumber);
    setPageSize(pageSize);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ marginTop: "80px" }}>
        Order List
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple order table">
          <TableHead>
            <TableRow>
              <TableCell>No.</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Size</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Price</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>tracking Number</TableCell>
              <TableCell>Order Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(pageSize > 0
              ? orders.slice(
                  (page - 1) * pageSize,
                  (page - 1) * pageSize + pageSize
                )
              : orders
            ).map((order) => (
              <Fragment key={order._id}>
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.name}</TableCell>
                  <TableCell>{order.items[0].productname}</TableCell>
                  <TableCell>{order.items[0].size}</TableCell>
                  <TableCell>{order.items[0].amount}</TableCell>
                  <TableCell>{order.totalprice}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.payment}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {order.parcel}
                    <a
                      href={getTrackingUrl(order.provider, order.parcel)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <OpenInNewIcon
                        style={{
                          verticalAlign: "middle",
                          height: "15px",
                          color: "#A9A9A9",
                        }}
                      />
                    </a>
                  </TableCell>
                  <TableCell>{formatTimeToBangkok(order.ordertime)}</TableCell>
                  <TableCell>
                    {order.items.length > 1 && (
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleToggle(order._id)}
                      >
                        {open[order._id] ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                        {order.items.length > 1 && !open[order._id] && (
                          <CircleBadge>+{order.items.length - 1}</CircleBadge>
                        )}
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
                {open[order._id] && order.items.length > 1 && (
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={12}
                    >
                      <Table aria-label="purchases">
                        <TableBody>
                          {order.items.slice(1).map((item, index) => (
                            <TableRow key={index}>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell>{order.name}</TableCell>
                              <TableCell>{item.productname}</TableCell>
                              <TableCell>{item.size}</TableCell>
                              <TableCell>{item.amount}</TableCell>
                              <TableCell>{order.totalprice}</TableCell>
                              <TableCell>{order.address}</TableCell>
                              <TableCell>{order.payment}</TableCell>
                              <TableCell>{order.status}</TableCell>
                              <TableCell>
                                {order.parcel}
                                <a
                                  href={getTrackingUrl(
                                    order.provider,
                                    order.parcel
                                  )}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <OpenInNewIcon
                                    style={{
                                      verticalAlign: "middle",
                                      height: "15px",
                                      color: "#A9A9A9",
                                    }}
                                  />
                                </a>
                              </TableCell>
                              <TableCell>
                                {formatTimeToBangkok(order.ordertime)}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Pagination
        showSizeChanger
        pageSizeOptions={[5, 10, 25]}
        onChange={handleChangePage}
        onShowSizeChange={handleChangePage}
        current={page}
        total={orders.length}
        pageSize={pageSize}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        style={{ marginTop: "20px" }}
      />
    </Container>
  );
};

export default Order;
