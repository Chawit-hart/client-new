import "./App.css";
import Carousel from "./Component/Body/Carousel";
import Category from "./Component/Body/Category";
import Footer from "./Component/Footer/Footer";
import Navbar from "./Component/Header/navbar";

const imageSlides = [
  "./Images/test1.jpeg",
  "./Images/test2.png"
];

const categories = [
  { name: 'เสื้อผ้า', imageUrl: imageSlides[0], description: 'คำอธิบาย 1' },
  { name: 'เครื่องประดับ', imageUrl: imageSlides[1], description: 'คำอธิบาย 2' },
];


function App() {
  return (
    <div className="App">
      <Navbar />
      <Carousel slides={imageSlides} />
      <Category categories={categories} />
      <Footer />
    </div>
  );
}

export default App;
