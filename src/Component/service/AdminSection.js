import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from './AdminAuthContext';
import AdminLayout from '../../AdminLayout';

const AdminSection = ({ children }) => {
  const { currentAdmin } = useAdminAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!currentAdmin) {
      navigate('/admin-login');
    }
  }, [currentAdmin, navigate]);

  return currentAdmin ? (
    <AdminLayout>
      {children}
    </AdminLayout>
  ) : null;
};

export default AdminSection;
