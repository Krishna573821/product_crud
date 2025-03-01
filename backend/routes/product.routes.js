import express from "express";
import {
   addProduct,
   getAllProducts,
   updateProduct,
   deleteProduct,
   getFeaturedProducts,
   getProductsByPrice,
   getProductsByRating,
} from "../controllers/product.controllers.js";
import { authenticate, authorizeAdmin } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/price", getProductsByPrice);
router.get("/rating", getProductsByRating);


router.post("/", authenticate, authorizeAdmin, addProduct);
router.patch("/:id", authenticate, authorizeAdmin, updateProduct);
router.delete("/:id", authenticate, authorizeAdmin, deleteProduct);

export default router;
