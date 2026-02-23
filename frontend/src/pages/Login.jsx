import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (e) {
            setError(e.response?.data?.message || 'Login failed');
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <Link to="/" className="auth-logo">amazon<span>.in</span></Link>
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Sign In</h1>
                {error && <div className="form-error" style={{ marginBottom: 12, padding: 10, background: '#fff0f0', borderRadius: 4, border: '1px solid #ffcccc' }}>{error}</div>}
                <div className="form-group"><label>Email</label><input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Enter your email" /></div>
                <div className="form-group"><label>Password</label><input type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Enter your password" /></div>
                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading}>{loading ? 'Signing in...' : 'Sign In'}</button>
                <p style={{ fontSize: '0.8rem', marginTop: 16 }}>By continuing, you agree to Amazon's <a href="#">Conditions of Use</a> and <a href="#">Privacy Notice</a>.</p>
                <div className="auth-divider">New to Amazon?</div>
                <Link to="/register"><button type="button" className="btn btn-outline btn-block">Create your Amazon account</button></Link>
            </form>
            <div className="auth-footer">
                <p style={{ fontSize: '0.75rem', color: '#888', marginTop: 24 }}>Demo Accounts:<br />Admin: admin@amazon.com / admin123<br />Seller: seller@amazon.com / seller123<br />Customer: john@test.com / test123</p>
            </div>
        </div>
    );
};

export default Login;
