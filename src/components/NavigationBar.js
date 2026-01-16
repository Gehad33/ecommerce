import React, { useState, useEffect, useRef } from 'react';
import { Navbar, Nav, Container, Badge, Form, Button, Dropdown, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setFilteredProducts } from '../features/products/productsSlice';

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { items: products, searchQuery } = useSelector((state) => state.products);
  
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
    dispatch(setSearchQuery(''));
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
            <Nav.Link onClick={handleDealsClick} className="mx-3 fw-bold cursor-pointer">
              🔥 Deals
            </Nav.Link>
            <Nav.Link onClick={handleBestSellersClick} className="mx-3 fw-bold cursor-pointer">
              ⭐ Best Sellers
            </Nav.Link>
          </Nav>
          
          <div className="d-flex align-items-center">
            {/* شريط البحث */}
            <div className="position-relative me-3" ref={searchRef}>
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
                    style={{ minWidth: '250px' }}
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
                    animation: 'slideDown 0.3s ease-out'
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
                          onClick={() => {
                            handleSearch({ preventDefault: () => {} });
                          }}
                        >
                          View all results →
                        </Button>
                      </div>
                    </div>
                    
                    {filteredProducts.map((product) => (
                      <div 
                        key={product.id}
                        className="p-3 border-bottom hover-bg-light cursor-pointer search-result-card"
                        onClick={() => handleProductClick(product)}
                        style={{ cursor: 'pointer' }}
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
                              backgroundColor: '#f8f9fa'
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://via.placeholder.com/50x50?text=Product";
                            }}
                          />
                          <div className="flex-grow-1">
                            <div className="d-flex justify-content-between">
                              <h6 className="mb-1" style={{ maxWidth: '250px' }}>
                                {product.title.length > 40 
                                  ? `${product.title.substring(0, 40)}...` 
                                  : product.title}
                              </h6>
                              <Badge bg="warning" text="dark" className="ms-2">
                                ${product.price}
                              </Badge>
                            </div>
                            <div className="d-flex align-items-center">
                              <Badge bg="info" className="me-2">
                                {product.category}
                              </Badge>
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
                    animation: 'slideDown 0.3s ease-out'
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
              className="position-relative rounded-pill"
              onClick={() => navigate('/cart')}
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
          </div>
        </Navbar.Collapse>
      </Container>

      <style jsx="true">{`
        .cursor-pointer {
          cursor: pointer !important;
        }
        .hover-bg-light:hover {
          background-color: rgba(0, 0, 0, 0.05) !important;
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .search-result-card {
          transition: all 0.2s ease;
        }
        .search-result-card:hover {
          transform: translateX(5px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
      `}</style>
    </Navbar>
  );
};

export default NavigationBar;