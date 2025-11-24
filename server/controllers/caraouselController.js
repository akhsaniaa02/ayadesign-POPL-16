const ImageCarousel = require('../models/imageModels');

exports.insertData = async (req, res) => {
    const { items } = req.body;
    console.log("Insert request received:", items); // ✅ log request data
    try {
        // Validate items array
        if (!items || !Array.isArray(items)) {
            return res.status(400).json({ message: 'Items array is required' });
        }

        // Validate each item
        for (let item of items) {
            if (!item.id || !item.title || !item.price || !item.imageUrl) {
                return res.status(400).json({ message: 'Missing required fields: id, title, price, imageUrl' });
            }
        }

        const result = await ImageCarousel.insertMany(items);
        console.log("Insert success:", result); // ✅ log hasil insert
        res.status(201).json({ 
            message: 'Data inserted successfully',
            count: result.length,
            data: result
        });
    } catch (error) {
        console.error("Insert error:", error); // ❌ log error
        if (error.code === 11000) {
            res.status(400).json({ message: 'Duplicate ID found. Please use unique IDs.' });
        } else {
            res.status(500).json({ message: 'Error inserting data', error: error.message });
        }
    }
};

exports.getImageCarousel = async (req, res) => {
    console.log("GET /imagecarousel request received"); // ✅ log permintaan GET
    try {
        const imageCarouselItems = await ImageCarousel.find();
        console.log("Fetched items from DB:", imageCarouselItems.length); // ✅ log jumlah item

        // Filter by category field first, fallback to URL-based filtering for backward compatibility
        let photocardItems = imageCarouselItems.filter(item => 
            item.category === 'photocard' || (!item.category && item.imageUrl.includes('photocard'))
        );
        let bannerItems = imageCarouselItems.filter(item => 
            item.category === 'banner' || (!item.category && item.imageUrl.includes('banner'))
        );

        console.log("Photocard items:", photocardItems.length); // ✅ log jumlah masing-masing
        console.log("Banner items:", bannerItems.length);

        res.json({
            photocardItems,
            bannerItems,
            totalItems: imageCarouselItems.length
        });
    } catch (err) {
        console.error("Error in getImageCarousel:", err); // ❌ log error
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// Get all products (for admin panel)
exports.getAllProducts = async (req, res) => {
    console.log("GET /products - Admin request received");
    try {
        const products = await ImageCarousel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ 
            success: false,
            message: 'Error fetching products', 
            error: error.message 
        });
    }
};

// Get single product by ID
exports.getProductById = async (req, res) => {
    console.log("GET /product/:id request received");
    try {
        const product = await ImageCarousel.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({
            success: false,
            message: 'Error fetching product',
            error: error.message
        });
    }
};

// Update product
exports.updateProduct = async (req, res) => {
    console.log("PUT /product/:id request received");
    try {
        const { id, title, description, price, imageUrl, formQuantity, category } = req.body;

        // Find and update product
        const product = await ImageCarousel.findByIdAndUpdate(
            req.params.id,
            {
                id,
                title,
                description,
                price,
                imageUrl,
                formQuantity,
                category
            },
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log("Product updated successfully:", product);
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });
    } catch (error) {
        console.error("Error updating product:", error);
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Product ID already exists'
            });
        }
        res.status(500).json({
            success: false,
            message: 'Error updating product',
            error: error.message
        });
    }
};

// Delete product
exports.deleteProduct = async (req, res) => {
    console.log("DELETE /product/:id request received");
    try {
        const product = await ImageCarousel.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        console.log("Product deleted successfully:", product);
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
            data: product
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({
            success: false,
            message: 'Error deleting product',
            error: error.message
        });
    }
};
