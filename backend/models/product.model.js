import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
   productId: { 
      type: String, 
      required: true, 
      unique: true
   },
   name: { 
      type: String, 
      required: [true, "Product name is required"], 
      minlength: [3, "Product name must be at least 3 characters"],
      maxlength: [100, "Product name cannot exceed 100 characters"]
   },
   price: { 
      type: Number, 
      required: true,
   },
   featured: { 
      type: Boolean, 
      default: false 
   },
   rating: { 
      type: Number, 
      default: 0
   },
   createdAt: { 
      type: Date, 
      required: true, 
      default: Date.now 
   },
   company: { 
      type: String, 
      required: true
   }
});

const Product = mongoose.model("Product", productSchema);
export default Product;
