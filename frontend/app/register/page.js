'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { UserPlus, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      setError('Only @gmail.com addresses are allowed for security.');
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, '').replace(/[-()]/g, '');
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(cleanPhone)) {
      setError('Please enter a valid phone number (e.g., +15550000000).');
      return;
    }

    try {
      await register(name, email, password, phone);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-32 px-6 flex flex-col items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-[2rem] p-10 max-w-md w-full backdrop-blur-xl shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gold/20 rounded-full blur-[80px]" />
        
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 mx-auto relative z-10 shadow-[0_0_20px_rgba(251,191,36,0.15)]">
          <UserPlus size={24} className="text-gold" />
        </div>

        <h1 className="serif text-3xl font-bold text-center mb-2">Join LUXE</h1>
        <p className="text-secondary text-center mb-8 text-sm">Create an account to unlock exclusive collections and privileges.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-semibold">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors" 
              placeholder="James Bond" 
            />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-semibold">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors" 
              placeholder="client@luxe.com" 
            />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-semibold">Phone Number</label>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors" 
              placeholder="+1 (555) 000-0000" 
            />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-semibold">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-gold transition-colors" 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="floating-btn w-full flex items-center justify-center gap-2 mt-4" style={{ background: 'linear-gradient(135deg, var(--accent-gold), #b45309)', boxShadow: '0 10px 30px rgba(251,191,36,0.3)' }}>
            Create Account <ArrowRight size={16} />
          </button>
        </form>

        <p className="text-center text-secondary text-sm mt-8 relative z-10">
          Already have an account? <Link href="/login" className="text-white hover:text-gold transition-colors font-semibold">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
