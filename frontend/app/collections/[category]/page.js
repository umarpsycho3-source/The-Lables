'use client';

import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { ShoppingBag, CheckCircle2, Heart } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function CollectionPage() {
  const params = useParams();
  const categoryName = decodeURIComponent(params.category);
  
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { formatPrice } = useCurrency();
  const [addedItems, setAddedItems] = useState({});
  const [sortOption, setSortOption] = useState('default');

  let filteredProducts = categoryName.toLowerCase() === 'all'
    ? products
    : categoryName.toLowerCase() === 'new arrivals' 
      ? products.filter(p => p.isNewArrival)
      : products.filter(p => p.category.toLowerCase() === categoryName.toLowerCase());

  if (sortOption === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

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
          <h1 className="serif text-5xl md:text-7xl font-bold mb-4 capitalize">
            {categoryName}
          </h1>
          <p className="text-secondary">Discover our exclusive collection of {categoryName.toLowerCase()}.</p>
        </div>

        {/* Filter and Sort Bar */}
        {filteredProducts.length > 0 && (
          <div className="flex justify-end mb-8">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-primary transition-colors cursor-pointer"
              >
                <option value="default" className="bg-black">Featured</option>
                <option value="price-asc" className="bg-black">Price: Low to High</option>
                <option value="price-desc" className="bg-black">Price: High to Low</option>
              </select>
            </div>
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-secondary">
            <p className="text-xl">No products found in this collection.</p>
            <Link href="/">
              <button className="mt-8 bg-white/10 hover:bg-white/20 px-8 py-3 rounded-full transition-colors">
                Return to All Collections
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
            {filteredProducts.map((product, index) => {
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
                        onClick={(e) => product.isOutOfStock ? e.preventDefault() : handleAddToCart(e, product)}
                        disabled={product.isOutOfStock}
                        className={`w-full mt-6 py-4 rounded-xl flex items-center justify-center gap-2 transition-all group/btn ${product.isOutOfStock ? 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed' : 'bg-white/5 hover:bg-primary hover:text-black text-white border border-white/10'}`}
                      >
                        {product.isOutOfStock ? (
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
        )}

      </div>
    </div>
  );
}
