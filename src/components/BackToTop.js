import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { ArrowUp } from 'react-bootstrap-icons';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="primary"
      onClick={scrollToTop}
      className="position-fixed bottom-0 end-0 m-4 rounded-circle p-3 shadow-lg"
      style={{
        zIndex: 1000,
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      aria-label="Back to top"
    >
      <span style={{ fontSize: '20px' }}>↑</span>
    </Button>
  );
};

export default BackToTop;