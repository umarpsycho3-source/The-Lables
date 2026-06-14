'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { Check, Truck, Package, RotateCcw, XCircle, Clock } from 'lucide-react';
import { useState } from 'react';
import { useCurrency } from '@/context/CurrencyContext';

const statuses = [
  { name: 'Under Review', icon: Clock },
  { name: 'Processing', icon: Package },
  { name: 'Shipped', icon: Truck },
  { name: 'Delivered', icon: Check }
];

export default function OrdersPage() {
  const { orders, cancelOrder, cancelOrderItem } = useAuth();
  const [cancellingId, setCancellingId] = useState(null);
  const [cancellingItemId, setCancellingItemId] = useState(null);
  const { formatPrice } = useCurrency();

  const getStatusIndex = (status) => {
    if (status === 'Cancelled') return -1;
    return statuses.findIndex(s => s.name === status);
  };

  const handleCancelItem = (orderId, itemIndex) => {
    setCancellingItemId(`${orderId}-${itemIndex}`);
    // Simulate processing delay
    setTimeout(() => {
      cancelOrderItem(orderId, itemIndex);
      setCancellingItemId(null);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {orders.length === 0 ? (
        <div className="bg-white/5 border border-white/10 p-12 rounded-3xl backdrop-blur-md text-center">
          <p className="text-secondary mb-4">You haven't placed any orders yet.</p>
        </div>
      ) : (
        orders.map((order) => {
          const orderDate = new Date(order.date);
          const now = new Date();
          const canCancel = order.status === 'Under Review';
          const isCancelled = order.status === 'Cancelled';

          return (
            <div key={order.id} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md relative overflow-hidden">
              {isCancelled && (
                <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 px-6 py-2 rounded-bl-2xl font-semibold border-b border-l border-red-500/30">
                  CANCELLED
                </div>
              )}
              
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8 border-b border-white/10 pb-6">
                <div>
                  <h3 className="serif text-xl sm:text-2xl font-bold mb-1 break-all">Order {order.id}</h3>
                  <p className="text-secondary text-sm">Placed on {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gold">{formatPrice(order.total)}</p>
                  <p className="text-secondary text-sm">{order.items.length} item(s)</p>
                </div>
              </div>

              {/* Items List */}
              <div className="mb-10 space-y-3">
                {order.items.map((item, idx) => {
                  const isItemCancelled = item.status === 'Cancelled';
                  const isItemCancelling = cancellingItemId === `${order.id}-${idx}`;

                  return (
                    <div key={idx} className={`flex justify-between items-center text-sm ${isItemCancelled ? 'opacity-50 grayscale' : ''}`}>
                      <span className={`text-white ${isItemCancelled ? 'line-through text-gray-500' : ''}`}>
                        <span className={`text-primary mr-2 ${isItemCancelled ? 'text-gray-500' : ''}`}>{item.quantity}x</span> 
                        {item.name} {item.selectedSize && <span className="text-secondary ml-1">(Size: {item.selectedSize})</span>}
                      </span>
                      
                      <div className="flex items-center gap-4">
                        <span className={`text-secondary ${isItemCancelled ? 'line-through' : ''}`}>
                          {formatPrice((item.isOffer ? item.offerPrice : item.price) * item.quantity)}
                        </span>
                        
                        {isItemCancelled ? (
                          <span className="text-red-400 font-semibold text-xs border border-red-500/30 px-2 py-1 rounded">Cancelled</span>
                        ) : (
                          canCancel && !isCancelled && (
                            <button 
                              onClick={() => handleCancelItem(order.id, idx)}
                              disabled={isItemCancelling}
                              className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1 transition-colors"
                            >
                              <XCircle size={14} /> {isItemCancelling ? '...' : 'Cancel'}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Tracking Timeline */}
              {!isCancelled && (
                <div className="relative mb-12">
                  <div className="absolute top-5 left-0 w-full h-[2px] bg-white/10" />
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(getStatusIndex(order.status) / (statuses.length - 1)) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="absolute top-5 left-0 h-[2px] bg-primary shadow-[0_0_10px_#10b981]" 
                  />
                  
                  <div className="relative flex justify-between">
                    {statuses.map((status, index) => {
                      const isActive = getStatusIndex(order.status) >= index;
                      const Icon = status.icon;
                      
                      return (
                        <div key={status.name} className="flex flex-col items-center">
                          <motion.div 
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: index * 0.3 }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 z-10 transition-colors duration-500
                              ${isActive ? 'bg-primary border-primary text-background shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-background border-white/20 text-secondary'}`}
                          >
                            <Icon size={18} />
                          </motion.div>
                          <span className={`mt-3 text-xs font-semibold uppercase tracking-widest ${isActive ? 'text-white' : 'text-secondary'}`}>
                            {status.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Cancellation & Receipt Footer */}
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-sm">
                  {!isCancelled && (
                    canCancel ? (
                      <span className="text-primary flex items-center gap-2"><RotateCcw size={16} /> Eligible for item cancellation</span>
                    ) : (
                      <span className="text-secondary flex items-center gap-2"><XCircle size={16} /> Order locked. Cancellation is only available while under review.</span>
                    )
                  )}
                  {isCancelled && <span className="text-red-400">Your refund is currently processing for all cancelled items.</span>}
                </div>
                {order.receiptImage && (
                  <a href={order.receiptImage} target="_blank" rel="noopener noreferrer" className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                    View Uploaded Receipt
                  </a>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
