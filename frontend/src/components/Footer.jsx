import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import '../styles/styles.css';
const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-section newsletter">
          <h3>Subscribe to Newsletter</h3>
          <form onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Enter your email" required />
            <button type="submit">Subscribe</button>
          </form>
        </div>
        <div className="footer-section">
          <h3>Quick Links</h3>
          <p><a href="#about">About Us</a></p>
          <p><a href="#contact">Contact Us</a></p>
          <p><a href="#">Careers</a></p>
          <p><a href="#">Terms & Conditions</a></p>
        </div>
        <div className="footer-section">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="#"><FontAwesomeIcon icon={faYoutube} /> YouTube</a>
            <a href="#"><FontAwesomeIcon icon={faTwitter} /> Twitter</a>
            <a href="#"><FontAwesomeIcon icon={faInstagram} /> Instagram</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">&copy; 2025 All rights reserved.</div>
    </footer>
  );
};

export default Footer;
