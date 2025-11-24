const Cart = require('../models/cartModels');
const User = require('../models/userModels'); // Ensure you have a User model
const { Transaksi, TransaksiItem } = require('../models/transactionModel'); // Adjust the path as needed
const verifyTokenAndGetUserId = require('../utils/verifyToken');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');



exports.addToCart = async (req, res) => {
    try {
        const { title, name, description, imageUrl, price } = req.body;

        // Get user ID from authenticated user (set by protect middleware)
        const userId = req.user._id;

        // Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Create a new cart item
        const newCart = new Cart({
            title,
            name,
            description,
            imageUrl,
            price,
            user: userId // Associate cart item with user ID
        });

        // Save the cart item
        await newCart.save();
        console.log('New cart item saved:', newCart);

        // Update the user's cart
        user.cart.push(newCart._id);
        await user.save();

        console.log('User cart updated:', user.cart);

        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error in addToCart:', error); // Log the error
        res.status(400).json({ error: error.message });
    }
};



// Fetch cart items for a specific user
exports.getItemCart = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and extract user ID
        const userId = verifyTokenAndGetUserId(token);
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const cartItems = await Cart.find({ user: userId });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and extract user ID
        const userId = verifyTokenAndGetUserId(token);
        if (!userId) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const { id } = req.params;
        const deletedItem = await Cart.findOneAndDelete({ _id: id, user: userId });
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }
        res.status(200).json(deletedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// Checkout
exports.checkout = async (req, res) => {
    try {
        const token = req.headers['authorization']?.split(' ')[1]; // Extract token from header
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        // Verify token and extract user ID
        const userId = verifyTokenAndGetUserId(token);
        if (!userId) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Check if cart has items for the user
        const cartItems = await Cart.find({ user: userId });
        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty, cannot proceed to checkout' });
        }

        // Calculate total price as an integer (removing non-digit characters)
        const totalHarga = cartItems.reduce((total, item) => {
            const price = parseInt(item.price.replace(/[^\d]/g, ''), 10);
            return total + price;
        }, 0);

        // Log the calculated total price for debugging
        console.log('Total Price:', totalHarga);

        // Create a new transaction
        const transaksi = new Transaksi({
            user_id: userId,
            total_harga: totalHarga,
            status: 'pending',
        });
        await transaksi.save();

        // Create transaction items and link to the transaction
        const transaksiItems = cartItems.map(item => ({
            transaksi_id: transaksi._id,
            judul: item.title,
            nama: item.name,
            deskripsi: item.description,
            img: item.imageUrl,
            harga: parseInt(item.price.replace(/[^\d]/g, ''), 10),
        }));
        await TransaksiItem.insertMany(transaksiItems);

        // Clear the cart for the user
        await Cart.deleteMany({ user: userId });

        // Send WhatsApp message
        const pengguna = await User.findById(userId);
        const namaPengguna = pengguna.name; // Assuming you have the user's name in the request object
        const adminPhoneNumber = '+6285271268570'; // Replace with actual admin phone number
        const whatsappLink = sendWhatsAppMessage(namaPengguna, transaksiItems, totalHarga, adminPhoneNumber);

        // Optionally, you can return the WhatsApp link or handle it as needed
        console.log('Generated WhatsApp Link:', whatsappLink); // Log link for debugging

        res.status(200).json({ message: 'Checkout successful and cart cleared', transaksiId: transaksi._id, whatsappLink });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Function to send WhatsApp message
const sendWhatsAppMessage = (namaPengguna, cartItems, totalHarga, adminPhoneNumber) => {
    let pesan = `Hai Admin, saya *${namaPengguna}* ingin melakukan pemesanan,\nBerikut pesanan Saya:\n\n`; // Initial message

    // Iterate through each item in cartItems
    cartItems.forEach((item, index) => {
        const folder_name = item.img.split('/').slice(-2, -1)[0];
        const fileName = item.img.split('/').pop();
        const kodePesanan = fileName.split('.')[0];

        // Split name and description into arrays
        const namaArray = item.nama.split(',');
        const deskripsiArray = item.deskripsi.split(',');

        // Add order number
        pesan += `Pesanan ${index + 1}\n`;
        pesan += `Judul: ${item.judul}\n`;
        pesan += `Kode Pesanan: ${kodePesanan}\n`;
        pesan += `Harga: ${item.harga}\n\n`;

        let angka = 1;
        if (folder_name === 'banner') {
            // Add order details
            pesan += "Detail Pemesanan:\n";

            namaArray.forEach((nama, i) => {
                const deskripsi = deskripsiArray[i] || ''; // Corresponding description

                // Add order details to the message
                pesan += `${angka}. Nama: ${nama}\n`;
                pesan += `    Deskripsi: ${deskripsi}\n`;
                angka++;
            });
        }

        // Add separator between orders
        if (index < cartItems.length - 1) {
            pesan += "--------------------------------------------------------------------------\n\n";
        }
    });

    // Add total price to the message
    pesan += "--------------------------------------------------------------------------\n\n";
    pesan += `Total Harga: ${totalHarga} IDR\n`;

    // Use encodeURIComponent for proper URL encoding
    const encodedPesan = encodeURIComponent(pesan);
    const whatsappLink = `https://api.whatsapp.com/send?phone=${adminPhoneNumber}&text=${encodedPesan}`;

    // Return the WhatsApp link
    return whatsappLink;
};

// Get all orders/transactions (Admin only)
exports.getAllOrders = async (req, res) => {
    try {
        console.log("GET /orders - Admin request received");
        
        // Get all transactions with user and items populated
        const orders = await Transaksi.find()
            .populate('user_id', 'name email') // Populate user info
            .sort({ createdAt: -1 }); // Sort by newest first

        // Get transaction items for each order
        const ordersWithItems = await Promise.all(
            orders.map(async (order) => {
                const items = await TransaksiItem.find({ transaksi_id: order._id });
                return {
                    _id: order._id,
                    user: order.user_id,
                    total_harga: order.total_harga,
                    status: order.status,
                    createdAt: order.createdAt,
                    updatedAt: order.updatedAt,
                    items: items
                };
            })
        );

        res.status(200).json({
            success: true,
            count: ordersWithItems.length,
            data: ordersWithItems
        });
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message
        });
    }
};

// Update order status (Admin only)
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Validate status
        if (!['pending', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status. Must be: pending, completed, or cancelled'
            });
        }

        const order = await Transaksi.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        ).populate('user_id', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            data: order
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error.message
        });
    }
};
