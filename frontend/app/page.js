'use client';

import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import Link from 'next/link';
import Hero3D from '@/components/Hero3D/Hero3D';
import FifaSection from '@/components/FifaSection/FifaSection';
import OffersCarousel from '@/components/OffersCarousel/OffersCarousel';
import CustomerReviews from '@/components/CustomerReviews/CustomerReviews';
import Features from '@/components/Features/Features';
import { ShoppingBag, ArrowRight, CheckCircle2, Heart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/context/ProductContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useState } from 'react';

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 100, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, type: 'spring', bounce: 0.4 } }
};

export default function Home() {
  const { addToCart } = useCart();
  const { products } = useProducts();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [addedItems, setAddedItems] = useState({});

  const handleAddToCart = (e, product) => {
    e.preventDefault(); // Prevent navigating to product page
    addToCart(product);
    setAddedItems({ ...addedItems, [product._id]: true });
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product._id]: false })), 2000);
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Hero Section */}
      <Hero3D />

      {/* FIFA World Cup Promo Section */}
      <FifaSection />

      {/* Offers Carousel */}
      <OffersCarousel />

      {/* Featured Products */}
      <section className="relative py-32 overflow-hidden">
        {/* Floating background blur */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px] -z-10" />
        
        <div className="container mx-auto px-6 max-w-7xl">
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="text-center mb-20">
              <h2 className="serif text-5xl md:text-7xl font-bold mb-6 text-foreground tracking-wide">
                Player Issue <span className="text-primary italic">Supremacy</span>
              </h2>
              <p className="text-secondary text-lg max-w-2xl mx-auto font-light">
                Discover authentic player-version football jerseys. Crafted with advanced cooling technology and tailored for elite performance.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
              {products.slice(0, 3).map((product, index) => {
                const isLiked = isInWishlist(product._id);
                return (
                  <motion.div variants={fadeUp} key={product._id} className={index % 3 === 1 ? 'lg:mt-16' : ''}>
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
                            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                              {product.isOffer && (
                                <div className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                  SALE
                                </div>
                              )}
                              {product.isNewArrival && (
                                <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                  NEW ARRIVAL
                                </div>
                              )}
                            </div>
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
                            <div className="flex flex-col items-end justify-end text-right">
                              {product.isOffer ? (
                                <>
                                  <p className="text-xl font-bold text-gold">{formatPrice(product.offerPrice)}</p>
                                  <p className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</p>
                                </>
                              ) : (
                                <p className="text-xl font-bold text-white">{formatPrice(product.price)}</p>
                              )}
                            </div>
                          </div>
                        </Link>
                        <button 
                          onClick={(e) => product.outOfStockSizes?.length === 5 ? e.preventDefault() : handleAddToCart(e, product)}
                          disabled={product.outOfStockSizes?.length === 5}
                          className={`w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all group/btn ${product.outOfStockSizes?.length === 5 ? 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed' : 'bg-white/5 hover:bg-primary hover:text-black text-white border border-white/10'}`}
                        >
                          {product.outOfStockSizes?.length === 5 ? (
                            <>Out of Stock</>
                          ) : addedItems[product._id] ? (
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

            <motion.div variants={fadeUp} className="mt-24 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/collections">
                <button className="group relative overflow-hidden rounded-full bg-transparent border border-white/20 px-8 py-4 flex items-center gap-4 hover:border-primary transition-colors">
                  <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out -z-10" />
                  <span className="font-medium tracking-widest uppercase text-sm group-hover:text-white transition-colors">View All Collections</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
                </button>
              </Link>
              <Link href="/collections/New Arrivals">
                <button className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-full px-10 py-4 font-bold tracking-widest uppercase text-sm transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]">
                  NEW ARRIVALS
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Customer Reviews */}
      <CustomerReviews />

      {/* Features / Why Choose Us */}
      <Features />
    </div>
  );
}
