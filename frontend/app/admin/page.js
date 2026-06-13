'use client';

import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { DollarSign, ShoppingBag, Package, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const { products } = useProducts();
  const { orders } = useAuth();

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter(o => o.status === 'Processing' || o.status === 'Shipped').length;

  const stats = [
    { title: 'Total Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'Active Orders', value: activeOrders, icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Total Products', value: products.length, icon: ShoppingBag, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { title: 'Conversion Rate', value: '4.2%', icon: TrendingUp, color: 'text-primary', bg: 'bg-primary/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center gap-6"
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-white">{stat.value}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Orders Preview */}
      <div className="bg-white/5 border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-semibold text-white">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm">
              <tr>
                <th className="p-4 font-medium">Order ID</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {[...orders].reverse().slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-gray-300">{order.id}</td>
                  <td className="p-4 text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${order.status === 'Processing' ? 'bg-yellow-500/10 text-yellow-400' : ''}
                      ${order.status === 'Shipped' ? 'bg-blue-500/10 text-blue-400' : ''}
                      ${order.status === 'Delivered' ? 'bg-green-500/10 text-green-400' : ''}
                      ${order.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' : ''}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-gray-300 font-semibold">Rs. {Number(order.total).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-8 text-center text-gray-500">No recent orders found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
