'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote, BadgeCheck, MessageSquarePlus } from 'lucide-react';
import ReviewModal from '@/components/ReviewModal/ReviewModal';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/reviews');
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
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
            Customer <span className="text-primary italic">Reviews</span>
          </h1>
          <p className="text-secondary text-lg max-w-2xl mx-auto mb-8">
            Read what our community of athletes and fans have to say about their experience with The Label's premium player-issue apparel.
          </p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary hover:bg-emerald-500 text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center gap-2 mx-auto"
          >
            <MessageSquarePlus size={18} />
            Write a Review
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20 text-white animate-pulse">Loading all reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
            <MessageSquarePlus size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No reviews have been published yet.</p>
            <p className="text-gray-500">Be the first to share your experience with us!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
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
    </div>
  );
}
