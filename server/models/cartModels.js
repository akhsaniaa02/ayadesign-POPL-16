const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Cart schema
const cartSchema = new Schema({
    title: { type: String, required: true },
    name: { type: String },
    description: { type: String },
    imageUrl: { type: String, required: true },
    price: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Reference to the User
});

// Create the Cart model
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
