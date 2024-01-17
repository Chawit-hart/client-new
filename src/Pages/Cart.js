import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
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
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Cart() {
    const navigate = useNavigate();
  const [items, setItems] = useState([
    {
      id: 1,
      name: "สินค้า 1",
      price: 1000,
      checked: false,
      image: "/Images/shirt1.png",
    },
    {
      id: 2,
      name: "สินค้า 2",
      price: 1500,
      checked: false,
      image: "/Images/shirt1.png",
    },
    {
      id: 3,
      name: "สินค้า 3",
      price: 500,
      checked: false,
      image: "/Images/shirt1.png",
    },
  ]);

  const goToConfirmation = () => {
    navigate('/confirmation');
  };

  const handleCheck = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const handleCheckAll = (checked) => {
    setItems(items.map((item) => ({ ...item, checked })));
  };

  const getTotalPrice = () => {
    return items
      .filter((item) => item.checked)
      .reduce((total, item) => total + item.price, 0);
  };

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
              checked={items.every((item) => item.checked)}
              onChange={(e) => handleCheckAll(e.target.checked)}
            />
            <Typography variant="subtitle1" sx={{ ml: 1 }}>เลือกทั้งหมด</Typography>
          </Box>
          <Divider />
          <List>
            {items.map((item) => (
              <ListItem key={item.id} divider className="align-items-center">
                <ListItemAvatar>
                  <Avatar
                    alt={item.name}
                    src={item.image}
                    sx={{ width: 56, height: 56, mr: 2 }}
                  />
                </ListItemAvatar>
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={item.checked}
                  onChange={() => handleCheck(item.id)}
                />
                <ListItemText
                  primary={item.name}
                  secondary={`ราคา: ${item.price} บาท`}
                  sx={{ ml: 2 }}
                />
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
        </Paper>
      </Container>
    </Box>
  );
}
