const User= require("../models/UserModel");
const bcrypt= require("bcrypt");
const jwt= require("jsonwebtoken");
const {sendEmail}= require("../utils/emailProvider");

const getUsers= async (req, res) => {
    try {
        const users= await User.find();
        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
}
const getUser= async (req, res) => {
    try {
        const user= await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
}
const createUser= async (req,res)=>{
    const {name, email, password, phone, birthDay}= req.body;
    try {
        const userExists= await User.findOne({email});
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword= await bcrypt.hash(password, 10);
        const user= await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            birthDay,
        });
        const otp= Math.floor(100000 + Math.random() * 900000);
        const userWithOtp= await User.findByIdAndUpdate(user._id, {otp}, {new: true});
        const emailBody= `
        <h1>Welcome to our platform</h1>
        <p>Your OTP is ${otp}</p>
        <p>Please verify your email address</p>
        `;
        sendEmail(email, "Verify your email", "OTP Verification", emailBody)
        .then((info) => {
            console.log("Email sent: ", info.response);
        })
        .catch((error) => {
            console.error("Error sending email: ", error);
        });
        const token= jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
}
const verifyEmail= async (req, res) => {
    const {otp}= req.body;
    try {
        const user= await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP",
            });
        }
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
}
const Login= async (req, res) => {
    try{
        const {email, password}= req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User not found",
            });
        }
        const isMatch= await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                success:false,
                message:"Invalid credentials",
            });
        }
        const token= jwt.sign({id:user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({
            success:true,
            message:"User logged in successfully",
            token,
        });
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Server Error",
            error:error.message,
        });
    }
}
const updateUser= async (req, res) => {
    try {
        const {name, email, phone, birthDay}= req.body;
        const token= req.headers.authorization.split(" ")[1];
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this user",
            });
        }
        const user= await User.findByIdAndUpdate(req.params.id, {
            name,
            email,
            phone,
            birthDay,
        }, {new: true});
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
}
const deleteUser= async (req,res)=>{
    try{
        const token= req.headers.authorization.split(" ")[1];
        const decoded= jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.isAdmin || decoded.id !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this user",
            });
        }
        const user= await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    }catch(error){
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        })
    }
}
const blockUser= async (req, res) => {
    try {
        const user= await User.findByIdAndUpdate(req.params.id, {isBlocked: true}, {new: true});
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User blocked successfully",
            user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
}
module.exports= {
    getUsers,
    getUser,
    createUser,
    verifyEmail,
    Login,
    updateUser,
    deleteUser,
    blockUser
}