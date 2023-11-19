import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          boxShadow: "none",
          backgroundColor: "transparent",
          color: "black",
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "none", md: "flex" } }}
          >
            <MenuIcon sx={{ color: "black" }} />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontFamily: "'Kanit', sans-serif",
              fontWeight: "bold",
              color: "black",
              textAlign: "center",
            }}
          >
            Name or Logo
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Button
              variant="h6"
              sx={{
                fontFamily: "Kanit",
                color: "black",
                fontSize: "18px",
              }}
            >
              Home
            </Button>
            <Button
              variant="h6"
              sx={{
                fontFamily: "Kanit",
                color: "black",
                fontSize: "18px",
              }}
            >
              Product
            </Button>
            <Button
              variant="h6"
              color="inherit"
              sx={{
                fontFamily: "Kanit",
                color: "black",
                fontSize: "18px",
              }}
            >
              Sign In
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
