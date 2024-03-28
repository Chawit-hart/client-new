import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../Config/firebaseConfig";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);

  // ติดตามสถานะการล็อกอินของผู้ใช้
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // รีเฟตช์ข้อมูลตะกร้าสินค้าโดยใช้อีเมลผู้ใช้
        fetchCartCount(currentUser.email);
      } else {
        // รีเซ็ตจำนวนในตะกร้าเป็น 0 หรือสถานะเริ่มต้นอื่นๆ เมื่อผู้ใช้ออกจากระบบ
        setCartCount(0);
      }
    });
    return unsubscribe; // ยกเลิกการติดตามเมื่อ component unmount
  }, []);

  const fetchCartCount = async (email) => {
    try {
      const response = await fetch(`http://localhost:3001/cart?email=${email}`);
      const cartItems = await response.json();
      setCartCount(cartItems.length);
    } catch (error) {
      console.error('Failed to fetch cart count:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, setCartCount, user }}>
      {children}
    </CartContext.Provider>
  );
};
