import "./AdminDashboard.css";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
   const [products, setProducts] = useState([]);
   const [editProduct, setEditProduct] = useState(null); 
   const token = localStorage.getItem("token");

   const fetchProducts = async () => {
      try {
         const response = await axios.get("http://localhost:8000/api/products", {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         if (Array.isArray(response.data.data)) {
            setProducts(response.data.data);
         } else {
            console.error("Unexpected API response:", response.data);
            setProducts([]);
         }
      } catch (error) {
         console.error("Error fetching products:", error);
         setProducts([]);
      }
   };

   useEffect(() => {
      fetchProducts();
   }, []);

   const handleEditClick = (product) => {
      setEditProduct(product); 
   };

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditProduct((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleUpdate = async (e) => {
     e.preventDefault();
     console.log("Updating Product:", editProduct)
      try {
         await axios.patch(`http://localhost:8000/api/products/${editProduct._id}`, editProduct, {
            headers: {
               Authorization: `Bearer ${token}`,
            },
         });

         alert("Product updated successfully!");
         setEditProduct(null); 
         fetchProducts(); 
      } catch (error) {
         console.error("Error updating product:", error);
         alert(error.response?.data?.message || "Failed to update product");
      }
   };

   const handleDelete = async (id) => {
      if (window.confirm("Are you sure you want to delete this product?")) {
         try {
            await axios.delete(`http://localhost:8000/api/products/${id}`, {
               headers: {
                  Authorization: `Bearer ${token}`,
               },
            });

            fetchProducts();
         } catch (error) {
            console.error("Error deleting product:", error);
            alert(error.response?.data?.message || "Failed to delete product");
         }
      }
   };

   return (
      <div>
         <h1>Admin Dashboard</h1>
         <NavLink to="/addProduct">
            <button>Add New Product</button>
         </NavLink>

         <h2>Product List</h2>
         <table border="1">
            <thead>
               <tr>
                  <th>Product ID</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Featured</th>
                  <th>Rating</th>
                  <th>Company</th>
                  <th>Actions</th>
               </tr>
            </thead>
            <tbody>
               {products.length > 0 ? (
                  products.map((product) => (
                     <tr key={product._id}>
                        <td>{product.productId}</td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>{product.featured ? "Yes" : "No"}</td>
                        <td>{product.rating}</td>
                        <td>{product.company}</td>
                        <td>
                           <button onClick={() => handleEditClick(product)}>Edit</button>
                           <button onClick={() => handleDelete(product._id)}>Delete</button>
                        </td>
                     </tr>
                  ))
               ) : (
                  <tr>
                     <td colSpan="7">No products found</td>
                  </tr>
               )}
            </tbody>
         </table>

         {editProduct && (
            <div style={{ marginTop: "20px", padding: "10px", border: "1px solid #ddd" }}>
               <h2>Edit Product</h2>
               <form onSubmit={handleUpdate}>
                  <label>
                     Name:
                     <input type="text" name="name" value={editProduct.name} onChange={handleInputChange} required />
                  </label>
                  <br />
                  <label>
                     Price:
                     <input type="number" name="price" value={editProduct.price} onChange={handleInputChange} required />
                  </label>
                  <br />
                  <label>
                     Featured:
                     <select name="featured" value={editProduct.featured} onChange={handleInputChange}>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                     </select>
                  </label>
                  <br />
                  <label>
                     Rating:
                     <input type="number" name="rating" value={editProduct.rating} onChange={handleInputChange} required />
                  </label>
                  <br />
                  <label>
                     Company:
                     <input type="text" name="company" value={editProduct.company} onChange={handleInputChange} required />
                  </label>
                  <br />
                  <button type="submit">Update</button>
                  <button type="button" onClick={() => setEditProduct(null)}>Cancel</button>
               </form>
            </div>
         )}
      </div>
   );
};

export default AdminDashboard;
