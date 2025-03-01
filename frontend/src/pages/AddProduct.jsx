import "./AddProduct.css";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
   const navigate = useNavigate();
   const [formData, setFormData] = useState({
      productId: "",
      name: "",
      price: "",
      featured: false,
      rating: "",
      company: "",
   });

   useEffect(() => {
      const role = localStorage.getItem("role");
      if (role !== "admin") {
         alert("Unauthorized access! Only admins can add products.");
         navigate("/dashboard"); 
      }
   }, [navigate]);

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");

      if (!token) {
         alert("Unauthorized: No token found. Please log in.");
         navigate("/login");
         return;
      }

      try {
         await axios.post("http://localhost:8000/api/products", formData, {
            headers: { Authorization: `Bearer ${token}` },
         });

         alert("Product added successfully!");
         navigate("/admin");
      } catch (error) {
         console.error("Error adding product:", error.response?.data || error.message);
         alert("Error adding product: " + (error.response?.data?.message || error.message));
      }
   };

   return (
      <div className="add-product-container">
         <h2>Add New Product</h2>
         <form onSubmit={handleSubmit} className="add-product-form">
            <label>Product ID:</label>
            <input
               type="text"
               name="productId"
               value={formData.productId}
               onChange={handleChange}
               required
            />

            <label>Product Name:</label>
            <input
               type="text"
               name="name"
               value={formData.name}
               onChange={handleChange}
               required
            />

            <label>Price:</label>
            <input
               type="number"
               name="price"
               value={formData.price}
               onChange={handleChange}
               required
            />

            <label>Featured:</label>
            <input
               type="checkbox"
               name="featured"
               checked={formData.featured}
               onChange={handleChange}
            />

            <label>Rating:</label>
            <input
               type="number"
               name="rating"
               value={formData.rating}
               onChange={handleChange}
               min="0"
               max="5"
               step="0.1"
               required
            />

            <label>Company:</label>
            <input
               type="text"
               name="company"
               value={formData.company}
               onChange={handleChange}
               required
            />

            <button type="submit">Add Product</button>
         </form>
      </div>
   );
};

export default AddProduct;
