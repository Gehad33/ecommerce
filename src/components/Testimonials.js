import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fashion Blogger",
      text: "The quality of products here is amazing! Fast shipping and great customer service.",
      rating: 5,
      avatar: "👩‍💼"
    },
    {
      name: "Mike Chen",
      role: "Tech Enthusiast",
      text: "Best place for electronics! Got my new laptop at an incredible price.",
      rating: 5,
      avatar: "👨‍💻"
    },
    {
      name: "Emma Wilson",
      role: "Frequent Shopper",
      text: "Love their jewelry collection! Always get compliments when I wear them.",
      rating: 4,
      avatar: "👸"
    }
  ];

  return (
    <section className="py-5 bg-light rounded-4 my-5">
      <Container>
        <h2 className="fw-bold text-center mb-5">What Our Customers Say</h2>
        <Row className="g-4">
          {testimonials.map((testimonial, idx) => (
            <Col md={4} key={idx}>
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="display-4 me-3">{testimonial.avatar}</div>
                    <div>
                      <Card.Title className="mb-0">{testimonial.name}</Card.Title>
                      <small className="text-muted">{testimonial.role}</small>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`fs-4 ${i < testimonial.rating ? 'text-warning' : 'text-secondary'}`}>
                        ★
                      </span>
                    ))}
                  </div>
                  
                  <Card.Text className="text-muted">
                    "{testimonial.text}"
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Testimonials; 