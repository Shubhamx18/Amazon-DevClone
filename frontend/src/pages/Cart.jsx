import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { cartItems, cartSummary, updateCartItem, removeFromCart } = useCart();

    if (!isAuthenticated) { return <div className="cart-page"><div className="cart-empty"><h2>Sign in to view your cart</h2><p>Your shopping cart is waiting for you</p><Link to="/login"><button className="btn btn-primary btn-lg">Sign In</button></Link></div></div>; }

    if (cartItems.length === 0) {
        return <div className="cart-page"><div className="cart-items"><div className="cart-empty"><h2>Your Amazon Cart is empty</h2><p>Your shopping cart lives to serve. Give it purpose — fill it with groceries, clothing, electronics, and more.</p><Link to="/products"><button className="btn btn-primary btn-lg">Continue Shopping</button></Link></div></div></div>;
    }

    return (
        <div className="cart-page">
            <div className="cart-items">
                <h1>Shopping Cart</h1>
                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#565959', marginBottom: 8 }}>Price</div>
                {cartItems.map(item => (
                    <div key={item.id} className="cart-item">
                        <img className="cart-item-img" src={item.product?.thumbnail || item.product?.images?.[0] || 'https://via.placeholder.com/180'} alt={item.product?.title} onClick={() => navigate(`/products/${item.product?.id}`)} />
                        <div className="cart-item-details">
                            <div className="cart-item-title" onClick={() => navigate(`/products/${item.product?.id}`)}>{item.product?.title}</div>
                            <div className="cart-item-seller">Sold by: {item.product?.seller?.sellerName || 'Amazon'}</div>
                            <div className="cart-item-stock">{item.product?.stock > 0 ? 'In Stock' : 'Out of Stock'}</div>
                            <div className="cart-item-actions">
                                <select value={item.quantity} onChange={e => updateCartItem(item.id, parseInt(e.target.value))}>
                                    {Array.from({ length: Math.min(item.product?.stock || 10, 10) }, (_, i) => <option key={i + 1} value={i + 1}>Qty: {i + 1}</option>)}
                                </select>
                                <span className="separator">|</span>
                                <button onClick={() => removeFromCart(item.id)}>Delete</button>
                                <span className="separator">|</span>
                                <button onClick={() => navigate('/wishlist')}>Save for later</button>
                            </div>
                        </div>
                        <div className="cart-item-price">
                            <div className="price">₹{Number(item.product?.price).toLocaleString('en-IN')}</div>
                            {item.product?.discount > 0 && <div style={{ fontSize: '0.8rem', color: '#565959', textDecoration: 'line-through' }}>₹{Number(item.product?.originalPrice).toLocaleString('en-IN')}</div>}
                        </div>
                    </div>
                ))}
                <div style={{ textAlign: 'right', padding: '16px 0', fontSize: '1.1rem' }}>
                    Subtotal ({cartSummary.totalItems} items): <strong>₹{cartSummary.subtotal?.toLocaleString('en-IN')}</strong>
                </div>
            </div>

            <div className="cart-summary">
                {cartSummary.subtotal >= 499 && <div className="free-shipping-msg">✓ Your order qualifies for FREE Delivery</div>}
                <h3>Subtotal ({cartSummary.totalItems} items): <strong>₹{cartSummary.totalAmount?.toLocaleString('en-IN')}</strong></h3>
                <div className="summary-row"><span>Items:</span><span>₹{cartSummary.subtotal?.toLocaleString('en-IN')}</span></div>
                <div className="summary-row"><span>Delivery:</span><span>{cartSummary.shippingCost === 0 ? 'FREE' : `₹${cartSummary.shippingCost}`}</span></div>
                <div className="summary-row"><span>Tax (GST 18%):</span><span>₹{cartSummary.tax?.toLocaleString('en-IN')}</span></div>
                {cartSummary.totalDiscount > 0 && <div className="summary-row" style={{ color: '#067d62' }}><span>You Save:</span><span>₹{cartSummary.totalDiscount?.toLocaleString('en-IN')}</span></div>}
                <div className="summary-total"><span>Order Total:</span><span>₹{cartSummary.totalAmount?.toLocaleString('en-IN')}</span></div>
                <button className="btn btn-primary btn-block btn-lg" style={{ marginTop: 16 }} onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
            </div>
        </div>
    );
};

export default Cart;
