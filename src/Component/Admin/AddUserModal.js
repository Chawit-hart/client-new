import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import axios from 'axios';

const AddUserModal = ({ show, handleClose, refreshUsers }) => {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRepassword] = useState('');
  const [userstatus, setUserStatus] = useState('');
  const [errors, setErrors] = useState({
    user: false,
    password: false,
    repassword: false,
    userstatus: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่าทุกช่องถูกกรอกหรือไม่
    const newErrors = {
      user: user === '',
      password: password === '',
      repassword: repassword === '',
      userstatus: userstatus === ''
    };
    setErrors(newErrors);

    // ถ้ามีช่องไหนที่ไม่ได้กรอกจะไม่ดำเนินการต่อ
    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    if (password === repassword) {
      const userData = {
        user,
        pass: password,
        userstatus
      };

      console.log('Submitting user data:', userData); // เพิ่ม log เพื่อตรวจสอบข้อมูล

      try {
        const token = localStorage.getItem("token");
        const response = await axios.post('http://localhost:3001/email/user', userData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: token
          }
        });
        console.log('API response:', response.data);
        refreshUsers();
        handleClose();
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'User added successfully!',
        });
        setUser('');
        setPassword('');
        setRepassword('');
        setUserStatus('');
      } catch (error) {
        console.error('Error adding user:', error); // เพิ่ม log เพื่อตรวจสอบข้อผิดพลาด
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: `Failed to add user! ${error.response ? error.response.data : error.message}`,
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Passwords do not match!',
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add New User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label style={{ color: errors.user ? 'red' : 'inherit' }}>User</Form.Label>
            <Form.Control
              type="text"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: '5px', color: errors.password ? 'red' : 'inherit' }}>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: '5px', color: errors.repassword ? 'red' : 'inherit' }}>Re-enter Password</Form.Label>
            <Form.Control
              type="password"
              value={repassword}
              onChange={(e) => setRepassword(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: '5px', color: errors.userstatus ? 'red' : 'inherit' }}>Select User Status</Form.Label>
            <Form.Control
              as="select"
              value={userstatus}
              onChange={(e) => setUserStatus(e.target.value)}
              required
            >
              <option value='' disabled>Please select user status</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </Form.Group>
          <Button variant="primary" type="submit" style={{ marginTop: '20px'}}>
            Add User
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddUserModal;
