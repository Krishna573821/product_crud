import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
   try {
      const { name, email, password, role } = req.body;

      if (!name || !email || !password) {
         return res.status(400).json({ message: "Name, email, and password are required." });
      }

      if (name.length < 3 || name.length > 50) {
         return res.status(400).json({ message: "Name must be between 3 and 50 characters." });
      }

      if (password.length < 6) {
         return res.status(400).json({ message: "Password must be of more than 6 characters" });
      }


      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ message: "Email already registered." });
      }

      const user = new User({
         name,
         email,
         password,
         role: role || "user",
      });

      await user.save();
      res.status(201).json({ message: "User registered", data: user });
   } catch (error) {
      res.status(400).json({ message: error.message });
   }
};

export const loginUser = async (req, res) => {
   try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
         return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
         { id: user._id, role: user.role },
         process.env.JWT_SECRET,
         {
            expiresIn: "1h",
         }
      );
      res.json({ message: "Login Successful", token });
   } catch (error) {
      res.status(500).json({ message: error.message });
   }
};
