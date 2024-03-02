import React, { useState, useEffect } from "react";
import Sidebar from "./component/sidebar";
import MyChart from "./component/Chart";
import axios from "axios";

const AdminDashboard = () => {
  const [data, setData] = useState({
    ProductCountSuccess: 0,
    ProductCount: 0,
    totalpriceSuccess: 0,
  });

  useEffect(() => {
    const Data = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/order/dashboard"
        );
        setData(response.data);
      } catch (error) {
        console.error("There was an error fetching the dashboard:", error);
      }
    };
    Data();
  }, []);

  console.log("data", data);

  const chartData = {
    labels: ["Monthly Sales", "Total Products", "Total"],
    datasets: [
      {
        data: [
          data.ProductCountSuccess,
          data.ProductCount,
          data.totalpriceSuccess,
        ],
        backgroundColor: ["#007bff", "#28a745", "#ffc107"],
        borderColor: ["#007bff", "#28a745", "#ffc107"],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        ticks: {
          type: 'logarithmic',
          callback: function (value, index, values) {
            return Number(value.toString());
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const cardStyle = (backgroundColor) => ({
    backgroundColor: backgroundColor,
    color: "#fff",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  });

  const pageStyle = {
    fontFamily: "Kanit, sans-serif",
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
          <div className="row text-center justify-content-center">
            <div className="col-md-3 mb-4">
              <div className="card h-100" style={cardStyle("#007bff")}>
                <div className="card-body">
                  <h5 className="card-title">Monthly Sales</h5>
                  <p className="card-text">{data.ProductCountSuccess} items</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100" style={cardStyle("#28a745")}>
                <div className="card-body">
                  <h5 className="card-title">Total Products</h5>
                  <p className="card-text">{data.ProductCount} items</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4">
              <div className="card h-100" style={cardStyle("#ffc107")}>
                <div className="card-body">
                  <h5 className="card-title">Total Revenue</h5>
                  <p className="card-text">{data.totalpriceSuccess} บาท</p>
                </div>
              </div>
            </div>
          </div>
          <div style={{ height: "400px", marginTop: "100px" }}>
            <MyChart
              data={chartData}
              options={chartOptions}
              chartId="myChart"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
