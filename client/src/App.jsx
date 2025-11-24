import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './Pages/Dashboard';
import Login from './Auth/Login'
import Register from './Auth/Register';
import { Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Nav from './Components/Nav';
import AboutUs from './Pages/user/AboutUs';
import UpdateProfile from './Pages/user/UpdateProfile';
import Faq from './Pages/user/Faq';
import HowToOrder from './Pages/user/HowToOrder';
import ProductCatalog from './Pages/user/ProductCatalog';
import InsertDataPage from './Pages/admin/InsertDataPage';
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminOrders from './Pages/admin/AdminOrders';
import EditProductPage from './Pages/admin/EditProductPage';
import ProductDetail from './Pages/user/ProductDetail';
import CartPage from './Pages/user/CartPage';
import OrderDetail from './Pages/user/OrderDetail';
import MyOrders from './Pages/user/MyOrders';
import ScrollToTop from './Components/Elements/ScrollToTop';
import { ProtectedRoute, AdminRoute } from './Components/ProtectedRoute';

const App = () => {
  const { isAuthenticated } = useAuth()
  return (
    <Router>
      <ScrollToTop></ScrollToTop>
      <Routes>
        <Route path='/' element={!isAuthenticated ? <Dashboard /> : <Navigate to="/dashboard" />} /> 
        <Route path="/login" element={!isAuthenticated ? <Login/> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isAuthenticated ? <Register/> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Dashboard />} />
        <Route path="/profile" element={<ProtectedRoute><UpdateProfile/></ProtectedRoute>} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/Faq" element={<Faq />} />
        <Route path="/HowToOrder" element={<HowToOrder />} />
        <Route path="/productcatalog" element={<ProductCatalog />} />
        <Route path="/productdetail/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
        <Route path="/cart/detail/" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
        <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
        
        {/* Admin Routes - Protected */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/insert" element={<AdminRoute><InsertDataPage /></AdminRoute>} />
        <Route path="/admin/edit/:id" element={<AdminRoute><EditProductPage /></AdminRoute>} />
        <Route path="/insert" element={<AdminRoute><InsertDataPage /></AdminRoute>} />
      
      </Routes>
    </Router>
  );
};

export default App;
