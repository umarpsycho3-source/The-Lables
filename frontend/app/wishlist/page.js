'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, CheckCircle2, Trash2 } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { formatPrice } = useCurrency();
  const [addedItems, setAddedItems] = useState({});

  const savedProducts = products.filter(p => wishlist.includes(p._id));

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    setAddedItems({ ...addedItems, [product._id]: true });
    setTimeout(() => setAddedItems(prev => ({ ...prev, [product._id]: false })), 2000);
  };

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
            <Heart size={24} className="fill-current" />
          </div>
          <h1 className="serif text-4xl md:text-5xl font-bold">Your <span className="text-red-400 italic">Wishlist</span></h1>
        </div>

        {savedProducts.length === 0 ? (
          <div className="bg-white/5 border border-white/10 p-16 rounded-[2rem] backdrop-blur-md text-center">
            <Heart size={48} className="mx-auto text-white/20 mb-6" />
            <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
            <p className="text-secondary mb-8">Save items you love to revisit them later.</p>
            <Link href="/">
              <button className="bg-primary text-black px-8 py-3 rounded-full font-bold hover:bg-emerald-500 transition-colors">
                Explore Collections
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedProducts.map((product, index) => (
              <motion.div 
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-[2rem] p-4 flex flex-col group hover:border-primary/50 transition-colors"
              >
                <Link href={`/product/${product._id}`} className="block relative h-64 rounded-[1.5rem] overflow-hidden mb-4">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      toggleWishlist(product._id);
                    }}
                    className="absolute top-4 right-4 p-2 bg-black/40 backdrop-blur-md rounded-full text-white hover:text-red-400 hover:bg-black/60 transition-all z-10"
                  >
                    <Trash2 size={18} />
                  </button>
                </Link>

                <div className="flex justify-between items-start mb-4 px-2">
                  <div>
                    <p className="text-xs text-secondary uppercase tracking-widest mb-1">{product.category}</p>
                    <h3 className="serif text-xl font-bold">{product.name}</h3>
                  </div>
                  <p className="text-gold font-bold">{formatPrice(product.price)}</p>
                </div>

                <button 
                  onClick={(e) => handleAddToCart(e, product)}
                  className="w-full mt-auto bg-white/5 hover:bg-primary hover:text-black border border-white/10 py-3 rounded-xl flex items-center justify-center gap-2 transition-colors group/btn"
                >
                  {addedItems[product._id] ? (
                    <><CheckCircle2 size={18} className="text-primary group-hover/btn:text-black" /> Added</>
                  ) : (
                    <><ShoppingBag size={18} /> Add to Cart</>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
