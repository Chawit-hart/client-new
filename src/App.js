import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import AdminLayout from "./AdminLayout";
import Products from "./Component/Admin/Products";
import OrderList from "./Component/Admin/OrderList";
import Order from "./Pages/Orders";

const imageSlides = ["./Images/shirt1.png", "./Images/applewatch.png"];

const categories = [
  { name: "เสื้อผ้า", imageUrl: imageSlides[0] },
  {
    name: "เครื่องประดับ",
    imageUrl: imageSlides[1]
  },
];

function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Home>
              <Carousel slides={imageSlides} />
              <Category categories={categories} />
            </Home>
          }
        />
        <Route
          path="/profile"
          element={
            <Home>
              <Profile />
            </Home>
          }
        />
        <Route
          path="/cart"
          element={
            <Home>
              <Cart />
            </Home>
          }
        />
        <Route
          path="/category/เสื้อผ้า"
          element={
            <Home>
              <ClothingCategoryPage />
            </Home>
          }
        />
        <Route
          path="/category/เครื่องประดับ"
          element={
            <Home>
              <AccPage />
            </Home>
          }
        />
        <Route
          path="/confirmation"
          element={
            <Home>
              <ConfirmationPage />
            </Home>
          }
        />
        <Route
          path="/orders"
          element={
            <Home>
              <Order />
            </Home>
          }
        />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route
          path="/Dashboard"
          element={
            <AdminLayout>
              <HomeForAdmin />
            </AdminLayout>
          }
        />
        <Route
          path="/Customers"
          element={
            <AdminLayout>
              <Customer />
            </AdminLayout>
          }
        />
        <Route
          path="/OrderList"
          element={
            <AdminLayout>
              <OrderList />
            </AdminLayout>
          }
        />
        <Route
          path="/Products"
          element={
            <AdminLayout>
              <Products />
            </AdminLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
