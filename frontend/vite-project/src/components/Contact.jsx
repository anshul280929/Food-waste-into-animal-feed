import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css'; // Import CSS file

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Message sent successfully!');
    setFormData({ name: '', email: '', message: '' }); // Reset form
  };

  return (
    <div className="contact-container">
      {/* Header */}
      <header className="contact-header">
        <h1>Contact Us</h1>
      </header>

      {/* Contact Form */}
      <section className="contact-form-section">
        <h2>We’d Love to Hear From You</h2>
        <p>Have questions or want to collaborate? Reach out to us!</p>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Message</label>
            <textarea
              rows="4"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-button">Send Message</button>
        </form>
      </section>

      {/* Back Button */}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate('/')}>Go Back</button>
      </div>
    </div>
  );
};

export default Contact;
