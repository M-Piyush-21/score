import React from 'react';
import { Heart } from 'lucide-react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <p className="footer-text">
          Made with <Heart className="heart-icon" /> by{' '}
          <span className="author-name">Piyush</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
