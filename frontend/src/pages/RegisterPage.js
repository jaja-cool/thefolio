import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    dob: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    terms: false
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      // Clear error when checkbox is checked
      if (checked && errors.terms) {
        setErrors({ ...errors, terms: '' });
      }
    } else if (type === 'radio') {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleFullNameChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, fullname: value });
    
    if (/\d/.test(value)) {
      setErrors({ ...errors, fullname: 'Invalid name.' });
    } else if (value === '') {
      setErrors({ ...errors, fullname: 'Full Name is required' });
    } else {
      setErrors({ ...errors, fullname: '' });
    }
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, email: value });
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value === '') {
      setErrors({ ...errors, email: 'Email is required' });
    } else if (!emailRegex.test(value)) {
      setErrors({ ...errors, email: 'Invalid email.' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };

  const handleDobChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, dob: value });
    
    if (value === '') {
      setErrors({ ...errors, dob: 'Date of Birth is required' });
    } else {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        setErrors({ ...errors, dob: 'You must be 18 or older.' });
      } else {
        setErrors({ ...errors, dob: '' });
      }
    }
  };
  
  const getPasswordError = (value) => {

    if (value === '') return 'Password is required';
    if (value.length < 8) return 'Password min 8 chars, upper, lower, number, symbol';
    if (!/[A-Z]/.test(value)) return 'Password min 8 chars, upper, lower, number, symbol';
    if (!/[a-z]/.test(value)) return 'Password min 8 chars, upper, lower, number, symbol';
    if (!/[0-9]/.test(value)) return 'Password min 8 chars, upper, lower, number, symbol';
    if (!/[@$!%*?&]/.test(value)) return 'Password min 8 chars, upper, lower, number, symbol';
    return '';
  };

  const getPasswordStrength = (value) => {
    if (value.length < 8) return 20;
    let score = 20;
    if (/[A-Z]/.test(value)) score += 20;
    if (/[a-z]/.test(value)) score += 20;
    if (/[0-9]/.test(value)) score += 20;
    if (/[@$!%*?&]/.test(value)) score += 20;
    return Math.min(score, 100);
  };

  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, password: value });
    const error = getPasswordError(value);
    setErrors({ ...errors, password: error });
    
    // Clear confirm if password valid
    if (!error && formData.confirmPassword) {
      if (value === formData.confirmPassword) {
        setErrors({ ...errors, confirmPassword: '' });
      }
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, confirmPassword: value });
    
    if (value === '') {
      setErrors({ ...errors, confirmPassword: 'Confirm Password is required' });
    } else if (value !== formData.password) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match.' });
    } else {
      setErrors({ ...errors, confirmPassword: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    
    // Validate all required fields
    const newErrors = {};
    
    if (!formData.fullname.trim()) {
      newErrors.fullname = 'Full Name is required';
    } else if (/\d/.test(formData.fullname)) {
      newErrors.fullname = 'Invalid name.';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required';
    } else {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        newErrors.dob = 'You must be 18 or older.';
      }
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Invalid email.';
      }
    }
    
    const pwError = getPasswordError(formData.password);
    if (pwError) {
      newErrors.password = pwError;
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    
    if (!formData.terms) {
      newErrors.terms = 'You must agree to the terms';
    }
    
    // If there are any errors, set them and prevent submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setSubmitting(true);
    try {
      const user = await register(formData);
      // Auto-login success, redirect based on role
      navigate(user.role === 'admin' ? '/admin' : '/profile');
    } catch (err) {
      const errorMsg = err.response?.data?.message;
      if (Array.isArray(errorMsg)) {
        setServerError(errorMsg.map(e => e.msg).join(', '));
      } else {
        setServerError(errorMsg || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="register-wrapper">
        <div className="register-card">
          <div className="register-header">
            <h2>Create Account</h2>
            <p>Join us and stay updated!</p>
          </div>
          {serverError && <p className="error-text" style={{textAlign: 'center', marginBottom: '20px'}}>{serverError}</p>}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  placeholder="Jaslyn Kate Gatchalian"
                  value={formData.fullname}
                  onChange={handleFullNameChange}
                  className={errors.fullname ? 'error-border' : ''}
                />
                {errors.fullname && <span className="error-text">{errors.fullname}</span>}
              </div>

              <div className="form-group">
                <label>Username *</label>
                <input 
                  type="text" 
                  placeholder="jaja09"
                  value={formData.username}
                  onChange={handleChange}
                  name="username"
                  className={errors.username ? 'error-border' : ''}
                />
                {errors.username && <span className="error-text">{errors.username}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth</label>
                <input 
                  type="date" 
                  value={formData.dob}
                  onChange={handleDobChange}
                  name="dob"
                  className={errors.dob ? 'error-border' : ''}
                />
                {errors.dob && <span className="error-text">{errors.dob}</span>}
              </div>

              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  placeholder="jaja@example.com"
                  value={formData.email}
                  onChange={handleEmailChange}
                  name="email"
                  className={errors.email ? 'error-border' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  name="password"
                  className={errors.password ? 'error-border' : ''}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className={`strength-fill strength-${getPasswordStrength(formData.password) >= 80 ? 'strong' : getPasswordStrength(formData.password) >= 60 ? 'medium' : 'weak'}`}
                        style={{width: `${getPasswordStrength(formData.password)}%`}}
                      ></div>
                    </div>
                    <small>
                      Strength: {getPasswordStrength(formData.password) >= 80 ? 'Strong' : getPasswordStrength(formData.password) >= 60 ? 'Medium' : 'Weak'}
                      {getPasswordStrength(formData.password) < 100 && (
                        <> | Needs: {(!/[A-Z]/.test(formData.password) ? 'Upper ' : '')}
                        {(!/[a-z]/.test(formData.password) ? 'Lower ' : '')}
                        {(!/[0-9]/.test(formData.password) ? 'Number ' : '')}
                        {(!/[@$!%*?&]/.test(formData.password) ? 'Symbol(@$!%*?&) ' : '')}</>
                      )}
                    </small>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  name="confirmPassword"
                  className={errors.confirmPassword ? 'error-border' : ''}
                />
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Gender</label>
              <div className="radio-buttons">
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="male" 
                    checked={formData.gender === 'male'}
                    onChange={handleChange}
                  />
                  <span>Male</span>
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="female"
                    checked={formData.gender === 'female'}
                    onChange={handleChange}
                  />
                  <span>Female</span>
                </label>
                <label className="radio-label">
                  <input 
                    type="radio" 
                    name="gender" 
                    value="other"
                    checked={formData.gender === 'other'}
                    onChange={handleChange}
                  />
                  <span>Other</span>
                </label>
              </div>
              {errors.gender && <span className="error-text">{errors.gender}</span>}
            </div>

            <div className="checkbox-wrapper">
              <label className={`checkbox-label ${errors.terms ? 'checkbox-error' : ''}`}>
                <input 
                  type="checkbox" 
                  name="terms" 
                  checked={formData.terms}
                  onChange={handleChange}
                />
                <span>I agree to receive updates and accept the terms</span>
              </label>
              {errors.terms && <span className="error-text">{errors.terms}</span>}
            </div>

            <button type="submit" className="submit-btn" disabled={submitting}>
              {submitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>

      <footer className="register-footer">
        <p>Contact: jkgatchalian23109703@student.dmmmsu.edu.ph | 09668113017</p>
        <p>© 2026 Jaslyn Kate Portfolio | All Rights Reserved</p>
      </footer>
    </>
  );
};

export default RegisterPage;

