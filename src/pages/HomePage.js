import React, { useEffect } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../features/products/productsSlice';
import ProductCard from '../components/ProductCard';
import MarqueeSlider from '../components/MarqueeSlider';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: products, status } = useSelector((state) => state.products);

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }
  }, [dispatch, products.length]);

  const featuredProducts = products.slice(0, 8);
  const bestSellers = products.slice(3, 7);
  const electronics = products.filter(p => p.category === 'electronics').slice(0, 4);

  return (
    <>
      <MarqueeSlider />
      
      {/* Hero Section مع صورة خلفية */}
      <section 
        className="py-5 mb-5 position-relative overflow-hidden"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '15px',
          color: 'white'
        }}
      >
        <Container className="position-relative z-1">
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="mb-4">
                <Badge bg="warning" text="dark" className="fs-6 px-3 py-2 mb-3">
                  🎉 Exclusive Online Store
                </Badge>
                <h1 className="display-4 fw-bold mb-4">
                  Welcome to <span className="text-primary">MyStore</span>
                </h1>
                <p className="lead mb-4 fs-5" style={{ opacity: 0.9 }}>
                  Discover amazing products at unbeatable prices. 
                  From electronics to fashion, we have everything you need!
                </p>
              </div>
              
              <div className="d-flex flex-wrap gap-3 mb-4">
                <Link to="/products">
                  <Button variant="primary" size="lg" className="px-4 py-3 fw-bold">
                    <span className="me-2">🛍️</span> Shop Now
                  </Button>
                </Link>
                <Link to="/products">
                  <Button variant="outline-light" size="lg" className="px-4 py-3 fw-bold">
                    <span className="me-2">🔥</span> Hot Deals
                  </Button>
                </Link>
              </div>

              {/* Features Icons */}
              <div className="d-flex flex-wrap gap-4 mt-4">
                <div className="d-flex align-items-center">
                  <div className="bg-primary rounded-circle p-2 me-2">
                    <span className="text-white">🚚</span>
                  </div>
                  <span>Free Shipping</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-success rounded-circle p-2 me-2">
                    <span className="text-white">💳</span>
                  </div>
                  <span>Secure Payment</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="bg-warning rounded-circle p-2 me-2">
                    <span className="text-dark">⭐</span>
                  </div>
                  <span>Best Quality</span>
                </div>
              </div>
            </Col>
            
            <Col lg={6} className="text-center">
              <div className="position-relative">
               
<img
  src="https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  alt="Featured Product"
  className="img-fluid rounded shadow-lg"
  style={{ 
    maxHeight: '400px',
    objectFit: 'cover',
    border: '5px solid white',
    transform: 'rotate(5deg)'
  }}
/>
                <div className="position-absolute top-0 start-0 bg-danger text-white px-3 py-2 rounded shadow"
                  style={{ transform: 'translate(-20%, -20%)' }}>
                  <strong>-30% OFF</strong>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Categories Section */}
      <section className="py-4 mb-5">
        <h2 className="fw-bold text-center mb-5">Shop By Category</h2>
        <Row className="g-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100 text-center hover-scale">
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                <div className="display-4 mb-3">📱</div>
                <Card.Title>Electronics</Card.Title>
                <Card.Text className="text-muted">
                  Latest gadgets & devices
                </Card.Text>
                <Link to="/products?category=electronics" className="btn btn-outline-primary mt-2">
                  Shop Now
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100 text-center hover-scale">
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                <div className="display-4 mb-3">👕</div>
                <Card.Title>Fashion</Card.Title>
                <Card.Text className="text-muted">
                  Trendy clothes & accessories
                </Card.Text>
                <Link to="/products?category=men's clothing" className="btn btn-outline-primary mt-2">
                  Shop Now
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100 text-center hover-scale">
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                <div className="display-4 mb-3">💎</div>
                <Card.Title>Jewelry</Card.Title>
                <Card.Text className="text-muted">
                  Beautiful jewelry collections
                </Card.Text>
                <Link to="/products?category=jewelery" className="btn btn-outline-primary mt-2">
                  Shop Now
                </Link>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100 text-center hover-scale">
              <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                <div className="display-4 mb-3">🏠</div>
                <Card.Title>Home</Card.Title>
                <Card.Text className="text-muted">
                  Home essentials & decor
                </Card.Text>
                <Link to="/products" className="btn btn-outline-primary mt-2">
                  Shop Now
                </Link>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>

      {/* Featured Products */}
      <section className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">🔥 Featured Products</h2>
            <p className="text-muted">Most popular items this week</p>
          </div>
          <Link to="/products" className="btn btn-outline-primary">
            View All Products →
          </Link>
        </div>
        
        {status === 'loading' ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : status === 'failed' ? (
          <div className="text-center py-5">
            <div className="alert alert-danger">
              Failed to load products. Please try again later.
            </div>
          </div>
        ) : (
          <Row xs={1} md={2} lg={4} className="g-4">
            {featuredProducts.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        )}
      </section>

      {/* Banner */}
      <section className="py-5 my-5">
        <div className="bg-gradient-primary text-white rounded-4 p-5 text-center"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
          }}>
          <h2 className="display-5 fw-bold mb-4">Summer Sale! Up to 50% OFF</h2>
          <p className="fs-5 mb-4">Limited time offer. Don't miss out on amazing deals!</p>
          <Link to="/products">
            <Button variant="light" size="lg" className="fw-bold px-5 py-3">
              Shop Sale Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="py-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">⭐ Best Sellers</h2>
              <p className="text-muted">Customer favorites</p>
            </div>
            <Link to="/products?sort=rating" className="btn btn-outline-primary">
              See More →
            </Link>
          </div>
          
          <Row xs={1} md={2} lg={4} className="g-4">
            {bestSellers.map((product) => (
              <Col key={product.id}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </section>
      )}
    </>
  );
};

// إضافة Badge component إذا لم يكن موجوداً
const Badge = ({ bg, text, children, className, ...props }) => (
  <span className={`badge bg-${bg} text-${text} ${className}`} {...props}>
    {children}
  </span>
);

export default HomePage;