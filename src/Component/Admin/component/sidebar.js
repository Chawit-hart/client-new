import React from 'react';

const Sidebar = () => {
  // Inline styles
  const sidebarStyle = {
    width: '250px',
    height: '100vh', // ให้ sidebar มีสูงเท่ากับ viewport
    position: 'fixed',
    top: 0,
    left: 0,
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
    overflowY: 'auto',
    fontFamily: 'Kanit, sans-serif'
  };

  const listGroupStyle = {
    marginTop: '20px',
  };

  const listItemStyle = {
    padding: '30px 20px', // เพิ่ม padding เพื่อเพิ่มความสูงและความกว้าง
    display: 'flex',
    alignItems: 'center',
    border: 'none',
    fontSize: '1.2em'
  };

  const titleStyle = {
    padding: '20px', // Padding สำหรับข้อความ
    fontSize: '2.3em', // ขนาดตัวอักษร
    textAlign: 'center', // จัดให้อยู่ตรงกลาง
  };

  return (
    <div style={sidebarStyle}>
        <div style={titleStyle}>AdminPanel</div>
      <ul className="list-group" style={listGroupStyle}>
      <li className="list-group-item list-group-item-action" style={listItemStyle}>
          <i className="bi bi-speedometer2 me-2"></i>Dashboard
        </li>
        <li className="list-group-item list-group-item-action" style={listItemStyle}>
          <i className="bi bi-people me-2"></i>Customers
        </li>
        <li className="list-group-item list-group-item-action" style={listItemStyle}>
          <i className="bi bi-bag me-2"></i>Products
        </li>
        <li className="list-group-item list-group-item-action" style={listItemStyle}>
          <i className="bi bi-bar-chart me-2"></i>Reports
        </li>
        <li className="list-group-item list-group-item-action" style={listItemStyle}>
          <i className="bi bi-gear me-2"></i>Settings
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
