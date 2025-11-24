const express = require('express');
const router = express.Router();
const { 
    insertData, 
    getImageCarousel, 
    getAllProducts, 
    getProductById, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/caraouselController');
const { 
    addToCart, 
    getItemCart, 
    removeFromCart, 
    checkout,
    getAllOrders,
    updateOrderStatus,
    getUserOrders
} = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Carousel routes (Public)
router.get('/imageCarousel', getImageCarousel);

// Admin Product Management Routes (Protected - Admin only)
router.post('/insert', protect, isAdmin, insertData); 
router.get('/products', protect, isAdmin, getAllProducts);
router.get('/product/:id', protect, isAdmin, getProductById);
router.put('/product/:id', protect, isAdmin, updateProduct);
router.delete('/product/:id', protect, isAdmin, deleteProduct);

// Cart routes - Protected (user must be logged in)
router.post('/cart', protect, addToCart);
router.get('/cart', protect, getItemCart);
router.delete('/cart/:id', protect, removeFromCart);

// Checkout route - Protected (user must be logged in)
router.post('/checkout', protect, checkout);

// User Order Routes (Protected - User must be logged in)
router.get('/my-orders', protect, getUserOrders);

// Admin Order Management Routes (Protected - Admin only)
router.get('/orders', protect, isAdmin, getAllOrders);
router.put('/order/:id/status', protect, isAdmin, updateOrderStatus);

module.exports = router;
