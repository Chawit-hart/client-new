import React, { useState, useCallback } from "react";
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { auth } from "../../Config/firebaseConfig";
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const goToHome = () => {
    navigate('/');
  };

  const signInWithGoogle = useCallback(() => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result);
        setUser(result.user);
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Sign In success!',
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1500,
          toast: true,
          didOpen: (toast) => {
            toast.style.marginTop = '70px';
          }
        });
      }).catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      setUser(null);
      navigate('/');
    }).catch((error) => {
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
            }}
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
                fontSize: "18px",
              }}
            >
              Home
            </Button>
            {user ? (
              <>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: "Kanit",
                    color: "black",
                    fontSize: "18px",
                  }}
                >
                  {user.displayName || user.email}
                </Typography>
                <Button onClick={handleSignOut}
                  variant="h6"
                  color="inherit"
                  sx={{
                    fontFamily: "Kanit",
                    color: "black",
                    fontSize: "18px",
                  }}
                >
                  
                  Sign Out
                </Button>
              </>
            ) : (
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
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
