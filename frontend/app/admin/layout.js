'use client';

import AdminRoute from '@/components/ProtectedRoute/AdminRoute';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, LogOut, Hexagon, MessageSquare, Users, Star } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: ShoppingBag },
    { name: 'Orders', href: '/admin/orders', icon: Package },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Live Chat', href: '/admin/chat', icon: MessageSquare },
  ];

  return (
    <AdminRoute>
      <div className="min-h-screen bg-[#02040a] flex text-white font-sans">
        
        {/* Sidebar */}
        <aside className="w-64 bg-[#0a0f1c] border-r border-white/5 flex flex-col fixed h-full z-20">
          <div className="p-8 flex items-center gap-3">
            <Hexagon className="text-primary" size={28} />
            <span className="font-serif text-2xl font-bold tracking-[0.2em] text-white">LUXE<span className="text-primary text-xs align-top uppercase tracking-widest ml-1">Admin</span></span>
          </div>

          <nav className="flex-1 px-4 space-y-2 mt-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href}>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    <link.icon size={18} />
                    {link.name}
                  </div>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/5">
            <button 
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all font-medium"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64 min-h-screen bg-gradient-to-br from-[#02040a] to-[#0a0f1c]">
          <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#0a0f1c]/50 backdrop-blur-md sticky top-0 z-10">
            <h1 className="text-xl font-semibold text-gray-200 capitalize">
              {pathname.split('/').pop() === 'admin' ? 'Dashboard Overview' : pathname.split('/').pop()}
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">admin@luxe.com</span>
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 text-primary font-bold">
                A
              </div>
            </div>
          </header>
          
          <div className="p-10">
            {children}
          </div>
        </main>
      </div>
    </AdminRoute>
  );
}
