import React, { useState } from 'react';
import './Auth.css';

function Signup({ onClose, onSwitchToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل إنشاء الحساب');
      }

      setSuccess('تم إنشاء الحساب بنجاح! جاري تسجيل الدخول...');
      localStorage.setItem('userInfo', JSON.stringify(data));

     // ✨ هنا زادة تتسكر النافذة بعد ثانية
      setTimeout(() => {
        if (onClose) onClose(); // يسكر المودال
        window.location.reload(); // يحدث الصفحة
      }, 1000);

    } catch (err) {
      setError(err.message);
    }
  };
  
  return (
    <div className="auth-modal">
      <h2>إنشاء حساب</h2>
      <form onSubmit={handleSignup}>
        <div className="form-group">
          <label htmlFor="name">الاسم الكامل:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">البريد الإلكتروني:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">كلمة المرور:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">إنشاء حساب</button>
      </form>
      <p>
        لديك حساب بالفعل؟{' '}
        <button onClick={onSwitchToLogin} className="switch-link">
          تسجيل الدخول
        </button>
      </p>
    </div>
  );
}
export default Signup;