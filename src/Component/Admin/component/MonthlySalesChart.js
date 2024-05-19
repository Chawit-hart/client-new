import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlySalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/order/dashboard",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        setSalesData(response.data.orders);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, [token]);

  const currentMonth = new Date().getMonth() + 1; // เดือนปัจจุบัน (0-based index) ดังนั้นต้อง +1
  const currentYear = new Date().getFullYear(); // ปีปัจจุบัน

  // กรองข้อมูลสำหรับเดือนและปีปัจจุบัน
  const filteredSalesData = salesData.filter(
    (item) => item._id.month === currentMonth && item._id.year === currentYear
  );

  // สร้างข้อมูลยอดขายรายวันแยกตามหมวดหมู่
  const categories = [...new Set(filteredSalesData.map((item) => item._id.category))];
  const dailySalesByCategory = categories.reduce((acc, category) => {
    acc[category] = Array.from({ length: 30 }, (_, i) => {
      const day = i + 1;
      const sale = filteredSalesData.find(
        (item) => item._id.day === day && item._id.category === category
      );
      return sale ? sale.totalSales : 0;
    });
    return acc;
  }, {});

  const colors = [
    "rgba(255, 99, 132, 0.6)",
    "rgba(54, 162, 235, 0.6)",
    "rgba(255, 206, 86, 0.6)",
    "rgba(75, 192, 192, 0.6)",
    "rgba(153, 102, 255, 0.6)",
    "rgba(255, 159, 64, 0.6)",
    "rgba(199, 199, 199, 0.6)",
    "rgba(83, 102, 255, 0.6)",
    "rgba(255, 99, 255, 0.6)",
    "rgba(140, 159, 64, 0.6)",
    "rgba(240, 240, 102, 0.6)",
    "rgba(100, 100, 100, 0.6)",
  ];

  const data = {
    labels: Array.from({ length: 30 }, (_, i) => i + 1), // สร้าง labels วันที่ 1-30
    datasets: categories.map((category, index) => ({
      label: category,
      data: dailySalesByCategory[category],
      backgroundColor: colors[index % colors.length],
      borderColor: colors[index % colors.length].replace("0.6", "1"),
      borderWidth: 1,
    })),
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
      },
      title: {
        display: true,
        text: "Daily Sales by Category for the Current Month",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#333",
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#333",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(200, 200, 200, 0.3)",
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "#333",
          callback: function(value) {
            if (Number.isInteger(value)) {
              return value;
            }
          }
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default MonthlySalesChart;
