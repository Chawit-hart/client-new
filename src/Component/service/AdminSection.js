import React from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "./AdminAuthContext";
import AdminLayout from "../../AdminLayout";
import Swal from "sweetalert2";

const AdminSection = ({ children }) => {
  const currentAdmin = localStorage.getItem("currentAdmin");
  const username = localStorage.getItem("username");
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentAdmin) {
      navigate("/admin-login");
    }
  }, [currentAdmin, navigate]);

  React.useEffect(() => {
    if (username) {
      const socket = new WebSocket("ws://localhost:3002/", username);

      socket.onopen = () => {
        console.log("WebSocket connection established");
      };

      socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log("WebSocket message received:", message);

        if (message.type === "TOKEN_EXPIRED") {
          console.warn("Token expired, redirecting to login...");
          Swal.fire({
            title: 'Session Expired',
            text: 'Your session has expired. Please log in again.',
            icon: 'warning',
            confirmButtonText: 'OK'
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/admin-login");
            }
          });
        }
      };

      socket.onclose = () => {
        console.log("WebSocket connection closed");
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      // Cleanup on unmount
      return () => {
        socket.close();
      };
    }
  }, [username, navigate, currentAdmin]);

  return currentAdmin ? <AdminLayout>{children}</AdminLayout> : null;
};

export default AdminSection;
