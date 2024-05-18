import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2";
import axios from "axios";

const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/email/login", {
        user: username,
        pass: password,
      });

      console.log(response.data.token);

      if (response.data.isAdmin) {
        localStorage.setItem("username", username);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("currentAdmin", response.data.isAdmin);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Sign In success!",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1500,
          toast: true,
        });
        navigate("/Dashboard");
      } else {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: "Incorrect username or password!",
          showConfirmButton: false,
          timerProgressBar: true,
          timer: 1500,
          toast: true,
        });
      }
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error.response?.data?.message || "An error occurred. Please try again.";
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: errorMessage,
        showConfirmButton: false,
        timerProgressBar: true,
        timer: 1500,
        toast: true,
      });
    }
  };

  const kanitStyle = { fontFamily: "Kanit, sans-serif" };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ ...kanitStyle, height: "100vh" }}
    >
      <Form style={{ width: "300px" }} onSubmit={handleSubmit}>
        <h1 className="text-center mb-4">Admin Login</h1>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default AdminLoginPage;
