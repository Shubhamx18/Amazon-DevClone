import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart, FiMapPin, FiMenu } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { searchAPI, categoryAPI } from '../services/api';

const Header = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const { cartCount } = useCart();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [categories, setCategories] = useState([]);
    const searchRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        categoryAPI.getAll().then(r => setCategories(r.data.categories || [])).catch(() => { });
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (searchQuery.length >= 2) {
                searchAPI.suggestions(searchQuery).then(r => {
                    setSuggestions(r.data.suggestions || []);
                    setShowSuggestions(true);
                }).catch(() => { });
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        const handleClick = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) setShowSuggestions(false);
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowDropdown(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowSuggestions(false);
        }
    };

    const handleLogout = () => {
        logout();
        setShowDropdown(false);
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-top">
                <Link to="/" className="header-logo">amazon<span>.in</span></Link>
                <div className="header-deliver">
                    <div className="deliver-to">Deliver to</div>
                    <div className="deliver-location"><FiMapPin size={14} /> India</div>
                </div>
                <form className="header-search" onSubmit={handleSearch} ref={searchRef} style={{ position: 'relative' }}>
                    <select><option>All</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select>
                    <input type="text" placeholder="Search Amazon.in" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onFocus={() => suggestions.length > 0 && setShowSuggestions(true)} />
                    <button type="submit"><FiSearch /></button>
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="search-suggestions">
                            {suggestions.map(s => (
                                <div key={s.id} className="search-suggestion-item" onClick={() => { navigate(`/products/${s.id}`); setShowSuggestions(false); setSearchQuery(''); }}>
                                    {s.thumbnail && <img src={s.thumbnail} alt="" />}
                                    <div>
                                        <div style={{ fontSize: '0.9rem' }}>{s.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#B12704' }}>₹{Number(s.price).toLocaleString('en-IN')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </form>
                {isAuthenticated ? (
                    <div className="header-nav-item" ref={dropdownRef} style={{ cursor: 'pointer', position: 'relative' }} onClick={() => setShowDropdown(!showDropdown)} onMouseEnter={() => setShowDropdown(true)} onMouseLeave={() => setShowDropdown(false)}>
                        <span className="nav-line1">Hello, {user?.name?.split(' ')[0]}</span>
                        <span className="nav-line2" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>Account ▾</span>
                        {showDropdown && (
                            <div className="header-dropdown" style={{ display: 'block', position: 'absolute', top: '100%', right: 0, background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', borderRadius: '8px', padding: '8px 0', minWidth: '200px', zIndex: 1000 }}>
                                <Link to="/profile" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none', fontSize: '0.9rem' }} onClick={() => setShowDropdown(false)}>Your Account</Link>
                                <Link to="/orders" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none', fontSize: '0.9rem' }} onClick={() => setShowDropdown(false)}>Your Orders</Link>
                                <Link to="/wishlist" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none', fontSize: '0.9rem' }} onClick={() => setShowDropdown(false)}>Wishlist</Link>
                                {user?.role === 'seller' && <Link to="/seller" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none', fontSize: '0.9rem' }} onClick={() => setShowDropdown(false)}>Seller Dashboard</Link>}
                                {user?.role === 'admin' && <Link to="/admin" style={{ display: 'block', padding: '8px 16px', color: '#333', textDecoration: 'none', fontSize: '0.9rem' }} onClick={() => setShowDropdown(false)}>Admin Dashboard</Link>}
                                <div style={{ borderTop: '1px solid #eee', margin: '4px 0' }}></div>
                                <button onClick={handleLogout} style={{ display: 'block', width: '100%', padding: '8px 16px', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.9rem', color: '#333' }}>Sign Out</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to="/login" className="header-nav-item"><span className="nav-line1">Hello, Sign in</span><span className="nav-line2">Account & Lists</span></Link>
                )}
                <Link to="/orders" className="header-nav-item"><span className="nav-line1">Returns</span><span className="nav-line2">& Orders</span></Link>
                <Link to="/cart" className="header-cart"><FiShoppingCart size={28} /><span className="cart-count">{cartCount}</span><span className="cart-text">Cart</span></Link>
            </div>
            <nav className="header-bottom">
                <Link to="/products"><FiMenu style={{ marginRight: 4 }} /> All</Link>
                <Link to="/products?featured=true">Today's Deals</Link>
                {categories.slice(0, 6).map(c => <Link key={c.id} to={`/category/${c.id}`}>{c.name}</Link>)}
                {isAuthenticated && user?.role === 'seller' && <Link to="/seller">Seller Dashboard</Link>}
                {isAuthenticated && user?.role === 'admin' && <Link to="/admin">Admin Panel</Link>}
            </nav>
        </header>
    );
};

export default Header;
