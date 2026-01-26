import React, { useState, useEffect } from 'react';
import { 
  Container, Row, Col, Card, Button, Tab, Nav, 
  Alert, Spinner, ListGroup, Badge, Modal, Form 
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { logout, getUserProfile } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { user, isLoading } = useSelector((state) => state.auth);
  const cartItems = useSelector((state) => state.cart.items);
  
  const [activeTab, setActiveTab] = useState('profile');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      dispatch(getUserProfile(user.id));
      // تحميل الطلبات الوهمية
      loadOrders();
    }
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (user) {
      setEditForm({
        email: user.email || '',
        username: user.username || '',
        name: user.name || { firstname: '', lastname: '' },
        phone: user.phone || '',
        address: user.address || {
          city: '',
          street: '',
          number: '',
          zipcode: ''
        }
      });
    }
  }, [user]);

  const loadOrders = () => {
    // طلبات وهمية للعرض
    const mockOrders = [
      {
        id: 'ORD-001',
        date: '2024-01-15',
        total: 249.99,
        status: 'Delivered',
        items: 3
      },
      {
        id: 'ORD-002',
        date: '2024-01-10',
        total: 129.99,
        status: 'Processing',
        items: 2
      },
      {
        id: 'ORD-003',
        date: '2024-01-05',
        total: 89.99,
        status: 'Shipped',
        items: 1
      }
    ];
    setOrders(mockOrders);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    // هنا سيكون تحديث البيانات في API
    setShowEditModal(false);
  };

  if (!user) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading...</p>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col lg={3} className="mb-4">
          <Card className="shadow-sm border-0">
            <Card.Body className="text-center">
              <div className="mb-3">
                <div 
                  className="rounded-circle bg-primary d-inline-flex align-items-center justify-content-center"
                  style={{ width: '100px', height: '100px' }}
                >
                  <span className="text-white fs-2">
                    {user.name?.firstname?.charAt(0) || user.username?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <h5 className="mb-1">
                {user.name?.firstname} {user.name?.lastname}
              </h5>
              <p className="text-muted mb-3">@{user.username}</p>
              
              <ListGroup variant="flush">
                <ListGroup.Item action active={activeTab === 'profile'} onClick={() => setActiveTab('profile')}>
                  👤 Profile
                </ListGroup.Item>
                <ListGroup.Item action active={activeTab === 'orders'} onClick={() => setActiveTab('orders')}>
                  📦 Orders ({orders.length})
                </ListGroup.Item>
                <ListGroup.Item action active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')}>
                  ❤️ Wishlist
                </ListGroup.Item>
                <ListGroup.Item action active={activeTab === 'cart'} onClick={() => setActiveTab('cart')}>
                  🛒 Cart ({cartItems.length} items)
                </ListGroup.Item>
                <ListGroup.Item action active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
                  ⚙️ Settings
                </ListGroup.Item>
              </ListGroup>
              
              <Button 
                variant="outline-danger" 
                className="w-100 mt-4"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={9}>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Profile Information</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Profile
                </Button>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-4">
                      <h6 className="text-muted mb-2">Personal Information</h6>
                      <p><strong>Name:</strong> {user.name?.firstname} {user.name?.lastname}</p>
                      <p><strong>Username:</strong> @{user.username}</p>
                      <p><strong>Email:</strong> {user.email || 'Not provided'}</p>
                      <p><strong>Phone:</strong> {user.phone || 'Not provided'}</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-4">
                      <h6 className="text-muted mb-2">Address</h6>
                      {user.address ? (
                        <>
                          <p><strong>Street:</strong> {user.address.street}</p>
                          <p><strong>City:</strong> {user.address.city}</p>
                          <p><strong>Zip Code:</strong> {user.address.zipcode}</p>
                        </>
                      ) : (
                        <p className="text-muted">No address provided</p>
                      )}
                    </div>
                  </Col>
                </Row>
                
                <div className="mt-4">
                  <h6 className="text-muted mb-3">Account Stats</h6>
                  <Row>
                    <Col md={4} className="text-center mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <div className="display-6 fw-bold text-primary">{orders.length}</div>
                          <small className="text-muted">Total Orders</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="text-center mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <div className="display-6 fw-bold text-success">{cartItems.length}</div>
                          <small className="text-muted">Items in Cart</small>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={4} className="text-center mb-3">
                      <Card className="border-0 bg-light">
                        <Card.Body>
                          <div className="display-6 fw-bold text-warning">12</div>
                          <small className="text-muted">Wishlist Items</small>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Order History</h5>
              </Card.Header>
              <Card.Body>
                {orders.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="display-1 mb-3">📦</div>
                    <h5>No orders yet</h5>
                    <p className="text-muted">Start shopping to see your orders here</p>
                    <Button variant="primary" onClick={() => navigate('/products')}>
                      Shop Now
                    </Button>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map(order => (
                          <tr key={order.id}>
                            <td><strong>{order.id}</strong></td>
                            <td>{order.date}</td>
                            <td>{order.items}</td>
                            <td>${order.total}</td>
                            <td>
                              <Badge 
                                bg={
                                  order.status === 'Delivered' ? 'success' :
                                  order.status === 'Processing' ? 'warning' :
                                  'info'
                                }
                              >
                                {order.status}
                              </Badge>
                            </td>
                            <td>
                              <Button variant="outline-primary" size="sm">
                                View Details
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Cart Tab */}
          {activeTab === 'cart' && (
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Shopping Cart</h5>
                  <Button variant="primary" onClick={() => navigate('/cart')}>
                    View Full Cart
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {cartItems.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="display-1 mb-3">🛒</div>
                    <h5>Your cart is empty</h5>
                    <p className="text-muted">Add some products to get started</p>
                    <Button variant="primary" onClick={() => navigate('/products')}>
                      Browse Products
                    </Button>
                  </div>
                ) : (
                  <>
                    <ListGroup variant="flush">
                      {cartItems.slice(0, 5).map(item => (
                        <ListGroup.Item key={item.id}>
                          <Row className="align-items-center">
                            <Col xs={3}>
                              <img
                                src={item.image}
                                alt={item.title}
                                className="img-fluid rounded"
                                style={{ maxHeight: '60px' }}
                              />
                            </Col>
                            <Col xs={5}>
                              <h6 className="mb-1">{item.title.substring(0, 30)}...</h6>
                              <small className="text-muted">Qty: {item.quantity}</small>
                            </Col>
                            <Col xs={4} className="text-end">
                              <strong>${(item.price * item.quantity).toFixed(2)}</strong>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                    {cartItems.length > 5 && (
                      <div className="text-center mt-3">
                        <p className="text-muted">
                          And {cartItems.length - 5} more items...
                        </p>
                      </div>
                    )}
                  </>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Wishlist</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-5">
                  <div className="display-1 mb-3">❤️</div>
                  <h5>Your wishlist is empty</h5>
                  <p className="text-muted">Save your favorite products here</p>
                  <Button variant="primary" onClick={() => navigate('/products')}>
                    Start Browsing
                  </Button>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-light">
                <h5 className="mb-0">Account Settings</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Email Notifications</h6>
                      <p className="text-muted mb-0">Receive updates about your orders</p>
                    </div>
                    <Form.Check type="switch" defaultChecked />
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Marketing Emails</h6>
                      <p className="text-muted mb-0">Receive promotions and offers</p>
                    </div>
                    <Form.Check type="switch" />
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Two-Factor Authentication</h6>
                      <p className="text-muted mb-0">Add extra security to your account</p>
                    </div>
                    <Button variant="outline-primary" size="sm">
                      Enable
                    </Button>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Delete Account</h6>
                      <p className="text-muted mb-0">Permanently delete your account</p>
                    </div>
                    <Button variant="outline-danger" size="sm">
                      Delete
                    </Button>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name?.firstname || ''}
                onChange={(e) => setEditForm({
                  ...editForm,
                  name: { ...editForm.name, firstname: e.target.value }
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={editForm.name?.lastname || ''}
                onChange={(e) => setEditForm({
                  ...editForm,
                  name: { ...editForm.name, lastname: e.target.value }
                })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={editForm.email || ''}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="tel"
                value={editForm.phone || ''}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default ProfilePage;