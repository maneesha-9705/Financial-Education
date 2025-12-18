import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container footer-container">
                <div className="footer-section">
                    <h3>FinEdu</h3>
                    <p>
                        Empowering everyone to make informed financial decisions through education and simplified tools.
                    </p>
                </div>
                <div className="footer-section">
                    <h3>Quick Links</h3>
                    <ul className="footer-links">
                        <li><a href="/">Home</a></li>
                        <li><a href="/learn">Learn</a></li>
                        <li><a href="/tools">Calculators</a></li>
                    </ul>
                </div>
                <div className="footer-section">
                    <h3>Disclaimer</h3>
                    <p>
                        This platform is for educational purposes only. We do not provide investment advice.
                    </p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 Financial Education Platform. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
