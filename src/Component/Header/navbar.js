import React, { useState, useCallback } from "react";
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { auth } from "../../Config/firebaseConfig";

export default function Navbar() {

  const [user, setUser] = useState(null);
  
  const signInWithGoogle = useCallback(() => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        setUser(result.user); // อัปเดตสถานะของผู้ใช้
      }).catch((error) => {
        console.error(error);
      });
  }, [setUser]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: "none",
          backgroundColor: "white",
          color: "black",
        }}
        elevation={0}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
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
            Adshop
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
            <Button onClick={signInWithGoogle}
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
