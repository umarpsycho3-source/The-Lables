'use client';

import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AccountLayout({ children }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { name: 'Profile Details', href: '/account', icon: User },
    { name: 'Order History', href: '/account/orders', icon: Package },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background pt-32 px-6 pb-20">
        <div className="container mx-auto max-w-6xl">
          <h1 className="serif text-4xl md:text-5xl font-bold mb-12">Your <span className="text-primary italic">Account</span></h1>
          
          <div className="flex flex-col md:flex-row gap-12">
            
            {/* Sidebar */}
            <div className="w-full md:w-64 shrink-0">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-md sticky top-32 flex flex-col gap-2">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link key={link.href} href={link.href}>
                      <div className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all ${isActive ? 'bg-primary/20 text-primary border border-primary/30' : 'text-secondary hover:bg-white/5 hover:text-white'}`}>
                        <link.icon size={18} />
                        <span className="font-medium">{link.name}</span>
                      </div>
                    </Link>
                  );
                })}
                <div className="my-4 border-t border-white/10" />
                <button 
                  onClick={logout}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Sign Out</span>
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <motion.div 
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
