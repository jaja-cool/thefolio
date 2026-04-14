import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/DarkModeContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isDark, toggleDarkMode } = useDarkMode();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const profileRef = useRef(null);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleClickOutside = (event) => {
    if (profileRef.current && !profileRef.current.contains(event.target)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Don't show nav on splash page
  if (location.pathname === '/splash') {
    return null;
  }

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/home';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
  };

  return (
    <header>
      <div className="header-left">
        <div 
          id="darkToggle" 
          className="lamp"
          onClick={toggleDarkMode}
        >
          <div className={`shade ${isDark ? 'on' : ''}`} id="shade"></div>
          <div className="bulb"></div>
        </div>
        <h1 className="logo">TheFolio</h1>

      </div>
      <nav style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
        <Link to="/home" className={isActive('/') ? 'active' : ''}>HOME</Link>
        <Link to="/about" className={isActive('/about') ? 'active' : ''}>ABOUT</Link>
        {!(user && user.role === 'admin') && (
          <Link to="/contact" className={isActive('/contact') ? 'active' : ''}>CONTACT US</Link>
        )}

{user ? (
  <>
    <Link to="/profile" className={isActive('/profile') ? 'active' : ''}>PROFILE</Link>
    {user.role === 'admin' && (
      <Link to="/admin" className={isActive('/admin') ? 'active' : ''}>ADMIN</Link>
    )}
    <Link to="/create-post" className={isActive('/create-post') ? 'active' : ''}>NEW POST</Link>
    <div ref={profileRef} className="profile-logout-container" style={{marginLeft: 'auto', position: 'relative'}}>
      <button 
        onClick={handleToggleDropdown}
        style={{background: 'none', border: 'none', cursor: 'pointer'}}
        aria-label="User menu"
      >
        {user.profilePic ? (
          <img 
            src={`/uploads/${user.profilePic}`} 
            alt="Profile"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          /> 
        ) : (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: isDark ? '#3730a3' : '#4f46e5',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
        )}
      </button>
      {showDropdown && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: isDark ? '#1f2937' : 'white',
          border: isDark ? '1px solid #374151' : '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 1000,
          minWidth: '120px',
          marginTop: '4px'
        }}>
          <button 
            onClick={handleLogout}
style={{
              background: 'none', 
              border: 'none', 
              color: isDark ? '#f9fafb' : '#111827',
              cursor: 'pointer',
              display: 'block',
              width: '100%',
              padding: '12px 16px',
              textAlign: 'left',
              fontSize: '14px'
            }}>
            Logout
          </button>

        </div>
      )}
    </div>
  </>
) : (
  <>
    <Link to="/login" className={isActive('/login') ? 'active' : ''}>LOGIN</Link>
    <Link to="/register" className={isActive('/register') ? 'active' : ''}>REGISTER</Link>
  </>
)}
      </nav>
    </header>
  );
};

export default Navbar;

