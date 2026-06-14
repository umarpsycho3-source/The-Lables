'use client';

import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');
  const [isSaved, setIsSaved] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image must be smaller than 2MB");
        return;
      }
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(name, email, profileImage);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md">
      <h2 className="serif text-2xl font-bold mb-6">Profile Details</h2>
      <p className="text-secondary mb-8">Update your personal information and profile picture to ensure a seamless luxury experience.</p>
      
      <form onSubmit={handleSave} className="space-y-6 max-w-xl">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative w-24 h-24 rounded-full border-2 border-white/20 overflow-hidden bg-white/5 flex items-center justify-center shrink-0">
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-bold text-gray-500">{name ? name.charAt(0).toUpperCase() : '?'}</span>
            )}
            {isUploading && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-xs font-bold animate-pulse">Wait...</div>}
          </div>
          <div>
            <label className="bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition-colors inline-block">
              Upload New Picture
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={isUploading} />
            </label>
            <p className="text-xs text-gray-500 mt-2">Recommended: Square image, under 2MB.</p>
          </div>
        </div>

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
          <button type="submit" className="floating-btn" disabled={isUploading}>
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
