import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        const fetchOrders = async () => {
            try {
                const res = await orderAPI.getAll({ status: filter || undefined });
                setOrders(res.data.orders || []);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        fetchOrders();
    }, [isAuthenticated, filter]);

    if (loading) return <div className="loading"><div className="spinner"></div></div>;

    return (
        <div className="orders-page">
            <h1>Your Orders</h1>
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(s => (
                    <button key={s} className={`btn btn-sm ${filter === s ? 'btn-amazon' : 'btn-outline'}`} onClick={() => setFilter(s)}>
                        {s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Orders'}
                    </button>
                ))}
            </div>

            {orders.length === 0 ? (
                <div className="empty-state"><h2>No orders found</h2><p>Looks like you haven't placed any orders yet.</p><Link to="/products"><button className="btn btn-primary btn-lg">Start Shopping</button></Link></div>
            ) : (
                orders.map(order => (
                    <div key={order.id} className="order-card" onClick={() => navigate(`/orders/${order.id}`)} style={{ cursor: 'pointer' }}>
                        <div className="order-card-header">
                            <div className="order-info">
                                <div><span className="label">Order Placed</span>{new Date(order.createdAt || order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                                <div><span className="label">Total</span>₹{Number(order.totalAmount || order.total_amount).toLocaleString('en-IN')}</div>
                                <div><span className="label">Order #</span>{order.orderNumber || order.order_number}</div>
                            </div>
                            <span className={`order-status-badge ${order.status}`}>{order.status}</span>
                        </div>
                        <div className="order-card-body">
                            {(order.items || []).map(item => (
                                <div key={item.id} className="order-item">
                                    <img src={item.productImage || item.product_image || item.product?.thumbnail || 'https://via.placeholder.com/80'} alt="" />
                                    <div className="order-item-info">
                                        <div className="item-title">{item.productTitle || item.product_title || item.product?.title}</div>
                                        <div className="item-meta">Qty: {item.quantity} | ₹{Number(item.price).toLocaleString('en-IN')}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
