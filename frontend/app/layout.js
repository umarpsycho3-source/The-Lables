import './globals.css';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import FloatingSocials from '@/components/FloatingSocials/FloatingSocials';
import { ThemeProvider } from '@/components/ThemeProvider/ThemeProvider';
import LiveChat from '@/components/LiveChat';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { Cinzel, Montserrat } from 'next/font/google';

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });

export const metadata = {
  title: 'The Label | High-End Apparel & Perfumes',
  description: 'Experience the pinnacle of fashion and fragrance with The Label. Discover authentic player-version football jerseys and premium perfumes.',
  keywords: ['Premium Jerseys', 'Player Version Kits', 'Football Shirts', 'Luxury Perfumes', 'The Label'],
  authors: [{ name: 'The Label' }],
  creator: 'The Label',
  openGraph: {
    title: 'The Label | High-End Apparel & Perfumes',
    description: 'Experience the pinnacle of fashion and fragrance with The Label. Discover authentic player-version football jerseys and premium perfumes.',
    url: 'https://thelabel.com',
    siteName: 'The Label',
    images: [
      {
        url: '/og-image.jpg', // You can add an actual image later
        width: 1200,
        height: 630,
        alt: 'The Label Premium Apparel',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Label | Premium Apparel',
    description: 'Discover authentic player-version football jerseys and premium perfumes.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${cinzel.variable} ${montserrat.variable}`}>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
          <ProductProvider>
            <AuthProvider>
              <WishlistProvider>
                <CurrencyProvider>
                  <CartProvider>
                    <Navbar />
                    <FloatingSocials />
                    <LiveChat />
                    <main className="min-h-screen">{children}</main>
                    <Footer />
                  </CartProvider>
                </CurrencyProvider>
              </WishlistProvider>
            </AuthProvider>
          </ProductProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
