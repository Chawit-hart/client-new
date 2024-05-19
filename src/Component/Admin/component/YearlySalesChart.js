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

const YearlySalesChart = () => {
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

  // สร้างอาร์เรย์สำหรับเดือนที่มีค่าเริ่มต้นเป็น 0
  const salesByMonthAndCategory = {};
  const categories = new Set();

  salesData.forEach((item) => {
    const monthIndex = item._id.month - 1; // เดือนในข้อมูล API มีค่า 1-12 แปลงเป็น index 0-11
    const category = item._id.category;
    categories.add(category);
    
    if (!salesByMonthAndCategory[category]) {
      salesByMonthAndCategory[category] = Array(12).fill(0);
    }

    salesByMonthAndCategory[category][monthIndex] += item.totalSales;
  });

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
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: Array.from(categories).map((category, index) => ({
      label: category,
      data: salesByMonthAndCategory[category],
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
        text: "Monthly Sales by Category for the Current Year",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#333",
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleFont: {
          size: 16,
          weight: "bold",
        },
        bodyFont: {
          size: 14,
        },
        footerFont: {
          size: 12,
        },
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
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default YearlySalesChart;
