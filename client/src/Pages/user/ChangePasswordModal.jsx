import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { baseURL } from '../../api/private.client';

const ChangePasswordModal = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('Password and Confirm Password do not match');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('user_token');

      const { data } = await axios.put(
        baseURL + '/auth/change-password',
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(data.message);
      handleCloseModal(); // Menutup modal setelah perubahan password berhasil
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(error.response?.data?.error || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    // Reset input fields
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');

    // Close the modal
    onClose();
  };

  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="bg-white rounded-lg w-96 p-6">
        <div className="flex justify-end">
          <button
            className="text-[#BA6264] hover:text-red-500 focus:outline-none"
            onClick={handleCloseModal}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="oldPassword" className="block text-sm text-gray-700 mb-2">
              Old Password
            </label>
            <input
              type="password"
              id="oldPassword"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-sm text-gray-700 mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-sm text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-[#BA6264] text-white px-4 py-2 rounded hover:bg-[#a55253] focus:outline-none focus:bg-[#a55253] mr-2"
              onClick={handleChangePassword}
              disabled={loading}
            >
              {loading ? 'Changing...' : 'Change Password'}
            </button>
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
