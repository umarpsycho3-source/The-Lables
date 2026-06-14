'use client';

import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, CreditCard, Lock, ShieldCheck, Upload, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { useCurrency } from '@/context/CurrencyContext';

export default function CheckoutPage() {
  const { cartItems, cartTotal, clearCart, checkout } = useCart();
  const { formatPrice } = useCurrency();
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  
  // Payment State
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [receiptImage, setReceiptImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Generate a random reference code for bank transfers
  const [bankRefCode] = useState(() => `LUXE-REF-${Math.floor(Math.random() * 1000000)}`);

  const handleCheckout = async (e) => {
    e.preventDefault();

    // Validation
    if (!firstName || !lastName || !email || !address) {
      alert("Please fill in all shipping information.");
      return;
    }

    if (!email.toLowerCase().endsWith('@gmail.com')) {
      alert("Only @gmail.com addresses are allowed for security.");
      return;
    }

    const cleanPhone = phone.replace(/\s+/g, '').replace(/[-()]/g, '');
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(cleanPhone)) {
      alert("Please enter a valid phone number (e.g., +15550000000).");
      return;
    }

    if (paymentMethod === 'bank_transfer' && !receiptImage) {
      alert("Please upload your bank transfer receipt to complete the order.");
      return;
    }

    setIsProcessing(true);
    
    const shippingDetails = { firstName, lastName, email, phone, address };
    const result = await checkout(
      paymentMethod, 
      paymentMethod === 'bank_transfer' ? bankRefCode : null, 
      paymentMethod === 'bank_transfer' ? receiptImage : null,
      shippingDetails
    );
    
    if (result && result.id) {
      setIsProcessing(false);
      setCompletedOrderId(result.id);
    } else {
      setIsProcessing(false);
      alert("Checkout failed. Please ensure you are logged in.");
    }
  };

  if (completedOrderId) {
    return (
      <div className="min-h-screen bg-background pt-32 px-6 flex flex-col items-center justify-center text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-16 max-w-2xl w-full backdrop-blur-md relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-emerald-400 to-gold" />
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <ShieldCheck size={40} className="text-primary" />
          </div>
          <h2 className="serif text-4xl font-bold mb-4 text-white drop-shadow-md">Payment Successful</h2>
          <p className="text-secondary mb-8 text-lg">Thank you for your exquisite purchase. Your order #{completedOrderId} is being prepared.</p>
          <Link href="/account/orders">
            <button className="floating-btn">View Orders</button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 px-6 pb-20">
      <div className="container mx-auto max-w-6xl">
        <Link href="/cart" className="inline-flex items-center gap-2 text-secondary hover:text-white transition-colors mb-8">
          <ArrowLeft size={16} /> Return to Cart
        </Link>
        
        <h1 className="serif text-4xl md:text-5xl font-bold mb-12">Secure <span className="text-primary italic">Checkout</span></h1>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Checkout Form */}
          <div className="flex-1 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md"
            >
              <h3 className="serif text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock size={20} className="text-primary" /> Shipping Information
              </h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-secondary mb-2 uppercase tracking-widest">First Name *</label>
                    <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" placeholder="James" />
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-2 uppercase tracking-widest">Last Name *</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} required className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" placeholder="Bond" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-secondary mb-2 uppercase tracking-widest">Email Address *</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" placeholder="007@mi6.gov.uk" />
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-2 uppercase tracking-widest">Phone Number (Optional)</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-2 uppercase tracking-widest">Shipping Address *</label>
                  <input type="text" value={address} onChange={e => setAddress(e.target.value)} required className="w-full bg-background/50 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-primary transition-colors" placeholder="123 Savile Row, London" />
                </div>
              </form>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md"
            >
              <h3 className="serif text-2xl font-bold mb-6 flex items-center gap-2">
                <CreditCard size={20} className="text-gold" /> Payment Details
              </h3>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <label className={`flex-1 flex items-center gap-2 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'cash_on_delivery' ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/30'}`}>
                  <input type="radio" name="payment" value="cash_on_delivery" checked={paymentMethod === 'cash_on_delivery'} onChange={() => setPaymentMethod('cash_on_delivery')} className="hidden" />
                  <span className={`font-semibold ${paymentMethod === 'cash_on_delivery' ? 'text-primary' : 'text-gray-400'}`}>Cash on Delivery</span>
                </label>
                <label className={`flex-1 flex items-center gap-2 p-4 rounded-xl border cursor-pointer transition-colors ${paymentMethod === 'bank_transfer' ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-white/30'}`}>
                  <input type="radio" name="payment" value="bank_transfer" checked={paymentMethod === 'bank_transfer'} onChange={() => setPaymentMethod('bank_transfer')} className="hidden" />
                  <span className={`font-semibold ${paymentMethod === 'bank_transfer' ? 'text-primary' : 'text-gray-400'}`}>Bank Transfer</span>
                </label>
              </div>

              {paymentMethod === 'cash_on_delivery' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-xl">
                  <p className="text-emerald-400 font-medium text-center">You will pay in cash when the order is delivered to your address. No extra fees applied.</p>
                </div>
              )}

              {paymentMethod === 'bank_transfer' && (
                <div className="bg-gold/10 border border-gold/20 p-6 rounded-xl space-y-4">
                  <p className="text-gold font-medium">Please transfer the total amount to the following bank account. Your order will not ship until the funds have cleared in our account.</p>
                  <div className="bg-black/50 p-4 rounded-lg font-mono text-sm space-y-2">
                    <p className="text-gray-400">Bank Name: <span className="text-white">Luxe Global Bank</span></p>
                    <p className="text-gray-400">Account Name: <span className="text-white">LUXE APPAREL LTD</span></p>
                    <p className="text-gray-400">Account Number: <span className="text-white">1234-5678-9012</span></p>
                  </div>
                  <div className="border-t border-gold/20 pt-4">
                    <p className="text-sm text-gold mb-1 uppercase tracking-widest">IMPORTANT: Use this Reference Code in your transfer:</p>
                    <p className="text-2xl font-bold text-white tracking-wider">{bankRefCode}</p>
                  </div>
                  <div className="border-t border-gold/20 pt-4">
                    <p className="text-sm text-gold mb-2 uppercase tracking-widest">Upload Transfer Receipt *</p>
                    <div className="flex items-center gap-4">
                      <label className="cursor-pointer bg-white/5 border border-white/20 hover:border-gold px-4 py-2 rounded-lg flex items-center gap-2 text-sm text-white transition-colors">
                        <Upload size={16} />
                        {isUploading ? 'Uploading...' : 'Choose Image'}
                        <input 
                          type="file" 
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            setIsUploading(true);
                            const formData = new FormData();
                            formData.append('images', file);
                            try {
                              const token = localStorage.getItem('luxe_token');
                              const res = await fetch('https://the-lables.onrender.com/api/upload', {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` },
                                body: formData
                              });
                              if (res.ok) {
                                const data = await res.json();
                                setReceiptImage(data.urls[0]);
                              } else {
                                alert('Failed to upload receipt.');
                              }
                            } catch (err) {
                              console.error(err);
                              alert('Error uploading receipt.');
                            } finally {
                              setIsUploading(false);
                            }
                          }}
                          disabled={isUploading}
                        />
                      </label>
                      {receiptImage && <span className="text-emerald-400 flex items-center gap-1 text-sm"><CheckCircle2 size={16} /> Uploaded</span>}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-96 shrink-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-md sticky top-32"
            >
              <h3 className="serif text-2xl font-bold mb-6">In Your Bag</h3>
              
              <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="flex gap-4">
                    <div className="w-20 h-20 relative rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-white text-sm">{item.name}</h4>
                          <p className="text-secondary text-xs">{item.category}</p>
                          {item.selectedSize && (
                            <p className="text-white/60 text-xs mt-1">Size: <span className="font-semibold text-white">{item.selectedSize}</span></p>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          {item.isOffer ? (
                            <>
                              <span className="text-sm font-bold text-gold">{formatPrice(item.offerPrice)}</span>
                              <span className="text-xs text-gray-500 line-through">{formatPrice(item.price)}</span>
                            </>
                          ) : (
                            <span className="text-sm font-bold text-gold">{formatPrice(item.price)}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-secondary mt-1">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t border-white/10 pt-6 mb-8 space-y-4">
                <div className="flex justify-between text-secondary">
                  <span>Subtotal</span>
                  <span className="text-white">{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-secondary">
                  <span>Shipping</span>
                  <span className="text-white">Complimentary</span>
                </div>
                <div className="flex justify-between text-lg font-medium pt-4 border-t border-white/10">
                  <span>Total</span>
                  <span className="text-3xl font-bold text-gold">{formatPrice(cartTotal)}</span>
                </div>
              </div>
              
              <button 
                onClick={handleCheckout}
                disabled={isProcessing}
                className="floating-btn w-full flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  />
                ) : (
                  <>Complete Purchase <ShieldCheck size={18} /></>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
