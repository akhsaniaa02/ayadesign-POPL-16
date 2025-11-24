import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, notification } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { baseURL } from '../../api/private.client';

const CartPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigate = useNavigate();
  const { userData, isAuthenticated, token } = useAuth(); // Make sure token is included

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login'); // Redirect if not authenticated
      return;
    }
    
    // Redirect admin to dashboard if they try to access cart
    if (userData?.role === 'admin') {
      notification.warning({
        message: 'Access Denied',
        description: 'Admin users cannot access the cart. This feature is for customers only.',
      });
      navigate('/admin');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(baseURL + '/api/cart', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Include token in header
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to fetch orders',
        });
      } finally {
        setLoading(false); // Set loading to false once data is fetched or an error occurs
      }
    };

    fetchOrders();
  }, [isAuthenticated, token, navigate]);

  const handleRemove = async (orderId) => {
    try {
      const response = await fetch(baseURL + `/api/cart/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, // Include token in header
          'Content-Type': 'application/json', // Optional but recommended
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove item from cart');
      }

      // No need to parse JSON if the backend response doesn't contain a body after deletion
      setOrders(orders.filter(order => order._id !== orderId));

      notification.success({
        message: 'Success',
        description: 'Item has been removed from cart',
      });
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to remove item from cart',
      });
    }
  };

  const handleCheckout = async () => {
    try {
        const response = await fetch(baseURL + '/api/checkout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, // Include token in header
            },
        });

        // Check if the response is in JSON format
        const contentType = response.headers.get('Content-Type');
        if (!response.ok) {
            let errorMessage = 'Failed to proceed to checkout';
            if (contentType && contentType.includes('application/json')) {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            }
            throw new Error(errorMessage);
        }

        // If response is JSON
        if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            notification.success({
                message: 'Success',
                description: result.message || 'Checkout successful',
                duration: 3,
            });

            // Redirect to WhatsApp in a new tab and refresh the current tab
            if (result.whatsappLink) {
                window.open(result.whatsappLink, '_blank');
                window.location.reload(); // Refresh the current tab
            } else {
                // Fallback if the WhatsApp link is not present
                navigate('/');
            }
        } else {
            // If response is not JSON, handle it as text
            const result = await response.text();
            notification.success({
                message: 'Success',
                description: result || 'Checkout successful',
                duration: 3,
            });

            // Refresh the current tab if necessary
            window.location.reload(); // Refresh the current tab
        }
    } catch (error) {
        console.error('Failed to proceed to checkout:', error);
        notification.error({
            message: 'Error',
            description: error.message || 'Failed to proceed to checkout',
        });
    }
};

  const handleOrderDetailClick = (order) => {
    navigate(`/cart/detail`, { state: { order } });
  };

  const totalharga = orders.reduce((total, order) => total + parseInt(order.price.replace(/[^\d]/g, '')), 0);

  if (loading) {
    return <div>Loading...</div>; // Placeholder while data is being fetched
  }

  return (
    <section className="py-8 antialiased dark:bg-gray-900 md:py-16">
      <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-xl judul">Shopping Cart</h2>

        <div className="mt-6 sm:mt-8 md:gap-6 lg:flex lg:items-start xl:gap-8">
          <div className="mx-auto w-full flex-none lg:max-w-2xl xl:max-w-4xl">
            <div className="space-y-6">
              {orders.length > 0 ? (
                orders.map(order => (
                  <div key={order._id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 md:p-6">
                    <div className="space-y-4 md:flex md:items-center md:justify-between md:gap-6 md:space-y-0">
                      <a href="#" className="shrink-0 md:order-1">
                        <img className="h-20 w-20 dark:hidden" src={order.imageUrl} alt="Product Image" />
                        <img className="hidden h-20 w-20 dark:block" src={order.imageUrl} alt="Product Image" />
                      </a>
                      <div className="text-end md:order-4 md:w-32">
                        <p className="text-base font-bold text-gray-900 dark:text-white">{order.price}</p>
                      </div>
                      <div className="w-full min-w-0 flex-1 space-y-4 md:order-2 md:max-w-md">
                        <a href="#" className="text-base font-medium text-gray-900 hover:underline dark:text-white">{order.title}</a>
                        <div className="flex items-center gap-4">
                          <Button type="link" onClick={() => handleOrderDetailClick(order)}>
                            lihat Detail Barang
                          </Button>
                          <Button type="link" danger onClick={() => handleRemove(order._id)}>
                            <svg className="me-1.5 h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6" />
                            </svg>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-lg font-medium text-gray-900 dark:text-white">Belum ada Barang yang dimasukkan ke keranjang</p>
              )}
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-4xl flex-1 space-y-6 lg:mt-0 lg:w-full">
            <div className="space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800 sm:p-6">
              <p className="text-xl font-semibold text-gray-900 dark:text-white">Order summary</p>
              <div className="space-y-4">
                {/* Display order summary details */}
              </div>
              <dl className="flex items-center justify-between gap-4 border-t border-gray-200 pt-2 dark:border-gray-700">
                <dt className="text-base font-bold text-gray-900 dark:text-white">Total</dt>
                <dd className="text-base font-bold text-gray-900 dark:text-white">Rp. {totalharga.toLocaleString('id-ID')}</dd>
              </dl>
              <div className="flex w-full items-center justify-center">
                <Button type="primary" onClick={handleCheckout} className="rounded-lg bg-custom-pink px-5 py-2.5 text-sm font-medium text-white hover:bg-custom-pink/90 focus:outline-none focus:ring-4 focus:ring-custom-pink dark:bg-custom-pink dark:hover:bg-custom-pink/90 dark:focus:ring-custom-pink">
                  Proceed to Checkout
                </Button>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400"> or </span>
                <Link to="/productcatalog" title="" className="inline-flex items-center gap-2 text-sm font-medium text-custom-pink underline hover:no-underline dark:text-custom-pink">
                  Continue Shopping
                  <svg className="h-5 w-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 12H5m14 0-4 4m4-4-4-4" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CartPage;
