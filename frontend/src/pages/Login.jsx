import "./Login.css";   
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; 

const Login = () => {
   const [credentials, setCredentials] = useState({
      email: "",
      password: "",
   });

   const navigate = useNavigate();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setCredentials((prev) => ({
         ...prev,
         [name]: value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post("http://localhost:8000/api/users/login", credentials);
         const { token } = response.data;
   
         console.log("Login Successful:", response.data);
         alert("Login Successful");
   
         localStorage.setItem("token", token);
   
         const decoded = jwtDecode(token);
         console.log("Decoded Token:", decoded);
   
         localStorage.setItem("role", decoded.role); 
   
         if (decoded.role === "admin") {
            navigate("/admin");
         } else {
            navigate("/dashboard");
         }
      } catch (error) {
         console.error("Login failed:", error.response?.data || error.message);
         alert("Login failed: " + (error.response?.data?.message || error.message));
      }
   };
   

   return (
      <div className="main">
         <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <input
               type="email"
               id="email"
               name="email"
               placeholder="Enter Email..."
               value={credentials.email}
               onChange={handleChange}
               required
            />
            <input
               type="password"
               id="password"
               name="password"
               placeholder="Enter Password"
               value={credentials.password}
               onChange={handleChange}
               required
            />
            <button type="submit">Login</button>
            <p>Don't have an account?</p>
            <button type="button" onClick={() => navigate("/signup")}>Sign Up</button>
         </form>
      </div>
   );
};

export default Login;
