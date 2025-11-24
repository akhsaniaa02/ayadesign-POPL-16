import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../../api/private.client';
import { useAuth } from '../../contexts/AuthContext';
import Layout from '../../Components/Layouts/Layout';
import { message, Table, Tag, Button, Modal, Space, Collapse, Card } from 'antd';
import { EyeOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Panel } = Collapse;

const AdminOrders = () => {
    const { token } = useAuth();
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
            const response = await axios.get(`${baseURL}/api/orders`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setOrders(response.data.data);
        } catch (error) {
            console.error('Error fetching orders:', error);
            message.error('Failed to fetch orders');
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await axios.put(
                `${baseURL}/api/order/${orderId}/status`,
                { status: newStatus },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            message.success(`Order status updated to ${newStatus}`);
            fetchOrders(); // Refresh the list
        } catch (error) {
            console.error('Error updating order status:', error);
            message.error('Failed to update order status');
        }
    };

    const showOrderDetail = (order) => {
        setSelectedOrder(order);
        setDetailModalVisible(true);
    };

    const getStatusTag = (status) => {
        const statusConfig = {
            pending: { color: 'orange', icon: <ClockCircleOutlined /> },
            completed: { color: 'green', icon: <CheckCircleOutlined /> },
            cancelled: { color: 'red', icon: <CloseCircleOutlined /> }
        };
        
        const config = statusConfig[status] || statusConfig.pending;
        
        return (
            <Tag color={config.color} icon={config.icon}>
                {status.toUpperCase()}
            </Tag>
        );
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: '_id',
            key: '_id',
            width: 120,
            render: (id) => <span className="font-mono text-xs">{id.slice(-8)}</span>
        },
        {
            title: 'Customer',
            dataIndex: 'user',
            key: 'customer',
            render: (user) => (
                <div>
                    <div className="font-semibold">{user?.name || 'N/A'}</div>
                    <div className="text-xs text-gray-500">{user?.email || 'N/A'}</div>
                </div>
            ),
        },
        {
            title: 'Items',
            dataIndex: 'items',
            key: 'items',
            width: 80,
            align: 'center',
            render: (items) => (
                <Tag color="blue">{items?.length || 0} item(s)</Tag>
            ),
        },
        {
            title: 'Total',
            dataIndex: 'total_harga',
            key: 'total_harga',
            width: 120,
            render: (total) => (
                <span className="font-semibold">Rp. {total?.toLocaleString('id-ID') || 0}</span>
            ),
            sorter: (a, b) => a.total_harga - b.total_harga,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            width: 130,
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
            width: 150,
            render: (date) => moment(date).format('DD MMM YYYY HH:mm'),
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: 300,
            fixed: 'right',
            render: (_, record) => (
                <Space size="small">
                    <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => showOrderDetail(record)}
                        size="small"
                    >
                        Detail
                    </Button>
                    {record.status === 'pending' && (
                        <>
                            <Button
                                type="default"
                                style={{ backgroundColor: '#52c41a', color: 'white' }}
                                icon={<CheckCircleOutlined />}
                                onClick={() => updateOrderStatus(record._id, 'completed')}
                                size="small"
                            >
                                Complete
                            </Button>
                            <Button
                                danger
                                icon={<CloseCircleOutlined />}
                                onClick={() => updateOrderStatus(record._id, 'cancelled')}
                                size="small"
                            >
                                Cancel
                            </Button>
                        </>
                    )}
                </Space>
            ),
        },
    ];

    return (
        <Layout>
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
                        <p className="text-gray-600 mt-1">View and manage customer orders</p>
                    </div>
                    <Button onClick={fetchOrders} loading={loading}>
                        Refresh
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                        <Card className="bg-orange-50">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-orange-600">
                                    {orders.filter(o => o.status === 'pending').length}
                                </div>
                                <div className="text-gray-600">Pending Orders</div>
                            </div>
                        </Card>
                        <Card className="bg-green-50">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600">
                                    {orders.filter(o => o.status === 'completed').length}
                                </div>
                                <div className="text-gray-600">Completed</div>
                            </div>
                        </Card>
                        <Card className="bg-red-50">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-red-600">
                                    {orders.filter(o => o.status === 'cancelled').length}
                                </div>
                                <div className="text-gray-600">Cancelled</div>
                            </div>
                        </Card>
                        <Card className="bg-blue-50">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600">
                                    {orders.length}
                                </div>
                                <div className="text-gray-600">Total Orders</div>
                            </div>
                        </Card>
                    </div>

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
                        scroll={{ x: 1400 }}
                    />
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
                            {/* Customer Info */}
                            <Card title="Customer Information" size="small">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-gray-600">Name:</span>
                                        <span className="ml-2 font-semibold">{selectedOrder.user?.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Email:</span>
                                        <span className="ml-2 font-semibold">{selectedOrder.user?.email}</span>
                                    </div>
                                </div>
                            </Card>

                            {/* Order Info */}
                            <Card title="Order Information" size="small">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <span className="text-gray-600">Status:</span>
                                        <span className="ml-2">{getStatusTag(selectedOrder.status)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Order Date:</span>
                                        <span className="ml-2 font-semibold">
                                            {moment(selectedOrder.createdAt).format('DD MMM YYYY HH:mm')}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Total:</span>
                                        <span className="ml-2 font-semibold text-green-600">
                                            Rp. {selectedOrder.total_harga?.toLocaleString('id-ID')}
                                        </span>
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
                                                    className="w-20 h-20 object-cover rounded"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-semibold text-lg">{item.judul}</div>
                                                    {item.nama && (
                                                        <div className="text-sm text-gray-600">
                                                            <span className="font-medium">Nama:</span> {item.nama}
                                                        </div>
                                                    )}
                                                    {item.deskripsi && (
                                                        <div className="text-sm text-gray-600">
                                                            <span className="font-medium">Deskripsi:</span> {item.deskripsi}
                                                        </div>
                                                    )}
                                                    <div className="text-sm font-semibold text-green-600 mt-1">
                                                        Rp. {item.harga?.toLocaleString('id-ID')}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Action Buttons */}
                            {selectedOrder.status === 'pending' && (
                                <div className="flex gap-2 justify-end pt-4">
                                    <Button
                                        type="primary"
                                        style={{ backgroundColor: '#52c41a' }}
                                        icon={<CheckCircleOutlined />}
                                        onClick={() => {
                                            updateOrderStatus(selectedOrder._id, 'completed');
                                            setDetailModalVisible(false);
                                        }}
                                    >
                                        Mark as Completed
                                    </Button>
                                    <Button
                                        danger
                                        icon={<CloseCircleOutlined />}
                                        onClick={() => {
                                            updateOrderStatus(selectedOrder._id, 'cancelled');
                                            setDetailModalVisible(false);
                                        }}
                                    >
                                        Cancel Order
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </Modal>
            </div>
        </Layout>
    );
};

export default AdminOrders;
