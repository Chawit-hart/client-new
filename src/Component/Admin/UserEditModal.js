import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function UserEditModal({ show, handleClose, user, refreshUsers }) {
  const [username, setUsername] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.user || '');
      setUserStatus(user.userstatus || '');
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (!user || !user._id) {
      alert('User data is not loaded correctly.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }

    try {
      await axios.put(`http://localhost:3001/email/update-user/${user._id}`, {
        _id: user._id,
        pass: newPassword,
        userstatus: userStatus,
      });
      refreshUsers();
      handleClose();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
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
            <Form.Label column sm="2">Username:</Form.Label>
            <Col sm="9">
              <Form.Control
                plaintext
                readOnly
                defaultValue={username}
              />
            </Col>
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: '10px' }}>Old Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter old password"
              value={oldPassword}
              onChange={e => setOldPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: '10px' }}>New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: '10px' }}>Confirm New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label style={{ marginTop: '10px' }}>User Status</Form.Label>
            <Form.Control
              as="select"
              value={userStatus}
              onChange={e => setUserStatus(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Control>
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
