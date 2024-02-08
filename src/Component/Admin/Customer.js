import React from 'react';
import styled from 'styled-components';

const CustomerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 80%;
  padding: 20px;
`;


const customers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', address: '123 Main St, Anytown, AS 12345' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '098-765-4321', address: '456 Maple Ave, Othertown, AS 67890' },
];

const Customer = () => {
  return (
    <CustomerContainer className="container mt-5">
      <h2>Customer Management</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Address</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <th scope="row">{customer.id}</th>
              <td>{customer.name}</td>
              <td>{customer.email}</td>
              <td>{customer.phone}</td>
              <td>{customer.address}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </CustomerContainer>
  );
};

export default Customer;
