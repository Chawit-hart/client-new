import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './Component/Header/navbar';
import Carousel from './Component/Body/Carousel';
import Category from './Component/Body/Category';
import Home from './Home';
import ClothingCategoryPage from './Component/Pages/ClothingCategoryPage';

const imageSlides = [
  "./Images/test1.jpeg",
  "./Images/test2.png"
];


const categories = [
  { name: 'เสื้อผ้า', imageUrl: imageSlides[0], description: 'คำอธิบาย 1' },
  { name: 'เครื่องประดับ', imageUrl: imageSlides[1], description: 'คำอธิบาย 2' },
];

const products = [
  { name: 'เสื้อผ้า 1', imageUrl: '/Images/shirt1.png', description: 'คำอธิบายสินค้า 1' },
  { name: 'เสื้อผ้า 2', imageUrl: '/Images/short1.jpg', description: 'คำอธิบายสินค้า 2' },
];

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={
          <Home>
            <Carousel slides={imageSlides} />
            <Category categories={categories} />
          </Home>
        } />
        <Route path="/category/เสื้อผ้า" element={<ClothingCategoryPage products={products} />} />
      </Routes>
    </Router>
  );
}

export default App;
