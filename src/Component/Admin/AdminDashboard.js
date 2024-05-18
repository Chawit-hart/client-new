import React, { useState, useEffect } from "react";
import Sidebar from "./component/sidebar";
import MyChart from "./component/Chart";
import AddUserModal from "./AddUserModal";
import { Button } from "react-bootstrap";
import { FaTrash, FaEdit } from "react-icons/fa";
import axiosInstance from "../service/axiosConfig";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [show, setShow] = useState(false);
  const [data, setData] = useState({
    ProductCountSuccess: 0,
    ProductCount: 0,
    totalpriceSuccess: 0,
  });
  const [username, setUsername] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axiosInstance.get(
        "http://localhost:3001/email/check-user",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );

      setUsers(response.data);
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) {
        const currentUserData = response.data.find(
          (user) => user.user === storedUsername
        );
        setCurrentUser(currentUserData);
        setUsername(storedUsername);
      }
    } catch (error) {
      console.error("มีข้อผิดพลาดในการดึงข้อมูลผู้ใช้:", error);
    }
  };

  const addUser = async (userData) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post("http://localhost:3001/email/user", userData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      fetchUsers();
    } catch (error) {
      console.error("มีข้อผิดพลาดในการเพิ่มผู้ใช้:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axiosInstance.delete(
        `http://localhost:3001/email/delete-user/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      fetchUsers();
    } catch (error) {
      console.error("มีข้อผิดพลาดในการลบผู้ใช้:", error);
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

  const editUser = (user) => {
    console.log("Editing user:", user);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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
            <Button variant="primary" onClick={handleShow}>
              Add User
            </Button>
          </div>
          <AddUserModal
            show={show}
            handleClose={handleClose}
            addUser={addUser}
            refreshUsers={fetchUsers}
          />
          <table className="table table-hover">
            <thead className="thead-dark">
              <tr>
                <th scope="col">UID</th>
                <th scope="col">User</th>
                <th scope="col">Status</th>
                {currentUser && currentUser.roles === "admin" && (
                  <th scope="col">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td>{user._id}</td>
                  <td>{user.user}</td>
                  <td>{user.roles}</td>
                  {currentUser && currentUser.roles === "admin" && (
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => deleteUser(user._id)}
                      >
                        <FaTrash />
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => editUser(user)}
                      >
                        <FaEdit />
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
