import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function UserEditModal({ show, handleClose, user, refreshUsers }) {
  const [username, setUsername] = useState("");
  const [userStatus, setUserStatus] = useState();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (user) {
      setUsername(user.user || "");
    }
  }, [user]);

  const handleSaveChanges = async () => {
    console.log("token", token);
    if (!user || !user._id) {
      Swal.fire({
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        text: "User data is not loaded correctly.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        text: "New passwords do not match!",
      });
      return;
    }

    try {
      await axios.put(
        `http://localhost:3001/email/update-user/${user._id}`,
        {
          _id: user._id,
          old: oldPassword,
          pass: newPassword,
          userStatus,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      refreshUsers();
      handleClose();
      Swal.fire({
        icon: "success",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
        text: "Password has been changed successfully.",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
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

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group as={Row} className="align-items-center">
            <Form.Label column sm="2">
              Username:
            </Form.Label>
            <Col sm="9">
              <Form.Control plaintext readOnly defaultValue={username} />
            </Col>
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: "10px" }}>Old Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: "10px" }}>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: "10px" }}>
              Confirm New Password
            </Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserEditModal;
