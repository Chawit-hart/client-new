import React, { useState, useEffect } from "react";
import Sidebar from "./component/sidebar";
import MyChart from "./component/Chart";
import AddUserModal from "./AddUserModal";
import { Button, Modal, FormControl, Form } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import axiosInstance from "../service/axiosConfig";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [data, setData] = useState({
    ProductCountSuccess: 0,
    ProductCount: 0,
    totalpriceSuccess: 0,
  });
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToEdit, setUserToEdit] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleDeleteClose = () => setShowDeleteModal(false);
  const handleDeleteShow = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };
  const handleEditClose = () => setShowEditModal(false);
  const handleEditShow = (user) => {
    setUserToEdit(user);
    setRole(user.roles); // Set the role state to the current role of the user
    setShowEditModal(true);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUsers();
      fetchDashboard();
    }
  }, [token]);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/order/dashboard",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const data = response.data;
      setData(data);
    } catch (error) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/admin-login");
        }
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get(
        "http://localhost:3001/email/check-user",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      const { users: usersData, newToken } = response.data;
      setToken(newToken); // Update token state

      if (Array.isArray(usersData)) {
        setUsers(usersData);
      } else {
        console.error("Unexpected data format:", response.data);
        setUsers([]);
      }

      const storedUsername = localStorage.getItem("username");

      if (storedUsername) {
        const currentUserData = usersData.find(
          (user) => user.user === storedUsername
        );
        setCurrentUser(currentUserData);
        setUsername(storedUsername);
      }
    } catch (error) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/admin-login");
        }
      });
    }
  };

  const addUser = async (userData) => {
    try {
      const response = await axiosInstance.post(
        "http://localhost:3001/email/user",
        userData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const { newToken } = response.data;
      setToken(newToken); // Update token state
      fetchUsers();
    } catch (error) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/admin-login");
        }
      });
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await axiosInstance.delete(
        `http://localhost:3001/email/delete-user/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const { newToken } = response.data;
      setToken(newToken); // Update token state
      fetchUsers();
    } catch (error) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/admin-login");
        }
      });
    }
  };

  const updateUser = async (userId, updatedData) => {
    try {
      const response = await axiosInstance.put(
        `http://localhost:3001/email/update-user/${userId}`,
        updatedData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const { newToken } = response.data;
      setToken(newToken); // Update token state

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...updatedData } : user
        )
      );
    } catch (error) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/admin-login");
        }
      });
    }
  };

  const handleEditSubmit = (event) => {
    event.preventDefault();
    if (userToEdit) {
      updateUser(userToEdit._id, { roles: role }).then(() => {
        handleEditClose();
        Swal.fire({
          icon: "success",
          toast: true,
          text: "User updated successfully!",
          position: "top-end",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1500,
          didOpen: (toast) => {
            toast.style.marginTop = "70px";
          },
        });
      });
    }
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete._id);
      handleDeleteClose();
      Swal.fire({
        icon: "success",
        toast: true,
        text: "User deleted successfully!",
        position: "top-end",
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500,
        didOpen: (toast) => {
          toast.style.marginTop = "70px";
        },
      });
    }
  };

  const chartData = {
    labels: ["Monthly Sales", "Total Products", "Total"],
    datasets: [
      {
        data: [
          data.ProductCountSuccess,
          data.ProductCount,
          data.totalpriceSuccess,
        ],
        backgroundColor: ["#007bff", "#28a745", "#ffc107"],
        borderColor: ["#007bff", "#28a745", "#ffc107"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        ticks: {
          type: "logarithmic",
          callback: function (value, index, values) {
            return Number(value.toString());
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const cardStyle = (backgroundColor) => ({
    backgroundColor: backgroundColor,
    color: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  });

  const pageStyle = {
    fontFamily: "Kanit, sans-serif",
  };

  const filteredUsers =
    searchQuery === ""
      ? users
      : users.filter(
          (user) =>
            user._id.includes(searchQuery) || user.user.includes(searchQuery)
        );

  return (
    <div className="container-fluid" style={pageStyle}>
      <div className="row">
        <div className="col-md-2">
          <Sidebar currentUser={currentUser} refreshUsers={fetchUsers} />
        </div>
        <div className="col-md-10">
          <div>
            <h1 className="my-4 text-center">
              Welcome {username} to Admin Dashboard
            </h1>
          </div>
          <div className="row text-center justify-content-center">
            <div className="col-md-3 mb-4">
              <div className="card h-100" style={cardStyle("#007bff")}>
                <div className="card-body">
                  <h5 className="card-title">Monthly Sales</h5>
                  <p className="card-text">{data.ProductCountSuccess} items</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100" style={cardStyle("#28a745")}>
                <div className="card-body">
                  <h5 className="card-title">Total Products</h5>
                  <p className="card-text">{data.ProductCount} items</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100" style={cardStyle("#ffc107")}>
                <div className="card-body">
                  <h5 className="card-title">Total Revenue</h5>
                  <p className="card-text">{data.totalpriceSuccess} บาท</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: "400px", marginTop: "100px" }}>
            <MyChart
              data={chartData}
              options={chartOptions}
              chartId="myChart"
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              marginTop: "20px",
            }}
          >
            <h2>รายชื่อผู้ใช้</h2>
            {currentUser && currentUser.roles === "admin" && (
              <Button variant="primary" onClick={handleShow}>
                Add User
              </Button>
            )}
          </div>
          <FormControl
            type="text"
            placeholder="Search by UID or Username"
            className="mb-4"
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ borderRadius: "20px" }}
          />
          <AddUserModal
            show={show}
            handleClose={handleClose}
            addUser={addUser}
            refreshUsers={fetchUsers}
          />
          {filteredUsers.length > 0 ? (
            <table className="table table-hover">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">UID</th>
                  <th scope="col">User</th>
                  <th scope="col">Role</th>
                  {currentUser && currentUser.roles === "admin" && (
                    <th scope="col">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index}>
                    <td>{user._id}</td>
                    <td>{user.user}</td>
                    <td>{user.roles}</td>
                    {currentUser && currentUser.roles === "admin" && (
                      <td>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleEditShow(user)}
                          style={{ marginRight: "10px" }}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDeleteShow(user)}
                        >
                          <FaTrash />
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>ไม่พบสิ่งที่ค้นหา</p>
          )}
        </div>
      </div>
      <Modal show={showDeleteModal} onHide={handleDeleteClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete user {userToDelete?.user}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showEditModal} onHide={handleEditClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </Form.Control>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              style={{ marginTop: "15px" }}
            >
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
