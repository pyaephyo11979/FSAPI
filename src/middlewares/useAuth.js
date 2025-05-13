const User = require('../models/UserModel');
const checkAuth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const user = await User.findById(token);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
const isSeller = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.role !== 'seller') {
            return res.status(403).json({ message: 'Access denied' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
module.exports = { checkAuth, isAdmin, isSeller };