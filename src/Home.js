import React from "react";
import Footer from "./Component/Footer/Footer";
import Navbar from "./Component/Header/navbar";

function Home({ children }) {
  return (
    <div>
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}

export default Home;