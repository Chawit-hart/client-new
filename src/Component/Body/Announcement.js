import React from 'react';
import styled, { keyframes } from 'styled-components';

// การสร้าง Keyframes สำหรับการเคลื่อนไหวเลื่อนข้อความ
const scrollAnimation = keyframes`
  from {
    transform: translateX(250%);
  }
  to {
    transform: translateX(-100%);
  }
`;

// สร้าง styled-component สำหรับแถบประกาศ
const ScrollContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background-color: transparent;
  color: #333;
`;

// สร้าง styled-component สำหรับข้อความเลื่อน
const ScrollingText = styled.div`
  white-space: nowrap;
  padding: 10px;
  display: inline-block;
  animation: ${scrollAnimation} 20s linear infinite;
`;

const Announcement = () => {
  return (
    <ScrollContainer>
      <ScrollingText>📢 Welcome to our website! Check out our latest promotions and products! 🚀</ScrollingText>
    </ScrollContainer>
  );
};

export default Announcement;
