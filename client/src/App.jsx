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
import ProductDetail from './Pages/user/ProductDetail';
import CartPage from './Pages/user/CartPage';
import OrderDetail from './Pages/user/OrderDetail';
import ScrollToTop from './Components/Elements/ScrollToTop';

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
        <Route path="/profile" element={isAuthenticated ? <UpdateProfile/> : <Navigate to="/dashboard" />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/Faq" element={<Faq />} />
        <Route path="/HowToOrder" element={<HowToOrder />} />
        <Route path="/productcatalog" element={<ProductCatalog />} />
        <Route path="/productdetail/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/cart/detail/" element={<OrderDetail />} />
        <Route path="/insert" element={<InsertDataPage />} />
      
      </Routes>
    </Router>
  );
};

export default App;
