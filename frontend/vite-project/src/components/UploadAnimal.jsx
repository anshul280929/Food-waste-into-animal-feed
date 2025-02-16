import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authAPI } from '../services/api';
import styles from './UploadAnimal.module.css';

const UploadAnimal = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = new URLSearchParams(location.search).get('email');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Image is required');
      return;
    }

    const formData = new FormData();
    formData.append('email', email);
    formData.append('image', image);

    try {
      const response = await authAPI.uploadAnimal(formData);
      setSuccess('Animal uploaded successfully! Redirecting to dashboard...');
      setTimeout(() => navigate('/'), 2000);
    } catch (error) {
      setError(error.message || 'Upload failed');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Upload Your Animal</h2>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className={styles.uploadArea}>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={styles.fileInput}
            required
          />
          {preview && (
            <div className={styles.preview}>
              <img src={preview} alt="Preview" />
            </div>
          )}
        </div>
        <button type="submit" className={styles.button}>
          Upload Animal
        </button>
      </form>
    </div>
  );
};

export default UploadAnimal;