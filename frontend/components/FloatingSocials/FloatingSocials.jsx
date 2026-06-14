'use client';

import { motion } from 'framer-motion';

// Custom Facebook SVG Icon
const FacebookIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

// Custom WhatsApp SVG Icon
const WhatsAppIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

// Custom Instagram SVG Icon
const InstagramIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

// Custom TikTok SVG Icon since Lucide doesn't have it
const TikTokIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

export default function FloatingSocials() {
  return (
    <div className="fixed right-6 bottom-1/4 z-50 flex flex-col gap-4 pointer-events-auto">
      <motion.a 
        href="https://www.facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="w-12 h-12 bg-[#1877F2]/10 backdrop-blur-md border border-[#1877F2]/30 text-[#1877F2] rounded-full flex items-center justify-center hover:bg-[#1877F2]/20 hover:shadow-[0_0_15px_#1877F2] transition-all"
      >
        <FacebookIcon size={24} />
      </motion.a>

      <motion.a 
        href="https://chat.whatsapp.com/KiWpf4MILYwBV3D4qxJnHP"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, type: "spring" }}
        className="w-12 h-12 bg-[#25D366]/10 backdrop-blur-md border border-[#25D366]/30 text-[#25D366] rounded-full flex items-center justify-center hover:bg-[#25D366]/20 hover:shadow-[0_0_15px_#25D366] transition-all"
      >
        <WhatsAppIcon size={24} />
      </motion.a>
      
      <motion.a 
        href="https://www.instagram.com/_thelabel.lk_?igsh=bWZ1aHRxMTNteHpj"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, type: "spring" }}
        className="w-12 h-12 bg-[#E4405F]/10 backdrop-blur-md border border-[#E4405F]/30 text-[#E4405F] rounded-full flex items-center justify-center hover:bg-[#E4405F]/20 hover:shadow-[0_0_15px_#E4405F] transition-all"
      >
        <InstagramIcon size={24} />
      </motion.a>
      
      <motion.a 
        href="https://tiktok.com"
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, type: "spring" }}
        className="w-12 h-12 bg-[#00f2fe]/10 backdrop-blur-md border border-[#00f2fe]/30 text-[#00f2fe] rounded-full flex items-center justify-center hover:bg-[#00f2fe]/20 hover:shadow-[0_0_15px_#00f2fe] transition-all"
      >
        <TikTokIcon size={22} />
      </motion.a>
    </div>
  );
}
