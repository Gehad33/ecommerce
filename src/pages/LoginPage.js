import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../features/auth/authSlice';
import { mergeGuestCart } from '../features/cart/cartSlice';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isLoading, error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);

  // إذا كان المستخدم مسجل دخول بالفعل، توجيه للصفحة الرئيسية
  useEffect(() => {
    if (user) {
      navigate(location.state?.from || '/');
    }
  }, [user, navigate, location]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) dispatch(clearError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      return;
    }

    try {
      await dispatch(loginUser(formData)).unwrap();
      
      // دمج عربة الضيف مع عربة المستخدم بعد تسجيل الدخول
      dispatch(mergeGuestCart());
      
      // توجيه للمستخدم
      navigate(location.state?.from || '/');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // بيانات تجريبية للاختبار
  const demoAccounts = [
    { username: 'johnd', password: 'm38rmF$', name: 'John Doe' },
    { username: 'mor_2314', password: '83r5^_', name: 'Jane Smith' },
  ];

  const handleDemoLogin = (account) => {
    setFormData({
      username: account.username,
      password: account.password,
    });
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Welcome Back</h2>
                <p className="text-muted">Sign in to your account</p>
              </div>

              {error && (
                <Alert variant="danger" className="text-center">
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter your username"
                    required
                    className="py-3"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    className="py-3"
                  />
                </Form.Group>

                <Form.Group className="mb-3 d-flex justify-content-between">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <Link to="/forgot-password" className="text-decoration-none">
                    Forgot password?
                  </Link>
                </Form.Group>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-100 py-3 mb-3"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <div className="text-center mb-4">
                  <span className="text-muted">Don't have an account? </span>
                  <Link to="/register" className="text-decoration-none fw-bold">
                    Sign up
                  </Link>
                </div>

                <div className="text-center">
                  <small className="text-muted">Or sign in with</small>
                  <div className="d-flex justify-content-center gap-3 mt-2">
                    <Button variant="outline-primary" className="rounded-circle">
                      <i className="fab fa-google"></i>
                    </Button>
                    <Button variant="outline-primary" className="rounded-circle">
                      <i className="fab fa-facebook-f"></i>
                    </Button>
                    <Button variant="outline-primary" className="rounded-circle">
                      <i className="fab fa-twitter"></i>
                    </Button>
                  </div>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Demo Accounts للاختبار */}
          <Card className="mt-4 border-0 shadow-sm">
            <Card.Body>
              <h6 className="mb-3">Demo Accounts (for testing):</h6>
              {demoAccounts.map((account, index) => (
                <div key={index} className="mb-2">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="w-100 text-start"
                    onClick={() => handleDemoLogin(account)}
                  >
                    <strong>{account.name}</strong>
                    <br />
                    <small className="text-muted">
                      Username: {account.username} | Password: {account.password}
                    </small>
                  </Button>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;