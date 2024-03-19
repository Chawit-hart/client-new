import React, { useState, useEffect } from "react";
import { auth } from "../Config/firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import {
  Box,
  Typography,
  Paper,
  Container,
  Avatar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import "bootstrap/dist/css/bootstrap.min.css";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import DeleteIcon from "@mui/icons-material/Delete";

import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [selectedAddressIdForManagement, setSelectedAddressIdForManagement] =
    useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    address: "",
    tel: "",
    email: "",
    photoURL: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fetchProfileEndpoint = `http://localhost:3001/usersinfo/address?email=${currentUser.email}`;

        axios
          .get(fetchProfileEndpoint)
          .then((response) => {
            const profileInfo = response.data;
            setProfileData({
              id: profileInfo._id,
              name: profileInfo.name,
              // สมมติว่าที่อยู่อยู่ใน profileInfo.addresses และเป็นอาร์เรย์ของที่อยู่
              address: profileInfo.address, // ปรับใช้ข้อมูลให้เหมาะสม
              tel: profileInfo.tel,
              email: currentUser.email,
              photoURL: currentUser.photoURL,
            });
          })
          .catch((error) => {
            console.error("Error fetching profile data:", error);
          });
      } else {
        setUser(null);
        setProfileData({
          name: "",
          addresses: "",
          tel: "",
          email: "",
          photoURL: "",
        });
      }
    });

    return unsubscribe;
  }, []);

  const handleEditToggle = () => {
    if (editMode) {
      setEditingAddressId(null);
      setEditMode(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const editProfileEndpoint = `http://localhost:3001/usersinfo/${profileData.id}`;

    axios
      .put(editProfileEndpoint, {
        name: profileData.name,
        address: profileData.address,
        tel: profileData.tel,
      })
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        setEditMode(false);
        setEditingAddressId(null);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const handleSelectForManagement = (id) => {
    setSelectedAddressIdForManagement(
      selectedAddressIdForManagement === id ? null : id
    );
    if (editingAddressId === id) {
      setEditMode(false);
      setEditingAddressId(null);
    }
  };

  const toggleEditAddress = (id) => {
    if (editingAddressId === id) {
      setEditingAddressId(null);
      setEditMode(false);
      setSelectedAddressIdForManagement(null);
    } else {
      setEditingAddressId(id);
      setEditMode(true);
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      axios.delete(`http://localhost:3001/usersinfo/${id}`)
        .then((response) => {
          console.log(response.data.message);
        })
        .catch((error) => {
          console.error("Error deleting user:", error.response.data.error);
        });
    }
  };

  if (!user) {
    return <Typography>กรุณาล็อกอินเพื่อเข้าถึงหน้าโปรไฟล์</Typography>;
  }

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{ padding: 4, marginTop: 15, borderRadius: "15px" }}
      >
        <Typography variant="h4" gutterBottom align="center">
          หน้าโปรไฟล์
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar src={profileData.photoURL} sx={{ width: 80, height: 80 }} />
          <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 2 }}>
            {user?.email}
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="address table">
              <TableHead>
                <TableRow>
                  <TableCell>ชื่อ-นามสกุล</TableCell>
                  <TableCell align="right">ที่อยู่</TableCell>
                  <TableCell align="right">เบอร์โทร</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    {profileData.name}
                  </TableCell>
                  <TableCell align="right">{profileData.address}</TableCell>
                  <TableCell align="right">{profileData.tel}</TableCell>
                  <TableCell align="right">
                    {selectedAddressIdForManagement === profileData.id ? (
                      <>
                        <IconButton
                          onClick={() => toggleEditAddress(profileData.id)}
                          size="small"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(profileData.id)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton
                        onClick={() =>
                          handleSelectForManagement(profileData.id)
                        }
                        size="small"
                      >
                        <SettingsIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
                {editMode && editingAddressId === profileData.id && (
                  <TableRow>
                    <TableCell colSpan={4}>
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
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            mt: 2,
          }}
        >
          <IconButton color="primary" disableRipple>
            <AddIcon />
            <Typography
              variant="h6"
              sx={{
                alignSelf: "center",
              }}
            >
              เพิ่มที่อยู่
            </Typography>
          </IconButton>
        </Box>
      </Paper>
    </Container>
  );
}
