import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Login from './components/Login';
import Signup from './components/Signup';
import Contact from './components/Contact'; 
function App() {
  // 1. تعريف الـ States الأساسية
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // 2. حفظ السلة في localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // 3. التحقق من تسجيل الدخول عند تحميل الصفحة
  useEffect(() => {
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      setUserInfo(JSON.parse(savedUser));
    }
  }, []);

  // 4. تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    window.location.reload();
  };

  // 5. دوال التحكم في السلة (الإضافة، الزيادة، النقصان، الحذف)
  const handleAddToCart = (product) => {
    const existingIndex = cart.findIndex(item => (item._id || item.id) === (product._id || product.id));

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setIsCartOpen(true);
  };

  // زيادة الكمية حسب الـ index (أضمن وأسرع طريقة)
  const increaseQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
  };

  // نقص الكمية أو حذف المنتج إذا وصلت للـ 1
  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      setCart(updatedCart);
    } else {
      removeFromCart(index);
    }
  };

  // حذف منتج حسب الـ index
  const removeFromCart = (indexToRemove) => {
    setCart(cart.filter((_, index) => index !== indexToRemove));
  };

  // 6. دالة إتمام الشراء (Checkout)
  const handleCheckout = async () => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));

    if (!storedUser) {
      alert('الرجاء تسجيل الدخول أولاً لإتمام الشراء! ✨');
      setIsCartOpen(false);
      setIsLoginOpen(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${storedUser.token}`
        },
        body: JSON.stringify({
          orderItems: cart,
          totalPrice: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'حدث خطأ أثناء إتمام الطلب');
      }

      alert('تم إتمام طلبك بنجاح! شكراً لتسوقك من Glow Cosmetics 🎉');
      setCart([]);
      localStorage.removeItem('cart');
      setIsCartOpen(false);

    } catch (err) {
      alert(err.message);
    }
  };

  const totalItemsCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="app-container">

      {/* شريط التنقل */}

      <header className="navbar">

        <h1 className="logo">Gglow ✨🔥</h1>

        <nav>

          <ul>

            <li><a href="#home">Home</a></li>

            <li><a href="#products">Products</a></li>

            <li><a href="#contact">Contact</a></li> {/* رابط قسم الاتصال */}
            <li>

              <button

                onClick={() => setIsCartOpen(true)}

                className="cart-link-btn"

              >

                Cart 🛍️ ({totalItemsCount})

              </button>

            </li>
            
          </ul>

        </nav>
         <div className="header-actions">
          {userInfo ? (
            <>
              <span>مرحباً، {userInfo.name || userInfo.email}!</span>
              <button onClick={handleLogout}>تسجيل الخروج</button>
            </>
          ) : (
            <>
              <button onClick={() => { setIsSignupOpen(false); setIsLoginOpen(true); }} className="nav-login-btn">تسجيل الدخول</button>
              <button onClick={() => { setIsLoginOpen(false); setIsSignupOpen(true); }} className="nav-signup-btn">إنشاء حساب</button>
            </>
          )}
        </div>
      </header>

{isCartOpen && ( <Cart
      cartItems={cart}
      onClose={() =>  setIsCartOpen(false)}
      onRemoveItem={removeFromCart}
      onIncrease={increaseQuantity}
      onDecrease={decreaseQuantity}
      onCheckout={handleCheckout}
    /> )}
  
      {/* المحتوى الرئيسي */} {isLoginOpen && (
        <Login 
          onClose={() => setIsLoginOpen(false)} 
          onSwitchToSignup={() => {
            setIsLoginOpen(false); 
            setIsSignupOpen(true);
          }}
        />
      )}

      {isSignupOpen && (
        <Signup 
          onClose={() => setIsSignupOpen(false)} 
          onSwitchToLogin={() => {
            setIsSignupOpen(false); 
            setIsLoginOpen(true);
          }}
        />
      )}

      <main className="main-content">

        <section id="home" className="hero">

          <h2>Welcome to Your Beauty Journey</h2>

          <p>Discover our latest collection of premium cosmetics and skincare.</p>

          <button className="shop-btn" onClick={() => document.getElementById('products').scrollIntoView({ behavior: 'smooth' })}>

            Shop Now

          </button>

        </section>



        {/* قسم المنتجات */}

        <section id="products" className="products-section">

          <h2 className="section-title">Featured Products</h2>

          <div className="products-grid">
            <ProductList onAddToCart={handleAddToCart} />
          </div>

        </section>



        {/* إضافة قسم الاتصال هنا */}

        <Contact />

      </main>



      {/* تذييل الصفحة */}

      <footer className="footer">

        <p>&copy; 2026 Gglow Cosmetics. All rights reserved.</p>

      </footer>

    </div>

  );

}



export default App;

