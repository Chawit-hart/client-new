import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

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

const Sidebar = () => {
  const navigate = useNavigate();

  const handleToDashboard = () => {
    navigate('/Dashboard')
  }

  const handleToCustomer = () => {
    navigate('/Customers');
  };

  const handleToProduct = () => {
    navigate('/Products')
  }

  const handleToOrderList = () => {
    navigate('/OrderList')
  }

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
    </SidebarContainer>
  );
};

export default Sidebar;
