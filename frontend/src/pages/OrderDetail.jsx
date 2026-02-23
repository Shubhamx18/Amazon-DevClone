import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const OrderDetail = () => {
    const { id } = useParams();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        orderAPI.getById(id).then(r => setOrder(r.data.order)).catch(() => navigate('/orders')).finally(() => setLoading(false));
    }, [id]);

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        try {
            await orderAPI.cancel(id, { reason: 'Customer requested cancellation' });
            toast.success('Order cancelled');
            orderAPI.getById(id).then(r => setOrder(r.data.order));
        } catch (e) { toast.error(e.response?.data?.message || 'Cannot cancel order'); }
    };

    if (loading) return <div className="loading"><div className="spinner"></div></div>;
    if (!order) return <div className="empty-state"><h2>Order not found</h2></div>;

    const statuses = ['confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered'];
    const currentIdx = statuses.indexOf(order.status);

    return (
        <div className="orders-page">
            <h1>Order Details</h1>
            <div className="order-card">
                <div className="order-card-header">
                    <div className="order-info">
                        <div><span className="label">Order #</span>{order.orderNumber || order.order_number}</div>
                        <div><span className="label">Placed</span>{new Date(order.createdAt || order.created_at).toLocaleDateString('en-IN')}</div>
                        <div><span className="label">Total</span>₹{Number(order.totalAmount || order.total_amount).toLocaleString('en-IN')}</div>
                        <div><span className="label">Payment</span>{(order.paymentMethod || order.payment_method || '').toUpperCase()}</div>
                    </div>
                    <span className={`order-status-badge ${order.status}`}>{order.status}</span>
                </div>

                {!['cancelled', 'returned', 'refunded'].includes(order.status) && (
                    <div style={{ padding: '0 20px' }}>
                        <div className="order-timeline">
                            {statuses.map((s, i) => (
                                <div key={s} className={`timeline-step ${i <= currentIdx ? 'completed' : ''} ${i === currentIdx ? 'active' : ''}`}>
                                    <div className="step-dot">{i <= currentIdx ? <FaCheckCircle /> : (i + 1)}</div>
                                    <span className="step-label">{s.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="order-card-body">
                    <h3 style={{ marginBottom: 12 }}>Items</h3>
                    {(order.items || []).map(item => (
                        <div key={item.id} className="order-item" onClick={() => item.product && navigate(`/products/${item.product.id}`)} style={{ cursor: 'pointer' }}>
                            <img src={item.productImage || item.product_image || item.product?.thumbnail || 'https://via.placeholder.com/80'} alt="" />
                            <div className="order-item-info">
                                <div className="item-title">{item.productTitle || item.product_title}</div>
                                <div className="item-meta">Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')} = ₹{Number(item.total).toLocaleString('en-IN')}</div>
                            </div>
                        </div>
                    ))}

                    <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                        <div>
                            <h3 style={{ marginBottom: 8 }}>Shipping Address</h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
                                <strong>{order.shippingName || order.shipping_name}</strong><br />
                                {order.shippingAddress || order.shipping_address}<br />
                                {order.shippingCity || order.shipping_city}, {order.shippingState || order.shipping_state} - {order.shippingPincode || order.shipping_pincode}<br />
                                Phone: {order.shippingPhone || order.shipping_phone}
                            </p>
                        </div>
                        <div>
                            <h3 style={{ marginBottom: 8 }}>Order Summary</h3>
                            <div style={{ fontSize: '0.9rem', lineHeight: 2 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Subtotal:</span><span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Shipping:</span><span>{Number(order.shippingCost || order.shipping_cost) === 0 ? 'FREE' : `₹${order.shippingCost || order.shipping_cost}`}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tax:</span><span>₹{Number(order.tax).toLocaleString('en-IN')}</span></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, borderTop: '1px solid #ddd', paddingTop: 8 }}><span>Total:</span><span>₹{Number(order.totalAmount || order.total_amount).toLocaleString('en-IN')}</span></div>
                            </div>
                        </div>
                    </div>

                    {['pending', 'confirmed', 'processing'].includes(order.status) && (
                        <div style={{ marginTop: 20 }}><button className="btn btn-danger" onClick={handleCancel}>Cancel Order</button></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
