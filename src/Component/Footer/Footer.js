import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Box, Container, Grid, Link, Typography } from "@mui/material";

const Footer = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigateToHome = () => {
      navigate("/");
    };

    const handleNavigateToClothing = () => {
      navigate("/category/เสื้อผ้า");
    };

    const handleNavigateToAcc = () => {
      navigate("/category/เครื่องประดับ");
    };

    document
      .getElementById("home-link")
      .addEventListener("click", handleNavigateToHome);

    document
      .getElementById("clothing-link")
      .addEventListener("click", handleNavigateToClothing);

    document
      .getElementById("acc-link")
      .addEventListener("click", handleNavigateToAcc);

    return () => {
      document
        .getElementById("home-link")
        .removeEventListener("click", handleNavigateToHome);

      document
        .getElementById("clothing-link")
        .removeEventListener("click", handleNavigateToClothing);

      document
        .getElementById("acc-link")
        .removeEventListener("click", handleNavigateToAcc);
    };
  }, [navigate]);

  return (
    <Box
      component="footer"
      sx={{ backgroundColor: "#282c34", color: "white", py: 3, fontFamily: 'Kanit', }}
    >
      <Container
        maxWidth="lg"
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Grid container spacing={4} sx={{ fontFamily: 'Kanit'}}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontFamily: 'Kanit'}}>เกี่ยวกับเรา</Typography>
            <Typography variant="body1" sx={{ fontFamily: 'Kanit'}}>
              ยินดีต้อนรับสู่ Adshop -
              ร้านค้าออนไลน์ที่มุ่งเน้นในการขายเสื้อผ้าและเครื่องประดับสำหรับคนรุ่นใหม่
              และนักช้อปปิ้งทุกคนที่คุณสามารถค้นหาสินค้าแฟชั่นที่ทันสมัยและหรูหราได้ที่นี่
            </Typography>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Typography variant="h6">ลิงก์</Typography>
            <Link
              color="inherit"
              id="home-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                marginBottom: "-10px", // ปรับค่านี้ตามที่คุณต้องการ
              }}
            >
              <HomeIcon sx={{ mr: 1 }} /> หน้าหลัก
            </Link>
            <br />
            <Link
              color="inherit"
              id="clothing-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                marginBottom: "-10px", // ปรับค่านี้ตามที่คุณต้องการ
              }}
            >
              <ShoppingCartIcon sx={{ mr: 1 }} /> เสื้อผ้า
            </Link>
            <br />
            <Link
              color="inherit"
              id="acc-link"
              style={{
                cursor: "pointer",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                marginBottom: "-10px", // ปรับค่านี้ตามที่คุณต้องการ
              }}
            >
              <AttachMoneyIcon sx={{ mr: 1 }} /> เครื่องประดับ
            </Link>
          </Grid>

          <Grid item xs={12} sm={4} >
            <Typography variant="h6" sx={{ fontFamily: 'Kanit'}}>ติดต่อเรา</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "white",
                mb: 1,
              }}
            >
              <LocationOnIcon sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ fontFamily: 'Kanit'}}>
                มหาวิทยาลัยเทคโนโลยีราชมงคลกรุงเทพ เลขที่ 2 ถนนนางลิ้นจี่
                แขวงทุ่งมหาเมฆ เขตสาทร กรุงเทพฯ 10120
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                color: "white",
                mb: 1,
              }}
            >
              <MailOutlineIcon sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ fontFamily: 'Kanit'}}>
                <Link
                  href="mailto:635021000206@mail.rmutk.ac.th"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  635021000206@mail.rmutk.ac.th
                </Link>
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", color: "white" }}>
              <PhoneIcon sx={{ mr: 1 }} />
              <Typography variant="body1" sx={{ fontFamily: 'Kanit'}}>
                โทร: 02-287-9600 ต่อ 1520-1523
              </Typography>
            </Box>
          </Grid>
        </Grid>
        <Typography variant="body2" sx={{ mt: 3, fontFamily: 'Kanit' }}>
          © 2023 Adshop
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
