import React from 'react';
import Marquee from 'react-fast-marquee';
import { Container } from 'react-bootstrap';

const MarqueeSlider = () => {
  const offers = [
    { text: "🚚 Free Shipping on Orders Over $50!", color: "success" },
    { text: "🔥 Hot Deals - Up to 50% Off Electronics!", color: "danger" },
    { text: "🎉 New Arrivals Every Week!", color: "primary" },
    { text: "💳 Secure Payment - 100% Safe Shopping", color: "info" },
    { text: "🔄 Easy Returns - 30-Day Money Back Guarantee", color: "warning" },
    { text: "⭐ Customer Satisfaction - Our Top Priority", color: "dark" },
  ];

  return (
    <Container fluid className="bg-gradient py-2" 
      style={{
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
      }}>
      <Marquee speed={40} gradient={false} pauseOnHover>
        {offers.map((offer, index) => (
          <span key={index} className="mx-4 d-flex align-items-center">
            <span className={`badge bg-${offer.color} text-white px-3 py-2 me-2 rounded-pill`}>
              OFFER
            </span>
            <span className="text-white fs-5 fw-bold">{offer.text}</span>
          </span>
        ))}
      </Marquee>
    </Container>
  );
};

export default MarqueeSlider;