'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const ProductContext = createContext();

const initialMockProducts = [
  {
    _id: '1',
    name: 'Real Madrid 23/24 Player Version',
    category: 'Football Jerseys',
    price: 150,
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?q=80&w=2000&auto=format&fit=crop',
    color: 'emerald',
    description: 'Authentic player-issue Real Madrid home jersey featuring advanced cooling technology and an athletic fit.',
    reviews: []
  },
  {
    _id: '2',
    name: 'Argentina 2022 World Cup Edition',
    category: 'Football Jerseys',
    price: 180,
    image: 'https://images.unsplash.com/photo-1600181516264-3ea807faade4?q=80&w=2000&auto=format&fit=crop',
    color: 'emerald',
    description: 'The legendary 3-star Argentina player version jersey worn during their historic World Cup victory.',
    reviews: [],
    isOffer: true,
    offerPrice: 140
  },
  {
    _id: '5',
    name: 'Brazil 2024 Copa America Player Edition',
    category: 'Football Jerseys',
    price: 160,
    image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?q=80&w=2000&auto=format&fit=crop',
    color: 'gold',
    description: 'Authentic Brazil national team jersey featuring ultra-breathable fabric used by the pros.',
    reviews: []
  },
  {
    _id: '6',
    name: 'Manchester City 23/24 Treble Winners Edition',
    category: 'Football Jerseys',
    price: 175,
    image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2000&auto=format&fit=crop',
    color: 'emerald',
    description: 'Premium player version kit celebrating the historic treble. Designed for maximum mobility and sweat-wicking.',
    reviews: []
  },
  {
    _id: '7',
    name: 'Inter Miami CF Messi #10 Player Version',
    category: 'Football Jerseys',
    price: 195,
    image: 'https://images.unsplash.com/photo-1551280857-2b9bbe5260fc?q=80&w=2000&auto=format&fit=crop',
    color: 'emerald',
    description: 'The exact pink jersey worn by Lionel Messi. Features heat-applied crests and athletic cut.',
    reviews: []
  }
];

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products');
        if (res.ok) {
          const data = await res.json();
          if (data.length === 0) {
            // Seed DB if empty
            await Promise.all(initialMockProducts.map(p => 
              fetch('http://localhost:5000/api/products', {
                method: 'POST',
                headers: { 
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('luxe_token')}`
                },
                body: JSON.stringify(p)
              })
            ));
            const newRes = await fetch('http://localhost:5000/api/products');
            setProducts(await newRes.json());
          } else {
            setProducts(data);
          }
        }
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setIsLoaded(true);
      }
    };
    fetchProducts();
  }, []);

  const addProduct = async (product) => {
    const token = localStorage.getItem('luxe_token');
    const res = await fetch('http://localhost:5000/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(product)
    });
    if (res.ok) {
      const newProduct = await res.json();
      setProducts([...products, newProduct]);
    }
  };

  const updateProduct = async (id, updatedProduct) => {
    try {
      const token = localStorage.getItem('luxe_token');
      const res = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedProduct)
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(prev => prev.map(p => p._id === id ? data : p));
      }
    } catch (error) {
      console.error('Failed to update product', error);
    }
  };

  const deleteProduct = async (id) => {
    const token = localStorage.getItem('luxe_token');
    const res = await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setProducts(products.filter(p => p._id !== id));
    }
  };

  const addReview = async (productId, review) => {
    const token = localStorage.getItem('luxe_token');
    const res = await fetch(`http://localhost:5000/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(review)
    });
    if (res.ok) {
      const updatedProduct = await res.json();
      setProducts(products.map(p => p._id === productId ? updatedProduct : p));
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, addReview, isLoaded }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProducts = () => useContext(ProductContext);
