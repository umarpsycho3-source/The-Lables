'use client';

import { Trophy } from 'lucide-react';
import Link from 'next/link';

export default function FifaMarquee() {
  return (
    <div className="w-full bg-gradient-to-r from-[#8a1538] via-[#e6205c] to-[#8a1538] text-white py-2 overflow-hidden relative z-[100] border-b border-gold/30">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
      <div className="flex animate-marquee whitespace-nowrap items-center font-bold text-sm tracking-widest uppercase">
        {/* We repeat the content multiple times to ensure smooth scrolling */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center mx-8">
            <Trophy size={16} className="text-gold mr-3 animate-pulse" />
            <span className="drop-shadow-md">FIFA World Cup 2026 Special Offers Ongoing! Grab your country's kit now!</span>
            <Trophy size={16} className="text-gold ml-3 animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}
