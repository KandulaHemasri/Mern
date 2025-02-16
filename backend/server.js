import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";

// Load environment variables
dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error(err));

// Models
const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

const ProductSchema = new mongoose.Schema({
    name: String,
    price: Number,
    image: String,
});

const CartSchema = new mongoose.Schema({
    userId: String,
    products: [{ productId: String, name: String, price: Number, quantity: Number }]
});

const User = mongoose.model("User", UserSchema);
const Product = mongoose.model("Product", ProductSchema);
const Cart = mongoose.model("Cart", CartSchema);

// Routes

// User Signup
app.post("/api/signup", async (req, res) => {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
});

// User Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

//  Get Products
app.get("/api/products", async (req, res) => {
    const products = await Product.find();
    res.json(products);
});

//  Add to Cart
app.post("/api/cart", async (req, res) => {
    const { userId, productId, name, price } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, products: [] });
    }

    const existingProduct = cart.products.find(p => p.productId === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.products.push({ productId, name, price, quantity: 1 });
    }

    await cart.save();
    res.json(cart);
});

//  Get Cart Items
app.get("/api/cart/:userId", async (req, res) => {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.json(cart ? cart.products : []);
});

//  Remove from Cart
app.delete("/api/cart/:userId/:productId", async (req, res) => {
    let cart = await Cart.findOne({ userId: req.params.userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.products = cart.products.filter(p => p.productId !== req.params.productId);
    await cart.save();
    res.json(cart.products);
});

//  Checkout (Clears the Cart)
app.post("/api/checkout", async (req, res) => {
    const { userId } = req.body;

    let cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: "Cart is empty" });

    cart.products = [];
    await cart.save();
    res.json({ message: "Order placed successfully" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
