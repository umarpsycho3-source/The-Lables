'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { usePathname } from 'next/navigation';

const FacebookIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="w-full bg-[#0a0f1c] border-t border-white/5 pt-0 mt-20 relative z-10">
      {/* WhatsApp Banner */}
      <div className="w-full bg-[#1e1e2e] py-3 flex items-center justify-center gap-4 px-4 text-center">
        <div className="flex items-center gap-2 text-primary font-medium text-sm">
          <MessageSquare size={16} />
          <span>Join our WhatsApp group for exclusive deals and support!</span>
        </div>
        <Link 
          href="https://chat.whatsapp.com/KiWpf4MILYwBV3D4qxJnHP" 
          target="_blank"
          className="bg-primary hover:bg-emerald-500 text-black px-4 py-1.5 rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
        >
          Join WhatsApp
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1 space-y-6">
            <Link href="/" className="font-serif text-3xl font-bold tracking-[0.1em] text-gold">
              The Label
            </Link>
            <p className="text-secondary text-sm leading-relaxed max-w-xs">
              Your ultimate destination for premium Player Version football jerseys. Authentic gear engineered for peak performance and elite aesthetics.
            </p>
            <div className="flex items-center gap-4">
              <Link href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <FacebookIcon />
              </Link>
              <Link href="https://www.instagram.com/_thelabel.lk_?igsh=bWZ1aHRxMTNteHpj" target="_blank" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <InstagramIcon />
              </Link>
              <Link href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <TikTokIcon />
              </Link>
            </div>
          </div>

          {/* Spacer */}
          <div className="hidden md:block"></div>

          {/* Links Columns */}
          <div className="col-span-1 flex flex-col space-y-4">
            <h4 className="text-white font-bold tracking-widest text-sm mb-2 uppercase">Shop</h4>
            <Link href="/collections/Football Jerseys" className="text-secondary hover:text-primary transition-colors text-sm">Football Jerseys</Link>
            <Link href="/collections/New Arrivals" className="text-secondary hover:text-primary transition-colors text-sm">New Arrivals</Link>
            <Link href="/collections/Best Sellers" className="text-secondary hover:text-primary transition-colors text-sm">Best Sellers</Link>
          </div>

          <div className="col-span-1 flex flex-col space-y-4">
            <h4 className="text-white font-bold tracking-widest text-sm mb-2 uppercase">Support</h4>
            <Link href="/support" className="text-secondary hover:text-primary transition-colors text-sm">Help Center</Link>
            <Link href="/support" className="text-secondary hover:text-primary transition-colors text-sm">Contact Us</Link>
            <Link href="/support" className="text-secondary hover:text-primary transition-colors text-sm">FAQs</Link>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            © 2026 The Label. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <Link href="https://chat.whatsapp.com/KiWpf4MILYwBV3D4qxJnHP" target="_blank" className="hover:text-white transition-colors">Join WhatsApp</Link>
            <Link href="/support" className="hover:text-white transition-colors">Contact Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
