'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('luxe_token');
      if (token) {
        const res = await fetch('http://localhost:5000/api/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      }
    } catch (err) {
      console.error("Failed to load orders", err);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('luxe_token');
      if (token) {
        const res = await fetch('http://localhost:5000/api/notifications', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      }
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const token = localStorage.getItem('luxe_token');
      await fetch('http://localhost:5000/api/notifications/read', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error("Failed to mark notifications as read", err);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('luxe_token');
        if (token) {
          const userStr = localStorage.getItem('luxe_user');
          if (userStr) setUser(JSON.parse(userStr));
          await fetchOrders();
          await fetchNotifications();
        }
      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const login = async (email, password) => {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    
    setUser(data.user);
    localStorage.setItem('luxe_token', data.token);
    localStorage.setItem('luxe_user', JSON.stringify(data.user));
    
    await fetchOrders();
    await fetchNotifications();
    
    if (data.user.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/'); 
    }
  };

  const register = async (name, email, password, phone) => {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone })
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    
    setUser(data.user);
    localStorage.setItem('luxe_token', data.token);
    localStorage.setItem('luxe_user', JSON.stringify(data.user));
    
    await fetchOrders();
    await fetchNotifications();
    
    router.push('/'); 
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    setNotifications([]);
    localStorage.removeItem('luxe_user');
    localStorage.removeItem('luxe_token');
    router.push('/login');
  };

  const updateProfile = (name, email) => {
    const updatedUser = { ...user, name, email };
    setUser(updatedUser);
    localStorage.setItem('luxe_user', JSON.stringify(updatedUser));
  };

  const cancelOrder = async (orderId) => {
    const token = localStorage.getItem('luxe_token');
    await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ status: 'Cancelled' })
    });
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Cancelled' } : o));
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('luxe_token');
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  const cancelOrderItem = async (orderId, itemIndex) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/items/${itemIndex}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('luxe_token')}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to cancel item');
      }
      const updatedOrder = await res.json();
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, orders, notifications, isLoading, login, register, logout, updateProfile, cancelOrder, updateOrderStatus, fetchOrders, fetchNotifications, markNotificationsAsRead, cancelOrderItem }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
