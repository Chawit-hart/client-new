import React, { useState, useEffect } from 'react';
import { Box, Paper, Button } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const Carousel = ({ slides = [] }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const buttonStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '50%',
    padding: '10px',
  };

  return (
    <Paper elevation={0} square style={{ position: 'relative', marginTop: '64px' }}>
      <Box>
        {slides.map((slide, index) => (
          <div key={index} style={{ display: index === activeSlide ? 'block' : 'none', position: 'relative' }}>
            <img src={slide} alt={`Slide ${index}`} style={{ width: '100%', height: 'auto', objectFit: 'contain', maxHeight: '500px', marginTop: "20px", marginBottom: "20px" }} />
          </div>
        ))}
      </Box>
      <Button 
        onClick={() => setActiveSlide((activeSlide - 1 + slides.length) % slides.length)}
        style={{ ...buttonStyle, left: '10px' }}
      >
        <ArrowBackIosIcon />
      </Button>
      <Button 
        onClick={() => setActiveSlide((activeSlide + 1) % slides.length)}
        style={{ ...buttonStyle, right: '10px' }}
      >
        <ArrowForwardIosIcon />
      </Button>
    </Paper>
  );
};

export default Carousel;
