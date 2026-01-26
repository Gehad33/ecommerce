import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Table, Badge, 
  Button, Modal, ListGroup, Alert 
} from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  useEffect(() => {
    if (user) {
      // Load orders from localStorage
      const userOrders = JSON.parse(localStorage.getItem(`orders_${user.id}`)) || [];
      setOrders(userOrders);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const getStatusBadge = (status) => {
    const statusColors = {
      'Processing': 'warning',
      'Shipped': 'info',
      'Delivered': 'success',
      'Cancelled': 'danger'
    };
    
    return (
      <Badge bg={statusColors[status] || 'secondary'} className="order-status-badge">
        {status}
      </Badge>
    );
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleReorder = (order) => {
    // In a real app, this would add items to cart
    alert('This feature would add all items from this order to your cart');
  };

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>My Orders</h1>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Continue Shopping
        </Button>
      </div>

      {orders.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <div className="display-1 mb-3">📦</div>
            <h4>No orders yet</h4>
            <p className="text-muted mb-4">
              Start shopping to see your orders here
            </p>
            <Button variant="primary" onClick={() => navigate('/products')}>
              Shop Now
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Card className="shadow-sm">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="bg-light">
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.orderId}>
                        <td>
                          <strong>{order.orderId}</strong>
                        </td>
                        <td>{order.date}</td>
                        <td>{order.items.length}</td>
                        <td>${order.total.toFixed(2)}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              onClick={() => handleViewOrder(order)}
                            >
                              View
                            </Button>
                            <Button 
                              variant="outline-success" 
                              size="sm"
                              onClick={() => handleReorder(order)}
                            >
                              Reorder
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </>
      )}

      {/* Order Details Modal */}
      <Modal show={showOrderModal} onHide={() => setShowOrderModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Order Details - {selectedOrder?.orderId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Shipping Information</h6>
                  <p className="mb-1">
                    <strong>Name:</strong> {selectedOrder.shipping.fullName}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {selectedOrder.shipping.email}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {selectedOrder.shipping.phone || 'N/A'}
                  </p>
                  <p className="mb-0">
                    <strong>Address:</strong> {selectedOrder.shipping.address}, {selectedOrder.shipping.city}
                  </p>
                </Col>
                <Col md={6}>
                  <h6>Order Information</h6>
                  <p className="mb-1">
                    <strong>Order Date:</strong> {selectedOrder.date}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong> {getStatusBadge(selectedOrder.status)}
                  </p>
                  <p className="mb-1">
                    <strong>Payment:</strong> {selectedOrder.payment}
                  </p>
                </Col>
              </Row>

              <h6>Order Items</h6>
              <ListGroup variant="flush" className="mb-4">
                {selectedOrder.items.map(item => (
                  <ListGroup.Item key={item.id}>
                    <Row className="align-items-center">
                      <Col xs={2}>
                        <img
                          src={item.image}
                          alt={item.title}
                          className="img-fluid rounded"
                          style={{ maxHeight: '50px' }}
                        />
                      </Col>
                      <Col xs={5}>
                        <h6 className="mb-1">{item.title}</h6>
                        <small className="text-muted">${item.price} × {item.quantity}</small>
                      </Col>
                      <Col xs={2} className="text-center">
                        <Badge bg="info">{item.category}</Badge>
                      </Col>
                      <Col xs={3} className="text-end">
                        <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Card>
                <Card.Body>
                  <h6>Order Summary</h6>
                  <Row>
                    <Col md={8}>
                      <p className="mb-1">Subtotal</p>
                      <p className="mb-1">Shipping</p>
                      <p className="mb-1">Tax</p>
                      <p className="mb-0 fw-bold">Total</p>
                    </Col>
                    <Col md={4} className="text-end">
                      <p className="mb-1">${selectedOrder.subtotal.toFixed(2)}</p>
                      <p className="mb-1">${selectedOrder.shippingCost.toFixed(2)}</p>
                      <p className="mb-1">${selectedOrder.tax.toFixed(2)}</p>
                      <p className="mb-0 fw-bold text-primary">${selectedOrder.total.toFixed(2)}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowOrderModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              setShowOrderModal(false);
              handleReorder(selectedOrder);
            }}
          >
            Reorder
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default OrdersPage;