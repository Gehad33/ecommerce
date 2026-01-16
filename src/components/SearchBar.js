import React, { useState, useEffect, useRef } from 'react';
import { Form, Button, Dropdown, Badge, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, setFilteredProducts } from '../features/products/productsSlice';
import { Search, X } from 'react-bootstrap-icons';

const SearchBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, searchQuery } = useSelector((state) => state.products);
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
  };

  return (
    <div className="position-relative" ref={searchRef}>
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
            style={{ minWidth: '300px' }}
          />
          {query && (
            <Button
              variant="link"
              className="position-absolute end-0 top-50 translate-middle-y me-2 text-muted"
              onClick={handleClearSearch}
              style={{ zIndex: 10 }}
            >
              <X size={18} />
            </Button>
          )}
        </div>
        <Button 
          variant="primary" 
          type="submit" 
          className="rounded-pill ms-2"
          disabled={!query.trim()}
        >
          <Search size={18} />
        </Button>
      </Form>

      {/* نتائج البحث */}
      {showResults && filteredProducts.length > 0 && (
        <Card className="position-absolute start-0 end-0 mt-2 shadow-lg border-0"
          style={{ 
            zIndex: 1050,
            maxHeight: '400px',
            overflowY: 'auto'
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
                className="p-3 border-bottom hover-bg-light cursor-pointer"
                onClick={() => handleProductClick(product)}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="rounded me-3"
                    style={{ width: '50px', height: '50px', objectFit: 'contain' }}
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
          style={{ zIndex: 1050 }}>
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
  );
};

export default SearchBar;