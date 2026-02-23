import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        wishlistAPI.get().then(r => setItems(r.data.items || [])).catch(() => { }).finally(() => setLoading(false));
    }, [isAuthenticated]);

    const handleRemove = async (productId) => {
        try { await wishlistAPI.remove(productId); setItems(items.filter(i => i.productId !== productId && i.product_id !== productId)); toast.info('Removed from wishlist'); } catch (e) { toast.error('Error'); }
    };

    const handleMoveToCart = async (item) => {
        try { await addToCart(item.product.id); await wishlistAPI.remove(item.product.id); setItems(items.filter(i => i.id !== item.id)); toast.success('Moved to cart!'); } catch (e) { toast.error('Error'); }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="wishlist-page">
            <h1>Your Wishlist ({items.length} items)</h1>
            {items.length === 0 ? (
                <div className="empty-state"><h2>Your wishlist is empty</h2><p>Add items you love to your wishlist. Review them anytime and easily move them to the cart.</p><Link to="/products"><button className="btn btn-primary btn-lg">Explore Products</button></Link></div>
            ) : (
                <div className="wishlist-grid">
                    {items.map(item => (
                        <div key={item.id} style={{ position: 'relative' }}>
                            <ProductCard product={item.product} />
                            <div style={{ padding: '0 16px 16px', display: 'flex', gap: 8 }}>
                                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={() => handleMoveToCart(item)}>Move to Cart</button>
                                <button className="btn btn-outline btn-sm" onClick={() => handleRemove(item.product.id)}>Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
