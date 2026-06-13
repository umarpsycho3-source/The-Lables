'use client';

import { useProducts } from '@/context/ProductContext';
import { useCurrency } from '@/context/CurrencyContext';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function OffersCarousel() {
  const { products } = useProducts();
  const { formatPrice } = useCurrency();

  const offerProducts = products.filter(p => p.isOffer);

  if (offerProducts.length === 0) return null;

  // Ensure we have enough items to fill the screen
  const minItems = 8;
  let baseItems = [...offerProducts];
  while (baseItems.length < minItems) {
    baseItems = [...baseItems, ...offerProducts];
  }

  return (
    <div className="w-full bg-[#0a0f1c] py-16 overflow-hidden border-y border-white/5 relative">
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0a0f1c] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0a0f1c] to-transparent z-10 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 mb-8 flex justify-between items-end relative z-20">
        <div>
          <h2 className="font-serif text-3xl font-bold text-white mb-2">Limited <span className="text-gold">Offers</span></h2>
          <p className="text-sm text-secondary">Exclusive deals on premium player version jerseys.</p>
        </div>
        <div className="hidden md:flex gap-2">
          <span className="w-2 h-2 rounded-full bg-gold animate-ping"></span>
          <span className="text-xs font-bold text-gold uppercase tracking-widest">Live Now</span>
        </div>
      </div>

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: baseItems.length * 4,
              ease: "linear",
            },
          }}
        >
          {/* Set 1 */}
          <div className="flex gap-6 mr-6">
            {baseItems.map((product, idx) => (
              <Link 
                key={`set1-${product._id}-${idx}`} 
                href={`/product/${product._id}`}
                className="inline-block w-[300px] shrink-0 bg-white/5 border border-white/10 hover:border-gold/50 rounded-2xl overflow-hidden group transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider z-10">
                    Sale
                  </div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-sm truncate mb-2 group-hover:text-gold transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gold">{formatPrice(product.offerPrice)}</span>
                    <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Set 2 (Duplicate for seamless loop) */}
          <div className="flex gap-6 mr-6">
            {baseItems.map((product, idx) => (
              <Link 
                key={`set2-${product._id}-${idx}`} 
                href={`/product/${product._id}`}
                className="inline-block w-[300px] shrink-0 bg-white/5 border border-white/10 hover:border-gold/50 rounded-2xl overflow-hidden group transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider z-10">
                    Sale
                  </div>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                </div>
                <div className="p-5">
                  <h3 className="text-white font-bold text-sm truncate mb-2 group-hover:text-gold transition-colors">{product.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gold">{formatPrice(product.offerPrice)}</span>
                    <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
