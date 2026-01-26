import React from 'react';
import { Container, Row, Col, Button, Card, Table, Form, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../features/cart/cartSlice';
import toast from 'react-hot-toast';

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const { user } = useSelector((state) => state.auth);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity >= 1) {
      dispatch(updateQuantity({ id, quantity: newQuantity }));
      toast.success('Quantity updated');
    }
  };

  const handleRemoveItem = (id, title) => {
    dispatch(removeFromCart(id));
    toast.error(`${title} removed from cart`);
  };

  const handleClearCart = () => {
    dispatch(clearCart());
    toast('Cart cleared', { icon: '🗑️' });
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to proceed to checkout', {
        icon: '🔒',
        duration: 3000,
      });
      navigate('/login', { 
        state: { 
          message: 'Please login to proceed to checkout',
          returnUrl: '/cart'
        } 
      });
      return;
    }
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <Container className="text-center py-5">
        <Alert variant="info" className="mb-4">
          <h4>Your cart is empty</h4>
          <p>Start shopping to add items to your cart!</p>
        </Alert>
        <Link to="/products" className="btn btn-primary btn-lg">
          ← Continue Shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="mb-4">Shopping Cart</h1>

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  Cart Items ({cartItems.length})
                </h5>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={handleClearCart}
                >
                  Clear Cart
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={item.image}
                            alt={item.title}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'contain',
                              marginRight: '15px',
                            }}
                          />
                          <div>
                            <Link
                              to={`/product/${item.id}`}
                              className="text-decoration-none"
                            >
                              <h6 className="mb-1" style={{ maxWidth: '250px' }}>
                                {item.title}
                              </h6>
                            </Link>
                            <small className="text-muted">
                              {item.category}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>
                        <Form.Control
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.id, parseInt(e.target.value) || 1)
                          }
                          style={{ width: '80px' }}
                        />
                      </td>
                      <td>
                        <strong>
                          ${(item.price * item.quantity).toFixed(2)}
                        </strong>
                      </td>
                      <td>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveItem(item.id, item.title)}
                        >
                          🗑️
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between mb-4">
            <Link to="/products" className="btn btn-outline-primary">
              ← Continue Shopping
            </Link>
            <Button variant="outline-secondary" onClick={handleClearCart}>
              Clear Shopping Cart
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '20px' }}>
            <Card.Header className="bg-light">
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success">FREE</span>
                    ) : (
                      `$${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (8%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-3">
                  <strong>Total</strong>
                  <strong className="text-primary h5">
                    ${total.toFixed(2)}
                  </strong>
                </div>

                {subtotal < 50 && (
                  <Alert variant="warning" className="small">
                    Add ${(50 - subtotal).toFixed(2)} more to get FREE shipping!
                  </Alert>
                )}

                {!user && (
                  <Alert variant="warning" className="mb-3">
                    <div className="d-flex align-items-center">
                      <span className="me-2">🔒</span>
                      <div>
                        <strong>Login required to checkout</strong>
                        <p className="mb-0">Please sign in to complete your purchase</p>
                      </div>
                    </div>
                  </Alert>
                )}

                <Button
                  variant={user ? "primary" : "warning"}
                  size="lg"
                  className="w-100 mb-2"
                  onClick={handleCheckout}
                  disabled={!user}
                >
                  {user ? 'Proceed to Checkout' : '🔒 Login to Checkout'}
                </Button>
                
                <Link to="/products" className="btn btn-outline-secondary w-100">
                  Continue Shopping
                </Link>

                {!user && (
                  <div className="mt-3">
                    <p className="text-center mb-2">Don't have an account?</p>
                    <div className="d-flex gap-2">
                      <Button 
                        as={Link} 
                        to="/login" 
                        variant="outline-primary" 
                        className="w-50"
                      >
                        Sign In
                      </Button>
                      <Button 
                        as={Link} 
                        to="/register" 
                        variant="primary" 
                        className="w-50"
                      >
                        Sign Up
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;