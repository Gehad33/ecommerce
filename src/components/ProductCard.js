import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isHovered, setIsHovered] = useState(false);
  const [isInWishlist, setIsInWishlist] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login to add items to cart', {
        icon: '🔒',
        duration: 3000,
      });
      navigate('/login', { 
        state: { 
          message: 'Please login to add items to cart',
          returnUrl: `/product/${product.id}`
        } 
      });
      return;
    }
    
    dispatch(addToCart(product));
    toast.success(`${product.title} added to cart!`, {
      icon: '🛒',
    });
  };

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login', { 
        state: { 
          message: 'Please login to add items to wishlist',
          returnUrl: `/product/${product.id}`
        } 
      });
      return;
    }
    
    setIsInWishlist(!isInWishlist);
    toast.success(
      isInWishlist 
        ? 'Removed from wishlist' 
        : 'Added to wishlist',
      {
        icon: isInWishlist ? '❌' : '❤️',
      }
    );
  };

  const handleQuickView = () => {
    // يمكن إضافة مودال للعرض السريع هنا
    toast.success('Quick view coming soon!');
  };

  const handleViewDetails = (e) => {
    e.preventDefault();
    navigate(`/product/${product.id}`);
  };

  return (
    <Card 
      className="h-100 border-0 shadow-sm hover-scale overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="position-relative overflow-hidden">
        <Card.Img
          variant="top"
          src={product.image}
          alt={product.title}
          style={{ 
            height: '220px', 
            objectFit: 'contain', 
            padding: '1rem',
            transition: 'transform 0.5s ease',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)'
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='14' fill='%236c757d'%3EProduct Image%3C/text%3E%3C/svg%3E";
          }}
        />
        
        {/* Badges */}
        <Badge
          bg="warning"
          text="dark"
          className="position-absolute top-0 start-0 m-2 px-3 py-2 rounded-pill fw-bold"
        >
          ${product.price}
        </Badge>
        
        {/* Wishlist Button */}
        <Button
          variant={isInWishlist ? "danger" : "outline-danger"}
          size="sm"
          className="position-absolute top-0 end-0 m-2 rounded-circle"
          onClick={handleWishlist}
          style={{ width: '36px', height: '36px' }}
        >
          {isInWishlist ? '❤️' : '🤍'}
        </Button>

        {/* Quick Actions on Hover */}
        {isHovered && (
          <div className="position-absolute bottom-0 start-0 end-0 p-3 bg-dark bg-opacity-75 text-center">
            <div className="d-flex justify-content-center gap-2">
              <Button 
                variant="light" 
                size="sm" 
                onClick={handleQuickView}
                className="rounded-pill px-3"
              >
                👁️ Quick View
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleAddToCart}
                className="rounded-pill px-3"
              >
                {user ? '🛒 Add to Cart' : '🔒 Login to Buy'}
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column p-3">
        <Badge bg="info" className="align-self-start mb-2 px-3 py-1 rounded-pill">
          {product.category}
        </Badge>
        
        <Card.Title className="fs-6 mb-2" style={{ height: '48px', overflow: 'hidden' }}>
          <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
            {product.title}
          </Link>
        </Card.Title>
        
        {/* Rating */}
        <div className="d-flex align-items-center mb-3">
          <div className="d-flex align-items-center me-2">
            {[...Array(5)].map((_, i) => (
              <span 
                key={i} 
                className={`fs-5 ${i < Math.floor(product.rating?.rate || 0) ? 'text-warning' : 'text-secondary'}`}
              >
                ★
              </span>
            ))}
          </div>
          <span className="text-muted small">
            ({product.rating?.count || 100})
          </span>
        </div>
        
        {/* Buttons */}
        <div className="mt-auto d-flex gap-2">
          <Button 
            variant="outline-primary" 
            onClick={handleViewDetails}
            className="flex-grow-1 rounded-pill"
          >
            👀 View Details
          </Button>
          <Button 
            variant={user ? "primary" : "warning"}
            onClick={handleAddToCart}
            className="rounded-pill px-3"
            style={{ minWidth: '45px' }}
            title={user ? "Add to Cart" : "Login Required"}
          >
            {user ? '+' : '🔒'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;