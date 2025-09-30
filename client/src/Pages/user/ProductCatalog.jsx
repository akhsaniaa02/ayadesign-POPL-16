import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import axios from 'axios';
import Layout from '../../Components/Layouts/Layout';
import { baseURL } from '../../api/private.client';

const ProductCatalog = () => {
    const [photocardItems, setPhotocardItems] = useState([]);
    const [bannerItems, setBannerItems] = useState([]);
    const navigate = useNavigate();

    const photocardOptions = {
        items: 4,
        nav: true,
        dots: false,
        margin: 10,
        mouseDrag: true,
        responsive: {
            0: { items: 1 },
            600: { items: 3 },
            1000: { items: 4 },
        },
    };

    const bannerOptions = {
        items: 3,
        nav: true,
        dots: false,
        margin: 10,
        mouseDrag: true,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            1100: { items: 3 },
        },
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(baseURL + '/api/imageCarousel');
                const response = await axios.get(baseURL + '/api/imageCarousel');
                console.log(response.data);
                setPhotocardItems(response.data.photocardItems);
                setBannerItems(response.data.bannerItems);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleItemClick = (item) => {
        navigate(`/productdetail/${item.id}`, { state: { item } });
    };

    return (
        <Layout>
            <section className="text-gray-600 body-font mt-20 mx-[70px]" style={{ marginBottom: '250px' }}>
                <h1 className="text-center judul text-xl mb-10">Photocard</h1>
                <div className="container px-5 py-8 mx-auto">
                    <OwlCarousel className="owl-theme" {...photocardOptions}>
                        {photocardItems.map(item => (
                            <div className="item" key={item._id}>
                                <div
                                    onClick={() => handleItemClick(item)}
                                    className="mb-10 px-4 cursor-pointer"
                                    style={{ width: '280px', height: '500px' }}
                                >
                                    <div className="overflow-hidden">
                                        <img alt="content" className="object-cover object-center h-96 w-auto" src={item.imageUrl} />
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-xl font-medium title-font text-gray-900">{item.title}</h2>
                                        <p className="text-base leading-relaxed mt-2">{item.description}</p>
                                        <h2 className="text-xl font-medium title-font text-gray-900 mt-2">{item.price}</h2>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </OwlCarousel>
                </div>
            </section>

            <section className="text-gray-600 body-font mt-20 mx-[150px]" style={{ marginBottom: '250px' }}>
                <h1 className="text-center judul text-xl mb-10">Banner</h1>
                <div className="container px-5 py-8 mx-auto">
                    <OwlCarousel className="owl-theme" {...bannerOptions}>
                        {bannerItems.map(item => (
                            <div className="item" key={item._id}>
                                <div
                                    onClick={() => handleItemClick(item)}
                                    className="mb-10 px-4 cursor-pointer"
                                    style={{ width: '260px', height: '800px' }}
                                >
                                    <div className="overflow-hidden">
                                        <img alt="content" className="object-cover object-center h-auto w-auto" src={item.imageUrl} />
                                    </div>
                                    <div className="text-center">
                                        <h2 className="text-xl font-medium title-font text-gray-900">{item.title}</h2>
                                        <p className="text-base leading-relaxed mt-2">{item.description}</p>
                                        <h2 className="text-xl font-medium title-font text-gray-900 mt-2">{item.price}</h2>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </OwlCarousel>
                </div>
            </section>
        </Layout>
    );
};

export default ProductCatalog;
