// src/component/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import styles from './Signup.module.css'; // Import the CSS file

const Signup = () => {
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.signup(formData);
      setSuccess('Signup successful! Redirecting to animal upload...');
      setTimeout(() => navigate(`/upload-animal?email=${formData.email}`), 2000);
    } catch (error) {
      setError(error.message || 'Signup failed');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title1}>Welcome to FeedNova</h2>
      <h1 className={styles.title}>Sign Up</h1>
      {error && <div className="error">{error}</div>}
      {success && <div style={{ color: 'green' }}>{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
        <h2 className={styles.subtitle}>Name</h2>
          <input
            type="text"
            id="name"
            
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.input}
            required
          />
        </div>
        <div className="input-group">
          <h2 className={styles.subtitle}>Email</h2>
          <input
            type="email"
            id="email"
            
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={styles.input}
            required
          />
        </div>
        <div className="input-group">
          <h2 className={styles.subtitle}>Password</h2>
          <input
            type="password"
            id="password"
            
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className={styles.input}
            required
          />
        </div>
        <button type="submit" className={styles.button}>Sign Up</button>
      </form>
      <div className="signup-link">
       Already have an account? <a href="/" className={styles.link}>Login here</a>
      </div>
    </div>
  );
};

export default Signup;