import React, { useState } from 'react';
import './Auth.css'; // نجموا نعملوا ملف CSS مشترك للـ Login والـ Signup

function Login({ onClose, onSwitchToSignup }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'فشل تسجيل الدخول');
      }

      setSuccess('تم تسجيل الدخول بنجاح! 🎉');
      // نحفظو الـ Token في localStorage باش يبقى المستخدم مسجل دخول
      localStorage.setItem('userInfo', JSON.stringify(data));
      
    // ✨ هذا هو الكود المسؤول باش تسكر النافذة وتحدث الصفحة
      setTimeout(() => {
        if (onClose) onClose(); // يسكر المودال (الـ page تسكرت)
        window.location.reload(); // يحدث الصفحة باش تظهر "مرحباً، اسمك"
      }, 1000); // 1 ثانية باش المستخدم يشاهد رسالة النجاح

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-modal">
      <h2>تسجيل الدخول</h2>
      <form onSubmit={handleLogin}>
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
        <button type="submit">تسجيل الدخول</button>
      </form>
      <p>
        ليس لديك حساب؟{' '}
        <button onClick={onSwitchToSignup} className="switch-link">
          انشئ حساب جديد
        </button>
      </p>
    </div>
  ); 
}

export default Login;