'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero3D() {
  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#050505] flex items-center">
      {/* Stadium Background Image */}
      <div 
        className="absolute inset-0 z-0 opacity-30 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518605368461-1ee7e5302a40?q=80&w=2000&auto=format&fit=crop')" }}
      />
      
      {/* Dark Gradient Overlay for text readability */}
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center justify-between gap-16 mt-16">
        
        {/* Left Side: Text */}
        <motion.div
          className="w-full lg:w-1/2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-bold tracking-[0.2em] uppercase mb-6">
            Elite Football Apparel
          </div>
          <h1 className="serif text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold mb-6 text-white leading-[1.1] drop-shadow-lg">
            Player Issue<br/>Supremacy
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-xl font-light leading-relaxed">
            Authentic player-version football jerseys engineered for peak performance and elite aesthetics on the pitch.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/collections/all">
              <button className="w-full sm:w-auto bg-white hover:bg-gray-200 text-black rounded-full px-10 py-4 font-bold tracking-widest uppercase text-sm transition-colors shadow-xl">
                Explore Jerseys
              </button>
            </Link>
            <Link href="/collections/New Arrivals">
              <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white rounded-full px-10 py-4 font-bold tracking-widest uppercase text-sm transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                New Arrivals
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Right Side: Player Cards */}
        <motion.div 
          className="w-full lg:w-1/2 flex justify-center lg:justify-end items-center gap-4 sm:gap-6 relative"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        >
          {/* Messi Card */}
          <div className="w-1/3 max-w-[200px] aspect-[2/3] rounded-xl overflow-hidden relative shadow-2xl translate-y-8 group border border-white/10 hover:border-emerald-500/50 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped%29.jpg" alt="Messi" className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute bottom-4 left-4 z-20">
              <div className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mb-1">10 //</div>
              <div className="text-lg text-white font-bold tracking-wider">MESSI</div>
            </div>
          </div>

          {/* Ronaldo Card (Center) */}
          <div className="w-1/3 max-w-[240px] aspect-[2/3] rounded-xl overflow-hidden relative shadow-[0_0_40px_rgba(16,185,129,0.3)] z-20 -translate-y-4 border border-emerald-500/50 group">
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg" alt="Ronaldo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div className="absolute bottom-6 left-5 z-20">
              <div className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mb-1">07 //</div>
              <div className="text-2xl text-white font-bold tracking-wider">RONALDO</div>
            </div>
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent -rotate-45 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-[1.5s] z-30 pointer-events-none" />
          </div>

          {/* Neymar Card */}
          <div className="w-1/3 max-w-[200px] aspect-[2/3] rounded-xl overflow-hidden relative shadow-2xl translate-y-8 group border border-white/10 hover:border-emerald-500/50 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/bb/Neymar_Jr._with_Al_Hilal%2C_3_October_2023_-_03_%28cropped%29.jpg" alt="Neymar" className="w-full h-full object-cover filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute bottom-4 left-4 z-20">
              <div className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase mb-1">10 //</div>
              <div className="text-lg text-white font-bold tracking-wider">NEYMAR</div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
