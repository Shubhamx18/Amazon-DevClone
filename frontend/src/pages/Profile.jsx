import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { authAPI, addressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, isAuthenticated, updateUser, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ name: '', email: '', phone: '' });
    const [addresses, setAddresses] = useState([]);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) { navigate('/login'); return; }
        setProfile({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
        addressAPI.getAll().then(r => setAddresses(r.data.addresses || [])).catch(() => { });
    }, [isAuthenticated, user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await authAPI.updateProfile({ name: profile.name, phone: profile.phone });
            updateUser(res.data.user);
            toast.success('Profile updated!');
            setEditing(false);
        } catch (e) { toast.error('Error updating profile'); }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('Passwords do not match'); return; }
        try {
            await authAPI.changePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
            toast.success('Password changed!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
    };

    const handleDeleteAddress = async (id) => {
        try { await addressAPI.delete(id); setAddresses(addresses.filter(a => a.id !== id)); toast.info('Address deleted'); } catch (e) { toast.error('Error'); }
    };

    return (
        <div className="profile-page">
            <h1>Your Account</h1>
            <div className="profile-card">
                <h2>Personal Information</h2>
                <form onSubmit={handleUpdateProfile}>
                    <div className="profile-grid">
                        <div className="form-group"><label>Name</label><input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} disabled={!editing} /></div>
                        <div className="form-group"><label>Email</label><input value={profile.email} disabled /></div>
                        <div className="form-group"><label>Phone</label><input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} disabled={!editing} /></div>
                        <div className="form-group"><label>Account Type</label><input value={user?.role || 'customer'} disabled style={{ textTransform: 'capitalize' }} /></div>
                    </div>
                    <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                        {editing ? (<><button type="submit" className="btn btn-primary">Save Changes</button><button type="button" className="btn btn-outline" onClick={() => setEditing(false)}>Cancel</button></>) : (<button type="button" className="btn btn-outline" onClick={() => setEditing(true)}>Edit Profile</button>)}
                    </div>
                </form>
            </div>

            <div className="profile-card">
                <h2>Change Password</h2>
                <form onSubmit={handleChangePassword}>
                    <div className="profile-grid">
                        <div className="form-group"><label>Current Password</label><input type="password" required value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} /></div>
                        <div className="form-group"><label>New Password</label><input type="password" required value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} /></div>
                        <div className="form-group"><label>Confirm Password</label><input type="password" required value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} /></div>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }}>Change Password</button>
                </form>
            </div>

            <div className="profile-card">
                <h2>Your Addresses</h2>
                <div className="addresses-list">
                    {addresses.map(a => (
                        <div key={a.id} className="address-card">
                            <div className="address-name">{a.fullName || a.full_name} {(a.isDefault || a.is_default) && <span style={{ background: '#067d62', color: 'white', padding: '2px 8px', borderRadius: 4, fontSize: '0.7rem', marginLeft: 8 }}>Default</span>}</div>
                            <div className="address-text">{a.addressLine1 || a.address_line1}, {a.city}, {a.state} - {a.pincode}<br />Phone: {a.phone}</div>
                            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                                <button className="btn btn-outline btn-sm" onClick={() => addressAPI.setDefault(a.id).then(() => { toast.success('Default address updated'); addressAPI.getAll().then(r => setAddresses(r.data.addresses || [])); })}>Set Default</button>
                                <button className="btn btn-outline btn-sm" onClick={() => handleDeleteAddress(a.id)} style={{ color: '#d32f2f' }}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="profile-card">
                <button className="btn btn-danger" onClick={() => { logout(); navigate('/'); }}>Sign Out</button>
            </div>
        </div>
    );
};

export default Profile;
