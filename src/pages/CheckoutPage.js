import React, { useState } from 'react';
import { 
  Container, Row, Col, Card, Form, Button, 
  Alert, ListGroup, Badge, Modal 
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);
  
  const [shippingInfo, setShippingInfo] = useState({
    fullName: user?.name ? `${user.name.firstname} ${user.name.lastname}` : '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    zipCode: user?.address?.zipcode || '',
    country: 'USA'
  });
  
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [cardInfo, setCardInfo] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);

  const shippingCost = totalPrice > 50 ? 0 : 5.99;
  const tax = totalPrice * 0.08;
  const finalTotal = totalPrice + shippingCost + tax;

  const handleShippingChange = (e) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleCardChange = (e) => {
    setCardInfo({
      ...cardInfo,
      [e.target.name]: e.target.value
    });
  };

  const generateOrderNumber = () => {
    return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.address) {
      toast.error('Please fill in all required shipping information');
      return;
    }
    
    if (paymentMethod === 'credit-card') {
      if (!cardInfo.cardNumber || !cardInfo.cardName || !cardInfo.expiryDate || !cardInfo.cvv) {
        toast.error('Please fill in all card details');
        return;
      }
    }

    // Generate order details
    const order = {
      orderId: generateOrderNumber(),
      date: new Date().toISOString().split('T')[0],
      items: cartItems,
      shipping: shippingInfo,
      payment: paymentMethod,
      subtotal: totalPrice,
      shippingCost,
      tax,
      total: finalTotal,
      status: 'Processing'
    };

    setOrderDetails(order);
    setShowSuccessModal(true);
    
    // Clear cart
    dispatch(clearCart());
    
    // Save order to localStorage (in a real app, this would be an API call)
    const userOrders = JSON.parse(localStorage.getItem(`orders_${user?.id}`)) || [];
    userOrders.unshift(order);
    localStorage.setItem(`orders_${user?.id}`, JSON.stringify(userOrders));
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info" className="mb-4">
          <h4>Your cart is empty</h4>
          <p>Add some products to checkout</p>
        </Alert>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Checkout</h1>
      
      <Row>
        <Col lg={8}>
          {/* Shipping Information */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Shipping Information</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        value={shippingInfo.fullName}
                        onChange={handleShippingChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Country</Form.Label>
                      <Form.Select
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                      >
                        <option value="USA">United States</option>
                        <option value="UK">United Kingdom</option>
                        <option value="CA">Canada</option>
                        <option value="AU">Australia</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Address *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleShippingChange}
                    placeholder="Street address"
                    required
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code *</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={shippingInfo.zipCode}
                        onChange={handleShippingChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>

          {/* Payment Method */}
          <Card className="mb-4 shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Payment Method</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-4">
                <Form.Check
                  type="radio"
                  id="credit-card"
                  label="💳 Credit/Debit Card"
                  name="paymentMethod"
                  checked={paymentMethod === 'credit-card'}
                  onChange={() => setPaymentMethod('credit-card')}
                  className="mb-3"
                />
                
                {paymentMethod === 'credit-card' && (
                  <div className="p-3 border rounded">
                    <Row>
                      <Col md={12}>
                        <Form.Group className="mb-3">
                          <Form.Label>Card Number *</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardNumber"
                            value={cardInfo.cardNumber}
                            onChange={handleCardChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength="19"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Cardholder Name *</Form.Label>
                          <Form.Control
                            type="text"
                            name="cardName"
                            value={cardInfo.cardName}
                            onChange={handleCardChange}
                            placeholder="JOHN DOE"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>Expiry Date *</Form.Label>
                          <Form.Control
                            type="text"
                            name="expiryDate"
                            value={cardInfo.expiryDate}
                            onChange={handleCardChange}
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label>CVV *</Form.Label>
                          <Form.Control
                            type="password"
                            name="cvv"
                            value={cardInfo.cvv}
                            onChange={handleCardChange}
                            placeholder="123"
                            maxLength="3"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                )}
                
                <Form.Check
                  type="radio"
                  id="paypal"
                  label="💰 PayPal"
                  name="paymentMethod"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                  className="mb-3"
                />
                
                <Form.Check
                  type="radio"
                  id="cod"
                  label="📦 Cash on Delivery"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          {/* Order Summary */}
          <Card className="sticky-top shadow-sm" style={{ top: '20px' }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush" className="mb-3">
                {cartItems.map(item => (
                  <ListGroup.Item key={item.id} className="d-flex justify-content-between">
                    <div>
                      <h6 className="mb-1">{item.title.substring(0, 20)}...</h6>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="text-end">
                      <div>${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              <ListGroup variant="flush" className="mb-3">
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Shipping</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `$${shippingCost.toFixed(2)}`
                    )}
                  </span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="d-flex justify-content-between fw-bold fs-5">
                  <span>Total</span>
                  <span className="text-primary">${finalTotal.toFixed(2)}</span>
                </ListGroup.Item>
              </ListGroup>
              
              <div className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="I agree to the Terms & Conditions"
                  required
                />
              </div>
              
              <Button
                variant="primary"
                size="lg"
                className="w-100 py-3"
                onClick={handlePlaceOrder}
              >
                Place Order - ${finalTotal.toFixed(2)}
              </Button>
              
              <small className="text-muted d-block text-center mt-3">
                Your personal data will be used to process your order
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>🎉 Order Confirmed!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderDetails && (
            <>
              <div className="text-center mb-4">
                <div className="display-1 text-success mb-3">✓</div>
                <h3>Thank You for Your Order!</h3>
                <p className="text-muted">
                  Your order has been placed successfully
                </p>
              </div>
              
              <Card className="mb-3">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Order Number:</strong></p>
                      <h4>{orderDetails.orderId}</h4>
                    </Col>
                    <Col md={6}>
                      <p><strong>Order Date:</strong></p>
                      <h4>{orderDetails.date}</h4>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Card className="mb-3">
                <Card.Body>
                  <h5>Order Summary</h5>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span>Subtotal</span>
                      <span>${orderDetails.subtotal.toFixed(2)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span>Shipping</span>
                      <span>${orderDetails.shippingCost.toFixed(2)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span>Tax</span>
                      <span>${orderDetails.tax.toFixed(2)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between fw-bold">
                      <span>Total</span>
                      <span className="text-primary">${orderDetails.total.toFixed(2)}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
              
              <Alert variant="info">
                <p className="mb-0">
                  We've sent a confirmation email to {orderDetails.shipping.email}. 
                  You can track your order in your account.
                </p>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowSuccessModal(false)}>
            Continue Shopping
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/orders');
            }}
          >
            View My Orders
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CheckoutPage;