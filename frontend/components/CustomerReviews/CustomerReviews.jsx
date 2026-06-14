'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Ahmed S.",
    role: "Verified Buyer",
    content: "The quality of the player edition jersey is absolutely insane. The cooling technology feels just like the real deal on the pitch. Highly recommend!",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=ahmed"
  },
  {
    id: 2,
    name: "Michael R.",
    role: "Verified Buyer",
    content: "Fast delivery and perfect fit. You can tell these are authentic player versions by the detailed stitching and lightweight material. Will buy again.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=michael"
  },
  {
    id: 3,
    name: "David T.",
    role: "Verified Buyer",
    content: "I've bought jerseys from many places, but The Label's quality is unmatched. The customer service was also incredibly helpful with sizing.",
    rating: 5,
    avatar: "https://i.pravatar.cc/150?u=david"
  }
];

export default function CustomerReviews() {
  return (
    <section className="py-24 bg-background relative overflow-hidden border-t border-white/5">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] -z-10" />

      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="serif text-4xl md:text-5xl font-bold mb-4 text-white">
            What Our <span className="text-primary italic">Fans</span> Say
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Don't just take our word for it. Read reviews from athletes and fans who experience our player-issue supremacy firsthand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-[2rem] p-8 relative hover:bg-white/10 transition-colors group"
            >
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center border border-primary/50 text-primary group-hover:scale-110 transition-transform">
                <Quote size={20} fill="currentColor" />
              </div>

              <div className="flex items-center gap-1 mb-6 text-gold">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="text-gray-300 text-sm leading-relaxed mb-8 italic">
                "{review.content}"
              </p>

              <div className="flex items-center gap-4 mt-auto">
                <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full border-2 border-white/10" />
                <div>
                  <h4 className="text-white font-bold">{review.name}</h4>
                  <p className="text-primary text-xs uppercase tracking-widest">{review.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
