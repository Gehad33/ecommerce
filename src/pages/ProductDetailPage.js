import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../features/products/productsSlice';
import { addToCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, status, error } = useSelector((state) => state.products);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (selectedProduct) {
      const productToAdd = { ...selectedProduct, quantity };
      dispatch(addToCart(productToAdd));
      toast.success(`${selectedProduct.title} added to cart!`);
    }
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-warning">★</span>);
      } else {
        stars.push(<span key={i} className="text-secondary">★</span>);
      }
    }

    return stars;
  };

  if (status === 'loading') {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading product details...</p>
      </Container>
    );
  }

  if (error || !selectedProduct) {
    return (
      <Container>
        <Alert variant="danger">
          Failed to load product. Please try again.
        </Alert>
        <Link to="/products" className="btn btn-primary">
          ← Back to Products
        </Link>
      </Container>
    );
  }

  return (
    <Container>
      <Link to="/products" className="btn btn-outline-secondary mb-4">
        ← Back to Products
      </Link>

      <Row className="g-4">
        <Col lg={6}>
          <div className="border rounded p-4 text-center bg-white">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.title}
              className="img-fluid"
              style={{ maxHeight: '500px', objectFit: 'contain' }}
            />
          </div>
        </Col>

        <Col lg={6}>
          <div className="p-3">
            <Badge bg="info" className="mb-3">
              {selectedProduct.category}
            </Badge>
            
            <h1 className="h2 mb-3">{selectedProduct.title}</h1>
            
            <div className="d-flex align-items-center mb-3">
              {renderRatingStars(selectedProduct.rating?.rate || 0)}
              <span className="ms-2">
                {selectedProduct.rating?.rate || 4.5}
              </span>
              <span className="text-muted ms-2">
                ({selectedProduct.rating?.count || 100} reviews)
              </span>
            </div>

            <h2 className="text-primary mb-4">${selectedProduct.price}</h2>

            <p className="lead mb-4">{selectedProduct.description}</p>

            <div className="mb-4">
              <strong>Available:</strong>
              <Badge bg="success" className="ms-2">
                In Stock
              </Badge>
            </div>

            <div className="d-flex align-items-center mb-4">
              <strong className="me-3">Quantity:</strong>
              <div className="d-flex align-items-center">
                <Button
                  variant="outline-secondary"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="mx-3" style={{ minWidth: '40px', textAlign: 'center' }}>
                  {quantity}
                </span>
                <Button
                  variant="outline-secondary"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </Button>
              </div>
            </div>

            <div className="d-flex gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                className="flex-grow-1"
              >
                Add to Cart
              </Button>
              <Link to="/cart" className="btn btn-success btn-lg">
                Buy Now
              </Link>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetailPage;