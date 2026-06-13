'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(name, email);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
      <h2 className="serif text-2xl font-bold mb-6">Profile Details</h2>
      <p className="text-secondary mb-8">Update your personal information to ensure a seamless luxury experience.</p>
      
      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        <div>
          <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-semibold">Full Name</label>
          <input 
            type="text" 
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" 
          />
        </div>
        <div>
          <label className="block text-xs text-secondary mb-2 uppercase tracking-widest font-semibold">Email Address</label>
          <input 
            type="email" 
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" 
          />
        </div>
        
        <div className="pt-4 flex items-center gap-6">
          <button type="submit" className="floating-btn">
            Save Changes
          </button>
          
          <AnimatePresence>
            {isSaved && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2 text-primary"
              >
                <CheckCircle2 size={18} />
                <span className="text-sm font-medium">Profile updated successfully</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </form>
    </div>
  );
}
