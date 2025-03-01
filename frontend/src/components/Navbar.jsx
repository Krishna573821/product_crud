import "./Navbar.css";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleAuth = () => {
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/login"); 
    } else {
      navigate("/login"); 
    }
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Product CRUD</h1>
      <button className="auth-btn" onClick={handleAuth}>
        {token ? "Log Out" : "Log In"}
      </button>
    </nav>
  );
};

export default Navbar;
