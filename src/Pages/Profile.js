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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [profileData, setProfileData] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    address: "",
    tel: "",
    email: "",
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fetchProfileEndpoint = `http://localhost:3001/usersinfo/address?email=${currentUser.email}`;
        axios
          .get(fetchProfileEndpoint)
          .then((response) => {
            const profileInfos = response.data;
            setProfileData(profileInfos);
            console.log("response.data---->", response.data);
          })
          .catch((error) => {
            console.error("Error fetching profile data:", error);
          });
      } else {
        setUser(null);
        setProfileData([]);
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
    const { name, value } = e.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    setNewAddress((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();

    const editProfileEndpoint = `http://localhost:3001/usersinfo/${editingAddressId}`;

    axios
      .put(editProfileEndpoint, {
        name: newAddress.name,
        address: newAddress.address,
        tel: newAddress.tel,
      })
      .then((response) => {
        console.log("Profile updated successfully:", response.data);
        setEditMode(false);
        setEditingAddressId(null);
        // อัปเดตข้อมูลโปรไฟล์หลังจากที่แก้ไข
        fetchAddresses();
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const handleSaveAddress = async () => {
    if (!user) {
      console.error("No user logged in.");
      return;
    }

    const addressData = {
      ...newAddress,
      email: user.email,
    };

    try {
      await axios.post("http://localhost:3001/usersinfo/", addressData);

      // รีเซ็ต newAddress เพื่อให้ฟอร์มว่าง
      setNewAddress({ name: "", address: "", tel: "" });

      // ดึงข้อมูลที่อยู่อัปเดต
      fetchAddresses();

      handleCloseAddressModal();
    } catch (error) {
      console.error("Error adding new address:", error);
    }
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

  const handleEditClick = (profile) => {
    setNewAddress({
      name: profile.name,
      address: profile.address,
      tel: profile.tel,
    });
    setEditMode(true);
    setEditingAddressId(profile._id);
  };

  const fetchAddresses = async () => {
    if (user && user.email) {
      try {
        const response = await axios.get(
          `http://localhost:3001/usersinfo/address?email=${user.email}`
        );
        setProfileData(response.data);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        if (error.response && error.response.status === 404) {
          setProfileData([]);
        }
      }
    }
  };



  const toggleEditAddress = (id) => {
    console.log("🚀 ~ file: Profile.js:166 ~ toggleEditAddress ~ id:", id);
    console.log("editAddressId---->", editingAddressId);
    if (editingAddressId === id) {
      setEditingAddressId(null);
      setEditMode(false);
      setSelectedAddressIdForManagement(null);
    } else {
      setEditingAddressId(id);
      setEditMode(true);
      handleEditClick(profileData.find((profile) => profile._id === id));
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      axios.delete(`http://localhost:3001/usersinfo/${id}`)
        .then((response) => {
          console.log(response.data.message);
          setProfileData(currentData => currentData.filter(profile => profile._id !== id));
        })
        .catch((error) => {
          console.error("Error deleting user:", error.response.data.error);
        });
    }
  };


  const handleOpenAddressModal = () => {
    setIsAddressModalOpen(true);
  };

  const handleCloseAddressModal = () => {
    setIsAddressModalOpen(false);
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
          <Avatar src={user.photoURL} sx={{ width: 80, height: 80 }} />
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
                {Object.values(profileData).map((profile) => (
                  <TableRow key={profile._id}>
                    <TableCell component="th" scope="row">
                      {profile.name}
                    </TableCell>
                    <TableCell align="right">{profile.address}</TableCell>
                    <TableCell align="right">{profile.tel}</TableCell>
                    <TableCell align="right">
                      {selectedAddressIdForManagement === profile._id ? (
                        <>
                          <IconButton
                            onClick={() => toggleEditAddress(profile._id)}
                            size="small"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(profile._id)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      ) : (
                        <IconButton
                          onClick={() => handleSelectForManagement(profile._id)}
                          size="small"
                        >
                          <SettingsIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {editMode &&
                  profileData.some(
                    (profile) => profile._id === editingAddressId
                  ) && (
                    <TableRow>
                      <TableCell colSpan={4}>
                        <form
                          onSubmit={handleSubmitEdit}
                          className="bg-light p-3 border rounded"
                        >
                          <TextField
                            label="ชื่อนามสกุล"
                            name="name"
                            value={newAddress.name}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="ที่อยู่"
                            name="address"
                            value={newAddress.address}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                          />
                          <TextField
                            label="เบอร์โทร"
                            name="tel"
                            value={newAddress.tel}
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
          <IconButton
            color="primary"
            onClick={handleOpenAddressModal}
            disableRipple
          >
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
      <Dialog open={isAddressModalOpen} onClose={handleCloseAddressModal}>
        <DialogTitle>เพิ่มที่อยู่ใหม่</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="ชื่อ-นามสกุล"
            value={newAddress.name}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="address"
            label="ที่อยู่"
            type="text"
            value={newAddress.address}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            id="tel"
            label="เบอร์โทร"
            type="tel"
            value={newAddress.tel}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressModal}>ยกเลิก</Button>
          <Button onClick={handleSaveAddress}>บันทึก</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
