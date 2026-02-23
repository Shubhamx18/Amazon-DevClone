import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</div>
            <div className="footer-main">
                <div className="footer-col">
                    <h4>Get to Know Us</h4>
                    <Link to="/">About Us</Link><Link to="/">Careers</Link><Link to="/">Press Releases</Link><Link to="/">Amazon Science</Link>
                </div>
                <div className="footer-col">
                    <h4>Connect with Us</h4>
                    <Link to="/">Facebook</Link><Link to="/">Twitter</Link><Link to="/">Instagram</Link>
                </div>
                <div className="footer-col">
                    <h4>Make Money with Us</h4>
                    <Link to="/register">Sell on Amazon</Link><Link to="/">Sell under Amazon Accelerator</Link><Link to="/">Protect and Build Your Brand</Link><Link to="/">Amazon Global Selling</Link>
                </div>
                <div className="footer-col">
                    <h4>Let Us Help You</h4>
                    <Link to="/orders">Your Orders</Link><Link to="/">Returns & Replacements</Link><Link to="/">Shipping Rates & Policies</Link><Link to="/">Amazon Assistant</Link><Link to="/">Help</Link>
                </div>
            </div>
            <div className="footer-bottom">
                <div style={{ marginBottom: 8 }}>
                    <Link to="/" style={{ color: 'white', fontSize: '1.2rem', fontWeight: 700, textDecoration: 'none' }}>amazon<span style={{ color: '#FF9900' }}>.in</span></Link>
                </div>
                © {new Date().getFullYear()} Amazon Clone. All rights reserved. Built for educational purposes.
            </div>
        </footer>
    );
};

export default Footer;
