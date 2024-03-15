import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AdminAuthContext = createContext();

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }) => {
    const [currentAdmin, setCurrentAdmin] = useState(null);

    const login = async (username, password) => {
        try {
            const response = await axios.post('http://localhost:3001/email/user', { username, password });
            setCurrentAdmin(response.data.admin);
            console.log(currentAdmin)
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };

    const logout = () => {
        setCurrentAdmin(null);
    };

    return (
        <AdminAuthContext.Provider value={{ currentAdmin, login, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};
