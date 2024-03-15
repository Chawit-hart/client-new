import React, { useState, useEffect } from "react";
import { auth } from "../Config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  Grid,
  Container,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "",
    address: "",
    tel: "",
    email: ""
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Endpoint สำหรับดึงข้อมูลโปรไฟล์โดยใช้ email
        const fetchProfileEndpoint = `http://localhost:3001/usersinfo/address?email=${currentUser.email}`;
  
        // เรียก API เพื่อดึงข้อมูลโปรไฟล์
        axios.get(fetchProfileEndpoint)
          .then(response => {
            const profileInfo = response.data;
            setProfileData({
              name: profileInfo.name,
              address: profileInfo.address,
              tel: profileInfo.tel,
              email: currentUser.email
            });
          })
          .catch(error => {
            console.error('Error fetching profile data:', error);
          });
      } else {
        setUser(null);
        setProfileData({
          name: "",
          address: "",
          tel: "",
          email: ""
        });
      }
    });
  
    return unsubscribe;
  }, []);

  const handleEditToggle = () => {
    setEditMode(!editMode);
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const AddProfileEndpoint = 'http://localhost:3001/usersinfo';
  
    axios.post(AddProfileEndpoint, {
      email: user.email,
      name: profileData.name,
      address: profileData.address,
      tel: profileData.tel,
    })
    .then(response => {
      console.log('Profile updated successfully:', response.data);
      setEditMode(false);
    })
    .catch(error => {
      console.error('Error updating profile:', error);
    });
  };

  if (!user) {
    return <Typography>กรุณาล็อกอินเพื่อเข้าถึงหน้าโปรไฟล์</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Container>
        <Paper elevation={3} sx={{ padding: 3, marginTop: 5, borderRadius: "20px" }}>
          <Typography variant="h4" gutterBottom>
            หน้าโปรไฟล์
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
              <Typography variant="h6">
                  อีเมล์: {user?.email}
                </Typography>
                <Typography variant="h6">
                  ชื่อนามสกุล: {profileData.name}
                </Typography>
                <Typography variant="h6">
                  ที่อยู่: {profileData.address}
                </Typography>
                <Typography variant="h6">
                  เบอร์โทร: {profileData.tel}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditToggle}
                  sx={{ marginTop: 2 }}
                >
                  แก้ไขโปรไฟล์
                </Button>
              </Grid>
              {editMode && (
                <Grid item xs={12} md={6}>
                  {/* ฟอร์มแก้ไขข้อมูลโปรไฟล์ */}
                  <form
                    onSubmit={handleSubmit}
                    className="bg-light p-3 border rounded"
                  >
                    <TextField
                      label="ชื่อนามสกุล"
                      name="name"
                      value={profileData.name}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="ที่อยู่"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <TextField
                      label="เบอร์โทร"
                      name="tel"
                      value={profileData.tel}
                      onChange={handleChange}
                      fullWidth
                      margin="normal"
                    />
                    <div className="text-center">
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                      >
                        บันทึก
                      </Button>
                      <Button
                        onClick={handleEditToggle}
                        variant="contained"
                        color="error"
                        sx={{ marginTop: 2, marginLeft: 2 }}
                      >
                        ยกเลิก
                      </Button>
                    </div>
                  </form>
                </Grid>
              )}
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
