import React, { useState } from "react";
import styled from "styled-components";
import { BiPlusCircle } from "react-icons/bi";
import Swal from "sweetalert2";

const ClothingData = [
  {
    id: 1,
    name: "Product 1",
    price: "100",
    imageUrl: "./Images/shirt1.png",
    quantity: 10,
  },
  {
    id: 2,
    name: "Product 2",
    price: "200",
    imageUrl: "./Images/short1.png",
    quantity: 20,
  },
];

const accessoryData = [
  {
    id: 1,
    name: "Watch 1",
    price: "200",
    imageUrl: "./Images/applewatch.png",
    quantity: 5,
  },
  {
    id: 2,
    name: "Sunglasses 1",
    price: "80",
    imageUrl: "./Images/applewatch.png",
    quantity: 8,
  },
];

const ProductsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  max-width: 60%;
  margin: 20px auto;
`;

const ProductCard = styled.div`
  width: 200px;
  border: 1px solid #0000;
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const ProductImage = styled.img`
  width: 100%;
  height: 200px;
  border-radius: 5px;
  object-fit: cover;
`;

const ProductName = styled.h3`
  font-size: 1.2em;
`;

const ProductPrice = styled.p`
  font-size: 1em;
  color: #666;
`;

const ProductQuantity = styled.p`
  font-size: 0.9em;
  color: #333;
  margin-top: 10px;
`;

const StyledBiPlusCircle = styled(BiPlusCircle)`
  margin-right: 5px;
  color: white;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-family: "Kanit", sans-serif;
`;

const Modal = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  z-index: 2;
  width: 50%;
  font-family: "Kanit", sans-serif;
`;

const Overlay = styled.div`
  display: ${(props) => (props.isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1;
`;

const AddProductButton = styled(Button)`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
`;

const StyledSelect = styled.select`
  width: 100%;
  padding: 10px;
  margin: 5px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: white;
  box-sizing: border-box;
`;

const StyledLabel = styled.label`
  font-size: 1em;
`;

const SubmitButton = styled(Button)`
  background-color: #28a745;
  &:hover {
    background-color: darken(#28a745, 10%);
  }
  flex-grow: 1;
  margin-right: 10px;
`;

const CancelButton = styled(Button)`
  background-color: #dc3545;
  &:hover {
    background-color: darken(#dc3545, 10%);
  }
  flex-grow: 1;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const FileInputContainer = styled.div`
  border: 1px dashed #ccc;
  padding: 10px;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const FileInputLabel = styled.label`
  margin-bottom: 5px;
`;

const ProductHeader = styled.h2`
  width: 100%;
  text-align: center;
  color: #333;
  font-size: 2em;
`;

const ClothesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  width: 100%;
  border-radius: 10px;
  border: 3px solid transparent;
  margin: 20px auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const AccContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 20px;
  width: 100%;
  border-radius: 10px;
  border: 3px solid transparent;
  margin: 20px auto;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const AccHeader = styled.div`
  width: 100%;
  text-align: center;
  color: #333;
  font-size: 2em;
`;

const Products = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [color, setColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [imageUpload, setImageUpload] = useState(null);

  const [isFormValid, setIsFormValid] = useState(true); // ห้ามลบ isFormValid เพราะว่าถ้าลบ มันจะเข้าใจว่า ตัวนี้จะไม่ใช่ฟังก์ชัน

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleImageChange = (e) => setImageUpload(e.target.files[0]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // ตรวจสอบความครบถ้วนของข้อมูล
    if (
      !productName ||
      !quantity ||
      !price ||
      !color ||
      !selectedSize ||
      !imageUpload
    ) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        showConfirmButton: true,
      });
      setIsFormValid(false); // ตั้งค่าสถานะเป็น false เพื่อแสดงข้อความแจ้งเตือน
      return;
    }

    // ถ้าข้อมูลครบถ้วน
    Swal.fire({
      icon: "success",
      title: "เพิ่มรายการสินค้าเรียบร้อย",
      showConfirmButton: false,
      timer: 1500,
    });
    closeModal();
    resetForm();
  };

  const resetForm = () => {
    setProductName("");
    setQuantity("");
    setPrice("");
    setColor("");
    setSelectedSize("");
    setImageUpload(null);
  };

  return (
    <>
      <ProductsContainer>
        <ClothesContainer>
          <ProductHeader>Clothes</ProductHeader>
          <AddProductButton onClick={openModal}>
            <StyledBiPlusCircle />
            Add Product
          </AddProductButton>
          {ClothingData.map((product) => (
            <ProductCard key={product.id}>
              <ProductImage src={product.imageUrl} alt={product.name} />
              <ProductName>{product.name}</ProductName>
              <ProductPrice>${product.price}</ProductPrice>
              <ProductQuantity>Quantity: {product.quantity}</ProductQuantity>
            </ProductCard>
          ))}
        </ClothesContainer>
        <AccContainer>
          <AccHeader>Accessories</AccHeader>
          {accessoryData.map((product) => (
            <ProductCard key={product.id}>
              <ProductImage src={product.imageUrl} alt={product.name} />
              <ProductName>{product.name}</ProductName>
              <ProductPrice>${product.price}</ProductPrice>
              <ProductQuantity>Quantity: {product.quantity}</ProductQuantity>
            </ProductCard>
          ))}
        </AccContainer>
      </ProductsContainer>
      <Overlay isOpen={modalOpen} onClick={closeModal} />
      <Modal isOpen={modalOpen}>
        <h2>Add New Product</h2>
        <StyledForm onSubmit={handleSubmit}>
          <StyledLabel>
            Product Name: <span style={{ color: "red" }}>*</span>
            <StyledInput
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </StyledLabel>
          <StyledLabel>
            Quantity: <span style={{ color: "red" }}>*</span>
            <StyledInput
              type="text"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </StyledLabel>
          <StyledLabel>
            Price: <span style={{ color: "red" }}>*</span>
            <StyledInput
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </StyledLabel>
          <StyledLabel>
            Color: <span style={{ color: "red" }}>*</span>
            <StyledInput
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </StyledLabel>
          <StyledLabel>
            Size: <span style={{ color: "red" }}>*</span>
            <StyledSelect
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Select Size</option>
              <option value="Freesize">Free size</option>
              <option value="Oversize">Over size</option>
              <option value="XS">XS (Extra-small)</option>
              <option value="S">S (small)</option>
              <option value="M">M (Medium)</option>
              <option value="L">L (Large)</option>
              <option value="XL">XL (Extra-Large)</option>
            </StyledSelect>
          </StyledLabel>
          <StyledLabel>
            <FileInputLabel htmlFor="product-image">
              Product Image: <span style={{ color: "red" }}>*</span>{" "}
            </FileInputLabel>
            <FileInputContainer>
              <StyledInput
                type="file"
                id="product-image"
                onChange={handleImageChange}
                accept="image/jpeg, image/png"
              />
              {imageUpload && <p>{imageUpload.name}</p>}
            </FileInputContainer>
          </StyledLabel>
          <ButtonsContainer>
            <SubmitButton type="submit">Submit</SubmitButton>
            <CancelButton type="button" onClick={closeModal}>
              Cancel
            </CancelButton>
          </ButtonsContainer>
        </StyledForm>
      </Modal>
    </>
  );
};

export default Products;
