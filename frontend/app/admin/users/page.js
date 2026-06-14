'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, XCircle, ShieldAlert, BadgeCheck, Power } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await fetch('https://the-lables.onrender.com/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, field, currentValue) => {
    try {
      const res = await fetch(`https://the-lables.onrender.com/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [field]: !currentValue })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u._id === updatedUser._id ? updatedUser : u));
      }
    } catch (error) {
      console.error('Failed to update user', error);
    }
  };

  if (loading) return <div className="text-white text-center py-20 animate-pulse">Loading Users Data...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">User Management</h2>
          <p className="text-gray-400">View and manage customer accounts, verified badges, and suspensions.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-3">
          <BadgeCheck size={20} />
          Total Users: {users.length}
        </div>
      </div>

      <div className="bg-[#0a0f1c] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-white/5 text-xs uppercase text-gray-400 font-semibold tracking-wider">
              <tr>
                <th className="px-6 py-4 rounded-tl-2xl">Customer</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4 text-center">Verified Buyer</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right rounded-tr-2xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user, idx) => (
                <motion.tr 
                  key={user._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-white/5 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {user.profileImage ? (
                        <img src={user.profileImage} alt={user.name} className="w-10 h-10 rounded-full border border-white/20 object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border border-primary/50">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white flex items-center gap-2">
                          {user.name}
                          {user.isVerifiedBuyer && <BadgeCheck size={14} className="text-blue-400" />}
                        </div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <button 
                      onClick={() => toggleUserStatus(user._id, 'isVerifiedBuyer', user.isVerifiedBuyer)}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${user.isVerifiedBuyer ? 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30' : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'}`}
                    >
                      {user.isVerifiedBuyer ? <><CheckCircle2 size={14} /> Verified</> : 'Grant Badge'}
                    </button>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${user.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-red-400 shadow-[0_0_8px_#ef4444]'}`} />
                      {user.isActive ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {user.role !== 'admin' && (
                      <button 
                        onClick={() => toggleUserStatus(user._id, 'isActive', user.isActive)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors ${user.isActive ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}
                      >
                        <Power size={14} />
                        {user.isActive ? 'Suspend User' : 'Reactivate'}
                      </button>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
