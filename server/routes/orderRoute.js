const express = require('express');
const router = express.Router();
const { insertData, getImageCarousel } = require('../controllers/caraouselController');
const { addToCart, getItemCart, removeFromCart, checkout } = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/adminMiddleware');

// Carousel routes
router.post('/insert', protect, isAdmin, insertData); // Protected - Admin only
router.get('/imageCarousel', getImageCarousel);

// Cart routes - Protected (user must be logged in)
router.post('/cart', protect, addToCart);
router.get('/cart', protect, getItemCart);
router.delete('/cart/:id', protect, removeFromCart);

// Checkout route - Protected (user must be logged in)
router.post('/checkout', protect, checkout);

module.exports = router;
