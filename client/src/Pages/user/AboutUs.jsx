import React from 'react';

import { Link } from 'react-router-dom';
import Layout from '../../Components/Layouts/Layout';
const AboutUs = () => {
    return (
        <Layout>
            <section className="text-gray-600 body-font">
                <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 flex justify-center">
                        <img className="object-cover object-center rounded h-40 mx-auto" alt="hero" src="../assets/image/aya-design.png" />
                    </div>
                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                        <h1 className="title-font sm:text-2xl text-xl mb-4 font-medium text-gray-900">About Us</h1>
                        <p className="mb-8 leading-relaxed text-xl">ayadsign adalah tempat dimana kamu bisa memesan jasa design kekinian dengan acrylic frame nya yang dipromosikan melalui akun Instagram. Yuk, jangan lupa di-follow dulu! <a href="https://www.instagram.com/ayadsign?igsh=MWVibXhjanltcTc2aQ==">@ayadsign</a>.</p>
                    </div>
                </div>
            </section>

            <section className="text-gray-600 body-font">
                <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                        <h1 className="title-font sm:text-2xl text-xl mb-4 font-medium text-gray-900">Social Media ayadsign</h1>
                        <p className="mb-8 leading-relaxed text-xl">Temukan jasa desain kekinian yang memukau di Ayadsign! Kami menghadirkan berbagai karya menawan dengan acrylic frame yang bisa kamu pesan langsung. Jangan lewatkan kesempatan untuk mempercantik ruangmu dengan sentuhan kreatif dari kami. Yuk, follow Instagram kami di @ayadsign untuk update terbaru dan inspirasi desain!</p>
                    </div>
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 flex justify-center">
                        <img className="object-cover object-center rounded h-42 mx-auto" alt="hero" src="../assets/image/instagram.png" />
                    </div>
                </div>
            </section>

            <section className="text-gray-600 body-font">
                <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                    <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0 flex justify-center">
                        <img className="object-cover object-center rounded h-42 mx-auto" alt="hero" src="../assets/image/akrilik.png" />
                    </div>
                    <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
                        <h1 className="title-font sm:text-2xl text-xl mb-4 font-medium text-gray-900">Acrylic Frame</h1>
                        <p className="mb-8 leading-relaxed text-xl">Acrylic frame ini cocok banget untuk hadiah ulang tahun, kado wisuda, kado kenang-kenangan, dan lain-lain. Dengan harga yang terjangkau, kamu bisa revisi sepuasnya! Foto-foto kamu akan menjadi lebih menarik kalau diabadikan dalam frame acrylic sebagai pajangan di kamar atau di mana pun. Selain desain frame acrylic, ayadsign juga menyediakan banner design dan fotostrip. Menarik nih! Tanpa kamu pergi ke photobox, kamu bisa memasukkan foto kamu ke dalam fotostrip yang sudah disediakan di ayadsign!</p>
                    </div>
                </div>
            </section>
        </Layout>
    );
};

export default AboutUs;
