// src/components/Contact.jsx
import React, { useState } from 'react';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا يمكنك لاحقاً ربط البيانات بـ Backend أو API
    setSubmitted(true);
  };

  return (
    <div className="contact-section" id="contact">
      <div className="contact-container">
        <h2 className="section-title">Get in Touch</h2>
        <p className="contact-subtitle">We would love to hear from you! Send us a message.</p>

        {submitted ? (
          <div className="success-message">
            <h3>Thank you, {formData.name}! ✨</h3>
            <p>Your message has been sent successfully. We will get back to you soon.</p>
            <button onClick={() => setSubmitted(false)} className="send-another-btn">
              Send Another Message
            </button>
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="Enter your name"
              />
            </div>

            <div className="form-group">
              <label>Your Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                placeholder="Enter your email"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea 
                name="message" 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                placeholder="How can we help you?"
              ></textarea>
            </div>

            <button type="submit" className="submit-btn">Send Message</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Contact;