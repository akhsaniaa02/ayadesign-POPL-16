const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the User schema
const userSchema = new Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    image: {
        url: String,
        public_id: String,
    },
    cart: [{ type: Schema.Types.ObjectId, ref: 'Cart' }] // Reference to Cart items
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
