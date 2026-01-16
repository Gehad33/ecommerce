import React, { useState } from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [isHovered, setIsHovered] = useState(false);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success(`${product.title} added to cart!`, {
      icon: '🛒',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  const handleQuickView = () => {
    // يمكن إضافة مودال للعرض السريع هنا
    toast.success('Quick view coming soon!');
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
        />
        
        {/* Badges */}
        <Badge
          bg="warning"
          text="dark"
          className="position-absolute top-0 start-0 m-2 px-3 py-2 rounded-pill fw-bold"
        >
          ${product.price}
        </Badge>
        
        {product.rating?.rate >= 4.5 && (
          <Badge
            bg="danger"
            className="position-absolute top-0 end-0 m-2 px-3 py-2 rounded-pill fw-bold"
          >
            ⭐ Top Rated
          </Badge>
        )}

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
                🛒 Add to Cart
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
          {product.title}
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
          <Link 
            to={`/product/${product.id}`} 
            className="btn btn-outline-primary flex-grow-1 rounded-pill"
          >
            👀 View Details
          </Link>
          <Button 
            variant="primary" 
            onClick={handleAddToCart}
            className="rounded-pill px-3"
            style={{ minWidth: '45px' }}
            title="Add to Cart"
          >
            +
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductCard;