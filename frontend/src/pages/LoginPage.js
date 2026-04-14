import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../pages/auth.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      // Redirect based on role
      navigate(user.role === 'admin' ? '/admin' : '/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className='auth-wrapper'>
      <div className='auth-card'>
        <div className='auth-header'>
          <h2>Login to TheFolio</h2>
        </div>
        {error && <p className='error-msg'>{error}</p>}
        <form onSubmit={handleSubmit} className='styled-form'>
          <div className='form-group'>
            <label>Email</label>
            <input type='email' placeholder='Enter your email'
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className='form-group'>
            <label>Password</label>
            <input type='password' placeholder='Enter your password'
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type='submit' className='btn-primary'>Login</button>
        </form>
        <p style={{textAlign: 'center', marginTop: '20px', color: '#666'}}>
          Don't have an account? <Link to='/register'>Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

