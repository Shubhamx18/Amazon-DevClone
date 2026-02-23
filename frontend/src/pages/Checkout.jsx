import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addressAPI, orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { cartItems, cartSummary, fetchCart } = useCart();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [loading, setLoading] = useState(false);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [addressForm, setAddressForm] = useState({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', addressType: 'home' });

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        if (cartItems.length === 0) { navigate('/cart'); return; }
        addressAPI.getAll().then(r => {
            setAddresses(r.data.addresses || []);
            const def = r.data.addresses?.find(a => a.isDefault || a.is_default);
            if (def) setSelectedAddress(def.id);
        }).catch(() => { });
    }, [isAuthenticated]);

    const handleAddAddress = async (e) => {
        e.preventDefault();
        try {
            const res = await addressAPI.add({ ...addressForm, isDefault: addresses.length === 0 });
            setAddresses([...addresses, res.data.address]);
            setSelectedAddress(res.data.address.id);
            setShowAddressForm(false);
            toast.success('Address added!');
        } catch (e) { toast.error('Error adding address'); }
    };

    const handlePlaceOrder = async () => {
        if (!selectedAddress) { toast.error('Please select a delivery address'); return; }
        setLoading(true);
        try {
            const res = await orderAPI.create({ addressId: selectedAddress, paymentMethod });
            await fetchCart();
            toast.success('Order placed successfully!');
            navigate(`/orders/${res.data.order.id}`);
        } catch (e) { toast.error(e.response?.data?.message || 'Error placing order'); }
        setLoading(false);
    };

    return (
        <div className="checkout-page">
            <h1>Checkout</h1>

            <div className="checkout-section">
                <h2>1. Select a delivery address</h2>
                <div className="address-cards">
                    {addresses.map(a => (
                        <div key={a.id} className={`address-card ${selectedAddress === a.id ? 'selected' : ''}`} onClick={() => setSelectedAddress(a.id)}>
                            <div className="address-name">{a.fullName || a.full_name} <span style={{ fontSize: '0.8rem', color: '#888' }}>({a.addressType || a.address_type})</span></div>
                            <div className="address-text">
                                {a.addressLine1 || a.address_line1}{a.addressLine2 || a.address_line2 ? `, ${a.addressLine2 || a.address_line2}` : ''}<br />
                                {a.city}, {a.state} - {a.pincode}<br />
                                Phone: {a.phone}
                            </div>
                        </div>
                    ))}
                    <div className="address-card" onClick={() => setShowAddressForm(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120, border: '2px dashed #ddd', cursor: 'pointer' }}>
                        <span style={{ fontSize: '2rem', color: '#888' }}>+ Add Address</span>
                    </div>
                </div>

                {showAddressForm && (
                    <form onSubmit={handleAddAddress} style={{ marginTop: 16, padding: 20, background: '#fafafa', borderRadius: 8 }}>
                        <div className="profile-grid">
                            <div className="form-group"><label>Full Name</label><input required value={addressForm.fullName} onChange={e => setAddressForm({ ...addressForm, fullName: e.target.value })} /></div>
                            <div className="form-group"><label>Phone</label><input required value={addressForm.phone} onChange={e => setAddressForm({ ...addressForm, phone: e.target.value })} /></div>
                            <div className="form-group"><label>Address Line 1</label><input required value={addressForm.addressLine1} onChange={e => setAddressForm({ ...addressForm, addressLine1: e.target.value })} /></div>
                            <div className="form-group"><label>Address Line 2</label><input value={addressForm.addressLine2} onChange={e => setAddressForm({ ...addressForm, addressLine2: e.target.value })} /></div>
                            <div className="form-group"><label>City</label><input required value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} /></div>
                            <div className="form-group"><label>State</label><input required value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} /></div>
                            <div className="form-group"><label>PIN Code</label><input required value={addressForm.pincode} onChange={e => setAddressForm({ ...addressForm, pincode: e.target.value })} /></div>
                            <div className="form-group"><label>Type</label><select value={addressForm.addressType} onChange={e => setAddressForm({ ...addressForm, addressType: e.target.value })}><option value="home">Home</option><option value="work">Work</option><option value="other">Other</option></select></div>
                        </div>
                        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}><button type="submit" className="btn btn-primary">Save Address</button><button type="button" className="btn btn-outline" onClick={() => setShowAddressForm(false)}>Cancel</button></div>
                    </form>
                )}
            </div>

            <div className="checkout-section">
                <h2>2. Select payment method</h2>
                <div className="payment-options">
                    {[{ value: 'cod', label: 'Cash on Delivery (COD)' }, { value: 'card', label: 'Credit / Debit Card' }, { value: 'upi', label: 'UPI (GPay, PhonePe, Paytm)' }, { value: 'netbanking', label: 'Net Banking' }, { value: 'emi', label: 'EMI' }].map(p => (
                        <div key={p.value} className={`payment-option ${paymentMethod === p.value ? 'selected' : ''}`} onClick={() => setPaymentMethod(p.value)}>
                            <input type="radio" name="payment" checked={paymentMethod === p.value} onChange={() => setPaymentMethod(p.value)} />
                            <span>{p.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="checkout-section">
                <h2>3. Review items and delivery</h2>
                {cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: '1px solid #eee' }}>
                        <img src={item.product?.thumbnail || item.product?.images?.[0] || ''} alt="" style={{ width: 80, height: 80, objectFit: 'contain' }} />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>{item.product?.title}</div>
                            <div style={{ fontSize: '0.85rem', color: '#B12704', fontWeight: 700 }}>₹{Number(item.product?.price).toLocaleString('en-IN')} × {item.quantity}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="checkout-section" style={{ background: '#FFF8EF', border: '1px solid #FF9900' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>Order Total: ₹{cartSummary.totalAmount?.toLocaleString('en-IN')}</div>
                        <div style={{ fontSize: '0.85rem', color: '#565959' }}>{cartSummary.totalItems} items | Delivery: {cartSummary.shippingCost === 0 ? 'FREE' : `₹${cartSummary.shippingCost}`}</div>
                    </div>
                    <button className="btn btn-amazon btn-lg" onClick={handlePlaceOrder} disabled={loading}>{loading ? 'Placing Order...' : 'Place your order'}</button>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
