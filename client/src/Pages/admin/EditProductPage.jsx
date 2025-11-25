import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../api/private.client';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../Components/Layouts/Layout';
import { useParams, useNavigate } from 'react-router-dom';
import { message, Spin } from 'antd';

const EditProductPage = () => {
    const { id } = useParams();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [product, setProduct] = useState({
        id: '',
        imageUrl: '',
        title: '',
        description: '',
        price: '',
        formQuantity: 1,
        category: 'photocard'
    });
    
    // Helper function to get full image URL
    const getImageUrl = (imageUrl) => {
        // If imageUrl starts with /uploads (local file), prepend baseURL
        if (imageUrl && imageUrl.startsWith('/uploads')) {
            return baseURL + imageUrl;
        }
        // Otherwise return as-is (Cloudinary URL or external URL)
        return imageUrl;
    };

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const response = await axios.get(`${baseURL}/api/product/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProduct(response.data.data);
        } catch (error) {
            console.error('Error fetching product:', error);
            message.error('Failed to fetch product details');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setProduct(prev => ({
            ...prev,
            [name]: (name === 'id' || name === 'formQuantity') ? parseInt(value) || 0 : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setSubmitting(true);
        
        try {
            const response = await axios.put(
                `${baseURL}/api/product/${id}`,
                product,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            message.success('Product updated successfully!');
            navigate('/admin');
        } catch (error) {
            console.error('Error updating product:', error);
            message.error('Failed to update product: ' + (error.response?.data?.message || error.message));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <Spin size="large" />
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
                    <p className="text-gray-600 mt-1">Update product information</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product ID: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="id"
                                value={product.id}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Form Quantity: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                name="formQuantity"
                                value={product.formQuantity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                min="1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category: <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={product.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                required
                            >
                                <option value="photocard">Photocard</option>
                                <option value="banner">Banner</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Image URL: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={product.imageUrl}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                            placeholder="https://example.com/image.jpg"
                            required
                        />
                        {product.imageUrl && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                                <img 
                                    src={getImageUrl(product.imageUrl)} 
                                    alt="Preview" 
                                    className="w-40 h-40 object-cover rounded-lg border"
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/160?text=Invalid+URL';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Title: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={product.title}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                            placeholder="Product title"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description:
                        </label>
                        <textarea
                            name="description"
                            value={product.description}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                            rows="4"
                            placeholder="Product description"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="price"
                            value={product.price}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                            placeholder="Rp. 35.000"
                            required
                        />
                    </div>

                    <div className="flex gap-4 justify-end pt-4">
                        <button
                            type="button"
                            onClick={() => navigate('/admin')}
                            className="px-6 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-300"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-[#BA6264] text-white rounded-md hover:bg-[#a55253] focus:outline-none focus:ring-2 focus:ring-[#BA6264] transition-colors duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
                            disabled={submitting}
                        >
                            {submitting ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default EditProductPage;
