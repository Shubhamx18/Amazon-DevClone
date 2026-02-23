import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const HERO_SLIDES = [
    { bg: 'linear-gradient(135deg, #232f3e 0%, #37475a 100%)', img: 'https://m.media-amazon.com/images/I/61lwJy4B8PL._SX3000_.jpg', title: 'Great Indian Festival', sub: 'Up to 70% off on Electronics, Fashion & more', btn: 'Shop Now', link: '/products?sort=discount', color: '#febd69' },
    { bg: 'linear-gradient(135deg, #0F1111 0%, #232f3e 100%)', img: 'https://m.media-amazon.com/images/I/71tIrZqybrL._SX3000_.jpg', title: 'New Launches', sub: 'Latest smartphones & laptops at best prices', btn: 'Explore', link: '/products?category=1', color: '#ff9900' },
    { bg: 'linear-gradient(135deg, #131A22 0%, #1a2533 100%)', img: 'https://m.media-amazon.com/images/I/61TD5JLGhIL._SX3000_.jpg', title: 'Fashion Sale', sub: 'Flat 50-80% off on top brands', btn: 'Shop Fashion', link: '/products?category=2', color: '#48c9b0' },
    { bg: 'linear-gradient(135deg, #232f3e 0%, #2c3e50 100%)', img: 'https://m.media-amazon.com/images/I/61CiqVTRBEL._SX3000_.jpg', title: 'Home Makeover', sub: 'Upgrade your home with best deals', btn: 'Shop Home', link: '/products?category=4', color: '#f39c12' },
];

const ScrollRow = ({ title, link, children }) => {
    const ref = useRef(null);
    const scroll = (dir) => { if (ref.current) ref.current.scrollBy({ left: dir * 320, behavior: 'smooth' }); };
    return (
        <section className="home-section">
            <div className="section-header">
                <h2>{title}</h2>
                {link && <Link to={link} className="see-all">See all deals →</Link>}
            </div>
            <div className="scroll-wrapper">
                <button className="scroll-btn scroll-left" onClick={() => scroll(-1)}>❮</button>
                <div className="scroll-row" ref={ref}>{children}</div>
                <button className="scroll-btn scroll-right" onClick={() => scroll(1)}>❯</button>
            </div>
        </section>
    );
};

const DealCard = ({ product }) => {
    const navigate = useNavigate();
    return (
        <div className="deal-card" onClick={() => navigate(`/product/${product.id}`)}>
            <div className="deal-badge">{product.discount}% OFF</div>
            <img src={product.thumbnail} alt={product.title} />
            <div className="deal-info">
                <p className="deal-price">₹{Number(product.price).toLocaleString('en-IN')}</p>
                <p className="deal-original">M.R.P: <s>₹{Number(product.originalPrice || product.original_price).toLocaleString('en-IN')}</s></p>
                <p className="deal-title">{product.title}</p>
                <div className="deal-progress">
                    <div className="deal-progress-bar" style={{ width: `${Math.min(90, 40 + Math.random() * 50)}%` }}></div>
                </div>
                <p className="deal-claimed">🔥 {Math.floor(40 + Math.random() * 50)}% claimed</p>
            </div>
        </div>
    );
};

const Home = () => {
    const [categories, setCategories] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [deals, setDeals] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [heroIndex, setHeroIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [catRes, featRes, dealRes, bestRes, newRes, allRes] = await Promise.all([
                    categoryAPI.getAll(),
                    productAPI.getFeatured(),
                    productAPI.getDeals(),
                    productAPI.getBestsellers(),
                    productAPI.getNewArrivals(),
                    productAPI.getAll({ limit: 50 }),
                ]);
                setCategories((catRes.data.categories || []).filter(c => !c.parentId && !c.parent_id));
                setFeatured(featRes.data.products || []);
                setDeals(dealRes.data.products || []);
                setBestsellers(bestRes.data.products || []);
                setNewArrivals(newRes.data.products || []);
                setAllProducts(allRes.data.products || []);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchAll();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => setHeroIndex(i => (i + 1) % HERO_SLIDES.length), 5000);
        return () => clearInterval(timer);
    }, []);

    const getPriceRange = (products, cat) => {
        const ps = products.filter(p => (p.categoryId || p.category_id) === cat.id);
        if (!ps.length) return 'Starting ₹199';
        const min = Math.min(...ps.map(p => Number(p.price)));
        return `Starting ₹${min.toLocaleString('en-IN')}`;
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    const budgetPicks = allProducts.filter(p => Number(p.price) < 1000).slice(0, 12);
    const premiumPicks = allProducts.filter(p => Number(p.price) > 10000).slice(0, 12);
    const electronics = allProducts.filter(p => [1].includes(p.categoryId || p.category_id)).slice(0, 12);
    const fashionItems = allProducts.filter(p => [2].includes(p.categoryId || p.category_id)).slice(0, 12);

    return (
        <div className="home-page">
            {/* Hero Carousel */}
            <div className="hero-carousel">
                {HERO_SLIDES.map((slide, i) => (
                    <div key={i} className={`hero-slide ${i === heroIndex ? 'active' : ''}`} style={{ background: slide.bg }}>
                        <div className="hero-content">
                            <h1 style={{ color: slide.color }}>{slide.title}</h1>
                            <p>{slide.sub}</p>
                            <Link to={slide.link} className="hero-btn" style={{ background: slide.color, color: '#0F1111' }}>{slide.btn}</Link>
                        </div>
                        <div className="hero-img-wrapper">
                            <img src={slide.img} alt={slide.title} />
                        </div>
                    </div>
                ))}
                <div className="hero-dots">
                    {HERO_SLIDES.map((_, i) => (
                        <button key={i} className={`dot ${i === heroIndex ? 'active' : ''}`} onClick={() => setHeroIndex(i)} />
                    ))}
                </div>
            </div>

            {/* Category Grid */}
            <section className="home-section">
                <div className="section-header"><h2>Shop by Category</h2></div>
                <div className="category-grid">
                    {categories.map(cat => (
                        <Link key={cat.id} to={`/products?category=${cat.id}`} className="category-card">
                            <div className="category-img-wrap">
                                <img src={cat.image || 'https://via.placeholder.com/200'} alt={cat.name} />
                            </div>
                            <h3>{cat.name}</h3>
                            <p className="category-price">{getPriceRange(allProducts, cat)}</p>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Multi-Card Promo Banners */}
            <section className="home-section">
                <div className="promo-grid">
                    <div className="promo-card" onClick={() => navigate('/products?sort=discount')} style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #f7c948 100%)' }}>
                        <h3>⚡ Lightning Deals</h3>
                        <p>Up to 80% off</p>
                        <span>Shop Now →</span>
                    </div>
                    <div className="promo-card" onClick={() => navigate('/products?category=1')} style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                        <h3>📱 Top Electronics</h3>
                        <p>Latest gadgets, best prices</p>
                        <span>Explore →</span>
                    </div>
                    <div className="promo-card" onClick={() => navigate('/products?category=3')} style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
                        <h3>📚 Bestselling Books</h3>
                        <p>Under ₹299</p>
                        <span>Browse →</span>
                    </div>
                    <div className="promo-card" onClick={() => navigate('/products?category=2')} style={{ background: 'linear-gradient(135deg, #eb3349 0%, #f45c43 100%)' }}>
                        <h3>👗 Fashion Fest</h3>
                        <p>50-80% off top brands</p>
                        <span>Shop Now →</span>
                    </div>
                </div>
            </section>

            {/* Today's Deals */}
            {deals.length > 0 && (
                <ScrollRow title="⚡ Today's Deals" link="/products?sort=discount">
                    {deals.map(p => <DealCard key={p.id} product={p} />)}
                </ScrollRow>
            )}

            {/* Featured Products */}
            {featured.length > 0 && (
                <ScrollRow title="🌟 Featured Products" link="/products?featured=true">
                    {featured.map(p => <ProductCard key={p.id} product={p} />)}
                </ScrollRow>
            )}

            {/* Budget Picks */}
            {budgetPicks.length > 0 && (
                <ScrollRow title="💰 Budget Picks Under ₹999" link="/products?maxPrice=999">
                    {budgetPicks.map(p => <ProductCard key={p.id} product={p} />)}
                </ScrollRow>
            )}

            {/* Mid Banner */}
            <section className="home-section">
                <div className="mid-banner" onClick={() => navigate('/products?category=1')} style={{ background: 'linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)', cursor: 'pointer' }}>
                    <div className="mid-banner-text">
                        <span className="mid-tag">ELECTRONICS MEGA SALE</span>
                        <h2>Up to 60% Off on Smartphones & Laptops</h2>
                        <p>Top brands: Samsung, Apple, OnePlus, ASUS & more</p>
                        <button className="hero-btn" style={{ background: '#ff9900', color: '#0F1111' }}>Shop Electronics</button>
                    </div>
                </div>
            </section>

            {/* Bestsellers */}
            {bestsellers.length > 0 && (
                <ScrollRow title="🏆 Bestsellers" link="/products?sort=popular">
                    {bestsellers.map(p => <ProductCard key={p.id} product={p} />)}
                </ScrollRow>
            )}

            {/* Electronics Row */}
            {electronics.length > 0 && (
                <ScrollRow title="📱 Electronics Store" link="/products?category=1">
                    {electronics.map(p => <ProductCard key={p.id} product={p} />)}
                </ScrollRow>
            )}

            {/* Fashion Row */}
            {fashionItems.length > 0 && (
                <ScrollRow title="👗 Fashion & Accessories" link="/products?category=2">
                    {fashionItems.map(p => <ProductCard key={p.id} product={p} />)}
                </ScrollRow>
            )}

            {/* Premium Picks */}
            {premiumPicks.length > 0 && (
                <ScrollRow title="💎 Premium Picks" link="/products?minPrice=10000">
                    {premiumPicks.map(p => <ProductCard key={p.id} product={p} />)}
                </ScrollRow>
            )}

            {/* New Arrivals */}
            {newArrivals.length > 0 && (
                <ScrollRow title="🆕 New Arrivals" link="/products?sort=newest">
                    {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
                </ScrollRow>
            )}

            {/* Trust Badges */}
            <section className="home-section">
                <div className="trust-grid">
                    <div className="trust-item"><span className="trust-icon">🚚</span><h4>FREE Delivery</h4><p>On orders above ₹499</p></div>
                    <div className="trust-item"><span className="trust-icon">🔄</span><h4>Easy Returns</h4><p>10-30 day return policy</p></div>
                    <div className="trust-item"><span className="trust-icon">🛡️</span><h4>Secure Payment</h4><p>100% secure checkout</p></div>
                    <div className="trust-item"><span className="trust-icon">⭐</span><h4>Top Brands</h4><p>100% authentic products</p></div>
                    <div className="trust-item"><span className="trust-icon">💬</span><h4>24/7 Support</h4><p>Dedicated customer service</p></div>
                    <div className="trust-item"><span className="trust-icon">📦</span><h4>Fast Shipping</h4><p>Delivery in 2-4 days</p></div>
                </div>
            </section>
        </div>
    );
};

export default Home;
