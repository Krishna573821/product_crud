import Product from "../models/product.model.js";


export const addProduct = async (req, res) => {
  try {
    const { productId, name, price, featured, rating, company } = req.body;
    if (!productId || !name || !price || rating === undefined || !company) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (price <= 0) {
      return res.status(400).json({ message: "Price must be a positive number." });
    }

    if (rating < 0 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 0 and 5." });
    }

    const existingProduct = await Product.findOne({ productId });
    if (existingProduct) {
      return res.status(400).json({ message: "Product ID must be unique." });
    }

    const product = new Product({ productId, name, price, featured, rating, company });
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Internal server error.", error: error.message });
  }
};


export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({data: products,  message: "Products fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ featured: true });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductsByPrice = async (req, res) => {
  try {
    const maxPrice = parseFloat(req.query.maxPrice);
    if (isNaN(maxPrice)) {
      return res.status(400).json({ message: "Invalid maxPrice value" });
    }

    const products = await Product.find({ price: { $lt: maxPrice } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getProductsByRating = async (req, res) => {
  try {
    const minRating = parseFloat(req.query.minRating); 
    if (isNaN(minRating)) {
      return res.status(400).json({ message: "Invalid minRating value" });
    }

    const products = await Product.find({ rating: { $gt: minRating } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

