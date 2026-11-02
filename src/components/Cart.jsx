// src/components/Cart.jsx
import React from 'react';
import './Cart.css';

function Cart({ cartItems, onClose, onRemoveItem, onIncrease, onDecrease, onCheckout }) {
  // حساب السعر الإجمالي لكل المنتجات مع مراعاة الكميات
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
// جلب بيانات المستخدم والتوكن من الـ localStorage
const userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};

  const handleCheckout = async () => {
  try {
    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
       image: Array.isArray(item.image) ? item.image[0] : (item.image || ''),
        price: item.price,
        product: item._id
      })),
      // ... بقية البيانات كيف الشحن والسعر
    };

    // هوني وين تستعمل orderData وتفسر التحذير:
    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`, // التوكن اللي حكينا عليه
      },
      body: JSON.stringify(orderData), // <--- استعملناه هنا!
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'فشل إتمام الطلب');
    }

    alert('تم إتمام الطلب بنجاح! 🎉');
    // تنظيف السلة أو توجيه المستخدم
  } catch (error) {
    console.error(error.message);
  }
};

return (
    <div className="cart-overlay">
      <div className="cart-drawer">
        <div className="cart-header">
          <h2>Your Shopping Bag 🛍️</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is currently empty.</p>
          ) : (
            <ul className="cart-items-list">
              {cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h4>{item.name}</h4>
                    {/* السعر مضروب في الكمية */}
                    <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                    
                    {/* أزرار التحكم في الكمية */}
                    <div className="quantity-controls">
                      <button className="qty-btn" onClick={() => onDecrease(index)}>-</button>
                      <span className="qty-value">{item.quantity}</span>
                      <button className="qty-btn" onClick={() => onIncrease(index)}>+</button>
                    </div>
                  </div>
                  <button 
                    className="remove-btn" 
                    onClick={() => onRemoveItem(index)}
                  >
                    🗑️
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="total-container">
              <span>Total:</span>
              <span className="total-price">${totalPrice.toFixed(2)}</span>
            </div>
             
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;