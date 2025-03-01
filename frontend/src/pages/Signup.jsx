import "./Signup.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Signup = () => {
   const [newUser, setNewUser] = useState({
      name: "",
      email: "",
      password: "",
      role: "user",
   });

   const navigate = useNavigate();

   const handleChange = (e) => {
      const { name, value } = e.target;
      setNewUser((prevUser) => ({
         ...prevUser,
         [name]: value,
      }));
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      try {
         const response = await axios.post(
            "http://localhost:8000/api/users/register",
            newUser
         );
         console.log("User Registered:", response.data);
         alert("User registered successfully");
         navigate("/login");
      } catch (error) {
         console.error(
            "Registration failed:",
            error.response?.data || error.message
         );
         alert(
            "Registration failed: " +
               (error.response?.data?.message || error.message)
         );
      }

      setNewUser({
         name: "",
         email: "",
         password: "",
         role: "user",
      });
   };

   return (
      <div className="main">
         <form onSubmit={handleSubmit}>
            <h1>Signup</h1>
            <input
               type="text"
               id="name"
               name="name"
               placeholder="Enter Name..."
               value={newUser.name}
               onChange={handleChange}
               required
            />
            <input
               type="email"
               id="email"
               name="email"
               placeholder="Enter Email..."
               value={newUser.email}
               onChange={handleChange}
               required
            />
            <input
               type="password"
               id="password"
               name="password"
               placeholder="Enter Password"
               value={newUser.password}
               onChange={handleChange}
               required
            />
            <select name="role" value={newUser.role} onChange={handleChange}>
               <option value="admin">Admin</option>
               <option value="user">User</option>
            </select>
            <button type="submit">Signup</button>
         </form>
      </div>
   );
};

export default Signup;
