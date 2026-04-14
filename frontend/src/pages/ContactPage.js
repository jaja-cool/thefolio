import React, { useState } from 'react';
import API from '../api/axios';
import './auth.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [notification, setNotification] = useState({ message: '', type: '' });

  const handleNameChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, name: value });
    
    if (!value.trim()) {
      setErrors({ ...errors, name: 'Name is required' });
    } else if (!/^[a-zA-Zs]+$/.test(value)) {
      setErrors({ ...errors, name: 'Name must contain letters only' });
    } else {
      setErrors({ ...errors, name: '' });
    }
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, email: value });
    
    if (!value.trim()) {
      setErrors({ ...errors, email: 'Email is required' });
    } else if (!value.includes('@')) {
      setErrors({ ...errors, email: 'Email must contain @' });
    } else {
      setErrors({ ...errors, email: '' });
    }
  };

  const handleMessageChange = (e) => {
    const { value } = e.target;
    setFormData({ ...formData, message: value });
    
    if (!value.trim()) {
      setErrors({ ...errors, message: 'Message is required' });
    } else if (value.trim().length < 15) {
      setErrors({ ...errors, message: 'Message must contain at least 15 letters' });
    } else {
      setErrors({ ...errors, message: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Zs]+$/.test(formData.name)) {
      newErrors.name = 'Name must contain letters only';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Email must contain @';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 15) {
      newErrors.message = 'Message must contain at least 15 letters';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      await API.post('/contact', formData);
      setNotification({ message: 'Message sent successfully!', type: 'success' });
      setFormData({ name: '', email: '', message: '' });
      setErrors({ name: '', email: '', message: '' });
      setTimeout(() => setNotification({ message: '', type: '' }), 5000);
    } catch (err) {
      setNotification({ message: `Failed to send message: ${err.response?.data?.message || err.message || 'Unknown error'}`, type: 'error' });
    }
  };

  return (
    <>
      {/* PAGE INTRO */}
      <section className="section">
        <h2>Contact & Resources</h2>
        <p>Feel free to reach out and explore useful resources related to web development.</p>
      </section>

      {/* CONTACT FORM */}
      <section className="section alt">
        <h2>Get in Touch</h2>

        <form className="contact-form" onSubmit={handleSubmit}>
          {notification.message && (
            <p className={`msg ${notification.type === 'success' ? 'success-msg' : 'error-msg'}`}>
              {notification.message}
            </p>
          )}
          <label htmlFor="name">Name</label>
          <input 
            type="text" 
            required 
            id="name" 
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleNameChange}
            className={errors.name ? 'error-border' : ''}
          />
          {errors.name && <span className="error-text">{errors.name}</span>}

          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            required 
            id="email" 
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleEmailChange}
            className={errors.email ? 'error-border' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}

          <label htmlFor="message">Message</label>
          <textarea 
            id="message" 
            required 
            rows="5" 
            placeholder="Write your message here"
            value={formData.message}
            onChange={handleMessageChange}
            className={errors.message ? 'error-border' : ''}
          />
          {errors.message && <span className="error-text">{errors.message}</span>}

          <button type="submit">Submit</button>
        </form>
      </section>

      {/* RESOURCES TABLE */}
      <section className="section">
        <h2>Helpful Resources</h2>

        <table className="resources-table">
          <thead>
            <tr>
              <th>Resource Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>W3Schools</td>
              <td>Beginner-friendly tutorials for HTML, CSS, and JavaScript.</td>
            </tr>
            <tr>
              <td>MDN Web Docs</td>
              <td>Official documentation and guides for web technologies.</td>
            </tr>
            <tr>
              <td>Canva</td>
              <td>Design tool useful for creating visuals and layouts.</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* MAP */}
      <section className="section alt">
        <h2>Location</h2>

        <div className="map">
          <iframe
            title="Google Maps"
            src="https://www.google.com/maps?q=Manila&output=embed"
            loading="lazy"
          />
        </div>
      </section>

      {/* EXTERNAL LINKS */}
      <section className="section">
        <h2>External Links</h2>

        <div className="external-links">
          <a href="https://www.w3schools.com" target="_blank" rel="noopener noreferrer">W3Schools</a>
          <a href="https://developer.mozilla.org" target="_blank" rel="noopener noreferrer">MDN Web Docs</a>
          <a href="https://www.freecodecamp.org" target="_blank" rel="noopener noreferrer">freeCodeCamp</a>
        </div>
      </section>

      {/* INLINED FOOTER */}
      <footer>
        <p>Contact: jkgatchalian23109703@student.dmmmsu.edu.ph | 09668113017</p>
        <p>&copy; 2026 Jaslyn Kate Portfolio | All Rights Reserved</p>
      </footer>
    </>
  );
};

export default ContactPage;
