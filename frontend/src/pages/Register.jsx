import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', phone: '', role: 'customer' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return; }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            await register(form);
            toast.success('Account created successfully!');
            navigate('/');
        } catch (e) { setError(e.response?.data?.message || 'Registration failed'); }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <Link to="/" className="auth-logo">amazon<span>.in</span></Link>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Create Account</h1>
                {error && <div className="form-error" style={{ marginBottom: 12, padding: 10, background: '#fff0f0', borderRadius: 4, border: '1px solid #ffcccc' }}>{error}</div>}
                <div className="form-group"><label>Your name</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="First and last name" /></div>
                <div className="form-group"><label>Email</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" /></div>
                <div className="form-group"><label>Mobile number</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Mobile number" /></div>
                <div className="form-group"><label>Password</label><input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="At least 6 characters" /></div>
                <div className="form-group"><label>Re-enter password</label><input type="password" required value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Re-enter password" /></div>
                <div className="form-group"><label>Account type</label><select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}><option value="customer">Customer</option><option value="seller">Seller</option></select></div>
                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>{loading ? 'Creating...' : 'Create your Amazon account'}</button>
                <div className="auth-divider">Already have an account?</div>
                <Link to="/login"><button type="button" className="btn btn-outline btn-block">Sign In</button></Link>
            </form>
        </div>
    );
};

export default Register;
