import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";

import productRoutes from "./routes/product.routes.js";
import userRoutes from "./routes/user.routes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);


const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
