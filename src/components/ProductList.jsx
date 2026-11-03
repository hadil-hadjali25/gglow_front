import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

function ProductList({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://gglow-back.onrender.com/api/products')
      .then(res => {
        if (!res.ok) {
          throw new Error('فشل في جلب المنتجات من السيرفر');
        }
        return res.json();
      })
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p role="alert">{error}</p>;

  return (
    <>
      {products.map(product => (
        <ProductCard
          key={product._id || product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </>
  );
    
}

export default ProductList;