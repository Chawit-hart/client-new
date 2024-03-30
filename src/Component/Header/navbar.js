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
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import { useCart } from "../service/CartContext";
import debounce from "lodash/debounce";
import axios from "axios";

const ListItemIcon = styled.div`
  margin-right: 10px;
`;

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    borderRadius: "20px",
    "& fieldset": {
      borderColor: "grey",
    },
    "&:hover fieldset": {
      borderColor: "black",
    },
    "&.Mui-focused fieldset": {
      borderColor: "blue",
    },
  },
});

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const { cartCount } = useCart();
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

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

  const debouncedSearch = useCallback(
    debounce(async (query) => {
      try {
        const response = await fetch(
          `http://localhost:3001/posts/?search=${query}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setSearchResults(data || []);
      } catch (error) {
        console.error("Error searching:", error);
        setSearchResults([]);
      }
    }, 500),
    []
  );

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      debouncedSearch(query);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const goToHome = () => {
    handleMenuClose();
    navigate("/");
  };

  const goToProfile = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const goToCart = () => {
    handleMenuClose();
    navigate("/cart");
  };

  const goToOrders = () => {
    handleMenuClose();
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

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm.trim()) {
      return text;
    }
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, index) => part.toLowerCase() === searchTerm.toLowerCase()
      ? <span key={index} style={{ 
        backgroundColor: 'rgba(63,81,181,0.2)', // สีพื้นหลังโปร่งใส
        borderRadius: '3px', // มุมโค้งน้อยลง
        padding: '0px 2px', // ระยะห่างภายในเล็กลง
        fontWeight: 'bold', // หนา
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', // เงา
        color: '#3f51b5', // สีตัวอักษร
      }}>
          {part}
        </span>
      : part);
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
          <StyledTextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            sx={{ marginLeft: "30px" }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          {searchResults.length > 0 && (
            <Box
              sx={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                right: 0,
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
                zIndex: 999,
                maxWidth: "300px",
                marginLeft: "50px",
                width: "100%",
                maxHeight: "200px", // กำหนดความสูงสูงสุดของผลลัพธ์เพื่อให้เกิดการเลื่อนเมื่อมีผลลัพธ์มาก
                overflowY: "auto", // ให้มีการเลื่อนเมื่อมีผลลัพธ์มาก
              }}
            >
              {searchResults.map((result) => (
                <MenuItem
                  key={result._id}
                  onClick={() => {
                    navigate(`/product/${result._id}`);
                    handleMenuClose();
                  }}
                  sx={{ display: "flex", alignItems: "center", gap: "8px" }}
                >
                  <img
                    src={`http://localhost:3001/posts/images/${result._id}`}
                    alt={result.name} // ใส่ alt สำหรับความสำคัญ
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: "8px",
                    }} // ปรับขนาดและขอบของรูปภาพ
                  />
                  <Typography variant="body1">
                    {highlightSearchTerm(result.name, searchQuery)}
                  </Typography>
                </MenuItem>
              ))}
            </Box>
          )}

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
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="h6"
              onClick={goToHome}
              sx={{
                fontFamily: "Kanit",
                color: "black",
                fontSize: "20px",
                marginLeft: "170px",
              }}
            >
              Home
            </Button>
            <IconButton
              onClick={goToCart}
              sx={{
                color: "black",
              }}
            >
              <Badge
                badgeContent={cartCount}
                color="error"
                invisible={cartCount === 0}
              >
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
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
                    textTransform: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {user?.photoURL && (
                    <Box
                      component="img"
                      src={user.photoURL}
                      alt="Profile"
                      referrerPolicy="no-referrer"
                      sx={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        marginRight: 1,
                      }}
                    />
                  )}
                  {user.displayName || "Sign In"}
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
