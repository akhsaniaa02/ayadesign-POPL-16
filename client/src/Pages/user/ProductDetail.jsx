import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button, notification } from 'antd';
import { useAuth } from '../../contexts/AuthContext';
import { baseURL } from '../../api/private.client';

const ProductDetail = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { item } = location.state;
    const { userData, isAuthenticated, token } = useAuth();

    const [formData, setFormData] = useState({});
    const inputRefs = useRef({});
    
    // Check if user is admin
    const isAdmin = userData?.role === 'admin';
    
    // Helper function to get full image URL
    const getImageUrl = (imageUrl) => {
        // If imageUrl starts with /uploads (local file), prepend baseURL
        if (imageUrl && imageUrl.startsWith('/uploads')) {
            return baseURL + imageUrl;
        }
        // Otherwise return as-is (Cloudinary URL or external URL)
        return imageUrl;
    };

    // Function to handle form submission
    const handleSubmit = async () => {
        if (!isAuthenticated) {
            notification.warning({
                message: 'Warning',
                description: 'Please login to add items to the cart.',
            });
            navigate('/login'); // Redirect to login page if not authenticated
            return;
        }

        const newData = {
            title: inputRefs.current.judul.value,
            name: '',
            description: '',
            imageUrl: item.imageUrl,
            price: item.price
        };

        for (let i = 1; i <= item.formQuantity; i++) {
            if (i > 1) {
                newData.name += ', ';
                newData.description += ', ';
            }
            newData.name += inputRefs.current[`nama${i}`]?.value || '';
            newData.description += inputRefs.current[`deskripsi${i}`]?.value || '';
        }

        setFormData(newData);

        try {
            const response = await fetch(baseURL + '/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newData),
            });

            const result = await response.json();

            if (!response.ok) {
                console.error('Response error:', result); // Log the error response from the server
                throw new Error(result.error || 'Failed to submit form');
            }

            setFormData({});

            notification.success({
                message: 'Success',
                description: 'Item telah dimasukkan ke keranjang',
            });

            navigate('/productcatalog');
        } catch (error) {
            console.error('Error submitting form:', error);

            notification.error({
                message: 'Error',
                description: error.message || 'Gagal mengirim form',
            });
        }
    };

    // Generating fields dynamically
    const fields = [];
    for (let i = 1; i <= item.formQuantity; i++) {
        fields.push(
            <div key={i} className="flex flex-wrap mb-6">
                <div className="w-full md:w-1/2 pr-2">
                    <input
                        type="text"
                        ref={el => inputRefs.current[`nama${i}`] = el}
                        id={`nama${i}`}
                        name={`nama${i}`}
                        placeholder={`Nama(${i})`}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
                <div className="w-full md:w-1/2 pl-2">
                    <input
                        type="text"
                        ref={el => inputRefs.current[`deskripsi${i}`] = el}
                        id={`deskripsi${i}`}
                        name={`deskripsi${i}`}
                        placeholder={`Deskripsi(${i})`}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="mt-6 ml-14 px-4 py-2 ">
                <Link
                    to="/productcatalog"
                    className="inline-block px-3 py-1 border border-black rounded-full text-black font-bold text-lg hover:bg-gray-200 hover:text-gray-700"
                >←
                </Link>
            </div>
            <div className="flex my-4">
                <div className="w-4/12 p-4 mx-4 ml-12 mr-4">
                    <img src={getImageUrl(item.imageUrl)} alt="Foto" />
                </div>
                <div className="w-3/12 p-4">
                    <h2 className="text-xl font-semibold mb-3">{item.title === "B&W Banner" ? "Design Banner" : "Design Photocard"}</h2>
                    <h3 className="text-lg text-gray-700 mb-2">{item.title === "B&W Banner" ? "Ukuran Banner" : "Ukuran Photocard"}</h3>
                    <p>Panjang: 60 cm</p>
                    <p className="mb-5">Lebar: 160 cm</p>
                    <h3 className="text-lg text-gray-700 mb-2">Detail</h3>
                    <p>Custome judul</p>
                    <p>Custome text</p>
                    <p>Font judul disesuaikan</p>
                    <p>{item.formQuantity ? `Foto untuk ${item.formQuantity} orang` : ""}</p>
                </div>
                <div className="w-5/12 p-4 mx-4 ml-6 mr-12">
                    <h3 className="text-lg text-gray-700 mb-2">Harga Design Banner</h3>
                    <p className="font-semibold">Rp. 35.000</p>
                </div>
            </div>
            {/* Form Section - Only show for non-admin users */}
            {!isAdmin && (
                <div className="container mx-auto px-4">
                    <h2 className="text-lg font-semibold mb-4">Isi Detail Pemesanan</h2>
                    <div className="mb-8">
                        <input
                            type="text"
                            ref={el => inputRefs.current.judul = el}
                            id="judul"
                            name="judul"
                            placeholder="Judul Banner"
                            className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </div>
                    {item.formQuantity > 0 && (
                        <>
                            <h3 className="text-md font-semibold mb-4">Detail Nama dan Deskripsi</h3>
                            {fields}
                        </>
                    )}
                    <div className="mb-4">
                        <Button
                            onClick={handleSubmit}
                            className='inline-flex items-center justify-center px-4 py-2 text-white bg-[#BA6264] border border-transparent rounded-xl font-medium hover:bg-[#A65253] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BA6264] shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl'
                        >
                            Add To Cart
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetail;
