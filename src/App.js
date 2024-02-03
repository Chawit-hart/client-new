import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
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
import Products from './Component/Admin/Products'

const imageSlides = ["./Images/test1.jpeg", "./Images/test2.png"];

const categories = [
  { name: "เสื้อผ้า", imageUrl: imageSlides[0], description: "คำอธิบาย 1" },
  {
    name: "เครื่องประดับ",
    imageUrl: imageSlides[1],
    description: "คำอธิบาย 2",
  },
];

const products = [
  {
    id: 1,
    name: "เสื้อผ้า 1",
    imageUrl: "/Images/shirt1.png",
    description: "คำอธิบายสินค้า 1",
  },
  {
    id: 2,
    name: "เสื้อผ้า 2",
    imageUrl: "/Images/short1.jpg",
    description: "คำอธิบายสินค้า 2",
  },
  {
    id: 3,
    name: "เสื้อผ้า 3",
    imageUrl: "/Images/short1.jpg",
    description: "คำอธิบายสินค้า 3",
  },
];

const Accproducts = [
  {
    id: 1,
    name: "เครื่องประดับ 1",
    imageUrl: "/Images/shirt1.png",
    description: "คำอธิบายสินค้า 1",
  },
  {
    id: 2,
    name: "เครื่องประดับ 2",
    imageUrl: "/Images/short1.jpg",
    description: "คำอธิบายสินค้า 2",
  },
  {
    id: 3,
    name: "เครื่องประดับ 3",
    imageUrl: "/Images/short1.jpg",
    description: "คำอธิบายสินค้า 3",
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
        <Route path="/profile" element={<Home><Profile /></Home>} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/category/เสื้อผ้า"
          element={<Home><ClothingCategoryPage products={products} /></Home>}
        />
        <Route
          path="/category/เครื่องประดับ"
          element={<Home><AccPage products={Accproducts} /></Home>}
        />
        <Route path="/confirmation" element={<Home><ConfirmationPage /></Home>} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/Dashboard" element={<AdminLayout><HomeForAdmin /></AdminLayout>} />
        <Route path="/Customers" element={<AdminLayout><Customer /></AdminLayout>} />
        <Route path="/Products" element={<AdminLayout><Products /></AdminLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
