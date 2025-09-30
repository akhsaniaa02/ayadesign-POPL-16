import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const OrderDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state;

  let names = null;
  let descriptions = null;

  if (order.name) {
    names = order.name.split(',').map((name, index) => (
      <li key={index} className="mb-2 list-disc">
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">Nama</span>
        <span className="text-base font-medium text-gray-700 dark:text-gray-300 ml-[28px]">: {name.trim()}</span>
      </li>
    ));
  }

  if (order.description) {
    descriptions = order.description.split(',').map((desc, index) => (
      <div key={index} className="mb-2">
        <span className="text-base font-medium text-gray-700 dark:text-gray-300">Deskripsi</span>
        <span className="text-base font-medium text-gray-700 dark:text-gray-300 ml-2">: {desc.trim()}</span>
      </div>
    ));
  }

  return (
    <div className='mb-10'>
      <div className="mt-6 ml-14 px-4 py-2"></div>
      <div className="flex my-4 mx-12">
        <div className="w-1/3 p-4 ">
          <img className="h-[500px]" src={order.imageUrl} alt="Product Image" />
        </div>
        <div className="w-2/4 p-4">
          <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
            {order.imageUrl.includes('banner') ? 'Design Banner' : 'Design Photocard'}
          </h2>
          <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            {order.imageUrl.includes('banner') ? 'Ukuran Banner' : 'Ukuran Photocard'}
          </h3>
          <p className="text-base text-gray-700 dark:text-gray-300">Panjang: 60 cm</p>
          <p className="text-base text-gray-700 dark:text-gray-300 mb-5">Lebar: 160 cm</p>
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Detail Pemesanan</h3>
          <div className="flex items-start mb-4">
            <span className="text-lg text-gray-700 dark:text-gray-300">Judul :</span>
            <span className="text-lg text-gray-700 dark:text-gray-300 ml-2">{order.title}</span>
          </div>
          {names && (
            <ul className="mb-4">
              {names.map((name, index) => (
                <div key={index} className="mb-2">
                  {name}
                  {index < descriptions.length && descriptions[index]}
                </div>
              ))}
            </ul>
          )}
        </div>
        <div className="w-1/4 p-4 mx-4 ml-6 mr-12">
          <h3 className="text-lg text-gray-700 dark:text-gray-300 mb-2">Harga Design Banner</h3>
          <p className="font-semibold text-gray-900 dark:text-white">{order.price}</p>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-4">
        <button
          onClick={() => navigate('/cart')}
          className='inline-flex items-center justify-center px-4 py-2 text-white bg-[#BA6264] border border-transparent rounded-xl font-medium hover:bg-[#A65253] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BA6264] shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl'>
          Back to Cart
        </button>

      </div>
    </div>
  );
};

export default OrderDetail;
