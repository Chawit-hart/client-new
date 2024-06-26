import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { BiPlusCircle, BiTrash, BiEdit } from "react-icons/bi";
import Swal from "sweetalert2";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const StyledBiPlusCircle = styled(BiPlusCircle)`
  margin-right: 5px;
  color: white;
`;

const StyledBiEdit = styled(BiEdit)`
  cursor: pointer;
  color: #007bff;
  font-size: 20px;
  margin-right: 10px;
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
  max-height: 80%;
  font-family: "Kanit", sans-serif;
`;

const ModalContent = styled.div`
  max-height: calc(80vh - 100px);
  overflow-y: auto;
  padding: 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
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

const SizesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const SizesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 10px;
`;

const SizeInfo = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
`;

const SizeLabel = styled.span`
  font-weight: bold;
`;

const SizeValue = styled.span`
  color: #666;
`;

const Products = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [productId, setProductId] = useState(null);
  const [productName, setProductName] = useState("");
  const [productDetail, setProductDetail] = useState("");
  const [quantity, setQuantity] = useState({
    XS: "",
    S: "",
    M: "",
    L: "",
    XL: "",
  });
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [imageUpload, setImageUpload] = useState(null);
  const imageInputRef = useRef(null);
  const [products, setProducts] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [modalOpen]);

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    resetForm();
  };

  const handleImageChange = (e) => {
    setImageUpload(e.target.files[0]);
  };

  const handleQuantityChange = (size) => (e) => {
    setQuantity({ ...quantity, [size]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !productName ||
      !price ||
      !productDetail ||
      !selectedCategory ||
      !imageUpload ||
      Object.values(quantity).every((val) => val === "")
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
    formData.append("image", imageUpload);
    formData.append("amount[S]", quantity.S);
    formData.append("amount[M]", quantity.M);
    formData.append("amount[L]", quantity.L);
    formData.append("amount[XL]", quantity.XL);
    formData.append("amount[XS]", quantity.XS);

    try {
      const token = localStorage.getItem("token");

      if (editMode) {
        await axios.put(`http://localhost:3001/posts/${productId}`, formData, {
          headers: {
            Authorization: token,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Product updated successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        await axios.post("http://localhost:3001/posts/upload-image", formData, {
          headers: {
            Authorization: token,
          },
        });
        Swal.fire({
          icon: "success",
          title: "Product added successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      }

      closeModal();
      resetForm();
      fetchProducts();
    } catch (error) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/admin-login");
        }
      });
    }
  };

  const resetForm = () => {
    setProductName("");
    setQuantity({ XS: "", S: "", M: "", L: "", XL: "" });
    setPrice("");
    setProductDetail("");
    setSelectedCategory("");
    setImageUpload(null);
    setEditMode(false);
    setProductId(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3001/posts");
      setProducts(response.data);
    } catch (error) {
      Swal.fire({
        title: "Session Expired",
        text: "Your session has expired. Please log in again.",
        icon: "warning",
        confirmButtonText: "OK",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/admin-login");
        }
      });
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
          const token = localStorage.getItem("token");
          await axios.delete(`http://localhost:3001/posts/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          });
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
          Swal.fire({
            title: "Session Expired",
            text: "Your session has expired. Please log in again.",
            icon: "warning",
            confirmButtonText: "OK",
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/admin-login");
            }
          });
        }
      }
    });
  };

  const editProduct = (product) => {
    setProductName(product.name);
    setProductDetail(product.detail);
    setQuantity(product.amount);
    setPrice(product.price);
    setSelectedCategory(product.category);
    setProductId(product._id);
    setEditMode(true);
    openModal();
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
              {product.amount &&
                typeof product.amount === "object" &&
                Object.keys(product.amount).length > 0 && (
                  <div>
                    <h5>Available Sizes</h5>
                    <SizesGrid>
                      {Object.keys(product.amount).map((key) => (
                        <SizeInfo key={key}>
                          <SizeLabel>{key}:</SizeLabel>
                          <SizeValue>{product.amount[key]}</SizeValue>
                        </SizeInfo>
                      ))}
                    </SizesGrid>
                  </div>
                )}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <StyledBiEdit onClick={() => editProduct(product)} />
                <BiTrash
                  style={{ cursor: "pointer", color: "red", fontSize: "20px" }}
                  onClick={() => deleteProduct(product._id, product.name)}
                />
              </div>
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
              {product.amount &&
                typeof product.amount === "object" &&
                Object.keys(product.amount).length > 0 && (
                  <div>
                    <h5>Available Sizes</h5>
                    <SizesGrid>
                      {Object.keys(product.amount).map((key) => (
                        <SizeInfo key={key}>
                          <SizeLabel>{key}:</SizeLabel>
                          <SizeValue>{product.amount[key]}</SizeValue>
                        </SizeInfo>
                      ))}
                    </SizesGrid>
                  </div>
                )}
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                <StyledBiEdit onClick={() => editProduct(product)} />
                <BiTrash
                  style={{ cursor: "pointer", color: "red", fontSize: "20px" }}
                  onClick={() => deleteProduct(product._id, product.name)}
                />
              </div>
            </ProductCard>
          ))}
        </AccContainer>
      </ProductsContainer>
      <Overlay isOpen={modalOpen} onClick={closeModal} />
      <Modal isOpen={modalOpen}>
        <ModalContent>
          <h2>{editMode ? "Edit Product" : "Add New Product"}</h2>
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
              Sizes:
              <SizesContainer>
                {["XS", "S", "M", "L", "XL"].map((size) => (
                  <div key={size}>
                    <StyledLabel>{size}</StyledLabel>
                    <StyledInput
                      type="number"
                      placeholder={`${size} Quantity`}
                      value={quantity[size]}
                      onChange={handleQuantityChange(size)}
                    />
                  </div>
                ))}
              </SizesContainer>
            </StyledLabel>
            <StyledLabel>
              <FileInputLabel htmlFor="product-image">
                Product Image: <span style={{ color: "red" }}>*</span>{" "}
              </FileInputLabel>
              <FileInputContainer>
                <StyledInput
                  type="file"
                  id="product-image"
                  ref={imageInputRef}
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
              <SubmitButton type="submit">{editMode ? "Update" : "Submit"}</SubmitButton>
            </ButtonsContainer>
          </StyledForm>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Products;
