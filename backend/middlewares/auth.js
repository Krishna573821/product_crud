import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticate = async (req, res, next) => {
   const token = req.header("Authorization")?.split(" ")[1];
 
   if (!token) return res.status(401).json({ message: "Access Denied" });
 
   try {
     const decoded = jwt.verify(token, process.env.JWT_SECRET);
     req.user = await User.findById(decoded.id).select("-password");
     next();
   } catch (error) {
     res.status(401).json({ message: "Invalid Token" });
   }
 };
 
 export const authorizeAdmin = (req, res, next) => {
   if (req.user.role !== "admin") {
     return res.status(403).json({ message: "Access denied: Admins only" });
   }
   next();
 };