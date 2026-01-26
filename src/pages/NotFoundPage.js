import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <div className="display-1 fw-bold text-primary mb-3">404</div>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="lead text-muted mb-5">
            The page you're looking for doesn't exist or has been moved.
          </p>
          
          <div className="d-flex justify-content-center gap-3">
            <Button as={Link} to="/" variant="primary" size="lg">
              🏠 Go Home
            </Button>
            <Button as={Link} to="/products" variant="outline-primary" size="lg">
              🛍️ Browse Products
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;