'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Globe } from 'lucide-react';

export default function FifaSection() {
  return (
    <section className="relative py-32 overflow-hidden bg-[#050014]">
      {/* Background World Cup Pattern & Glow */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 mix-blend-overlay"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold font-bold text-sm tracking-widest uppercase mb-4 shadow-[0_0_15px_rgba(255,215,0,0.2)]">
              <Globe size={16} className="animate-spin-slow" />
              FIFA World Cup 2026
            </div>
            
            <h2 className="serif text-5xl md:text-7xl font-bold leading-tight">
              Gear Up for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-200 to-gold">Glory</span>
            </h2>
            
            <p className="text-secondary text-lg max-w-xl leading-relaxed">
              The biggest tournament in the world is almost here. Show your true colors with our exclusive collection of authentic Player Issue national team kits. Engineered for peak performance, destined for history.
            </p>

            <Link href="/collections/Football Jerseys">
              <button className="group mt-4 relative overflow-hidden rounded-full bg-gradient-to-r from-gold to-yellow-600 px-8 py-4 flex items-center gap-4 text-black shadow-[0_0_30px_rgba(255,215,0,0.3)] hover:shadow-[0_0_50px_rgba(255,215,0,0.5)] transition-all">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
                <span className="font-bold tracking-widest uppercase text-sm relative z-10">Shop National Teams</span>
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300 relative z-10" />
              </button>
            </Link>
          </motion.div>

          {/* Visual Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex-1 relative"
          >
            <div className="relative w-full aspect-square max-w-[500px] mx-auto">
              {/* Spinning decorative ring */}
              <div className="absolute inset-0 border-[1px] border-dashed border-gold/30 rounded-full animate-[spin_30s_linear_infinite]"></div>
              <div className="absolute inset-4 border-[1px] border-gold/10 rounded-full animate-[spin_20s_linear_infinite_reverse]"></div>
              
              {/* Product Image placeholder (we'll use a premium looking jersey or graphic) */}
              <div className="absolute inset-0 flex items-center justify-center p-12 drop-shadow-[0_30px_30px_rgba(0,0,0,0.5)]">
                <img 
                  src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop" 
                  alt="FIFA World Cup Theme" 
                  className="rounded-full w-full h-full object-cover border-4 border-gold/20 mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                />
              </div>

              {/* Floating elements */}
              <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl"
              >
                <p className="text-gold font-bold">20% OFF</p>
                <p className="text-xs text-secondary">National Kits</p>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 left-10 bg-black/50 backdrop-blur-md border border-white/10 p-4 rounded-2xl"
              >
                <p className="text-white font-bold">Player Issue</p>
                <p className="text-xs text-secondary">Authentic Grade</p>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
