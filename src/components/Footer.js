import React from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-white mt-auto">
      {/* Features */}
      <Container className="py-4 border-bottom border-secondary">
        <Row className="text-center">
          <Col md={3} className="mb-3">
            <div className="mb-2 text-primary" style={{ fontSize: '30px' }}>🚚</div>
            <h6>Free Shipping</h6>
            <p className="small text-muted">On orders over $50</p>
          </Col>
          <Col md={3} className="mb-3">
            <div className="mb-2 text-primary" style={{ fontSize: '30px' }}>💳</div>
            <h6>Secure Payment</h6>
            <p className="small text-muted">100% secure payments</p>
          </Col>
          <Col md={3} className="mb-3">
            <div className="mb-2 text-primary" style={{ fontSize: '30px' }}>🛡️</div>
            <h6>30-Day Returns</h6>
            <p className="small text-muted">Money back guarantee</p>
          </Col>
          <Col md={3} className="mb-3">
            <div className="mb-2 text-primary" style={{ fontSize: '30px' }}>📞</div>
            <h6>24/7 Support</h6>
            <p className="small text-muted">Dedicated support</p>
          </Col>
        </Row>
      </Container>

      {/* Main Footer */}
      <Container className="py-4">
        <Row>
          <Col lg={4} className="mb-4">
            <h5 className="mb-3">MyStore</h5>
            <p className="text-muted">
              Your one-stop shop for all your needs. 
              Quality products at affordable prices.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-white" style={{ fontSize: '20px' }}>
                📘
              </a>
              <a href="#" className="text-white" style={{ fontSize: '20px' }}>
                🐦
              </a>
              <a href="#" className="text-white" style={{ fontSize: '20px' }}>
                📷
              </a>
              <a href="#" className="text-white" style={{ fontSize: '20px' }}>
                💼
              </a>
            </div>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6>Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-muted text-decoration-none">
                  Products
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-muted text-decoration-none">
                  Cart
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/profile" className="text-muted text-decoration-none">
                  My Account
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6>Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/products?category=electronics" className="text-muted text-decoration-none">
                  Electronics
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=jewelery" className="text-muted text-decoration-none">
                  Jewelry
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=men's clothing" className="text-muted text-decoration-none">
                  Men's Clothing
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=women's clothing" className="text-muted text-decoration-none">
                  Women's Clothing
                </Link>
              </li>
            </ul>
          </Col>

          <Col lg={4} className="mb-4">
            <h6>Newsletter</h6>
            <p className="text-muted small mb-3">
              Subscribe to get special offers and updates
            </p>
            <Form>
              <div className="input-group mb-3">
                <Form.Control
                  type="email"
                  placeholder="Your email"
                  aria-label="Your email"
                  className="rounded-0"
                />
                <Button variant="primary" className="rounded-0">
                  Subscribe
                </Button>
              </div>
            </Form>
            <small className="text-muted">
              By subscribing, you agree to our Privacy Policy
            </small>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <Row className="text-center">
          <Col>
            <p className="text-muted small mb-0">
              © {new Date().getFullYear()} MyStore. All rights reserved.
              This is a demo store using FakeStore API.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;