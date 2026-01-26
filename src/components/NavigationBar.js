import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Badge, Form, Button, Card, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setFilteredProducts, clearSearch } from '../features/products/productsSlice';
import { logout } from '../features/auth/authSlice';

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { items: products, searchQuery } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const [query, setQuery] = useState(searchQuery || '');
  const [showResults, setShowResults] = useState(false);
  const [filteredProducts, setLocalFilteredProducts] = useState([]);
  const searchRef = useRef(null);

  // إغلاق نتائج البحث عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // فلترة المنتجات عند تغيير البحث
  useEffect(() => {
    if (query.trim() === '') {
      setLocalFilteredProducts([]);
      dispatch(setFilteredProducts([]));
      return;
    }

    const searchTerm = query.toLowerCase();
    const results = products.filter(product => 
      product.title.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // عرض أول 5 نتائج فقط

    setLocalFilteredProducts(results);
    dispatch(setFilteredProducts(results));
  }, [query, products, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(setSearchQuery(query));
      navigate(`/products?search=${encodeURIComponent(query)}`);
      setShowResults(false);
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    dispatch(clearSearch());
    setLocalFilteredProducts([]);
    setShowResults(false);
  };

  const handleProductClick = (product) => {
    setQuery(product.title);
    setShowResults(false);
    navigate(`/product/${product.id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setShowResults(false);
    }
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  const handleDealsClick = () => {
    navigate('/products?sort=discount');
  };

  const handleBestSellersClick = () => {
    navigate('/products?sort=rating');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleAddToCartClick = () => {
    if (!user) {
      navigate('/login', { state: { message: 'Please login to add items to cart' } });
      return;
    }
    navigate('/cart');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top" className="shadow-lg">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
          <span className="text-primary">My</span>
          <span className="text-white">Store</span>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="mx-3 fw-bold">
              🏠 Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className="mx-3 fw-bold">
              🛍️ Products
            </Nav.Link>
            <Nav.Link onClick={handleDealsClick} className="mx-3 fw-bold" style={{ cursor: 'pointer' }}>
              🔥 Deals
            </Nav.Link>
            <Nav.Link onClick={handleBestSellersClick} className="mx-3 fw-bold" style={{ cursor: 'pointer' }}>
              ⭐ Best Sellers
            </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center">
            {/* شريط البحث */}
            <div className="position-relative me-3" ref={searchRef} style={{ minWidth: '300px' }}>
              <Form onSubmit={handleSearch} className="d-flex">
                <div className="position-relative flex-grow-1">
                  <Form.Control
                    type="search"
                    placeholder="Search products..."
                    className="rounded-pill pe-5"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setShowResults(true);
                    }}
                    onFocus={() => setShowResults(true)}
                    onKeyDown={handleKeyDown}
                    style={{ width: '100%' }}
                  />
                  {query && (
                    <Button
                      variant="link"
                      className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted p-0"
                      onClick={handleClearSearch}
                      style={{ 
                        zIndex: 10,
                        width: '20px',
                        height: '20px',
                        minWidth: '20px'
                      }}
                    >
                      ✕
                    </Button>
                  )}
                </div>
                <Button 
                  variant="outline-light" 
                  type="submit" 
                  className="rounded-pill ms-2"
                  disabled={!query.trim()}
                >
                  🔍
                </Button>
              </Form>

              {/* نتائج البحث */}
              {showResults && filteredProducts.length > 0 && (
                <Card className="position-absolute start-0 end-0 mt-2 shadow-lg border-0"
                  style={{ 
                    zIndex: 1050,
                    maxHeight: '400px',
                    overflowY: 'auto',
                    top: '100%'
                  }}>
                  <Card.Body className="p-0">
                    <div className="p-3 border-bottom bg-light">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Found {filteredProducts.length} results
                        </small>
                        <Button 
                          variant="link" 
                          size="sm" 
                          className="p-0 text-primary"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSearch(e);
                          }}
                        >
                          View all results →
                        </Button>
                      </div>
                    </div>
                    
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="p-3 border-bottom"
                        onClick={() => handleProductClick(product)}
                        style={{ 
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <div className="d-flex align-items-center">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="rounded me-3"
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              objectFit: 'contain',
                              backgroundColor: '#f8f9fa',
                              padding: '5px'
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'%3E%3Crect width='50' height='50' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='10' fill='%236c757d'%3EImage%3C/text%3E%3C/svg%3E";
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between align-items-start">
                              <h6 className="mb-1" style={{ maxWidth: '200px' }}>
                                {product.title.length > 30 
                                  ? `${product.title.substring(0, 30)}...` 
                                  : product.title}
                              </h6>
                              <Badge bg="warning" text="dark" className="ms-2">
                                ${product.price}
                              </Badge>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-info me-2">
                                {product.category}
                              </span>
                              <small className="text-muted">
                                ⭐ {product.rating?.rate || 4.5}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              )}

              {/* رسالة عدم وجود نتائج */}
              {showResults && query && filteredProducts.length === 0 && (
                <Card className="position-absolute start-0 end-0 mt-2 shadow-sm border-0"
                  style={{ 
                    zIndex: 1050,
                    top: '100%'
                  }}>
                  <Card.Body className="text-center py-4">
                    <div className="display-4 mb-3">🔍</div>
                    <h6>No products found</h6>
                    <p className="text-muted small mb-0">
                      Try different keywords or browse categories
                    </p>
                  </Card.Body>
                </Card>
              )}
            </div>
            
            {/* زر السلة */}
            <Button 
              variant="outline-light" 
              className="position-relative me-3 rounded-pill"
              onClick={handleAddToCartClick}
            >
              🛒 Cart
              {cartCount > 0 && (
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 start-100 translate-middle rounded-pill"
                  style={{ fontSize: '0.7rem' }}
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
            
            {/* أزرار تسجيل الدخول/تسجيل الخروج - تظهر دائماً */}
            {user ? (
              <Dropdown>
                <Dropdown.Toggle 
                  variant="outline-light" 
                  className="rounded-pill"
                  id="dropdown-user"
                >
                  👤 {user.username}
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Dropdown.Item as={Link} to="/profile">
                    👤 My Profile
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/orders">
                    📦 My Orders
                  </Dropdown.Item>
                  <Dropdown.Item as={Link} to="/checkout">
                    💳 Checkout
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout}>
                    🔓 Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-light" 
                  className="rounded-pill"
                >
                  🔑 Sign In
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary" 
                  className="rounded-pill"
                >
                  📝 Sign Up
                </Button>
              </div>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;