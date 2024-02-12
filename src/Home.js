import React from "react";
import { useLocation } from "react-router-dom";
import Footer from "./Component/Footer/Footer";
import Navbar from "./Component/Header/navbar";

function Home({ children }) {
  const location = useLocation();

  const appContainerStyle = {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  };

  const contentWrapStyle = {
    flex: 1,
  };

  const footerStyle = {
    marginTop: "100px",
  };

  return (
    <div style={appContainerStyle}>
      {location.pathname !== "/admin-login" && <Navbar />}
      <div style={contentWrapStyle}>{children}</div>
      <div style={footerStyle}>
        <Footer />
      </div>
    </div>
  );
}

export default Home;
