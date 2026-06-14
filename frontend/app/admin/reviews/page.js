'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle2, XCircle, Trash2, Star, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminReviewsPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [token]);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/reviews', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (id, currentStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ isApproved: !currentStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews(reviews.map(r => r._id === updated._id ? { ...r, isApproved: updated.isApproved } : r));
      }
    } catch (error) {
      console.error('Failed to update review', error);
    }
  };

  const deleteReview = async (id) => {
    if (!confirm('Are you sure you want to delete this review completely?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/reviews/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setReviews(reviews.filter(r => r._id !== id));
      }
    } catch (error) {
      console.error('Failed to delete review', error);
    }
  };

  if (loading) return <div className="text-white text-center py-20 animate-pulse">Loading Reviews...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2">Customer Reviews</h2>
          <p className="text-gray-400">Approve, reject, and manage customer reviews before they appear on the site.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 text-primary px-6 py-3 rounded-xl font-bold flex items-center gap-3">
          <MessageSquare size={20} />
          Total Reviews: {reviews.length}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {reviews.map((review, idx) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`bg-[#0a0f1c] border rounded-2xl p-6 relative flex flex-col ${review.isApproved ? 'border-primary/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-white/10'}`}
          >
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${review.isApproved ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                {review.isApproved ? 'Live on Site' : 'Pending Approval'}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-4 mt-2">
              {review.userId?.profileImage ? (
                <img src={review.userId.profileImage} alt={review.name} className="w-12 h-12 rounded-full border border-white/20 object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-white/5 text-gray-400 flex items-center justify-center font-bold border border-white/10">
                  {review.name.charAt(0)}
                </div>
              )}
              <div>
                <div className="font-bold text-white flex items-center gap-2">
                  {review.name}
                  {review.userId?.isVerifiedBuyer && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded uppercase tracking-wider font-bold">Verified</span>
                  )}
                </div>
                <div className="flex items-center text-gold mt-1">
                  {[...Array(review.rating)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white/5 rounded-xl p-4 mb-6 border border-white/5">
              <p className="text-gray-300 text-sm italic">"{review.content}"</p>
            </div>

            <div className="flex items-center gap-3 mt-auto">
              <button
                onClick={() => toggleApproval(review._id, review.isApproved)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-colors ${review.isApproved ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : 'bg-primary/20 text-primary hover:bg-primary/30'}`}
              >
                {review.isApproved ? <><XCircle size={16} /> Revoke</> : <><CheckCircle2 size={16} /> Approve</>}
              </button>
              
              <button
                onClick={() => deleteReview(review._id)}
                className="w-12 h-[44px] flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors rounded-xl"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}

        {reviews.length === 0 && (
          <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-white/10 border-dashed">
            <MessageSquare size={40} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No reviews have been submitted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
