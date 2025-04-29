const Order = require('../models/orderModel');
const Product = require('../models/ProductModel');
const User = require('../models/UserModel');
const { sendEmail } = require('../utils/emailService'); // Assuming you have an email service to send emails

const orderConfirmationMail = async (orderDetails) => {
    try{
        const subject = 'Order Confirmation';

        const user=User.findById(orderDetails.user);
        if(!user){
            throw new Error('User not found');
        }
        const userName = user.name;
        const userEmail = user.email;
        
        const message = `
            <h1>Order Confirmation</h1>
            <p>Dear ${userName},</p>
            <p>Thank you for your order!</p>
            <p>Order Number: ${orderDetails.orderNumber}</p>
            <p>Total Price: ${orderDetails.totalPrice}</p>
            <p>Shipping Address: ${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.state}, ${orderDetails.shippingAddress.country}, ${orderDetails.shippingAddress.zipCode}</p>
        `;
        await sendEmail(userEmail, subject, message);
    }catch(err){
        console.error('Error sending order confirmation email:', err);
    }
}

const createOrder = async (req, res) => {
    try{
        const { userId, products, shippingAddress, paymentMethod } = req.body;
        const orderNumber = Math.floor(Math.random() * 1000000); // Generate a random order number
        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if products exist
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product with ID ${item.product} not found` });
            }
        }

        const order = new Order({
            user: userId,
            products,
            totalPrice,
            shippingAddress,
            orderNumber,
            paymentMethod
        });

        await order.save();
        res.status(201).json(order,{ message: 'Order created successfully' ,orderNumber});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('user', 'name email').populate('products.product', 'name price');
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const getOrdersByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const orders = await Order.find({ user: userId }).populate('products.product', 'name price');
        res.status(200).json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { orderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(orderId, { orderStatus }, { new: true });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    createOrder,
    getOrders,
    getOrdersByUser,
    updateOrderStatus,
    deleteOrder
}