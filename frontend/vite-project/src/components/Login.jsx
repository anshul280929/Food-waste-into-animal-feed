import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import styles from './Login.module.css';
import farmGif from '../assets/Farm.gif'; // Import the GIF

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authAPI.login(formData);
      localStorage.setItem('token', response.token); // Store token
      navigate('/home'); // Redirect to dashboard
    } catch (error) {
      setError(error.message || 'Login failed');
    }
  };

  return (
    <div className={styles.container}>
      {/* Left side - GIF */}
      <div className={styles.gifContainer}>
        <img src={farmGif} alt="Farm Animation" className={styles.gif} />
      </div>

      {/* Right side - Login Form */}
      <div className={styles.formContainer}>
        <div className={styles.formWrapper}>
          <h2 className={styles.title1}>Welcome to FeedNova</h2>
          <h1 className={styles.title}>Login</h1>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={styles.input}
                required
              />
            </div>
            <button type="submit" className={styles.button}>
              Login
            </button>
          </form>

          {/* Sign Up Button */}
          <button
            className={styles.signupButton}
            onClick={() => window.location.href = 'http://localhost:5173/signup'}
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
