import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
  const [currentAdmin, setCurrentAdmin] = useState(
    JSON.parse(localStorage.getItem("currentAdmin"))
  );
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const newCurrentAdmin = JSON.parse(localStorage.getItem("currentAdmin"));
      setCurrentAdmin(newCurrentAdmin);
    };

    window.addEventListener("storage", handleStorageChange);

    // Cleanup function
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <AdminAuthContext.Provider value={{ currentAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
