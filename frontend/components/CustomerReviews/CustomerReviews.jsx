'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, BadgeCheck, MessageSquarePlus, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import ReviewModal from '../ReviewModal/ReviewModal';

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch('https://the-lables.onrender.com/api/reviews');
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="serif text-4xl md:text-5xl font-bold mb-4 text-white">
            What Our <span className="text-primary italic">Fans</span> Say
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto mb-8">
            Don't just take our word for it. Read reviews from athletes and fans who experience our player-issue supremacy firsthand.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-2"
            >
              <MessageSquarePlus size={18} />
              Write a Review
            </button>
            {reviews.length > 3 && (
              <Link href="/reviews" className="text-primary hover:text-emerald-400 font-bold uppercase tracking-widest text-sm transition-colors flex items-center gap-1 group">
                See All Reviews
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-white animate-pulse">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.slice(0, 3).map((review, idx) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2, duration: 0.6 }}
                className="bg-white/5 border border-white/10 rounded-[2rem] p-8 relative hover:bg-white/10 transition-colors group flex flex-col h-full"
              >
                <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/50 text-primary group-hover:scale-110 transition-transform">
                  <Quote size={20} fill="currentColor" />
                </div>

                <div className="flex items-center gap-1 mb-6 text-gold">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-8 italic flex-1">
                  "{review.content}"
                </p>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                  {review.userId?.profileImage ? (
                    <img src={review.userId.profileImage} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white/10 object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-white/10 text-gray-400 flex items-center justify-center font-bold text-lg border-2 border-white/10">
                      {review.name.charAt(0)}
                    </div>
                  )}
                  
                  <div>
                    <h4 className="text-white font-bold flex items-center gap-1.5">
                      {review.name}
                      {review.userId?.isVerifiedBuyer && (
                        <BadgeCheck size={16} className="text-blue-400" />
                      )}
                    </h4>
                    <p className={`text-[10px] uppercase tracking-widest font-bold ${review.userId?.isVerifiedBuyer ? 'text-blue-400' : 'text-gray-500'}`}>
                      {review.userId?.isVerifiedBuyer ? 'Verified Buyer' : 'Customer'}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <ReviewModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={() => {
          fetchReviews();
          alert('Review submitted! It will appear once approved by an admin.');
        }} 
      />
    </section>
  );
}
