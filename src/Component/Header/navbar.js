import React, { useState, useCallback, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { auth } from "../../Config/firebaseConfig";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import ListAltIcon from "@mui/icons-material/ListAlt";
import styled from "styled-components";

const ListItemIcon = styled.div`
  margin-right: 10px;
`;

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToHome = () => {
    navigate("/");
  };

  const goToProfile = () => {
    navigate("/profile");
  };

  const goToCart = () => {
    navigate("/cart");
  };

  const goToOrders = () => {
    navigate("/Orders");
  };

  const signInWithGoogle = useCallback(() => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    signInWithPopup(auth, provider)
      .then((result) => {
        setAnchorEl(null);
        setUser(result.user);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Sign In success!",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1500,
          toast: true,
          didOpen: (toast) => {
            toast.style.marginTop = "70px";
          },
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
              marginLeft: "250px",
              fontSize: "25px",
              cursor: "pointer",
            }}
            onClick={goToHome}
          >
            Adshop
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Button
              variant="h6"
              onClick={goToHome}
              sx={{
                fontFamily: "Kanit",
                color: "black",
                fontSize: "20px",
              }}
            >
              Home
            </Button>
            {user ? (
              <>
                <Button
                  endIcon={<ExpandMoreIcon />}
                  variant="h6"
                  onClick={handleMenuOpen}
                  sx={{
                    fontFamily: "Kanit",
                    color: "black",
                    fontSize: "18px",
                  }}
                >
                  {user.displayName || user.email}
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem
                    sx={{
                      fontSize: "16px",
                    }}
                    onClick={goToProfile}
                  >
                    <ListItemIcon>
                      <AccountCircleIcon />
                    </ListItemIcon>
                    Profile
                  </MenuItem>
                  <MenuItem
                    sx={{
                      fontSize: "16px",
                    }}
                    onClick={goToOrders}
                  >
                    <ListItemIcon>
                      <ListAltIcon />
                    </ListItemIcon>
                    Orders
                  </MenuItem>
                  <MenuItem
                    sx={{
                      fontSize: "16px",
                    }}
                    onClick={goToCart}
                  >
                    <ListItemIcon>
                      <ShoppingCartIcon />
                    </ListItemIcon>
                    Cart
                  </MenuItem>
                  <MenuItem
                    sx={{
                      fontSize: "16px",
                    }}
                    onClick={handleSignOut}
                  >
                    <ListItemIcon>
                      <ExitToAppIcon />
                    </ListItemIcon>
                    Sign Out
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                onClick={signInWithGoogle}
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
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}