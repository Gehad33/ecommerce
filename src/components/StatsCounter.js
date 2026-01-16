import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const StatsCounter = () => {
  const [stats, setStats] = useState([
    { value: 0, target: 10000, label: 'Happy Customers', icon: '😊' },
    { value: 0, target: 5000, label: 'Products Sold', icon: '🛒' },
    { value: 0, target: 150, label: 'Brand Partners', icon: '🤝' },
    { value: 0, target: 24, label: 'Hour Support', icon: '⏰' }
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => prev.map(stat => ({
        ...stat,
        value: stat.value < stat.target 
          ? Math.min(stat.value + Math.ceil(stat.target / 50), stat.target)
          : stat.target
      })));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <Container className="py-5">
      <Row className="text-center">
        {stats.map((stat, index) => (
          <Col md={3} key={index} className="mb-4">
            <div className="p-4 rounded-4 shadow-sm border">
              <div className="display-4 mb-3">{stat.icon}</div>
              <div className="display-3 fw-bold text-primary mb-2">
                {stat.value.toLocaleString()}+
              </div>
              <div className="text-muted">{stat.label}</div>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default StatsCounter; 