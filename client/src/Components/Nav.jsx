import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ProfileModal from '../Pages/user/ProfileModal'



const Nav = () => {
    const { isAuthenticated, userData } = useAuth();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const firstName = isAuthenticated ? userData?.name : null; // Gunakan optional chaining (?.)
    const showModal = () => {
        setIsModalVisible(true);
    };

    const closeModal = () => {
        setIsModalVisible(false);
    };

    return (
        <header className="text-gray-600 body-font">
            <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <Link to="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <img src="../assets/image/logo.png" alt="ayaDesign" style={{ width: '80px' }} />
                </Link>

                {isAuthenticated ? (
                    userData?.usertype === 'admin' ? (
                        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                            <Link to="/dashboard" className="mr-5 hover:text-gray-900 text-xl">Dashboard</Link>
                            <Link to="/admin/users" className="mr-5 hover:text-gray-900 text-xl">Manajemen Pengguna</Link>
                            <Link to="/transactions" className="mr-5 hover:text-gray-900 text-xl">Manajemen Transaksi</Link>
                            {/* Include dashboard component if necessary */}
                            {/* <Dashboard /> */}
                        </nav>
                    ) : (
                        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                            <Link to="/" className="mr-5 hover:text-gray-900 text-xl">Home</Link>
                            <Link to="/about" className="mr-5 hover:text-gray-900 text-xl">About Us</Link>
                            <Link to="/ProductCatalog" className="mr-5 hover:text-gray-900 text-xl">Go Shopping</Link>
                            <Link to="/cart">
                                <button type="submit" className="font-sans block mt-4 lg:inline-block lg:mt-0 lg:ml-6 align-middle text-black hover:text-gray-700 relative flex items-center">
                                    <svg className="flex-1 w-8 h-8" viewBox="0 0 24 24">
                                        {/* Lingkaran yang membungkus ikon cart */}
                                        <circle cx="12" cy="12" r="12" fill="#BA6264" />
                                        {/* Ikon cart */}
                                        <path
                                            d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"
                                            fill="white" />
                                    </svg>
                                </button>
                            </Link>
                            <div className="mt-6 ml-9 flex flex-col items-center cursor-pointer" onClick={showModal}>
                                {userData.image && userData.image.url ? (
                                    <img
                                        src={userData.image.url}
                                        alt="Profile"
                                        className="w-[30px] h-[30px] rounded-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src="../profilLogo.png" // Gambar placeholder jika userData.img.url tidak tersedia
                                        alt="Profile"
                                        className="w-[30px] h-[30px] rounded-full object-cover"
                                    />
                                )}
                                <span className="text-xs mt-1">{firstName}</span>
                            </div>


                        </nav>

                    )
                ) : (
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                        <Link to="/" className="mr-5 hover:text-gray-900 text-xl">Home</Link>
                        <Link to="/about" className="mr-5 hover:text-gray-900 text-xl">About Us</Link>
                        <Link to="/ProductCatalog" className="mr-5 hover:text-gray-900 text-xl">Go Shopping</Link>
                        <Link to="/cart">
                            <button type="submit" className="font-sans block mt-4 lg:inline-block lg:mt-0 lg:ml-6 align-middle text-black hover:text-gray-700 relative flex items-center">
                                <svg className="flex-1 w-8 h-8" viewBox="0 0 24 24">
                                    {/* Lingkaran yang membungkus ikon cart */}
                                    <circle cx="12" cy="12" r="12" fill="#BA6264" />
                                    {/* Ikon cart */}
                                    <path
                                        d="M17,18C15.89,18 15,18.89 15,20A2,2 0 0,0 17,22A2,2 0 0,0 19,20C19,18.89 18.1,18 17,18M1,2V4H3L6.6,11.59L5.24,14.04C5.09,14.32 5,14.65 5,15A2,2 0 0,0 7,17H19V15H7.42A0.25,0.25 0 0,1 7.17,14.75C7.17,14.7 7.18,14.66 7.2,14.63L8.1,13H15.55C16.3,13 16.96,12.58 17.3,11.97L20.88,5.5C20.95,5.34 21,5.17 21,5A1,1 0 0,0 20,4H5.21L4.27,2M7,18C5.89,18 5,18.89 5,20A2,2 0 0,0 7,22A2,2 0 0,0 9,20C9,18.89 8.1,18 7,18Z"
                                        fill="white" />
                                </svg>
                            </button>
                        </Link>
                    </nav>
                )}

            </div>
            <ProfileModal visible={isModalVisible} handleClose={closeModal} />

        </header>
    );
};

export default Nav;
