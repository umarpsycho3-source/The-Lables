'use client';

import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Eye, X, MapPin, Phone, Mail, User, Trash2 } from 'lucide-react';

import { useState } from 'react';

export default function AdminOrders() {
  const { orders, updateOrderStatus, deleteOrder } = useAuth();
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewOrder, setViewOrder] = useState(null);

  const filteredOrders = orders.filter(o => {
    const matchesPayment = paymentFilter === 'All' || o.paymentMethod === paymentFilter;
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      o.id.toLowerCase().includes(searchLower) ||
      (o.shippingDetails?.firstName?.toLowerCase() || '').includes(searchLower) ||
      (o.shippingDetails?.lastName?.toLowerCase() || '').includes(searchLower) ||
      (o.shippingDetails?.email?.toLowerCase() || '').includes(searchLower);
    
    return matchesPayment && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-xl font-semibold text-white">Order Management</h2>
        
        <div className="flex flex-col md:flex-row items-end md:items-center gap-4 w-full md:w-auto">
          <div className="w-full md:w-64 relative">
            <input 
              type="text" 
              placeholder="Search ID, Name, Email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl p-2 w-full md:w-auto">
            <span className="text-sm text-secondary pl-2 whitespace-nowrap">Filter by Payment:</span>
            <select 
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-transparent text-white text-sm focus:outline-none pr-4 cursor-pointer w-full"
            >
              <option value="All" className="bg-background">All Methods</option>
              <option value="credit_card" className="bg-background">Credit Card</option>
              <option value="cash_on_delivery" className="bg-background">Cash on Delivery</option>
              <option value="bank_transfer" className="bg-background">Bank Transfer</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm">
              <tr>
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Customer (Items)</th>
                <th className="p-4 font-medium">Payment Info</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 align-top">
                    <div className="font-mono text-gray-300">{order.id}</div>
                    <button 
                      onClick={() => setViewOrder(order)}
                      className="mt-2 text-xs text-primary hover:text-emerald-400 flex items-center gap-1 font-medium transition-colors"
                    >
                      <Eye size={12} /> View Details
                    </button>
                  </td>
                  <td className="p-4 text-gray-200 align-top">
                    <div className="font-medium mb-2 text-white">Customer Account</div>
                    <div className="text-xs text-gray-400 space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className={item.status === 'Cancelled' ? 'line-through text-red-500/50' : ''}>
                          {item.quantity}x {item.name} {item.selectedSize && <span className="text-gold">(Size: {item.selectedSize})</span>}
                          {item.status === 'Cancelled' && <span className="ml-2 text-[10px] text-red-400 font-bold">CANCELLED</span>}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="font-medium text-sm text-white capitalize">
                      {(order.paymentMethod || 'Credit Card').replace(/_/g, ' ')}
                    </div>
                    {order.paymentMethod === 'bank_transfer' && order.referenceCode && (
                      <div className="text-xs text-gold mt-1 font-mono">
                        Ref: {order.referenceCode}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-gray-400 align-top">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-4 text-gray-300 font-semibold align-top">Rs. {Number(order.total).toLocaleString()}</td>
                  <td className="p-4 align-top">
                    <div className="flex items-center gap-3">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        disabled={order.status === 'Cancelled'}
                        className={`bg-black/50 border border-white/10 rounded-lg p-2 text-sm focus:outline-none focus:border-primary appearance-none pr-8 cursor-pointer
                          ${order.status === 'Processing' ? 'text-yellow-400' : ''}
                          ${order.status === 'Shipped' ? 'text-blue-400' : ''}
                          ${order.status === 'Delivered' ? 'text-green-400' : ''}
                          ${order.status === 'Cancelled' ? 'text-red-400 opacity-50 cursor-not-allowed' : ''}
                        `}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        {order.status === 'Cancelled' && <option value="Cancelled">Cancelled</option>}
                      </select>
                      
                      <button
                        onClick={() => {
                          if (window.confirm("Are you sure you want to permanently delete this order?")) {
                            deleteOrder(order.id);
                          }
                        }}
                        className="text-gray-500 hover:text-red-500 transition-colors p-2 bg-white/5 hover:bg-red-500/10 rounded-lg"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredOrders.length === 0 && (
            <div className="p-8 text-center text-gray-500">No active orders found for this filter.</div>
          )}
        </div>
      </div>

      {/* View Order Modal */}
      <AnimatePresence>
        {viewOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0f1c] border border-white/10 p-6 rounded-3xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setViewOrder(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold text-white mb-2">Order Details</h3>
              <p className="text-sm text-gray-400 mb-6 font-mono">ID: {viewOrder.id}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Customer Details */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <User size={16} className="text-primary" /> Customer Info
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <User size={14} className="text-gray-500 mt-0.5 shrink-0" />
                      <span className="text-gray-300">
                        {viewOrder.shippingDetails?.firstName || 'Guest'} {viewOrder.shippingDetails?.lastName || 'User'}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail size={14} className="text-gray-500 mt-0.5 shrink-0" />
                      <span className="text-gray-300">
                        {viewOrder.shippingDetails?.email || 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone size={14} className="text-gray-500 mt-0.5 shrink-0" />
                      <span className="text-gray-300">
                        {viewOrder.shippingDetails?.phone || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Shipping Details */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MapPin size={16} className="text-primary" /> Shipping Address
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin size={14} className="text-gray-500 mt-0.5 shrink-0" />
                      <span className="text-gray-300 leading-relaxed">
                        {viewOrder.shippingDetails?.address || 'N/A'}<br/>
                        {viewOrder.shippingDetails?.city || 'N/A'} {viewOrder.shippingDetails?.zipCode ? `, ${viewOrder.shippingDetails?.zipCode}` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-6">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Order Items</h4>
                <div className="space-y-3">
                  {viewOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2 border-b border-white/5 last:border-0">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-black/50" />
                      <div className="flex-1">
                        <div className="text-sm text-white font-medium">{item.name}</div>
                        <div className="text-xs text-gray-400">
                          Qty: {item.quantity} {item.selectedSize && `| Size: ${item.selectedSize}`} {item.status === 'Cancelled' && <span className="text-red-400 font-bold ml-2">(CANCELLED)</span>}
                        </div>
                      </div>
                      <div className="text-sm text-gold font-bold">
                        Rs. {Number((item.isOffer ? item.offerPrice : item.price) * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-sm text-gray-400 uppercase tracking-widest font-bold">Total Paid</span>
                  <span className="text-xl text-primary font-bold">Rs. {Number(viewOrder.total).toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => setViewOrder(null)}
                className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-medium transition-colors"
              >
                Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
