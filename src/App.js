import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';

// Components
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import BackToTop from './components/BackToTop';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';

// Redux actions - المسار الصحيح
import { loadCart } from './features/cart/cartSlice';

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    // تحميل عربة المستخدم عند تحميل التطبيق
    dispatch(loadCart());
  }, [dispatch, user]);

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <NavigationBar />
        <Container className="flex-grow-1 py-4">
          <Routes>
            {/* الصفحة الرئيسية */}
            <Route path="/" element={<HomePage />} />
            
            {/* الصفحات العامة */}
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* الصفحات المحمية - تحتاج تسجيل دخول */}
            <Route 
              path="/profile" 
              element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/checkout" 
              element={
                <PrivateRoute>
                  <CheckoutPage />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/orders" 
              element={
                <PrivateRoute>
                  <OrdersPage />
                </PrivateRoute>
              } 
            />
            
            {/* إعادة توجيه أي صفحة غير موجودة للصفحة الرئيسية */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Container>
        <Footer />
        <BackToTop />
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
              borderRadius: '10px',
            },
            success: {
              icon: '🎉',
              style: {
                background: '#28a745',
              },
            },
            error: {
              icon: '❌',
              style: {
                background: '#dc3545',
              },
            },
            loading: {
              style: {
                background: '#007bff',
              },
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;