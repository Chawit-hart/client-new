import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from "axios";

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

const Sidebar = () => {
  const [ username, setUsername ] = useState("");

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
    navigate('/admin-login');
  };

  const handleSettings = () => {
    navigate('/settings');
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
    <SidebarContainer>
      <Title>AdminPanel</Title>
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
          <Icon className="bi bi-gear" onClick={handleSettings}></Icon>
          <Icon className="bi bi-box-arrow-right" onClick={handleLogout}></Icon>
        </IconContainer>
      </UsernameContainer>
    </SidebarContainer>
  );
};

export default Sidebar;
