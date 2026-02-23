import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiPackage, FiShoppingBag, FiDollarSign, FiClipboard, FiPlus } from 'react-icons/fi';
import { sellerAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SellerDashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('dashboard');
    const [dashboard, setDashboard] = useState({});
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState({ title: '', description: '', price: '', originalPrice: '', discount: 0, categoryId: '', brand: '', stock: 0, sku: '', bulletPoints: [], tags: [], images: [], thumbnail: '', deliveryDays: 5, freeDelivery: false, returnPolicy: '10 days return policy', warranty: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || (user?.role !== 'seller' && user?.role !== 'admin')) { navigate('/'); return; }
        categoryAPI.getAll().then(r => setCategories(r.data.categories || [])).catch(() => { });
        fetchData();
    }, [tab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (tab === 'dashboard') { const r = await sellerAPI.getDashboard(); setDashboard(r.data.dashboard || {}); }
            else if (tab === 'products') { const r = await sellerAPI.getProducts({}); setProducts(r.data.products || []); }
            else if (tab === 'orders') { const r = await sellerAPI.getOrders({}); setOrders(r.data.orders || []); }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleSaveProduct = async (e) => {
        e.preventDefault();
        try {
            const data = { ...form, bulletPoints: typeof form.bulletPoints === 'string' ? form.bulletPoints.split('\n').filter(Boolean) : form.bulletPoints, tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags, images: typeof form.images === 'string' ? form.images.split('\n').filter(Boolean) : form.images };
            if (editProduct) { await sellerAPI.updateProduct(editProduct.id, data); toast.success('Product updated!'); }
            else { await sellerAPI.createProduct(data); toast.success('Product created!'); }
            setShowForm(false); setEditProduct(null); setForm({ title: '', description: '', price: '', originalPrice: '', discount: 0, categoryId: '', brand: '', stock: 0, sku: '', bulletPoints: [], tags: [], images: [], thumbnail: '', deliveryDays: 5, freeDelivery: false, returnPolicy: '10 days return policy', warranty: '' });
            fetchData();
        } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    };

    const handleEdit = (p) => {
        setEditProduct(p);
        setForm({ ...p, bulletPoints: (p.bulletPoints || p.bullet_points || []).join('\n'), tags: (p.tags || []).join(', '), images: (p.images || []).join('\n') });
        setShowForm(true);
    };

    const handleUpdateStatus = async (itemId, status) => {
        try { await sellerAPI.updateOrderStatus(itemId, { status }); toast.success('Status updated!'); fetchData(); } catch (e) { toast.error('Error'); }
    };

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <h3 style={{ padding: '8px 12px', color: '#FF9900', fontSize: '1.1rem' }}>Seller Central</h3>
                <a className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')} style={{ cursor: 'pointer' }}><FiClipboard /> Dashboard</a>
                <a className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')} style={{ cursor: 'pointer' }}><FiPackage /> Products</a>
                <a className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')} style={{ cursor: 'pointer' }}><FiShoppingBag /> Orders</a>
            </aside>

            <div className="dashboard-content">
                {loading ? <div className="loading"><div className="spinner"></div></div> : (
                    <>
                        {tab === 'dashboard' && (
                            <div className="dashboard-stats">
                                <div className="stat-card"><div className="stat-label">Total Products</div><div className="stat-value">{dashboard.totalProducts || 0}</div></div>
                                <div className="stat-card"><div className="stat-label">Active Products</div><div className="stat-value">{dashboard.activeProducts || 0}</div></div>
                                <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-value">{dashboard.totalOrders || 0}</div></div>
                                <div className="stat-card"><div className="stat-label">Revenue</div><div className="stat-value">₹{(dashboard.totalRevenue || 0).toLocaleString('en-IN')}</div></div>
                                <div className="stat-card"><div className="stat-label">Pending Orders</div><div className="stat-value">{dashboard.pendingOrders || 0}</div></div>
                            </div>
                        )}

                        {tab === 'products' && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <h2>Your Products ({products.length})</h2>
                                    <button className="btn btn-amazon" onClick={() => { setEditProduct(null); setShowForm(!showForm); }}><FiPlus /> {showForm ? 'Cancel' : 'Add Product'}</button>
                                </div>
                                {showForm && (
                                    <form onSubmit={handleSaveProduct} style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20 }}>
                                        <h3 style={{ marginBottom: 16 }}>{editProduct ? 'Edit Product' : 'New Product'}</h3>
                                        <div className="profile-grid">
                                            <div className="form-group"><label>Title *</label><input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                                            <div className="form-group"><label>Brand</label><input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} /></div>
                                            <div className="form-group"><label>Price *</label><input type="number" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></div>
                                            <div className="form-group"><label>Original Price</label><input type="number" value={form.originalPrice} onChange={e => setForm({ ...form, originalPrice: e.target.value })} /></div>
                                            <div className="form-group"><label>Discount %</label><input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: parseInt(e.target.value) || 0 })} /></div>
                                            <div className="form-group"><label>Stock *</label><input type="number" required value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} /></div>
                                            <div className="form-group"><label>Category</label><select value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}><option value="">Select</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                            <div className="form-group"><label>SKU</label><input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} /></div>
                                        </div>
                                        <div className="form-group"><label>Description</label><textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}></textarea></div>
                                        <div className="form-group"><label>Bullet Points (one per line)</label><textarea rows={3} value={form.bulletPoints} onChange={e => setForm({ ...form, bulletPoints: e.target.value })}></textarea></div>
                                        <div className="form-group"><label>Image URLs (one per line)</label><textarea rows={2} value={form.images} onChange={e => setForm({ ...form, images: e.target.value })}></textarea></div>
                                        <div className="form-group"><label>Thumbnail URL</label><input value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} /></div>
                                        <div className="form-group"><label>Tags (comma separated)</label><input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} /></div>
                                        <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>{editProduct ? 'Update Product' : 'Create Product'}</button>
                                    </form>
                                )}
                                <div className="dashboard-table">
                                    <table>
                                        <thead><tr><th>Image</th><th>Title</th><th>Price</th><th>Stock</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
                                        <tbody>{products.map(p => (
                                            <tr key={p.id}>
                                                <td><img src={p.thumbnail || 'https://via.placeholder.com/50'} alt="" style={{ width: 50, height: 50, objectFit: 'contain' }} /></td>
                                                <td style={{ maxWidth: 200 }}>{p.title}</td>
                                                <td>₹{Number(p.price).toLocaleString('en-IN')}</td>
                                                <td>{p.stock}</td>
                                                <td>⭐ {p.avgRating || p.avg_rating || 0}</td>
                                                <td><span className={`order-status-badge ${p.isActive || p.is_active ? 'delivered' : 'cancelled'}`}>{p.isActive || p.is_active ? 'Active' : 'Inactive'}</span></td>
                                                <td><button className="btn btn-outline btn-sm" onClick={() => handleEdit(p)} style={{ marginRight: 4 }}>Edit</button><button className="btn btn-outline btn-sm" style={{ color: '#d32f2f' }} onClick={async () => { await sellerAPI.deleteProduct(p.id); fetchData(); toast.info('Product deactivated'); }}>Delete</button></td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {tab === 'orders' && (
                            <>
                                <h2 style={{ marginBottom: 16 }}>Orders ({orders.length})</h2>
                                <div className="dashboard-table">
                                    <table>
                                        <thead><tr><th>Order</th><th>Product</th><th>Qty</th><th>Total</th><th>Customer</th><th>Status</th><th>Actions</th></tr></thead>
                                        <tbody>{orders.map(item => (
                                            <tr key={item.id}>
                                                <td>#{item.order?.orderNumber || item.order?.order_number}</td>
                                                <td style={{ maxWidth: 150 }}>{item.productTitle || item.product_title}</td>
                                                <td>{item.quantity}</td>
                                                <td>₹{Number(item.total).toLocaleString('en-IN')}</td>
                                                <td>{item.order?.user?.name}</td>
                                                <td><span className={`order-status-badge ${item.status}`}>{item.status}</span></td>
                                                <td>
                                                    <select value={item.status} onChange={e => handleUpdateStatus(item.id, e.target.value)} style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.8rem' }}>
                                                        <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
