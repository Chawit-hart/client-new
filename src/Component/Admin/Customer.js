import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const CustomerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 80%;
  padding: 20px;
`;


const Customer = () => {

  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:3001/Usersinfo');
        setCustomers(response.data);
      } catch (error) {
        console.error('มีปัญหาในการดึงข้อมูล:', error);
      }
    };

    fetchCustomers();
  }, []);


  return (
    <CustomerContainer className="container mt-5">
      <h2>Customer List</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th scope="col">Uid</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Address</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td scope="row">{customer._id}</td>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.tel}</td>
              <td>{customer.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CustomerContainer>
  );
};

export default Customer;
