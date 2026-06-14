'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { fetchOrders } = useAuth();

  const checkout = async (paymentMethod = 'credit_card', referenceCode = null, receiptImage = null, shippingDetails = null) => {
    if (cartItems.length === 0) return null;
    
    try {
      const token = localStorage.getItem('luxe_token');
      if (!token) return null;

      const res = await fetch('https://the-lables.onrender.com/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          total: cartTotal,
          paymentMethod,
          referenceCode,
          receiptImage,
          shippingDetails
        })
      });
      
      const newOrder = await res.json();
      if (!res.ok) throw new Error('Checkout failed');
      
      setCartItems([]);
      localStorage.removeItem('luxe_cart');
      if (fetchOrders) await fetchOrders();
      return newOrder;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('luxe_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    setIsCartLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem('luxe_cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isCartLoaded]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const cartItemId = product.selectedSize ? `${product._id}-${product.selectedSize}` : product._id;
      const existing = prev.find(item => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, cartItemId, quantity: 1 }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCartItems(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(prev => prev.map(item => item.cartItemId === cartItemId ? { ...item, quantity: newQuantity } : item));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => {
    const activePrice = item.isOffer ? item.offerPrice : item.price;
    return total + activePrice * item.quantity;
  }, 0);
  
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      checkout,
      cartTotal,
      cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
