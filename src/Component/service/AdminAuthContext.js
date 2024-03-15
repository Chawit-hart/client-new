import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
    const [currentAdmin, setCurrentAdmin] = useState(JSON.parse(localStorage.getItem("currentAdmin")));
    const navigate = useNavigate();

    useEffect(() => {
        const checkSessionExpiration = () => {
          const sessionExpiration = localStorage.getItem("sessionExpiration");
          const currentTime = new Date().getTime();
      
          if (sessionExpiration && currentTime > parseInt(sessionExpiration)) {
            logout(true); // ส่ง true หาก session หมดอายุ
          }
        };
      
        // ตรวจสอบทันทีเมื่อ component ถูก mount
        checkSessionExpiration();
      
        // ตั้งค่าตรวจสอบ session หมดอายุทุกๆ 30 วินาที
        const intervalId = setInterval(checkSessionExpiration, 30000); // 30000 ms = 30 วินาที
      
        // คืนค่า cleanup function เพื่อ clear interval เมื่อ component ถูก unmount
        return () => clearInterval(intervalId);
      }, []);

    const login = async (username, password) => {
      try {
        const response = await axios.post("http://localhost:3001/email", {
          user: username,
          pass: password,
        });
        if (response.data && response.data.isAdmin) {
          const adminData = { username, ...response.data };
          const currentTime = new Date().getTime();
          const sessionExpiration = currentTime + (10 * 60 * 1000);
          localStorage.setItem("currentAdmin", JSON.stringify(adminData));
          localStorage.setItem("sessionExpiration", sessionExpiration.toString());
          setCurrentAdmin(adminData);
          navigate("/Dashboard");
        } else {
          Swal.fire("Access Denied", "You are not an admin.", "error");
        }
      } catch (error) {
        console.error("Error logging in:", error.response.data);
        Swal.fire("Login Failed", error.response.data.message, "error");
      }
    };

    const logout = (isSessionExpired = false) => {
        setCurrentAdmin(null);
        localStorage.removeItem("currentAdmin");
        localStorage.removeItem("sessionExpiration");
        if (isSessionExpired) {
          navigate('/admin-login');
          Swal.fire({
            icon: 'info',
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.',
          });
        } else {
          navigate('/admin-login');
        }
      };

    return (
      <AdminAuthContext.Provider value={{ currentAdmin, login, logout }}>
        {children}
      </AdminAuthContext.Provider>
    );
};
