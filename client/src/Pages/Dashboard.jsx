import React from 'react'
import { Avatar, Button, Card, Typography, Flex } from 'antd'
import { useAuth } from '../contexts/AuthContext'
import { Link } from 'react-router-dom'
import Layout from '../Components/Layouts/Layout'
const Dashboard = () => {
  const { userData, logout, isAuthenticated } = useAuth()
  const handleLogout = async () => {
    await logout()
  }
  return (
      <Layout>
        <section className="text-gray-800 body-font">
          <div className="container px-10 py-16 mx-auto flex flex-wrap">
            <div className="flex flex-wrap -mx-4 lg:w-1/2 sm:w-2/3 content-start sm:pr-10 mt-14">
              <div className="flex w-full sm:px-4">
                <span className=''></span>
                <h1 className='inline-block font-bold text-4xl'>aya</h1>
                <span className=''></span>
                <h1 className='inline-block font-bold text-4xl color1'> design</h1>
              </div>
              <div className="w-full sm:p-4 px-4">
                <h1 className="title-font text-xl mb-2 text-gray-900">Create with your beloved ones here!</h1>
                <div className="leading-relaxed">
                  Temukan jasa desain kekinian yang memukau di Ayadsign! Kami menghadirkan berbagai karya menawan dengan acrylic frame yang bisa kamu pesan langsung. Jangan lewatkan kesempatan untuk mempercantik ruangmu dengan sentuhan kreatif dari kami.
                </div>
              </div>
              {isAuthenticated ? (
                <div className="w-full sm:px-4 mb-6">
                  <Link
                    to="/productcatalog"
                    className="inline-flex items-center justify-center px-4 py-2 text-white bg-[#BA6264] border border-transparent rounded-xl font-medium hover:bg-[#a55253] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BA6264] shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl mr-4"
                  >
                    Go Shopping
                  </Link>
                  <Link
                    to="/insert"
                    className="inline-flex items-center justify-center px-4 py-2 text-white bg-green-600 border border-transparent rounded-xl font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    Admin Panel
                  </Link>
                </div>
              ) : (
                <div className="w-full sm:px-4 mb-6">
                  <Link
                    to="/login"
                    className="inline-flex items-center justify-center px-4 py-2 text-white bg-[#BA6264] border border-transparent rounded-xl font-medium hover:bg-[#a55253] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BA6264] shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
                  >
                    Get Started
                  </Link>
                  <Link
                    to="/productcatalog"
                    className="inline-flex items-center justify-center px-4 py-2 text-white bg-[#BA6264] border border-transparent rounded-xl font-medium hover:bg-[#a55253] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BA6264] shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl ml-4"
                  >
                    Go Shopping
                  </Link>
                </div>
              )}

            </div>
            <div className="lg:w-1/2 sm:w-1/3 w-full rounded-lg overflow-hidden mt-7 sm:mt-0 relative" style={{ width: '600px', height: '400px' }}>
              {/* Div Pertama */}
              <div className="absolute inset-0 flex justify-between" style={{ width: '600px', height: '400px', marginLeft: '100px' }}>
                <img className="object-cover object-center w-1/3 h-full absolute top-0 left-0 ml-12" src="assets/image/foto-home-1.png" alt="Image 1 description" style={{ width: '231px', height: '154px' }} />
                <img className="object-cover object-center w-1/3 h-full absolute top-0 left-1/2 transform -translate-x-1/2 ml-24 mt-5" src="assets/image/foto-home-2.png" alt="Image 2 description" style={{ width: '231px', height: '315px' }} />
              </div>
              {/* Div Kedua */}
              <div className="absolute inset-0 flex justify-center items-center ml-32 mt-52" style={{ width: '400px', height: '150px' }}>
                <img className="object-cover object-center mb-12" src="assets/image/foto-home-3.png" alt="Image 3 description" style={{ width: '312px', height: '208px' }} />
              </div>
            </div>
          </div>
        </section>

        <section className="mb-60 mt-24">
          <h1 className="text-center">Collection</h1>
          <div className="container px-5 py-34 mx-auto ml-64 mt-10">
            <div className="flex flex-wrap -mx-4 -mb-10" style={{ width: '900px' }}>
              <div className="mb-10 px-4" style={{ width: '280px', height: '360px' }}>
                <div className="overflow-hidden">
                  <img alt="content" className="object-cover object-center h-96 w-auto" src="assets/image/newyaer.png" />
                </div>
              </div>
              <div className="py-10 px-4 ml-6" style={{ width: '280px', height: '360px' }}>
                <div className="overflow-hidden">
                  <img alt="content" className="object-cover object-center h-96 w-auto" src="assets/image/palestine.png" />
                </div>
              </div>
              <div className="mb-10 px-4" style={{ width: '280px', height: '300px' }}>
                <div className="overflow-hidden">
                  <img alt="content" className="object-cover object-center h-96 w-auto" src="assets/image/ramadhan.png" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </Layout>
  )
}

export default Dashboard