import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsCamera } from 'react-icons/bs';
import { useAuth } from '../../contexts/AuthContext';
import Footer from '../../Components/Footer';
import Nav from '../../Components/Nav';
import ChangePasswordModal from './ChangePasswordModal'; // Pastikan path-nya sesuai dengan struktur proyek Anda
import { baseURL } from '../../api/private.client';

const UpdateProfile = () => {
  const [image, setImage] = useState({});
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { userData, login } = useAuth();
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setImage(userData.image);
      setEmail(userData.email);
    }
  }, [userData]);

  const handleImage = async (e) => {
    const file = e.target.files[0];
    let formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('user_token');

      setUploading(true);
      const { data } = await axios.post(baseURL + '/auth/upload-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUploading(false);
      setImage({
        url: data.url,
        public_id: data.public_id,
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('user_token');

      setLoading(true);
      const { data } = await axios.put(
        baseURL + '/auth/profile-update',
        {
          name,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      if (data) {
        login(token, data); // Memperbarui data pengguna di context atau state aplikasi
        toast.success('Profile Updated Successfully');
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Nav />
      <div className="flex items-center justify-center mb-4">
        <div className="w-full max-w-md">
          <h1 className="p-3 text-3xl text-center text-white">Profile Details</h1>
          <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md">
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />

            <div className="flex flex-col items-center mb-6">
              <label htmlFor="image" className="block mb-2">
                {image && image.url ? (
                  <img
                    src={image.url}
                    className="w-[200px] h-[200px] rounded-full object-cover border-4 border-[#BA6264]"
                    alt="User Avatar"
                  />
                ) : uploading ? (
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : (
                  <BsCamera
                    size={40}
                    style={{ cursor: 'pointer', color: '#BA6264' }}
                    onClick={() => setUploading(true)}
                  />
                )}
                <input
                  type="file"
                  accept="images/*"
                  onChange={handleImage}
                  name="image"
                  id="image"
                  hidden
                />
              </label>
            </div>

            <div className="mb-4">
              <label htmlFor="exampleInputName" className="block text-gray-700 mb-2">
                Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="w-full px-3 py-2 border-2 border-[#BA6264] rounded focus:outline-none focus:border-[#BA6264]"
                id="exampleInputName"
                aria-describedby="nameHelp"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="exampleInputEmail" className="block text-gray-700 mb-2">
                Email address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="w-full px-3 py-2 border-2 border-[#BA6264] rounded focus:outline-none focus:border-[#BA6264]"
                id="exampleInputEmail"
                aria-describedby="emailHelp"
                disabled
              />
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => setChangePasswordModalOpen(true)}
                className="btn btn-primary btn-lg px-6 py-2 text-white bg-[#BA6264] rounded-full hover:bg-[#a55253] focus:outline-none focus:ring-2 focus:ring-[#BA6264] focus:ring-opacity-50 mr-4"
              >
                Change Password
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-lg px-6 py-2 text-white bg-[#BA6264] rounded-full hover:bg-[#a55253] focus:outline-none focus:ring-2 focus:ring-[#BA6264] focus:ring-opacity-50"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span>Loading &nbsp;</span>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
      {/* Modal untuk mengubah password */}
      <ChangePasswordModal isOpen={isChangePasswordModalOpen} onClose={() => setChangePasswordModalOpen(false)} />
    </div>
  );
};

export default UpdateProfile;
