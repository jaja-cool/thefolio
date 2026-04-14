import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './SplashPage.css';

const SplashPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set splash page styles when mounting
    document.body.style.margin = '0';
    document.body.style.height = '100vh';
    document.body.style.display = 'flex';
    document.body.style.flexDirection = 'column';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.background = 'radial-gradient(circle at top, #f6ecff, #d6c2ff, #9f7aea)';
    document.body.style.overflow = 'hidden';
    document.body.style.fontFamily = "'Poppins', sans-serif";

    // Reset styles when unmounting (navigating away)
    return () => {
      document.body.style.margin = '';
      document.body.style.height = '';
      document.body.style.display = '';
      document.body.style.flexDirection = '';
      document.body.style.justifyContent = '';
      document.body.style.alignItems = '';
      document.body.style.background = '';
      document.body.style.overflow = 'visible';
      document.body.style.fontFamily = '';
    };
  }, []);

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="logo-container">
        <div className="logo butterfly">
          <div className="body"></div>
          <div className="wing left-upper"></div>
          <div className="wing left-lower"></div>
          <div className="wing right-upper"></div>
          <div className="wing right-lower"></div>
        </div>
      </div>
      <div className="loading-text">
        <span>Loading</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
        <span className="dot">.</span>
      </div>
    </div>
  );
};

export default SplashPage;

