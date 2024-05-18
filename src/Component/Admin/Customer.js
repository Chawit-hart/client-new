import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CustomerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  width: 80%;
  padding: 20px;
`;

const SearchContainer = styled.div`
  margin-bottom: 20px;
  margin-top: 20px;
  width: 50%;
`;

const StyledTextField = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 20px;
    &.Mui-focused {
      border-color: #blue;
    }
  }
`;

const Customer = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/Usersinfo", {
          headers: {
            Authorization: token,
          },
        });
        setCustomers(response.data.listOfUsers);
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

    fetchCustomers();
  }, []);

  const filteredCustomers = customers.filter(
    (customer) =>
      customer._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <CustomerContainer className="container mt-5">
      <h2>Customer List</h2>
      <SearchContainer>
        <StyledTextField
          fullWidth
          variant="outlined"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </SearchContainer>
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
          {filteredCustomers.map((customer) => (
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
