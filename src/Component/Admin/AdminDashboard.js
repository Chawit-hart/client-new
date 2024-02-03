import React from 'react';
import Sidebar from './component/sidebar';
import MyChart from './component/Chart';

const AdminDashboard = () => {
  const data = {
    monthlySales: 150,
    totalProducts: 1200,
    totalRevenue: 50000,
    totalProfit: 20000
  };

  const chartData = {
    labels: ["Monthly Sales", "Total Products", "Total Revenue", "Total Profit"],
    datasets: [{
      label: "Data",
      data: [data.monthlySales, data.totalProducts, data.totalRevenue, data.totalProfit],
      backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
      borderColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"],
      borderWidth: 1
    }]
  };

  const chartOptions = {
    scales: {
      y: [{
        ticks: {
          beginAtZero: true
        }
      }]
    },
    legend: {
      display: true,
      position: 'top'
    },
    responsive: true,
    maintainAspectRatio: false
  };

  const cardStyle = (backgroundColor) => ({
    backgroundColor: backgroundColor,
    color: '#fff',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
  });

  const pageStyle = {
    fontFamily: 'Kanit, sans-serif',
  };

  return (
    <div className="container-fluid" style={pageStyle}>
      <div className="row">
        <div className="col-md-2">
          <Sidebar />
        </div>
        <div className="col-md-10">
        <div>
        <h1 className="my-4 text-center">Welcome to Admin Dashboard</h1>
          </div>
          <div className="row text-center">
            <div className="col-md-3 mb-4">
              <div className="card h-100" style={cardStyle('#007bff')}>
                <div className="card-body">
                  <h5 className="card-title">Monthly Sales</h5>
                  <p className="card-text">{data.monthlySales} items</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100" style={cardStyle('#28a745')}>
                <div className="card-body">
                  <h5 className="card-title">Total Products</h5>
                  <p className="card-text" >{data.totalProducts} items</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100" style={cardStyle('#ffc107')}>
                <div className="card-body">
                  <h5 className="card-title">Total Revenue</h5>
                  <p className="card-text">${data.totalRevenue}</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100" style={cardStyle('#dc3545')}>
                <div className="card-body">
                  <h5 className="card-title">Total Profit</h5>
                  <p className="card-text">${data.totalProfit}</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: '400px', marginTop: '100px' }}>
            <MyChart data={chartData} options={chartOptions} chartId="myChart" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
