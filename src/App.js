import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminAuthProvider } from "./Component/service/AdminAuthContext";
import "./App.css";
import Carousel from "./Component/Body/Carousel";
import Category from "./Component/Body/Category";
import Home from "./Home";
import ClothingCategoryPage from "./Pages/ClothingCategoryPage";
import ConfirmationPage from "./Pages/ConfirmationPage";
import AccPage from "./Pages/AccPage";
import Profile from "./Pages/Profile";
import Cart from "./Pages/Cart";
import AdminLoginPage from "./Component/Admin/AdminLoginPage";
import HomeForAdmin from "./Component/Admin/HomeForAdmin";
import Customer from "./Component/Admin/Customer";
import Products from "./Component/Admin/Products";
import OrderList from "./Component/Admin/OrderList";
import Order from "./Pages/Orders";
import AdminSection from "./Component/service/AdminSection";
import Announcement from "./Component/Body/Announcement";

const imageSlides = ["./Images/shirt1.png", "./Images/applewatch.png"];

const categories = [
  { name: "เสื้อผ้า", imageUrl: imageSlides[0] },
  {
    name: "เครื่องประดับ",
    imageUrl: imageSlides[1],
  },
];

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Home><Announcement /><Carousel slides={imageSlides} /><Category categories={categories} /></Home>} />
          <Route path="/profile" element={<Home><Profile /></Home>} />
          <Route path="/cart" element={<Home><Cart /></Home>} />
          <Route path="/category/เสื้อผ้า" element={<Home><ClothingCategoryPage /></Home>} />
          <Route path="/category/เครื่องประดับ" element={<Home><AccPage /></Home>} />
          <Route path="/confirmation" element={<Home><ConfirmationPage /></Home>} />
          <Route path="/orders" element={<Home><Order /></Home>} />
          <Route path="/admin-login" element={<AdminLoginPage />} />
          {/* ต่อไปนี้คือ routes ที่ป้องกันด้วย AdminSection */}
          <Route path="/Dashboard" element={<AdminSection><HomeForAdmin /></AdminSection>} />
          <Route path="/Customers" element={<AdminSection><Customer /></AdminSection>} />
          <Route path="/OrderList" element={<AdminSection><OrderList /></AdminSection>} />
          <Route path="/Products" element={<AdminSection><Products /></AdminSection>} />
        </Routes>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;
