import "./Dashboard.css"
import React, { useEffect, useState } from "react";
import axios from "axios";


const Dashboard = () => {
   const [products, setProducts] = useState([]);
   const [filteredProducts, setFilteredProducts] = useState([]);
   const [featuredProducts, setFeaturedProducts] = useState([]);
   const [maxPrice, setMaxPrice] = useState("");
   const [minRating, setMinRating] = useState("");

   useEffect(() => {
      fetchProducts();
      fetchFeaturedProducts();
   }, []);

   const fetchProducts = async () => {
      setMaxPrice("");
      setMinRating("");
      try {
         const response = await axios.get("http://localhost:8000/api/products");
         setProducts(response.data.data || []);
         setFilteredProducts(response.data.data || []);
      } catch (error) {
         console.error("Error fetching products:", error);
      }
   };

   const fetchFeaturedProducts = async () => {
      try {
         const response = await axios.get("http://localhost:8000/api/products/featured");
         setFeaturedProducts(response.data || []);
      } catch (error) {
         console.error("Error fetching featured products:", error);
      }
   };

   const applyFilters = async () => {
      try {
         let priceFiltered = [];
         let ratingFiltered = [];

         if (maxPrice) {
            const priceResponse = await axios.get(`http://localhost:8000/api/products/price?maxPrice=${maxPrice}`);
            priceFiltered = priceResponse.data || [];
         }

         if (minRating) {
            const ratingResponse = await axios.get(`http://localhost:8000/api/products/rating?minRating=${minRating}`);
            ratingFiltered = ratingResponse.data || [];
         }

         if (maxPrice && minRating) {
            const filtered = priceFiltered.filter((product) =>
               ratingFiltered.some((p) => p.productId === product.productId)
            );
            setFilteredProducts(filtered);
         } else if (maxPrice) {
            setFilteredProducts(priceFiltered);
         } else if (minRating) {
            setFilteredProducts(ratingFiltered);
         } else {
            setFilteredProducts(products);
         }
      } catch (error) {
         console.error("Error fetching filtered products:", error);
      }
   };

   return (
      <div className="dashboard">
         <h1>Products Dashboard</h1>

         <div className="filters">
            <div>
               <label>Max Price:</label>
               <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Enter max price"
               />
            </div>

            <div>
               <label>Min Rating:</label>
               <input
                  type="number"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  placeholder="Enter min rating"
               />
            </div>

            <button onClick={applyFilters}>Apply Filters</button>
            <button onClick={fetchProducts}>Reset Filters</button>
         </div>

         <div className="featured-products">
            <h2>Featured Products</h2>
            <div className="product-list">
               {featuredProducts.length > 0 ? (
                  featuredProducts.map((product) => (
                     <div key={product.productId} className="product-card featured">
                        <h2>{product.name}</h2>
                        <p>Company: {product.company}</p>
                        <p>Price: ${product.price}</p>
                        <p>Rating: {product.rating}⭐</p>
                     </div>
                  ))
               ) : (
                  <p>No featured products available</p>
               )}
            </div>
         </div>

         <h2>All Products</h2>
         <div className="product-list">
            {filteredProducts.length > 0 ? (
               filteredProducts.map((product) => (
                  <div key={product.productId} className="product-card">
                     <h2>{product.name}</h2>
                     <p>Company: {product.company}</p>
                     <p>Price: ${product.price}</p>
                     <p>Rating: {product.rating}⭐</p>
                  </div>
               ))
            ) : (
               <p>No products found</p>
            )}
         </div>
      </div>
   );
};

export default Dashboard;
