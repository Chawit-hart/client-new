import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { BiPlusCircle, BiTrash } from "react-icons/bi";
import Swal from "sweetalert2";
import axios from "axios";

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
  margin-left: 10px;
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
  const [productDetail, setProductDetail] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const [products, setProducts] = useState([]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleImageChange = (e) => setImageUpload(e.target.files[0]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !productName ||
      !quantity ||
      !price ||
      !productDetail ||
      !selectedCategory ||
      !imageUpload
    ) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        showConfirmButton: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("category", selectedCategory);
    formData.append("detail", productDetail);
    formData.append("price", price);
    formData.append("amount", JSON.stringify(quantity)); // Convert quantity to string
    formData.append("image", imageUpload);

    try {
      const response = await axios.post(
        "http://localhost:3001/posts/upload-image",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Product added successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      closeModal();
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error("Error submitting the product:", error);
      Swal.fire({
        icon: "error",
        title: "An error occurred while saving the product",
        showConfirmButton: true,
      });
    }
  };

  const resetForm = () => {
    setProductName("");
    setQuantity("");
    setPrice("");
    setProductDetail("");
    setSelectedCategory("");
    setSelectedSize("");
    setImageUpload(null);
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products data:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id, name) => {
    Swal.fire({
      title: `Do you want to delete the product '${name}'?`,
      text: "You will not be able to recover this action!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
      cancelButtonText: "Cancel",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:3001/posts/${id}`);
          Swal.fire({
            icon: "success",
            title: "The product has been successfully deleted!",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1500,
            didOpen: (toast) => {
              toast.style.marginTop = "70px";
            },
          });
          fetchProducts();
        } catch (error) {
          console.error("Error deleting product:", error);
          Swal.fire({
            icon: "error",
            title: "An error occurred while deleting the product.",
            position: "top-end",
            toast: true,
            showConfirmButton: false,
            timerProgressBar: true,
            timer: 1500,
            didOpen: (toast) => {
              toast.style.marginTop = "70px";
            },
          });
        }
      }
    });
  };

  const clothingData = products.filter(
    (product) => product.category === "Clothing"
  );
  const accessoryData = products.filter(
    (product) => product.category === "Accessories"
  );

  return (
    <>
      <ProductsContainer>
        <ClothesContainer>
          <ProductHeader>Clothes</ProductHeader>
          <AddProductButton onClick={openModal}>
            <StyledBiPlusCircle />
            Add Product
          </AddProductButton>
          {clothingData.map((product) => (
            <ProductCard key={product._id}>
              <ProductImage
                src={`http://localhost:3001/posts/images/${product._id}`}
                alt={product.name}
              />
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price} บาท</ProductPrice>
                <div>
                  <h4>Available Sizes</h4>
                  {product.amount &&
                    typeof product.amount === "object" &&
                    Object.keys(product.amount).map((key) => (
                      <div key={key}>
                        {key}: {product.amount[key]}
                      </div>
                    ))}
                </div>
              <BiTrash
                style={{ cursor: "pointer", color: "red", fontSize: "20px" }}
                onClick={() => deleteProduct(product._id, product.name)}
              />
            </ProductCard>
          ))}
        </ClothesContainer>
        <AccContainer>
          <AccHeader>Accessories</AccHeader>
          {accessoryData.map((product) => (
            <ProductCard key={product._id}>
              <ProductImage
                src={`http://localhost:3001/posts/images/${product._id}`}
                alt={product.name}
              />
              <ProductName>{product.name}</ProductName>
              <ProductPrice>{product.price} บาท</ProductPrice>
              <ProductQuantity>Quantity: {product.amount}</ProductQuantity>
              <div>
                {product.amount &&
                  typeof product.amount === "object" &&
                  Object.keys(product.amount).map((key) => (
                    <div key={key}>
                      {key}: {product.amount[key]}
                    </div>
                  ))}
              </div>
              <BiTrash
                style={{ cursor: "pointer", color: "red", fontSize: "20px" }}
                onClick={() => deleteProduct(product._id, product.name)}
              />
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
            Detail: <span style={{ color: "red" }}>*</span>
            <StyledInput
              type="text"
              value={productDetail}
              onChange={(e) => setProductDetail(e.target.value)}
            />
          </StyledLabel>
          <StyledLabel>
            Quantity: <span style={{ color: "red" }}>*</span>
            <StyledInput
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </StyledLabel>
          <StyledLabel>
            Category: <span style={{ color: "red" }}>*</span>
            <StyledSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Select Category</option>
              <option value="Clothing">Clothing</option>
              <option value="Accessories">Accessories</option>
            </StyledSelect>
          </StyledLabel>
          <StyledLabel>
            Price: <span style={{ color: "red" }}>*</span>
            <StyledInput
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </StyledLabel>
          <StyledLabel>
            Size:
            <StyledSelect
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Select Size</option>
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
            <CancelButton type="button" onClick={closeModal}>
              Cancel
            </CancelButton>
            <SubmitButton type="submit">Submit</SubmitButton>
          </ButtonsContainer>
        </StyledForm>
      </Modal>
    </>
  );
};

export default Products;
