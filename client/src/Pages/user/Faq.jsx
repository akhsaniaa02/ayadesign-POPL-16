import React from 'react';
import Layout from '../../Components/Layouts/Layout';
const Faq = () => {
    return (
        <Layout>
            <section className="text-gray-600 body-font mb-20">
                <div className="container px-5 py-24 mx-auto">
                    <div className="flex flex-col text-center w-full mb-12">
                        <div className="mb-4">
                            <h1 className="inline-block text-5xl font-bold" style={{ color: '#BA6264', marginRight: '-5px' }}>F</h1>
                            <h1 className="inline-block text-5xl font-bold" style={{ color: '#142131' }}>AQs</h1>
                        </div>
                    </div>

                    <div className="lg:w-2/3 mx-auto">
                        <ul className="list-decimal list-inside text-left space-y-4">
                            <li>
                                <strong>Berapa harga design dengan Acrylic Frame?</strong>
                                <p className="ml-4">Untuk harga Rp. 38.000 sudah include Acrylic Frame</p>
                            </li>
                            <li>
                                <strong>Apakah boleh request design?</strong>
                                <p className="ml-4">Untuk request design boleh banget, kasih referensi untuk dipertimbangkan oleh owner.</p>
                            </li>
                            <li>
                                <strong>Berapa kali boleh revisi?</strong>
                                <p className="ml-4">Untuk semua design bebas revisi.</p>
                            </li>
                            <li>
                                <strong>Pengambilan barangnya gimana?</strong>
                                <p className="ml-4">Untuk pengambilan barang bisa melalui go-send dan ambil ke tempat dengan jadwal yang ditentukan owner.</p>
                            </li>
                            <li>
                                <strong>Untuk pembayaran bagaimana kak?</strong>
                                <p className="ml-4">Pembayaran bisa melalui cash dan transfer rekening BSI atau BCA.</p>
                            </li>
                        </ul>
                    </div>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base text-center mt-20 font-bold">Thank You For Visit Us!</p>
                </div>
            </section>
        </Layout>
    );
}

export default Faq;
