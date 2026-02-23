import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart, FaRegHeart, FaShieldAlt, FaTruck, FaUndo } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { productAPI, reviewAPI, wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [related, setRelated] = useState([]);
    const [ratingBreakdown, setRatingBreakdown] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [inWishlist, setInWishlist] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
    const [showReviewForm, setShowReviewForm] = useState(false);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const res = await productAPI.getById(id);
                setProduct(res.data.product);
                setRelated(res.data.relatedProducts || []);
                setRatingBreakdown(res.data.ratingBreakdown || []);
                setReviews(res.data.product.reviews || []);
                if (isAuthenticated) {
                    wishlistAPI.check(id).then(r => setInWishlist(r.data.inWishlist)).catch(() => { });
                }
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchProduct();
        window.scrollTo(0, 0);
    }, [id]);

    const renderStars = (r) => {
        const s = [];
        for (let i = 0; i < Math.floor(r); i++) s.push(<FaStar key={i} />);
        if (r % 1 >= 0.5) s.push(<FaStarHalfAlt key="h" />);
        while (s.length < 5) s.push(<FaRegStar key={`e${s.length}`} />);
        return s;
    };

    const handleAddToCart = async () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        try { await addToCart(product.id, quantity); toast.success('Added to cart!'); } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    };

    const handleBuyNow = async () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        try { await addToCart(product.id, quantity); navigate('/cart'); } catch (e) { toast.error('Error adding to cart'); }
    };

    const toggleWishlist = async () => {
        if (!isAuthenticated) { navigate('/login'); return; }
        try {
            if (inWishlist) { await wishlistAPI.remove(product.id); setInWishlist(false); toast.info('Removed from wishlist'); }
            else { await wishlistAPI.add({ productId: product.id }); setInWishlist(true); toast.success('Added to wishlist!'); }
        } catch (e) { toast.error('Error'); }
    };

    const submitReview = async (e) => {
        e.preventDefault();
        try {
            const res = await reviewAPI.create({ productId: product.id, ...reviewForm });
            setReviews([res.data.review, ...reviews]);
            setShowReviewForm(false);
            setReviewForm({ rating: 5, title: '', comment: '' });
            toast.success('Review submitted!');
        } catch (e) { toast.error(e.response?.data?.message || 'Error submitting review'); }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;
    if (!product) return <div className="empty-state"><h2>Product not found</h2></div>;

    const price = Number(product.price);
    const originalPrice = Number(product.originalPrice || product.price);
    const images = product.images || [];
    const specs = product.specifications || {};
    const bullets = product.bulletPoints || [];

    return (
        <div className="product-detail">
            <div className="product-detail-main">
                <div className="product-images">
                    <img className="product-image-main" src={images[selectedImage] || product.thumbnail || ''} alt={product.title} />
                    {images.length > 1 && (
                        <div className="product-image-thumbs">
                            {images.map((img, i) => <img key={i} src={img} alt="" className={i === selectedImage ? 'active' : ''} onClick={() => setSelectedImage(i)} />)}
                        </div>
                    )}
                </div>

                <div className="product-info">
                    <h1>{product.title}</h1>
                    {product.brand && <span className="brand-link">Visit the {product.brand} Store</span>}
                    <div className="rating-section">
                        <span style={{ color: '#007185', fontWeight: 600 }}>{product.avgRating}</span>
                        <span className="stars" style={{ color: '#FFA41C' }}>{renderStars(product.avgRating)}</span>
                        <span className="rating-count">{product.totalReviews?.toLocaleString()} ratings</span>
                    </div>

                    <div className="price-section">
                        {product.discount > 0 && <span className="deal-badge">Deal of the Day</span>}
                        <div className="price-display">
                            {product.discount > 0 && <span className="price-discount" style={{ fontSize: '1.5rem' }}>-{product.discount}%</span>}
                            <span className="price-large"><sup style={{ fontSize: '0.6em' }}>₹</sup>{price.toLocaleString('en-IN')}</span>
                        </div>
                        {product.discount > 0 && <div className="mrp">M.R.P.: <span style={{ textDecoration: 'line-through' }}>₹{originalPrice.toLocaleString('en-IN')}</span></div>}
                        <p style={{ fontSize: '0.85rem', marginTop: 8 }}>Inclusive of all taxes</p>
                    </div>

                    {bullets.length > 0 && (
                        <div className="bullet-points">
                            <h3>About this item</h3>
                            <ul>{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>
                        </div>
                    )}

                    {product.description && <div style={{ padding: '16px 0', fontSize: '0.9rem', lineHeight: 1.7, borderBottom: '1px solid #ddd' }}>{product.description}</div>}

                    <div style={{ display: 'flex', gap: 24, padding: '16px 0', fontSize: '0.85rem' }}>
                        <div style={{ textAlign: 'center' }}><FaTruck size={20} color="#888" /><div style={{ marginTop: 4 }}>Free Delivery</div></div>
                        <div style={{ textAlign: 'center' }}><FaUndo size={20} color="#888" /><div style={{ marginTop: 4 }}>{product.returnPolicy || '10 days return'}</div></div>
                        <div style={{ textAlign: 'center' }}><FaShieldAlt size={20} color="#888" /><div style={{ marginTop: 4 }}>{product.warranty || 'Warranty'}</div></div>
                    </div>
                </div>

                <div className="buy-box">
                    <div className="buy-price"><sup>₹</sup><span style={{ fontSize: '1.8rem' }}>{price.toLocaleString('en-IN')}</span></div>
                    <div className="delivery-info"><strong>FREE delivery</strong> {product.deliveryDays ? `in ${product.deliveryDays} days` : 'Available'}</div>
                    <div className={`stock-status ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                        {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </div>
                    {product.stock > 0 && (
                        <>
                            <div className="quantity-select">
                                <label>Qty: </label>
                                <select value={quantity} onChange={e => setQuantity(parseInt(e.target.value))}>
                                    {Array.from({ length: Math.min(product.stock, 10) }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                                </select>
                            </div>
                            <div className="buy-actions">
                                <button className="btn btn-primary" onClick={handleAddToCart}>Add to Cart</button>
                                <button className="btn btn-amazon" onClick={handleBuyNow}>Buy Now</button>
                            </div>
                        </>
                    )}
                    <button className="btn btn-outline btn-block" style={{ marginTop: 8 }} onClick={toggleWishlist}>
                        {inWishlist ? <><FaHeart color="#e74c3c" /> In Wishlist</> : <><FaRegHeart /> Add to Wishlist</>}
                    </button>
                    <div className="seller-info">
                        <div>Sold by: <strong>{product.seller?.sellerName || 'Amazon'}</strong></div>
                        {product.seller?.sellerRating > 0 && <div>Seller Rating: ⭐ {product.seller.sellerRating}</div>}
                    </div>
                </div>
            </div>

            {Object.keys(specs).length > 0 && (
                <div className="specs-section">
                    <h2>Specifications</h2>
                    <table className="specs-table"><tbody>{Object.entries(specs).map(([k, v]) => <tr key={k}><td>{k}</td><td>{v}</td></tr>)}</tbody></table>
                </div>
            )}

            <div className="reviews-section">
                <h2>Customer Reviews</h2>
                <div className="reviews-summary">
                    <div className="reviews-avg">
                        <div className="avg-number">{product.avgRating || 0}</div>
                        <div className="avg-star">{renderStars(product.avgRating)}</div>
                        <div style={{ fontSize: '0.85rem', color: '#565959', marginTop: 4 }}>{product.totalReviews || 0} reviews</div>
                    </div>
                    <div className="reviews-breakdown">
                        {[5, 4, 3, 2, 1].map(r => {
                            const entry = ratingBreakdown.find(b => b.rating === r);
                            const count = entry ? parseInt(entry.count) : 0;
                            const pct = product.totalReviews > 0 ? (count / product.totalReviews) * 100 : 0;
                            return (
                                <div key={r} className="rating-bar">
                                    <span className="bar-label">{r} star</span>
                                    <div className="bar"><div className="bar-fill" style={{ width: `${pct}%` }}></div></div>
                                    <span className="bar-count">{pct.toFixed(0)}%</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isAuthenticated && (
                    <div style={{ marginBottom: 20 }}>
                        <button className="btn btn-outline" onClick={() => setShowReviewForm(!showReviewForm)}>
                            {showReviewForm ? 'Cancel' : 'Write a review'}
                        </button>
                    </div>
                )}

                {showReviewForm && (
                    <form className="write-review" onSubmit={submitReview}>
                        <h3>Write your review</h3>
                        <div className="star-input">
                            {[1, 2, 3, 4, 5].map(s => (
                                <span key={s} className={s <= reviewForm.rating ? 'active' : ''} onClick={() => setReviewForm(f => ({ ...f, rating: s }))}>★</span>
                            ))}
                        </div>
                        <div className="form-group"><label>Title</label><input type="text" value={reviewForm.title} onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} placeholder="Headline for your review" /></div>
                        <div className="form-group"><label>Comment</label><textarea rows={4} value={reviewForm.comment} onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))} placeholder="Write your review here..."></textarea></div>
                        <button type="submit" className="btn btn-primary">Submit Review</button>
                    </form>
                )}

                {reviews.map(r => (
                    <div key={r.id} className="review-item">
                        <div className="review-header">
                            <div className="reviewer-avatar">{r.user?.name?.[0] || 'U'}</div>
                            <span className="reviewer-name">{r.user?.name || 'Customer'}</span>
                        </div>
                        <div className="review-stars">{renderStars(r.rating)} <strong style={{ marginLeft: 8 }}>{r.title}</strong></div>
                        <div className="review-date">{new Date(r.createdAt || r.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        {r.isVerifiedPurchase && <div className="review-verified">Verified Purchase</div>}
                        <div className="review-body">{r.comment}</div>
                        <div className="review-helpful">{r.helpfulCount || 0} people found this helpful <button onClick={() => reviewAPI.markHelpful(r.id).then(() => toast.success('Marked as helpful'))}>Helpful</button></div>
                    </div>
                ))}
            </div>

            {related.length > 0 && (
                <>
                    <div className="section-header"><h2>Related Products</h2></div>
                    <div className="product-scroll">{related.map(p => <ProductCard key={p.id} product={p} />)}</div>
                </>
            )}
        </div>
    );
};

export default ProductDetail;
