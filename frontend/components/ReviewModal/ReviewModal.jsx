'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { X, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReviewModal({ isOpen, onClose, onSuccess }) {
  const { user, token } = useAuth();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return setError('You must be logged in to leave a review.');
    
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: user.name,
          rating,
          content
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit review');
      
      onSuccess?.();
      setContent('');
      setRating(5);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-8 max-w-lg w-full relative z-10 shadow-2xl"
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>

          <h2 className="serif text-2xl font-bold text-white mb-2">Write a Review</h2>
          <p className="text-secondary text-sm mb-6">Share your experience with our Player Issue jerseys.</p>

          {!user ? (
            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-500 p-4 rounded-xl text-sm font-medium text-center">
              Please log in or create an account to leave a review.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs text-secondary uppercase tracking-widest font-semibold mb-3">Rate your experience</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star 
                        size={32} 
                        fill={(hoverRating || rating) >= star ? '#eab308' : 'transparent'} 
                        className={(hoverRating || rating) >= star ? 'text-gold drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : 'text-white/20'} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-secondary uppercase tracking-widest font-semibold mb-2">Your Review</label>
                <textarea 
                  required
                  rows="4"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tell us what you loved about the jersey..."
                  className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              {error && (
                <div className="text-red-400 text-sm font-medium">{error}</div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-primary hover:bg-emerald-500 text-black font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
