'use client';

import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { LogIn, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotMode, setForgotMode] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    try {
      if (resetStep === 1) {
        const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSuccessMsg(data.message);
        setResetStep(2);
      } else if (resetStep === 2) {
        const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSuccessMsg(data.message);
        setResetStep(3);
      } else if (resetStep === 3) {
        const res = await fetch('http://localhost:5000/api/auth/reset-password', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, otp, newPassword })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setSuccessMsg(data.message);
        setTimeout(() => {
          setForgotMode(false);
          setResetStep(1);
          setSuccessMsg('');
          setPassword('');
        }, 2000);
      }
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
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
        
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mb-8 mx-auto relative z-10 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
          <LogIn size={24} className="text-primary" />
        </div>

        <h1 className="serif text-3xl font-bold text-center mb-2">Welcome Back</h1>
        <p className="text-secondary text-center mb-8 text-sm">Enter your details to access your LUXE account.</p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-lg text-sm text-center mb-6">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-lg text-sm text-center mb-6">
            {successMsg}
          </div>
        )}

        {forgotMode ? (
          <form onSubmit={handleForgotSubmit} className="space-y-6 relative z-10">
            {resetStep === 1 && (
              <div>
                <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-semibold">Account Email</label>
                <input 
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" 
                  placeholder="client@luxe.com" 
                />
              </div>
            )}
            {resetStep === 2 && (
              <div>
                <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-semibold">6-Digit Verification Code</label>
                <input 
                  type="text" required value={otp} onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" 
                  placeholder="123456" 
                />
              </div>
            )}
            {resetStep === 3 && (
              <div>
                <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-semibold">New Password</label>
                <input 
                  type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" 
                  placeholder="••••••••" 
                />
              </div>
            )}
            <button type="submit" className="floating-btn w-full flex items-center justify-center gap-2 mt-4">
              {resetStep === 1 ? 'Send Code' : resetStep === 2 ? 'Verify Code' : 'Reset Password'} <ArrowRight size={16} />
            </button>
            <p className="text-center text-xs text-primary cursor-pointer hover:text-white transition-colors mt-4" onClick={() => { setForgotMode(false); setResetStep(1); setError(''); setSuccessMsg(''); }}>
              Back to Sign In
            </p>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
            <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-semibold">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" 
              placeholder="client@luxe.com" 
            />
          </div>
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-xs text-secondary uppercase tracking-widest font-semibold">Password</label>
              <span className="text-xs text-primary cursor-pointer hover:text-white transition-colors" onClick={() => { setForgotMode(true); setError(''); setSuccessMsg(''); }}>Forgot Password?</span>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" 
              placeholder="••••••••" 
            />
          </div>

          <button type="submit" className="floating-btn w-full flex items-center justify-center gap-2 mt-4">
            Sign In <ArrowRight size={16} />
          </button>
        </form>

          <p className="text-center text-secondary text-sm mt-8 relative z-10">
            New to LUXE? <Link href="/register" className="text-white hover:text-primary transition-colors font-semibold">Create an account</Link>
          </p>
          </>
        )}
      </motion.div>
    </div>
  );
}
