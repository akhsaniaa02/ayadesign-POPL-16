import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../api/private.client';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../Components/Layouts/Layout';
import { message, Table, Tag, Button, Modal, Card, Empty } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, ShoppingOutlined } from '@ant-design/icons';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
    const { token, userData } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${baseURL}/api/my-orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Failed to fetch your orders');
        } finally {
            setLoading(false);
        }
    };

    const showOrderDetail = (order) => {
        setSelectedOrder(order);
        setDetailModalVisible(true);
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            pending: { 
                color: 'orange', 
                icon: <ClockCircleOutlined />,
                text: 'PENDING'
            },
            completed: { 
                color: 'green', 
                icon: <CheckCircleOutlined />,
                text: 'COMPLETED'
            },
            cancelled: { 
                color: 'red', 
                icon: <CloseCircleOutlined />,
                text: 'CANCELLED'
            }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        
        return (
            <Tag color={config.color} icon={config.icon}>
                {config.text}
            </Tag>
        );
    };

    const getStatusMessage = (status) => {
        const messages = {
            pending: {
                title: '⏳ Pesanan Sedang Diproses',
                description: 'Pesanan Anda sedang ditinjau oleh admin. Kami akan segera memprosesnya.'
            },
            completed: {
                title: '✅ Pesanan Selesai',
                description: 'Pesanan Anda telah selesai diproses. Terima kasih atas pembelian Anda!'
            },
            cancelled: {
                title: '❌ Pesanan Dibatalkan',
                description: 'Pesanan ini telah dibatalkan. Silakan hubungi admin untuk informasi lebih lanjut.'
            }
        };
        return messages[status] || messages.pending;
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: '_id',
            key: '_id',
            width: 120,
            render: (id) => <span className="font-mono text-xs">#{id.slice(-8)}</span>
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
            width: 100,
            align: 'center',
            render: (items) => (
                <Tag color="blue">{items?.length || 0} item(s)</Tag>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total_harga',
            key: 'total_harga',
            width: 150,
            render: (total) => (
                <span className="font-semibold text-green-600">
                    Rp. {total?.toLocaleString('id-ID') || 0}
                </span>
            ),
            sorter: (a, b) => a.total_harga - b.total_harga,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            render: (status) => getStatusTag(status),
            filters: [
                { text: 'Pending', value: 'pending' },
                { text: 'Completed', value: 'completed' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
            onFilter: (value, record) => record.status === value,
        },
        {
            title: 'Order Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            render: (date) => (
                <div>
                    <div>{moment(date).format('DD MMM YYYY')}</div>
                    <div className="text-xs text-gray-500">{moment(date).format('HH:mm')}</div>
                </div>
            ),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            defaultSortOrder: 'descend',
        },
        {
            title: 'Action',
            key: 'action',
            width: 100,
            fixed: 'right',
            render: (_, record) => (
                <Button
                    type="primary"
                    icon={<EyeOutlined />}
                    onClick={() => showOrderDetail(record)}
                    size="small"
                >
                    Detail
                </Button>
            ),
        },
    ];

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
                    <p className="text-gray-600 mt-1">Track your order status and history</p>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <Card className="bg-blue-50 border-blue-200">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                                {orders.length}
                            </div>
                            <div className="text-gray-600 text-sm">Total Orders</div>
                        </div>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-orange-600">
                                {orders.filter(o => o.status === 'pending').length}
                            </div>
                            <div className="text-gray-600 text-sm">Pending</div>
                        </div>
                    </Card>
                    <Card className="bg-green-50 border-green-200">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">
                                {orders.filter(o => o.status === 'completed').length}
                            </div>
                            <div className="text-gray-600 text-sm">Completed</div>
                        </div>
                    </Card>
                    <Card className="bg-red-50 border-red-200">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-red-600">
                                {orders.filter(o => o.status === 'cancelled').length}
                            </div>
                            <div className="text-gray-600 text-sm">Cancelled</div>
                        </div>
                    </Card>
                </div>

                {/* Orders Table */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Order History</h2>
                        <Button onClick={fetchOrders} loading={loading}>
                            Refresh
                        </Button>
                    </div>

                    {orders.length === 0 && !loading ? (
                        <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={
                                <div>
                                    <p className="text-gray-500 mb-4">You haven't made any orders yet</p>
                                    <Button 
                                        type="primary" 
                                        icon={<ShoppingOutlined />}
                                        onClick={() => navigate('/productcatalog')}
                                        className="bg-[#BA6264] hover:bg-[#a55253]"
                                    >
                                        Start Shopping
                                    </Button>
                                </div>
                            }
                        />
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={orders}
                            rowKey="_id"
                            loading={loading}
                            pagination={{
                                pageSize: 10,
                                showSizeChanger: true,
                                showTotal: (total) => `Total ${total} orders`,
                            }}
                            scroll={{ x: 900 }}
                        />
                    )}
                </div>

                {/* Order Detail Modal */}
                <Modal
                    title={
                        <div className="text-xl font-bold">
                            Order Detail - #{selectedOrder?._id.slice(-8)}
                        </div>
                    }
                    open={detailModalVisible}
                    onCancel={() => setDetailModalVisible(false)}
                    footer={null}
                    width={800}
                >
                    {selectedOrder && (
                        <div className="space-y-4">
                            {/* Status Banner */}
                            <Card 
                                className={`
                                    ${selectedOrder.status === 'pending' ? 'bg-orange-50 border-orange-200' : ''}
                                    ${selectedOrder.status === 'completed' ? 'bg-green-50 border-green-200' : ''}
                                    ${selectedOrder.status === 'cancelled' ? 'bg-red-50 border-red-200' : ''}
                                `}
                            >
                                <div className="text-center">
                                    <h3 className="text-lg font-bold mb-2">
                                        {getStatusMessage(selectedOrder.status).title}
                                    </h3>
                                    <p className="text-gray-600">
                                        {getStatusMessage(selectedOrder.status).description}
                                    </p>
                                </div>
                            </Card>

                            {/* Order Info */}
                            <Card title="Order Information" size="small">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-gray-600 text-sm">Order ID:</span>
                                        <div className="font-mono font-semibold">#{selectedOrder._id.slice(-8)}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Status:</span>
                                        <div className="mt-1">{getStatusTag(selectedOrder.status)}</div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Order Date:</span>
                                        <div className="font-semibold">
                                            {moment(selectedOrder.createdAt).format('DD MMM YYYY, HH:mm')}
                                        </div>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Total:</span>
                                        <div className="font-semibold text-green-600 text-lg">
                                            Rp. {selectedOrder.total_harga?.toLocaleString('id-ID')}
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Order Items */}
                            <Card title={`Items (${selectedOrder.items?.length || 0})`} size="small">
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, index) => (
                                        <div key={item._id} className="border rounded-lg p-3 bg-gray-50">
                                            <div className="flex gap-3">
                                                <img
                                                    src={item.img}
                                                    alt={item.judul}
                                                    className="w-24 h-24 object-cover rounded"
                                                    onError={(e) => {
                                                        e.target.src = 'https://via.placeholder.com/96?text=Image';
                                                    }}
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-lg mb-1">{item.judul}</div>
                                                    {item.nama && (
                                                        <div className="text-sm text-gray-600 mb-1">
                                                            <span className="font-medium">Nama:</span> {item.nama}
                                                        </div>
                                                    )}
                                                    {item.deskripsi && (
                                                        <div className="text-sm text-gray-600 mb-1">
                                                            <span className="font-medium">Deskripsi:</span> {item.deskripsi}
                                                        </div>
                                                    )}
                                                    <div className="text-sm font-semibold text-green-600 mt-2">
                                                        Rp. {item.harga?.toLocaleString('id-ID')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Help Section */}
                            <Card size="small" className="bg-blue-50">
                                <div className="text-sm text-gray-700">
                                    <p className="font-semibold mb-2">Need Help?</p>
                                    <p>If you have any questions about your order, please contact our customer service.</p>
                                </div>
                            </Card>
                        </div>
                    )}
                </Modal>
            </div>
        </Layout>
    );
};

export default MyOrders;
