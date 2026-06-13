'use client';

import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ShoppingBag, CheckCircle2, Heart } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function AllCollectionsPage() {
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [addedItems, setAddedItems] = useState({});

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAddedItems({ ...addedItems, [product._id]: true });
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product._id]: false })), 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="container mx-auto max-w-7xl">
        
        <div className="text-center mb-20">
          <h1 className="serif text-5xl md:text-7xl font-bold mb-4">
            All <span className="text-primary italic">Collections</span>
          </h1>
          <p className="text-secondary">Explore our entire catalogue of premium items.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
          {products.map((product, index) => {
            const isLiked = isInWishlist(product._id);
            return (
              <motion.div variants={fadeUp} initial="hidden" animate="show" key={product._id} className={index % 3 === 1 ? 'lg:mt-16' : ''}>
                <Tilt tiltMaxAngleX={15} tiltMaxAngleY={15} scale={1.05} transitionSpeed={2000} className="transform-style-3d">
                  <div className="relative group rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 p-4 shadow-[0_30px_60px_rgba(0,0,0,0.4)] hover:shadow-[0_40px_80px_rgba(16,185,129,0.2)] transition-all duration-500">
                    <Link href={`/product/${product._id}`}>
                      <div className="relative h-[400px] w-full rounded-[1.5rem] overflow-hidden mb-6">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    </Link>

                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product._id);
                      }}
                      className={`absolute top-8 right-8 p-3 rounded-full backdrop-blur-md transition-colors z-10 
                        ${isLiked ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-black/20 text-white hover:bg-white/20 hover:text-red-400'}`}
                    >
                      <Heart size={20} className={isLiked ? 'fill-current' : ''} />
                    </button>

                    <Link href={`/product/${product._id}`}>
                      <div className="flex justify-between items-end px-2">
                        <div>
                          <p className="text-sm tracking-widest text-secondary uppercase mb-1">{product.category}</p>
                          <h3 className="serif text-2xl font-bold text-white group-hover:text-primary transition-colors">{product.name}</h3>
                        </div>
                        <p className="text-xl font-bold text-white">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                    
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="w-full mt-6 bg-white/5 hover:bg-primary hover:text-black text-white border border-white/10 py-4 rounded-xl flex items-center justify-center gap-2 transition-all group/btn"
                    >
                      {addedItems[product._id] ? (
                        <><CheckCircle2 size={18} className="text-primary group-hover/btn:text-black" /> Added to Cart</>
                      ) : (
                        <><ShoppingBag size={18} /> Add to Cart</>
                      )}
                    </button>
                  </div>
                </Tilt>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
