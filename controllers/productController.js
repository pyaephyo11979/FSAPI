const multer= require("multer");
const path= require("path");
const fs= require("fs");
const Product= require("../models/ProductModel");
const Category= require("../models/CategoryModel");
const User= require("../models/UserModel");

const storage= multer.diskStorage({
    destination: (req, file, cb) => {
        const dir= "./uploads";
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix= Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
})
const upload= multer({ storage: storage });
const uploadProductImage= upload.single("image");
const uploadProductImages= upload.array("images", 5);

const createCategory= async (req,res)=>{
    try{
        const {name, description}= req.body;
        const category= new Category({name, description});
        await category.save();
        res.status(201).json({message: "Category created successfully", category});
    }catch(err){
        res.status(500).json({message: "Error creating category", error: err.message});
    }
}
const getCategories= async (req,res)=>{
    try{
        const categories= await Category.find();
        res.status(200).json({message: "Categories fetched successfully", categories});
    }catch(err){
        res.status(500).json({message: "Error fetching categories", error: err.message});
    }
}
const getCategory= async (req,res)=>{
    try{
        const category= await Category.findById(req.params.id);
        res.status(200).json({message: "Category fetched successfully", category});
    }catch(err){
        res.status(500).json({message: "Error fetching category", error: err.message});
    }
}

const createProduct = async (req,res)=>{
    try{
        const {name, description, price, category,stock}= req.body;
        const image= req.file.path;
        const product= new Product({name, description, price, category,stock, images: [image]});
        await product.save();
        res.status(201).json({message: "Product created successfully", product});
    }catch(err){
        res.status(500).json({message: "Error creating product", error: err.message});
    }
}
const getProducts= async (req,res)=>{
    try{
        const products= await Product.find().populate("category");
        res.status(200).json({message: "Products fetched successfully", products});
    }catch(err){
        res.status(500).json({message: "Error fetching products", error: err.message});
    }
}
const getProduct= async (req,res)=>{
    try{
        const product= await Product.findById(req.params.id).populate("category");
        res.status(200).json({message: "Product fetched successfully", product});
    }catch(err){
        res.status(500).json({message: "Error fetching product", error: err.message});
    }
}
const getProductByPagination= async (req,res)=>{
    try{
        const page= parseInt(req.query.page) || 1;
        const limit= parseInt(req.query.limit) || 10;
        const skip= (page - 1) * limit;
        const products= await Product.find().populate("category").skip(skip).limit(limit);
        res.status(200).json({message: "Products fetched successfully", products});
    }catch(err){
        res.status(500).json({message: "Error fetching products", error: err.message});
    }
}
const updateProduct= async (req,res)=>{
    try{
        const {name, description, price, category,stock}= req.body;
        const image= req.file ? req.file.path : undefined;
        const product= await Product.findByIdAndUpdate(req.params.id, {name, description, price, category,stock}, {new: true});
        res.status(200).json({message: "Product updated successfully", product});
    }catch(err){
        res.status(500).json({message: "Error updating product", error: err.message});
    }
}
const deleteProduct= async (req,res)=>{
    try{
        const product= await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({message: "Product deleted successfully", product});
    }catch(err){
        res.status(500).json({message: "Error deleting product", error: err.message});
    }
}

const AddProductToCart= async (req,res)=>{
    try{
        const {productId,quantity}= req.body;
        const user= await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        const product= await Product.findById(productId);
        if(!product){
            return res.status(404).json({message: "Product not found"});
        }
        user.cart.push({productId, quantity});
        await user.save();
        res.status(200).json({message: "Product added to cart successfully", user});
    }catch(err){
        res.status(500).json({message: "Error adding product to cart", error: err.message});
    }
}

const RemoveProductFromCart= async (req,res)=>{
    try{
        const {productId}= req.body;
        const user= await User.findById(req.user._id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        user.cart= user.cart.filter(item=> item.productId.toString() !== productId);
        await user.save();
        res.status(200).json({message: "Product removed from cart successfully", user});
    }catch(err){
        res.status(500).json({message: "Error removing product from cart", error: err.message});
    }
}

const getCartProducts= async (req,res)=>{
    try{
        const user= await User.findById(req.user._id).populate("cart.productId");
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json({message: "Cart products fetched successfully", cart: user.cart});
    }catch(err){
        res.status(500).json({message: "Error fetching cart products", error: err.message});
    }
}


module.exports= {
    createCategory,
    getCategories,
    getCategory,
    createProduct,
    getProducts,
    getProduct,
    getProductByPagination,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    uploadProductImages,
    AddProductToCart,
    RemoveProductFromCart,
    getCartProducts
}