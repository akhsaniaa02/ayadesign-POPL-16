import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../api/private.client';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../Components/Layouts/Layout';
import { Link, useNavigate } from 'react-router-dom';
import { message, Modal, Table, Button, Space, Tag, Menu } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined, ShoppingOutlined, AppstoreOutlined } from '@ant-design/icons';

const AdminDashboard = () => {
    const { token } = useAuth();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/products`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setProducts(response.data.data);
        } catch (error) {
            console.error('Error fetching products:', error);
            message.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (productId, productTitle) => {
        Modal.confirm({
            title: 'Delete Product',
            content: `Are you sure you want to delete "${productTitle}"?`,
            okText: 'Delete',
            okType: 'danger',
            cancelText: 'Cancel',
            onOk: async () => {
                try {
                    await axios.delete(`${baseURL}/api/product/${productId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    message.success('Product deleted successfully');
                    fetchProducts(); // Refresh the list
                } catch (error) {
                    console.error('Error deleting product:', error);
                    message.error('Failed to delete product');
                }
            }
        });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            width: 80,
            sorter: (a, b) => a.id - b.id,
        },
        {
            title: 'Image',
            dataIndex: 'imageUrl',
            key: 'imageUrl',
            width: 100,
            render: (imageUrl) => (
                <img 
                    src={imageUrl} 
                    alt="product" 
                    style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8 }}
                />
            ),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            width: 120,
            filters: [
                { text: 'Photocard', value: 'photocard' },
                { text: 'Banner', value: 'banner' },
            ],
            onFilter: (value, record) => record.category === value,
            render: (category) => (
                <Tag color={category === 'photocard' ? 'blue' : 'green'}>
                    {category.toUpperCase()}
                </Tag>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            width: 120,
            sorter: (a, b) => {
                const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10);
                const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10);
                return priceA - priceB;
            },
        },
        {
            title: 'Quantity',
            dataIndex: 'formQuantity',
            key: 'formQuantity',
            width: 100,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 180,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button 
                        type="primary" 
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/productdetail/${record.id}`, { state: { item: record } })}
                        size="small"
                    >
                        View
                    </Button>
                    <Button 
                        type="default" 
                        icon={<EditOutlined />}
                        onClick={() => navigate(`/admin/edit/${record._id}`)}
                        size="small"
                    >
                        Edit
                    </Button>
                    <Button 
                        type="primary" 
                        danger 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDelete(record._id, record.title)}
                        size="small"
                    >
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                {/* Header with Navigation */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
                    
                    {/* Navigation Menu */}
                    <div className="flex gap-4 mb-6">
                        <Link to="/admin/products">
                            <Button 
                                type="primary" 
                                icon={<AppstoreOutlined />}
                                className="bg-[#BA6264] hover:bg-[#a55253]"
                            >
                                Products
                            </Button>
                        </Link>
                        <Link to="/admin/orders">
                            <Button 
                                type="default" 
                                icon={<ShoppingOutlined />}
                            >
                                Orders
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700">Product Management</h2>
                        <p className="text-gray-600 mt-1">Manage your products</p>
                    </div>
                    <Link to="/admin/insert">
                        <Button 
                            type="primary" 
                            icon={<PlusOutlined />}
                            size="large"
                            className="bg-green-600 hover:bg-green-700"
                        >
                            Add New Product
                        </Button>
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4 flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-700">
                            Total Products: <span className="text-[#BA6264]">{products.length}</span>
                        </h2>
                        <Button onClick={fetchProducts} loading={loading}>
                            Refresh
                        </Button>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={products}
                        rowKey="_id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showSizeChanger: true,
                            showTotal: (total) => `Total ${total} products`,
                        }}
                        scroll={{ x: 1200 }}
                    />
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
