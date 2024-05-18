import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from "axios";
import UserEditModal from '../UserEditModal';

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  font-family: 'Kanit', sans-serif;
  background-color: white;
  z-index: 100;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  transition: transform 0.3s ease-in-out;
`;

const HamburgerButton = styled.div`
  position: fixed;
  top: 15px;
  left: 15px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 200;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 10px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  span {
    display: block;
    width: 25px;
    height: 3px;
    background-color: black;
    margin: 3px 0;
    transition: transform 0.3s ease, opacity 0.3s ease;
  }

  span:nth-child(1) {
    transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none')};
  }

  span:nth-child(2) {
    opacity: ${({ isOpen }) => (isOpen ? '0' : '1')};
  }

  span:nth-child(3) {
    transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none')};
  }
`;

const Title = styled.div`
  padding: 20px;
  font-size: 2.3em;
  text-align: center;
`;

const ListGroup = styled.ul`
  margin-top: 10px;
  padding-right: 20px;
`;

const ListItem = styled.li`
  padding: 30px 20px;
  display: flex;
  align-items: center;
  border: none;
  font-size: 1.2em;
  cursor: pointer;
  
  &:hover {
    background-color: #f0f0f0;
    border-radius: 10px;
  }
`;

const UsernameContainer = styled.div`
  position: absolute;
  bottom: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const Icon = styled.i`
  cursor: pointer;
  font-size: 1.3em;
  padding: 10px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: #f8f9fa;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  bottom: 60px;
  right: 0;
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 101;
  width: 170px;
  padding: 10px;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
    border-radius: 10px;
  }
`;

const Sidebar = ({ currentUser, refreshUsers }) => {
  const [username, setUsername] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [editShow, setEditShow] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const handleToDashboard = () => {
    navigate('/Dashboard');
  };

  const handleToCustomer = () => {
    navigate('/Customers');
  };

  const handleToProduct = () => {
    navigate('/Products');
  };

  const handleToOrderList = () => {
    navigate('/OrderList');
  };

  const handleLogout = () => {
    console.log('Logging out...');
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("currentAdmin");
    navigate('/admin-login');
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleSettings = () => {
    setEditShow(true);
    setShowDropdown(false); // ปิด Dropdown เมื่อเปิด modal edit
  };

  const handleEditClose = () => {
    setEditShow(false);
  };

  useEffect(() => {
    const savedUsername = localStorage.getItem("username");

    if (savedUsername) {
      setUsername(savedUsername);
    } else {
      const fetchUserData = async () => {
        try {
          const response = await axios.get('http://localhost:3001/email/check-user');
          if (response.data && response.data.username) {
            localStorage.setItem("username", response.data.username);
            setUsername(response.data.username);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      };

      fetchUserData();
    }
  }, []);

  return (
    <>
      <HamburgerButton onClick={() => setSidebarOpen(!isSidebarOpen)} isOpen={isSidebarOpen}>
        <span></span>
        <span></span>
        <span></span>
      </HamburgerButton>
      <SidebarContainer isOpen={isSidebarOpen}>
        <Title style={{ marginTop: '50px' }}>AdminPanel</Title>
        <ListGroup>
          <ListItem onClick={handleToDashboard}>
            <i className="bi bi-speedometer2 me-2"></i>Dashboard
          </ListItem>
          <ListItem onClick={handleToCustomer}>
            <i className="bi bi-people me-2"></i>Customers
          </ListItem>
          <ListItem onClick={handleToOrderList}>
            <i className="bi bi-clipboard me-2"></i>Order list
          </ListItem>
          <ListItem onClick={handleToProduct}>
            <i className="bi bi-bag me-2"></i>Products
          </ListItem>
        </ListGroup>
        <UsernameContainer>
          <span>{username}</span>
          <IconContainer>
            <Icon className="bi bi-gear" onClick={toggleDropdown}></Icon>
            {showDropdown && (
              <DropdownMenu>
                <DropdownItem onClick={handleSettings}>Change Password</DropdownItem>
              </DropdownMenu>
            )}
            <Icon className="bi bi-box-arrow-right" onClick={handleLogout}></Icon>
          </IconContainer>
        </UsernameContainer>
        {currentUser && (
          <UserEditModal
            show={editShow}
            handleClose={handleEditClose}
            user={currentUser}
            refreshUsers={refreshUsers}
          />
        )}
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
