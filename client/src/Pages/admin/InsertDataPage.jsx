import React, { useState } from 'react';
import axios from 'axios';
import { baseURL } from '../../api/private.client';
import Layout from '../../Components/Layouts/Layout';
import { useAuth } from '../../contexts/AuthContext';

const InsertDataPage = () => {
    const { token } = useAuth();
    const [items, setItems] = useState([{ 
        id: '', 
        imageUrl: '', 
        imageFile: null,
        useFile: false,
        title: '', 
        description: '', 
        price: '', 
        formQuantity: 1, 
        category: 'photocard' 
    }]);

    const handleChange = (index, event) => {
        const { name, value } = event.target;
        const newItems = [...items];
        newItems[index][name] = (name === 'id' || name === 'formQuantity') ? parseInt(value) || 0 : value;
        setItems(newItems);
    };
    
    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        const newItems = [...items];
        newItems[index].imageFile = file;
        newItems[index].useFile = true;
        setItems(newItems);
    };
    
    const handleImageModeChange = (index, useFile) => {
        const newItems = [...items];
        newItems[index].useFile = useFile;
        if (!useFile) {
            newItems[index].imageFile = null;
        } else {
            newItems[index].imageUrl = '';
        }
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { 
            id: '', 
            imageUrl: '', 
            imageFile: null,
            useFile: false,
            title: '', 
            description: '', 
            price: '', 
            formQuantity: 1, 
            category: 'photocard' 
        }]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            
            // Prepare items for JSON
            const itemsData = items.map(item => ({
                id: item.id,
                title: item.title,
                description: item.description,
                price: item.price,
                formQuantity: item.formQuantity,
                category: item.category,
                imageUrl: item.useFile ? '' : item.imageUrl // Only include URL if not using file
            }));
            
            formData.append('items', JSON.stringify(itemsData));
            
            // Append image files
            items.forEach((item, index) => {
                if (item.imageFile) {
                    formData.append('images', item.imageFile);
                }
            });
            
            const response = await axios.post(`${baseURL}/api/insert`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            alert(response.data.message || 'Data inserted successfully!');
            // Reset form after successful submission
            setItems([{ 
                id: '', 
                imageUrl: '', 
                imageFile: null,
                useFile: false,
                title: '', 
                description: '', 
                price: '', 
                formQuantity: 1, 
                category: 'photocard' 
            }]);
        } catch (error) {
            alert('Error inserting data: ' + (error.response?.data?.message || error.message));
            console.error('Insert error:', error);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">Admin Panel - Insert Product Data</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {items.map((item, index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow-md border">
                            <h3 className="text-lg font-semibold mb-4 text-gray-700">Product {index + 1}</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ID:</label>
                                    <input
                                        type="number"
                                        name="id"
                                        value={item.id}
                                        onChange={(event) => handleChange(index, event)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                        required
                                    />
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Form Quantity:</label>
                                    <input
                                        type="number"
                                        name="formQuantity"
                                        value={item.formQuantity}
                                        onChange={(event) => handleChange(index, event)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category:</label>
                                    <select
                                        name="category"
                                        value={item.category}
                                        onChange={(event) => handleChange(index, event)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                        required
                                    >
                                        <option value="photocard">Photocard</option>
                                        <option value="banner">Banner</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image:</label>
                                
                                {/* Toggle between File Upload and URL */}
                                <div className="flex gap-4 mb-3">
                                    <button
                                        type="button"
                                        onClick={() => handleImageModeChange(index, true)}
                                        className={`px-4 py-2 rounded-md transition-colors ${
                                            item.useFile 
                                                ? 'bg-[#BA6264] text-white' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        Upload File
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleImageModeChange(index, false)}
                                        className={`px-4 py-2 rounded-md transition-colors ${
                                            !item.useFile 
                                                ? 'bg-[#BA6264] text-white' 
                                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        }`}
                                    >
                                        Use URL
                                    </button>
                                </div>
                                
                                {/* Conditional Input based on mode */}
                                {item.useFile ? (
                                    <div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(event) => handleFileChange(index, event)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                            required={item.useFile}
                                        />
                                        {item.imageFile && (
                                            <p className="mt-2 text-sm text-green-600">
                                                Selected: {item.imageFile.name}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <input
                                        type="url"
                                        name="imageUrl"
                                        value={item.imageUrl}
                                        onChange={(event) => handleChange(index, event)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                        placeholder="https://example.com/image.jpg"
                                        required={!item.useFile}
                                    />
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={item.title}
                                    onChange={(event) => handleChange(index, event)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                    placeholder="Product title"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description:</label>
                                <textarea
                                    name="description"
                                    value={item.description}
                                    onChange={(event) => handleChange(index, event)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                    rows="3"
                                    placeholder="Product description"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price:</label>
                                <input
                                    type="text"
                                    name="price"
                                    value={item.price}
                                    onChange={(event) => handleChange(index, event)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#BA6264]"
                                    placeholder="Rp. 35.000"
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <div className="flex gap-4 justify-center pt-6">
                        <button 
                            type="button" 
                            onClick={addItem}
                            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300"
                        >
                            Add More Items
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-3 bg-[#BA6264] text-white rounded-md hover:bg-[#a55253] focus:outline-none focus:ring-2 focus:ring-[#BA6264] transition-colors duration-300"
                        >
                            Insert Data
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default InsertDataPage;
