'use client';

import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useCurrency } from '@/context/CurrencyContext';
import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Minus, Plus, ArrowRight, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartCount } = useCart();
  const { formatPrice } = useCurrency();

  if (cartCount === 0) {
    return (
      <div className="min-h-screen bg-background pt-32 px-6 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-16 max-w-xl w-full backdrop-blur-md"
        >
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag size={40} className="text-primary" />
          </div>
          <h2 className="serif text-4xl font-bold mb-4">Your bag is empty</h2>
          <p className="text-secondary mb-8 text-lg">Discover our exclusive collections to find something exceptional.</p>
          <Link href="/">
            <button className="floating-btn">Explore Collections</button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="container mx-auto max-w-6xl">
        <h1 className="serif text-5xl font-bold mb-12">Your <span className="text-primary italic">Selection</span></h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="flex-1 space-y-6">
            {cartItems.map((item, index) => (
              <motion.div 
                layout
                key={item.cartItemId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex gap-6 bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md relative group hover:border-primary/50 transition-colors"
              >
                <div className="w-32 h-32 relative rounded-2xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{item.name}</h3>
                      <p className="text-secondary text-sm">{item.category}</p>
                      {item.selectedSize && (
                        <p className="text-white/60 text-sm mt-1">Size: <span className="text-white font-semibold">{item.selectedSize}</span></p>
                      )}
                    </div>
                    <div className="flex flex-col items-end">
                      {item.isOffer ? (
                        <>
                          <span className="text-xl font-bold text-gold">{formatPrice(item.offerPrice)}</span>
                          <span className="text-sm text-gray-500 line-through">{formatPrice(item.price)}</span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-gold">{formatPrice(item.price)}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 bg-black/50 border border-white/10 rounded-xl p-1">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="text-white font-medium w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                      >
                        +
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-red-400 hover:text-red-300 text-sm font-semibold transition-colors flex items-center gap-1"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md sticky top-32"
            >
              <h3 className="serif text-2xl font-bold mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="text-white">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Shipping</span>
                  <span className="text-white">Complimentary</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Taxes</span>
                  <span className="text-white">Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-6 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-lg font-medium">Estimated Total</span>
                  <span className="text-3xl font-bold text-gold">{formatPrice(cartTotal)}</span>
                </div>
              </div>
              
              <Link href="/checkout">
                <button className="floating-btn w-full flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight size={18} />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
