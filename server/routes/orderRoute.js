const express = require('express');
const router = express.Router();
const { insertData, getImageCarousel } = require('../controllers/caraouselController');
const { addToCart, getItemCart, removeFromCart, checkout } = require('../controllers/orderController');

// Carousel routes
router.post('/insert', insertData);
router.get('/imageCarousel', getImageCarousel);

// Cart routes
router.post('/cart', addToCart);
router.get('/cart', getItemCart);
router.delete('/cart/:id', removeFromCart);

// Checkout route
router.post('/checkout', checkout);

module.exports = router;
