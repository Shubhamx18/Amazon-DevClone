import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiUsers, FiPackage, FiShoppingBag, FiGrid, FiDollarSign, FiPlus, FiSearch } from 'react-icons/fi';
import { adminAPI, categoryAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [tab, setTab] = useState('dashboard');
    const [dashboard, setDashboard] = useState({});
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showCatForm, setShowCatForm] = useState(false);
    const [catForm, setCatForm] = useState({ name: '', description: '', image: '', parentId: '' });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') { navigate('/'); return; }
        fetchData();
    }, [tab]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (tab === 'dashboard') { const r = await adminAPI.getDashboard(); setDashboard(r.data.dashboard || {}); }
            else if (tab === 'users') { const r = await adminAPI.getUsers({}); setUsers(r.data.users || []); }
            else if (tab === 'products') { const r = await adminAPI.getProducts({}); setProducts(r.data.products || []); }
            else if (tab === 'orders') { const r = await adminAPI.getOrders({}); setOrders(r.data.orders || []); }
            else if (tab === 'categories') { const r = await categoryAPI.getAll(); setCategories(r.data.categories || []); }
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await categoryAPI.create(catForm);
            toast.success('Category created!');
            setShowCatForm(false);
            setCatForm({ name: '', description: '', image: '', parentId: '' });
            fetchData();
        } catch (e) { toast.error('Error'); }
    };

    const handleUpdateRole = async (userId, role) => {
        try { await adminAPI.updateUser(userId, { role }); toast.success('Role updated!'); fetchData(); } catch (e) { toast.error('Error'); }
    };

    const handleUpdateOrderStatus = async (orderId, status) => {
        try { await adminAPI.updateOrder(orderId, { status }); toast.success('Order status updated!'); fetchData(); } catch (e) { toast.error('Error'); }
    };

    return (
        <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
                <h3 style={{ padding: '8px 12px', color: '#FF9900', fontSize: '1.1rem' }}>Admin Panel</h3>
                <a className={tab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')} style={{ cursor: 'pointer' }}><FiGrid /> Dashboard</a>
                <a className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')} style={{ cursor: 'pointer' }}><FiUsers /> Users</a>
                <a className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')} style={{ cursor: 'pointer' }}><FiPackage /> Products</a>
                <a className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')} style={{ cursor: 'pointer' }}><FiShoppingBag /> Orders</a>
                <a className={tab === 'categories' ? 'active' : ''} onClick={() => setTab('categories')} style={{ cursor: 'pointer' }}><FiGrid /> Categories</a>
            </aside>

            <div className="dashboard-content">
                {loading ? <div className="loading"><div className="spinner"></div></div> : (
                    <>
                        {tab === 'dashboard' && (
                            <div className="dashboard-stats">
                                <div className="stat-card"><div className="stat-label">Total Users</div><div className="stat-value">{dashboard.totalUsers || 0}</div></div>
                                <div className="stat-card"><div className="stat-label">Total Products</div><div className="stat-value">{dashboard.totalProducts || 0}</div></div>
                                <div className="stat-card"><div className="stat-label">Total Orders</div><div className="stat-value">{dashboard.totalOrders || 0}</div></div>
                                <div className="stat-card"><div className="stat-label">Revenue</div><div className="stat-value">₹{(dashboard.totalRevenue || 0).toLocaleString('en-IN')}</div></div>
                                <div className="stat-card"><div className="stat-label">Sellers</div><div className="stat-value">{dashboard.totalSellers || 0}</div></div>
                                <div className="stat-card"><div className="stat-label">Categories</div><div className="stat-value">{dashboard.totalCategories || 0}</div></div>
                            </div>
                        )}

                        {tab === 'users' && (
                            <>
                                <h2 style={{ marginBottom: 16 }}>Manage Users ({users.length})</h2>
                                <div className="dashboard-table">
                                    <table>
                                        <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                                        <tbody>{users.map(u => (
                                            <tr key={u.id}>
                                                <td>{u.name}</td><td>{u.email}</td>
                                                <td><span className={`order-status-badge ${u.role === 'admin' ? 'delivered' : u.role === 'seller' ? 'shipped' : 'confirmed'}`}>{u.role}</span></td>
                                                <td>{new Date(u.createdAt || u.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <select value={u.role} onChange={e => handleUpdateRole(u.id, e.target.value)} style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.8rem' }}>
                                                        <option value="customer">Customer</option><option value="seller">Seller</option><option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {tab === 'products' && (
                            <>
                                <h2 style={{ marginBottom: 16 }}>All Products ({products.length})</h2>
                                <div className="dashboard-table">
                                    <table>
                                        <thead><tr><th>Image</th><th>Title</th><th>Seller</th><th>Price</th><th>Stock</th><th>Status</th></tr></thead>
                                        <tbody>{products.map(p => (
                                            <tr key={p.id}>
                                                <td><img src={p.thumbnail || 'https://via.placeholder.com/50'} alt="" style={{ width: 50, height: 50, objectFit: 'contain' }} /></td>
                                                <td style={{ maxWidth: 200 }}>{p.title}</td><td>{p.seller?.name || 'N/A'}</td><td>₹{Number(p.price).toLocaleString('en-IN')}</td><td>{p.stock}</td>
                                                <td><span className={`order-status-badge ${p.isActive || p.is_active ? 'delivered' : 'cancelled'}`}>{p.isActive || p.is_active ? 'Active' : 'Inactive'}</span></td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {tab === 'orders' && (
                            <>
                                <h2 style={{ marginBottom: 16 }}>All Orders ({orders.length})</h2>
                                <div className="dashboard-table">
                                    <table>
                                        <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
                                        <tbody>{orders.map(o => (
                                            <tr key={o.id}>
                                                <td>{o.orderNumber || o.order_number}</td><td>{o.user?.name}</td><td>{(o.items || []).length}</td>
                                                <td>₹{Number(o.totalAmount || o.total_amount).toLocaleString('en-IN')}</td>
                                                <td><span className={`order-status-badge ${o.status}`}>{o.status}</span></td>
                                                <td>{new Date(o.createdAt || o.created_at).toLocaleDateString()}</td>
                                                <td>
                                                    <select value={o.status} onChange={e => handleUpdateOrderStatus(o.id, e.target.value)} style={{ padding: '4px 8px', border: '1px solid #ddd', borderRadius: 4, fontSize: '0.8rem' }}>
                                                        <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="out_for_delivery">Out for Delivery</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}</tbody>
                                    </table>
                                </div>
                            </>
                        )}

                        {tab === 'categories' && (
                            <>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                                    <h2>Categories ({categories.length})</h2>
                                    <button className="btn btn-amazon" onClick={() => setShowCatForm(!showCatForm)}><FiPlus /> {showCatForm ? 'Cancel' : 'Add Category'}</button>
                                </div>
                                {showCatForm && (
                                    <form onSubmit={handleAddCategory} style={{ background: 'white', padding: 20, borderRadius: 8, marginBottom: 20 }}>
                                        <div className="profile-grid">
                                            <div className="form-group"><label>Name *</label><input required value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} /></div>
                                            <div className="form-group"><label>Description</label><input value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} /></div>
                                            <div className="form-group"><label>Image URL</label><input value={catForm.image} onChange={e => setCatForm({ ...catForm, image: e.target.value })} /></div>
                                            <div className="form-group"><label>Parent Category</label><select value={catForm.parentId} onChange={e => setCatForm({ ...catForm, parentId: e.target.value })}><option value="">None (Top Level)</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                        </div>
                                        <button type="submit" className="btn btn-primary" style={{ marginTop: 12 }}>Create Category</button>
                                    </form>
                                )}
                                <div className="dashboard-table">
                                    <table>
                                        <thead><tr><th>Image</th><th>Name</th><th>Description</th><th>Parent</th><th>Status</th></tr></thead>
                                        <tbody>{categories.map(c => (
                                            <tr key={c.id}>
                                                <td>{c.image ? <img src={c.image} alt="" style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }} /> : '—'}</td>
                                                <td><strong>{c.name}</strong></td><td>{c.description || '—'}</td><td>{c.parentId ? categories.find(p => p.id === c.parentId)?.name || '—' : 'Top Level'}</td>
                                                <td><span className={`order-status-badge ${c.isActive || c.is_active ? 'delivered' : 'cancelled'}`}>{c.isActive || c.is_active ? 'Active' : 'Inactive'}</span></td>
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

export default AdminDashboard;
