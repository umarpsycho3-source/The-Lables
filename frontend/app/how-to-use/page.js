import { ShoppingBag, CreditCard, UserCircle, Truck } from 'lucide-react';
import Link from 'next/link';

export default function HowToUsePage() {
  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="container mx-auto max-w-4xl text-white space-y-8">
        <h1 className="serif text-4xl md:text-5xl font-bold text-center mb-12">How To <span className="text-primary italic">Use</span></h1>
        
        <p className="text-center text-secondary text-lg max-w-2xl mx-auto mb-16">
          Welcome to The Label. Here is a quick guide on how to browse, purchase, and track your premium orders.
        </p>

        <div className="space-y-12">
          
          {/* Step 1 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <ShoppingBag size={32} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">1. Browse and Add to Cart</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Explore our collections of premium Player Issue jerseys. Once you find an item you love, select your preferred size and click "Add to Cart". You can view your cart at any time by clicking the shopping bag icon in the top navigation bar.
              </p>
              <Link href="/collections" className="text-primary hover:underline font-semibold text-sm">Browse Collections &rarr;</Link>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <CreditCard size={32} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">2. Secure Checkout</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Proceed to checkout from your cart. You will need to create an account or log in to complete your purchase. Enter your shipping details and select your preferred payment method: Cash on Delivery or Bank Transfer. If you choose Bank Transfer, you will need to upload a screenshot of the receipt.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <UserCircle size={32} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">3. Tracking Your Order</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Once your order is placed, it will be marked as "Under Review". You can track the live status of all your orders by visiting your Account Dashboard and clicking on the "Orders" tab. You will also receive notifications when your order ships.
              </p>
              <Link href="/account/orders" className="text-primary hover:underline font-semibold text-sm">View Your Orders &rarr;</Link>
            </div>
          </div>

          {/* Step 4 */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-16 h-16 shrink-0 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
              <Truck size={32} className="text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-3">4. Delivery and Reviews</h2>
              <p className="text-gray-400 leading-relaxed mb-4">
                Your order will be delivered nationwide within 3-5 business days. Once you receive your item, your order status will update to "Delivered". After delivery, you can leave a review on the product page to share your experience with other fans!
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
