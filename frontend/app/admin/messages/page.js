'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Search, CheckCircle2, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function MessagesPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [viewMessage, setViewMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('luxe_token');
      const res = await fetch('https://the-lables.onrender.com/api/contact', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('luxe_token');
      const res = await fetch(`https://the-lables.onrender.com/api/contact/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setMessages(messages.map(m => m.id === id ? { ...m, status } : m));
        if (viewMessage && viewMessage.id === id) {
          setViewMessage({ ...viewMessage, status });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || m.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Mail className="text-primary" size={24} /> Contact Messages
          </h2>
          <p className="text-gray-400 text-sm mt-1">Manage customer inquiries and product suggestions</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Search messages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          </div>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-black/50 border border-white/10 rounded-xl py-2 px-4 text-sm text-white focus:outline-none focus:border-primary appearance-none pr-8 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 border-b border-white/10 uppercase font-semibold text-gray-400">
              <tr>
                <th className="p-4 tracking-wider">Date</th>
                <th className="p-4 tracking-wider">Customer</th>
                <th className="p-4 tracking-wider">Preview</th>
                <th className="p-4 tracking-wider">Status</th>
                <th className="p-4 tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredMessages.map((msg) => (
                <tr key={msg.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 whitespace-nowrap text-gray-400 text-xs">
                    {new Date(msg.createdAt).toLocaleString()}
                  </td>
                  <td className="p-4">
                    <p className="text-white font-medium">{msg.name}</p>
                    <p className="text-gray-500 text-xs">{msg.email}</p>
                  </td>
                  <td className="p-4 max-w-xs">
                    <p className="truncate text-gray-400">{msg.message}</p>
                  </td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                      ${msg.status === 'Unread' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : ''}
                      ${msg.status === 'Read' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' : ''}
                      ${msg.status === 'Resolved' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : ''}
                    `}>
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => {
                        setViewMessage(msg);
                        if (msg.status === 'Unread') updateMessageStatus(msg.id, 'Read');
                      }}
                      className="text-primary hover:text-emerald-400 font-semibold px-3 py-1 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors text-xs uppercase tracking-widest"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredMessages.length === 0 && (
            <div className="p-8 text-center text-gray-500">No messages found.</div>
          )}
        </div>
      </div>

      {/* View Message Modal */}
      <AnimatePresence>
        {viewMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0f1c] border border-white/10 p-6 rounded-3xl w-full max-w-lg shadow-2xl relative"
            >
              <button 
                onClick={() => setViewMessage(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              
              <h3 className="text-xl font-bold text-white mb-6">Contact Message</h3>
              
              <div className="space-y-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">From</p>
                  <p className="text-white font-medium">{viewMessage.name}</p>
                  <a href={`mailto:${viewMessage.email}`} className="text-primary text-sm hover:underline">{viewMessage.email}</a>
                </div>
                
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Message</p>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{viewMessage.message}</p>
                </div>
                
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <p className="text-xs text-gray-500">{new Date(viewMessage.createdAt).toLocaleString()}</p>
                  <div className="flex gap-2">
                    {viewMessage.status !== 'Resolved' && (
                      <button 
                        onClick={() => updateMessageStatus(viewMessage.id, 'Resolved')}
                        className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 px-4 py-2 rounded-lg text-sm font-bold transition-colors"
                      >
                        <CheckCircle2 size={16} /> Mark Resolved
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
