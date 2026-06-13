'use client';

import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ProductPage() {
  const { id } = useParams();
  const { products, addReview } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  
  const [addedToCart, setAddedToCart] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [canReview, setCanReview] = useState(false);
  const [isCheckingEligibility, setIsCheckingEligibility] = useState(false);

  useEffect(() => {
    if (user) {
      setIsCheckingEligibility(true);
      const token = localStorage.getItem('luxe_token');
      fetch('http://localhost:5000/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(orders => {
        if (Array.isArray(orders)) {
          const eligible = orders.some(order => 
            order.status === 'Delivered' && 
            order.items.some(item => item._id === id)
          );
          setCanReview(eligible);
        }
      })
      .catch(console.error)
      .finally(() => setIsCheckingEligibility(false));
    } else {
      setCanReview(false);
    }
  }, [user, id]);

  const product = products.find(p => p._id === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white">
        <h1 className="text-2xl">Product not found.</h1>
      </div>
    );
  }

  const isLiked = isInWishlist(product._id);
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;
  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  const handleAddToCart = () => {
    if ((product.category === 'Football Jerseys' || product.category === 'Mens Clothing') && !selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
    
    addToCart({
      ...product,
      selectedSize
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to leave a review.");
    if (!reviewText.trim()) return;
    
    addReview(product._id, { user: user.name, rating, text: reviewText });
    setReviewText('');
    setRating(5);
  };

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="container mx-auto max-w-7xl">
        
        <Link href="/" className="inline-flex items-center gap-2 text-secondary hover:text-white mb-8 transition-colors">
          <ArrowLeft size={20} /> Back to Collections
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          
          {/* Product Image Gallery */}
          <div className="flex flex-col gap-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative h-[500px] md:h-[600px] rounded-[2rem] overflow-hidden group border border-white/10"
            >
              <img src={productImages[activeImageIndex]} alt={product.name} className="w-full h-full object-cover transition-opacity duration-300" />
              <div className="absolute top-6 left-6 flex flex-col gap-2 z-10">
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
              <button 
                onClick={() => toggleWishlist(product._id)}
                className={`absolute top-6 right-6 p-4 rounded-full backdrop-blur-md transition-colors
                  ${isLiked ? 'bg-red-500/20 text-red-500 border border-red-500/50' : 'bg-black/20 text-white hover:bg-white/20'}`}
              >
                <Heart size={24} className={isLiked ? 'fill-current' : ''} />
              </button>
            </motion.div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {productImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImageIndex === idx ? 'border-primary scale-105 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center"
          >
            <p className="text-sm tracking-widest text-secondary uppercase mb-2">{product.category}</p>
            <h1 className="serif text-5xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-8">
              {product.isOffer ? (
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-gold">{formatPrice(product.offerPrice)}</span>
                  <span className="text-xl text-gray-500 line-through">{formatPrice(product.price)}</span>
                  <span className="bg-red-500/20 text-red-500 border border-red-500/30 px-2 py-1 rounded text-xs font-bold uppercase tracking-widest ml-2">Sale</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-gold">{formatPrice(product.price)}</span>
              )}
              {reviews.length > 0 && (
                <div className="flex items-center gap-2 border-l border-white/20 pl-4">
                  <Star size={18} className="fill-gold text-gold" />
                  <span className="font-medium">{averageRating}</span>
                  <span className="text-secondary text-sm">({reviews.length} reviews)</span>
                </div>
              )}
            </div>

            {product.description && (
              <div className="mb-8">
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {(product.category === 'Football Jerseys' || product.category === 'Mens Clothing') && (
              <div className="mb-10">
                <h4 className="text-sm font-semibold uppercase tracking-widest text-secondary mb-4">Select Size</h4>
                <div className="flex gap-3">
                  {['S', 'M', 'L', 'XL', 'XXL'].map(size => {
                    const isSizeOutOfStock = product.outOfStockSizes?.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => !isSizeOutOfStock && setSelectedSize(size)}
                        disabled={isSizeOutOfStock}
                        className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold transition-all relative overflow-hidden
                          ${isSizeOutOfStock 
                            ? 'border-white/10 text-gray-600 bg-white/5 cursor-not-allowed opacity-50' 
                            : selectedSize === size 
                              ? 'border-primary bg-primary/10 text-primary scale-110' 
                              : 'border-white/20 text-gray-400 hover:border-white/50'
                          }`}
                      >
                        {size}
                        {isSizeOutOfStock && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-[1px] bg-red-500/50 rotate-45 transform scale-150"></div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <button 
              onClick={product.outOfStockSizes?.length === 5 ? undefined : handleAddToCart}
              disabled={product.outOfStockSizes?.length === 5}
              className={`w-full py-5 rounded-full flex items-center justify-center gap-3 font-bold text-lg transition-all group/btn ${product.outOfStockSizes?.length === 5 ? 'bg-white/5 border border-white/5 text-gray-500 cursor-not-allowed' : 'bg-primary text-black hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]'}`}
            >
              {product.outOfStockSizes?.length === 5 ? (
                <>Out of Stock</>
              ) : addedToCart ? (
                <><CheckCircle2 size={24} /> Added to Cart</>
              ) : (
                <><ShoppingBag size={24} /> Add to Cart - {product.isOffer ? formatPrice(product.offerPrice) : formatPrice(product.price)}</>
              )}
            </button>
            
            <div className="mt-8 flex items-center gap-6 text-sm text-secondary">
              {product.outOfStockSizes?.length === 5 ? (
                <div className="flex items-center gap-2"><span className="text-red-500 text-lg">&times;</span> <span className="text-red-400">Out of Stock - Returning Soon!</span></div>
              ) : (
                <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> In Stock</div>
              )}
              <div className="flex items-center gap-2"><CheckCircle2 size={16} className="text-primary" /> Free Premium Shipping</div>
            </div>
          </motion.div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-white/10 pt-16">
          <h2 className="serif text-3xl font-bold mb-10">Customer Reviews</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Reviews List */}
            <div className="lg:col-span-2 space-y-6">
              {reviews.length === 0 ? (
                <p className="text-secondary italic">No reviews yet. Be the first to review this exquisite item.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold text-white">{review.user}</span>
                      <div className="flex gap-1 text-gold">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className={i < review.rating ? 'fill-current' : 'text-gray-600'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-secondary">{review.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Write a Review */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-fit sticky top-32">
              <h3 className="text-xl font-bold mb-6">Write a Review</h3>
              {!user ? (
                <div className="text-center">
                  <p className="text-secondary mb-4">You must be logged in to share your thoughts.</p>
                  <Link href="/login">
                    <button className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-full transition-colors w-full">Sign In</button>
                  </Link>
                </div>
              ) : isCheckingEligibility ? (
                <div className="text-center">
                  <p className="text-secondary mb-4">Checking eligibility...</p>
                </div>
              ) : !canReview ? (
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <ShoppingBag size={32} className="mx-auto text-secondary mb-4 opacity-50" />
                  <p className="text-secondary mb-2">Verified Purchases Only</p>
                  <p className="text-sm text-gray-400">You must purchase and receive this item before you can write a review.</p>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-6">
                  <div>
                    <label className="block text-xs text-secondary mb-2 uppercase tracking-widest">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setRating(star)}
                          className={`p-1 ${star <= rating ? 'text-gold fill-current' : 'text-gray-600 hover:text-gold'}`}
                        >
                          <Star size={24} className={star <= rating ? 'fill-current' : ''} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-secondary mb-2 uppercase tracking-widest">Your Review</label>
                    <textarea 
                      required
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors min-h-[120px]"
                      placeholder="Share your experience..."
                    />
                  </div>
                  <button type="submit" className="w-full bg-primary text-black py-3 rounded-xl font-bold hover:bg-emerald-500 transition-colors">
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
