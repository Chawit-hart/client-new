// AdminLayout.js
import React from 'react';
import Sidebar from './Component/Admin/component/sidebar';

const AdminLayout = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="flex-grow-1">{children}</div>
    </div>
  );
};

export default AdminLayout;
