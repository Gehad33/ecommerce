import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
            <h5 className="mb-3">FakeStore</h5>
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
            </ul>
          </Col>

          <Col lg={2} md={6} className="mb-4">
            <h6>Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Electronics
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Jewelry
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Men's Clothing
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  Women's Clothing
                </a>
              </li>
            </ul>
          </Col>

          <Col lg={4} className="mb-4">
            <h6>Newsletter</h6>
            <p className="text-muted small mb-3">
              Subscribe to get special offers and updates
            </p>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Your email"
              />
              <button className="btn btn-primary" type="button">
                Subscribe
              </button>
            </div>
          </Col>
        </Row>

        <hr className="border-secondary" />

        <Row className="text-center">
          <Col>
            <p className="text-muted small mb-0">
              © {new Date().getFullYear()} FakeStore. All rights reserved.
              This is a demo store using FakeStore API.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;