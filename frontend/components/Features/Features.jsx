'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Truck, Clock, RefreshCw } from 'lucide-react';

const features = [
  {
    icon: ShieldCheck,
    title: "Premium Player Issue",
    description: "Authentic, lightweight materials with advanced cooling tech for peak performance."
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Receive your premium apparel in just 3-5 business days nationwide."
  },
  {
    icon: Clock,
    title: "24/7 Support",
    description: "Our dedicated team is here to assist you anytime with your orders."
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    description: "Hassle-free 7-day return policy on all unworn items."
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-[#02040a] relative overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="serif text-4xl md:text-5xl font-bold mb-4 text-white">
            Why Choose <span className="text-primary italic">The Label</span>
          </h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            We deliver uncompromising quality and an elite shopping experience. Here is what you can expect from us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center hover:bg-white/10 hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20 group-hover:scale-110 transition-transform duration-300">
                <feature.icon size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
