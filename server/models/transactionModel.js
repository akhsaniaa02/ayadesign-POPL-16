const mongoose = require('mongoose');

// Define the TransaksiItem schema
const TransaksiItemSchema = new mongoose.Schema({
    transaksi_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Transaksi',
        required: true 
    },
    judul: { 
        type: String, 
        required: true 
    },
    nama: { 
        type: String, 
    },
    deskripsi: { 
        type: String, 
    },
    img: { 
        type: String, 
        required: true 
    },
    harga: { 
        type: Number, 
        required: true 
    }
}, {
    timestamps: true // Add timestamps for createdAt and updatedAt
});

// Define the Transaksi schema
const TransaksiSchema = new mongoose.Schema({
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    total_harga: { 
        type: Number, 
        required: true 
    },
    status: { 
        type: String, 
        required: true,
        enum: ['pending', 'completed', 'cancelled'], // Example status values
        default: 'pending'
    },
    items: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'TransaksiItem' 
    }]
}, {
    timestamps: true // Add timestamps for createdAt and updatedAt
});

// Create models for Transaksi and TransaksiItem
const Transaksi = mongoose.model('Transaksi', TransaksiSchema);
const TransaksiItem = mongoose.model('TransaksiItem', TransaksiItemSchema);

module.exports = {
    Transaksi,
    TransaksiItem
};
