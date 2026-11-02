// src/components/ProductCard.jsx
// src/components/ProductCard.jsx
import React from 'react';
import './ProductCard.css';

function ProductCard({ product, onAddToCart }) {

    const getImageUrl = () => {
    let imgPath = product.image || product.images;
    
    const placeholder = 'https://placehold.co/300x300/f5f5f5/a9a9a9?text=Glow+Cosmetics';

    // لو كانت مصفوفة، ناخذو العنصر الأول
    if (Array.isArray(imgPath) && imgPath.length > 0) {
      imgPath = imgPath[0];
    }

    if (!imgPath || typeof imgPath !== 'string') {
      return placeholder;
    }
    
    if (imgPath.startsWith('http://') || imgPath.startsWith('https://')) {
      return imgPath;
    }
    
    const fixedPath = imgPath.replace(/\\/g, '/');
    
    // ⭐️ حل مؤقت ذكي: لو اسم الملف مش مكتوب فيه امتداد، نضيفوله .jpg تلقائياً باش يقراه السيرفر
    let finalPath = fixedPath.startsWith('/') ? fixedPath : `/${fixedPath}`;
    if (!finalPath.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
      finalPath = `${finalPath}.jpg`;
    }
    
    return `http://localhost:5000${finalPath}`;
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img src={getImageUrl()} alt={product.image} className="product-image" />
        <span className="product-tag">New</span>
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <div className="product-footer">
          <span className="product-price">${product.price.toFixed(2)}</span>
          <button className="add-to-cart-btn" 
            onClick={() => onAddToCart(product)} >Add to Cart</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;