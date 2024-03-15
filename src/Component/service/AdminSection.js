import React from 'react';
import { AdminAuthProvider } from './AdminAuthContext';
import AdminLayout from '../../AdminLayout';

const AdminSection = ({ children }) => {
  return (
    <AdminAuthProvider>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AdminAuthProvider>
  );
};

export default AdminSection;