'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Sun, ShoppingBag, User, Search, X, Gem, Shirt, Heart, Bell, ArrowRight, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCurrency } from '@/context/CurrencyContext';
import { useProducts } from '@/context/ProductContext';
import { usePathname } from 'next/navigation';

// Remove static megaMenuApparel

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount } = useCart();
  const { user, notifications, markNotificationsAsRead, logout } = useAuth();
  const { wishlist } = useWishlist();
  const { currency, toggleCurrency, formatPrice } = useCurrency();
  const { products } = useProducts();
  const pathname = usePathname();

  const searchResults = searchQuery.trim() === '' 
    ? [] 
    : products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 5);

  const suggestedProducts = products.slice(0, 3);

  // Hardcoded categories as requested
  const dynamicCategories = [
    {
      name: 'National Jerseys',
      href: '/collections/National Jerseys',
      img: '/images/brazil-jersey.jpg'
    },
    {
      name: 'Club Jerseys',
      href: '/collections/Club Jerseys',
      img: '/images/madrid-jersey.jpg'
    }
  ];

  useEffect(() => setMounted(true), []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <div className="fixed top-6 left-0 w-full z-50 flex justify-center pointer-events-none" onMouseLeave={() => setActiveMenu(null)}>
      
      {/* Floating Dock Navbar */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="pointer-events-auto flex items-center justify-between glass-nav rounded-full py-2 px-4 md:py-3 md:px-8 shadow-[0_20px_50px_rgba(16,185,129,0.15)] relative w-[95%] md:w-auto max-w-full"
      >
        {/* Logo */}
        <Link href="/" className="font-serif text-lg sm:text-xl md:text-3xl font-bold tracking-widest text-gold hover:drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] transition-all shrink-0">
          The Label
        </Link>

        {/* Navigation Links with animated underlines */}
        <div className="hidden md:flex items-center gap-6">
          <div 
            className="relative cursor-pointer group px-4 py-2"
            onMouseEnter={() => setActiveMenu('apparel')}
          >
            <Link href="/collections/all" className="font-medium tracking-widest uppercase text-sm flex items-center gap-2 group-hover:text-primary transition-colors">
              <Shirt size={16} /> Jerseys
            </Link>
            {activeMenu === 'apparel' && (
              <motion.div layoutId="nav-indicator" className="absolute bottom-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_10px_#10b981]" />
            )}
          </div>

          <div 
            className="relative cursor-pointer group px-4 py-2"
            onMouseEnter={() => setActiveMenu(null)}
          >
            <Link href="/contact" className="font-medium tracking-widest uppercase text-sm flex items-center gap-2 group-hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>

        {/* Icons & Action Dock Wrapper */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* Main Icons Dock */}
          <div className="flex items-center gap-1 sm:gap-2 bg-white/5 p-1 rounded-full border border-white/10">
          
          <motion.div layout className="hidden sm:flex items-center rounded-full px-2 relative">
            <AnimatePresence>
              {searchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Discover elegance..."
                  className="bg-transparent border-none outline-none text-sm px-2 text-primary placeholder-gray-500 font-medium"
                />
              )}
            </AnimatePresence>
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (searchOpen) setSearchQuery('');
              }} 
              className="p-2 text-foreground hover:text-gold transition-colors"
            >
              {searchOpen ? <X size={20} /> : <Search size={20} />}
            </motion.button>

            {/* Search Results / Suggestions Dropdown */}
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full mt-4 right-0 w-[320px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-3 shadow-2xl z-50 flex flex-col gap-2 pointer-events-auto"
                >
                  {searchQuery.trim() === '' ? (
                    <>
                      <div className="px-2 pb-1 pt-1 border-b border-white/10 mb-1">
                        <span className="text-xs uppercase tracking-widest text-secondary font-bold">Suggested</span>
                      </div>
                      {suggestedProducts.map(product => (
                        <Link 
                          key={product._id} 
                          href={`/product/${product._id}`}
                          onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                          className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors group"
                        >
                          <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-semibold group-hover:text-primary transition-colors truncate">{product.name}</h4>
                            <p className="text-secondary text-xs uppercase tracking-wider">{product.category}</p>
                          </div>
                          <span className="text-gold text-sm font-bold whitespace-nowrap">{formatPrice(product.price)}</span>
                        </Link>
                      ))}
                    </>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(product => (
                      <Link 
                        key={product._id} 
                        href={`/product/${product._id}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-xl transition-colors group"
                      >
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white text-sm font-semibold group-hover:text-primary transition-colors truncate">{product.name}</h4>
                          <p className="text-secondary text-xs uppercase tracking-wider">{product.category}</p>
                        </div>
                        <span className="text-gold text-sm font-bold whitespace-nowrap">{formatPrice(product.price)}</span>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-secondary text-sm">No products found</div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="w-[1px] h-6 bg-white/20 mx-1" />

          {user && (
            <div className="relative">
              <motion.button 
                whileHover={{ scale: 1.1, y: -2 }} 
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  if (!notificationsOpen && notifications?.some(n => !n.read)) {
                    markNotificationsAsRead();
                  }
                }}
                className="p-2 flex text-foreground hover:text-primary transition-colors relative"
              >
                <Bell size={20} />
                {notifications?.some(n => !n.read) && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full shadow-[0_0_5px_#ef4444]"></span>
                )}
              </motion.button>
              
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full mt-4 -right-20 sm:right-0 w-[85vw] sm:w-80 max-w-[320px] bg-black/95 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 shadow-2xl z-50 max-h-96 overflow-y-auto pointer-events-auto origin-top-right"
                  >
                    <h3 className="text-white font-bold mb-3 border-b border-white/10 pb-2">Notifications</h3>
                    {notifications?.length > 0 ? (
                      <div className="space-y-3">
                        {notifications.map(n => (
                          <div key={n.id} className={`p-3 rounded-xl border ${n.read ? 'bg-white/5 border-white/5' : 'bg-primary/10 border-primary/30'} text-sm`}>
                            <p className="text-gray-200">{n.message}</p>
                            <span className="text-[10px] text-gray-500 mt-1 block">{new Date(n.date).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">No notifications yet.</p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/account" className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border border-primary/50 hover:bg-primary/30 transition-colors" title="My Account">
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
              </Link>
              <button 
                onClick={logout} 
                className="hidden md:block text-xs font-bold uppercase tracking-widest text-secondary hover:text-red-400 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link href="/login" className="hidden md:block px-4 py-1.5 rounded-full bg-white/5 border border-white/20 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors">
              Login
            </Link>
          )}
          
          <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }} className="hidden md:block">
            <Link href="/wishlist" className="p-2 flex text-foreground hover:text-red-400 transition-colors relative">
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_5px_#ef4444]">
                  {wishlist.length}
                </span>
              )}
            </Link>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1, y: -2 }} whileTap={{ scale: 0.9 }}>
            <Link href="/cart" className="p-2 flex text-foreground hover:text-primary transition-colors relative">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-gold text-black text-[10px] font-bold flex items-center justify-center rounded-full shadow-[0_0_5px_#fbbf24]">
                  {cartCount}
                </span>
              )}
            </Link>
          </motion.div>

          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center bg-white/5 p-1 rounded-full border border-white/10 pointer-events-auto">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1 sm:p-2 text-white hover:text-gold transition-colors"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="absolute top-full left-4 right-4 mt-4 bg-black/95 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-6 shadow-2xl flex flex-col gap-8 md:hidden pointer-events-auto overflow-y-auto max-h-[70vh]"
            >
              <div className="flex flex-col gap-4">
                <Link href="/collections/all" onClick={() => setMobileMenuOpen(false)} className="group relative overflow-hidden rounded-2xl bg-white/5 p-4 flex items-center gap-4 border border-white/5 hover:border-primary/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-colors">
                    <Shirt size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold tracking-widest uppercase text-white group-hover:text-primary transition-colors">Explore Jerseys</h3>
                    <p className="text-xs text-gray-400 font-medium">View our full collection</p>
                  </div>
                  <ArrowRight size={20} className="text-gray-500 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>

                <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="group relative overflow-hidden rounded-2xl bg-white/5 p-4 flex items-center gap-4 border border-white/5 hover:border-blue-500/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <User size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold tracking-widest uppercase text-white group-hover:text-blue-400 transition-colors">Contact Us</h3>
                    <p className="text-xs text-gray-400 font-medium">Get support anytime</p>
                  </div>
                  <ArrowRight size={20} className="text-gray-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                </Link>
                
                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="group relative overflow-hidden rounded-2xl bg-red-500/5 p-4 flex items-center gap-4 border border-red-500/10 hover:border-red-500/50 transition-all">
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <Heart size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold tracking-widest uppercase text-white group-hover:text-red-400 transition-colors">Wishlist</h3>
                    <p className="text-xs text-gray-400 font-medium">Your favorite items</p>
                  </div>
                  <ArrowRight size={20} className="text-gray-500 group-hover:text-red-400 group-hover:translate-x-1 transition-all" />
                </Link>
                
                {user ? (
                  <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="group relative overflow-hidden rounded-2xl bg-red-500/5 p-4 flex items-center gap-4 border border-red-500/10 hover:border-red-500/50 transition-all text-left">
                    <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 group-hover:bg-red-500 group-hover:text-white transition-colors">
                      <X size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold tracking-widest uppercase text-red-400">Sign Out</h3>
                      <p className="text-xs text-red-500/50 font-medium">See you next time!</p>
                    </div>
                  </button>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="group relative overflow-hidden rounded-2xl bg-gold/5 p-4 flex items-center gap-4 border border-gold/10 hover:border-gold/50 transition-all">
                    <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-black transition-colors">
                      <User size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold tracking-widest uppercase text-gold">Login / Register</h3>
                      <p className="text-xs text-gold/50 font-medium">Manage your orders</p>
                    </div>
                  </Link>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                  <div className="h-[1px] flex-1 bg-white/10" />
                  Quick Collections
                  <div className="h-[1px] flex-1 bg-white/10" />
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {dynamicCategories.slice(0, 4).map((cat, idx) => (
                    <Link key={idx} href={cat.href} onClick={() => setMobileMenuOpen(false)} className="relative overflow-hidden h-24 rounded-xl group border border-white/10 shadow-lg">
                      <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-black/20" />
                      <div className="absolute inset-0 flex items-center justify-center p-2 text-center">
                        <span className="text-white text-xs font-bold tracking-wider uppercase z-10">{cat.name}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mega Menu Dropdown */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 20, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring" }}
              className="absolute top-full left-0 w-full flex justify-center pointer-events-auto"
              onMouseEnter={() => setActiveMenu(activeMenu)}
            >
              <div className="w-auto min-w-[600px] max-w-4xl glass-nav rounded-3xl p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] border border-primary/20">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full relative z-10">
                  {activeMenu === 'apparel' && (
                    dynamicCategories.length > 0 ? (
                      dynamicCategories.map((item, idx) => (
                        <Link 
                          key={idx} 
                          href={item.href}
                          className="group/item relative overflow-hidden rounded-2xl h-48 bg-black/20"
                        >
                          <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover/item:opacity-100 group-hover/item:scale-110 transition-all duration-700" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <span className="font-bold text-white uppercase tracking-wider text-sm">{item.name}</span>
                            <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md opacity-0 group-hover/item:opacity-100 transform translate-x-4 group-hover/item:translate-x-0 transition-all">
                              <ArrowRight size={14} className="text-white" />
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="col-span-full text-center text-gray-500 py-8 w-full">No categories found.</div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.nav>
    </div>
  );
}
