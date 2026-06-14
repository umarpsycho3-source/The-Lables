'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Headphones, MessageSquare, HelpCircle, Clock, Shield, MessageCircle, Mail, MapPin, ChevronDown, Phone } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  { question: "What products do you sell?", answer: "We sell premium Player Version football jerseys. These are the exact high-performance, athletic-cut jerseys worn by professionals." },
  { question: "What payment methods do you accept?", answer: "We accept Credit Cards securely via Stripe, Cash on Delivery for eligible regions, and direct Bank Transfers." },
  { question: "How do I receive my product after purchase?", answer: "Your jersey will be securely packaged and shipped via our trusted courier partners. You will receive a tracking link once dispatched." },
  { question: "Do you offer warranties or refunds?", answer: "We offer a 14-day return policy for unwashed, unworn items with original tags. Bank transfer refunds take 3-5 business days." },
  { question: "How do I contact support?", answer: "You can reach us through our Support Chat, WhatsApp community, or by filling out the Get in Touch form below." }
];

export default function SupportPage() {
  const [openFaq, setOpenFaq] = useState(null);
  
  // Contact Form State
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState('idle'); // idle, submitting, success, error

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;
    
    setContactStatus('submitting');
    try {
      const res = await fetch('https://the-lables.onrender.com/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: contactName, email: contactEmail, message: contactMessage })
      });
      if (res.ok) {
        setContactStatus('success');
        setContactName('');
        setContactEmail('');
        setContactMessage('');
        setTimeout(() => setContactStatus('idle'), 3000);
      } else {
        setContactStatus('error');
      }
    } catch (error) {
      console.error('Contact submit error:', error);
      setContactStatus('error');
    }
  };

  const toggleFaq = (index) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-20">
        
        {/* Header Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-2">
            <Headphones className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-serif">
            Support & <span className="text-primary">Contact</span>
          </h1>
          <p className="text-secondary max-w-lg mx-auto">
            Need help? We're here for you. Choose your preferred support channel or send us a message.
          </p>
        </div>

        {/* Support Channel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-2">
              <Headphones className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">LUXE Support Chat</h3>
            <p className="text-sm text-secondary flex-1">Chat with us directly on WhatsApp</p>
            <Link href="https://wa.me/94706990579" target="_blank" className="mt-4 px-6 py-2 border border-white/10 hover:border-primary text-white rounded-full text-sm font-bold transition-all w-full">
              Open Chat
            </Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-2">
              <MessageSquare className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">WhatsApp Community</h3>
            <p className="text-sm text-secondary flex-1">Get help from our community and support team</p>
            <Link href="https://wa.me/94706990579" target="_blank" className="mt-4 px-6 py-2 border border-white/10 hover:border-primary text-white rounded-full text-sm font-bold transition-all w-full">
              Join WhatsApp
            </Link>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center gap-4 hover:border-primary/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-2">
              <HelpCircle className="text-primary" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white">FAQs</h3>
            <p className="text-sm text-secondary flex-1">Find answers to commonly asked questions</p>
            <button onClick={() => document.getElementById('faqs').scrollIntoView({ behavior: 'smooth' })} className="mt-4 px-6 py-2 border border-white/10 hover:border-primary text-white rounded-full text-sm font-bold transition-all w-full">
              View FAQs
            </button>
          </div>
        </div>

        {/* Features Row */}
        <div className="flex flex-col md:flex-row gap-6 border-y border-white/5 py-10">
          <div className="flex-1 flex gap-4">
            <Clock className="text-primary shrink-0" size={24} />
            <div>
              <h4 className="text-white font-bold mb-1">24/7 Availability</h4>
              <p className="text-xs text-secondary">Our WhatsApp support is available around the clock</p>
            </div>
          </div>
          <div className="flex-1 flex gap-4">
            <MessageCircle className="text-primary shrink-0" size={24} />
            <div>
              <h4 className="text-white font-bold mb-1">Quick Response</h4>
              <p className="text-xs text-secondary">We typically respond within 24 hours</p>
            </div>
          </div>
          <div className="flex-1 flex gap-4">
            <Shield className="text-primary shrink-0" size={24} />
            <div>
              <h4 className="text-white font-bold mb-1">Secure Support</h4>
              <p className="text-xs text-secondary">Your information is always protected</p>
            </div>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="space-y-10">
          <h2 className="text-3xl font-bold text-center font-serif">Get in <span className="text-primary">Touch</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="text-primary" size={24} />
                <h3 className="text-xl font-bold text-white">Suggest or Offer a Product</h3>
              </div>
              <p className="text-sm text-secondary mb-8">
                Have a product idea or want to offer something for our store? We'd love to hear from you!
              </p>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-white mb-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="Your name" 
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-white mb-2">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none" 
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white mb-2">Product Description</label>
                  <textarea 
                    rows="4" 
                    placeholder="Describe the product..." 
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white focus:border-primary outline-none resize-none"
                  ></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={contactStatus === 'submitting'}
                  className={`w-full py-3 rounded-xl font-bold transition-colors ${
                    contactStatus === 'success' ? 'bg-green-500 text-white' : 
                    contactStatus === 'error' ? 'bg-red-500 text-white' : 
                    'bg-primary hover:bg-emerald-500 text-black'
                  }`}
                >
                  {contactStatus === 'submitting' ? 'Sending...' : 
                   contactStatus === 'success' ? 'Sent Successfully!' : 
                   contactStatus === 'error' ? 'Error - Try Again' : 
                   'Submit Suggestion'}
                </button>
              </form>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white">Contact Information</h3>
              <p className="text-sm text-secondary">
                Feel free to reach out to us through any of the following channels. We're always happy to help!
              </p>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center">
                    <Mail className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Email</h4>
                    <p className="text-xs text-secondary">thelabel225@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center">
                    <Phone className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Phone & WhatsApp</h4>
                    <p className="text-xs text-secondary">070 699 0579</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                  <div className="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center">
                    <MapPin className="text-primary" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Location</h4>
                    <p className="text-xs text-secondary">Sri Lanka</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mt-6">
                <h4 className="text-white font-bold mb-2">Response Time</h4>
                <p className="text-sm text-secondary">
                  We typically respond to all inquiries within 24 hours. For urgent matters, please reach out via WhatsApp for faster support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQs */}
        <div id="faqs" className="space-y-10 pt-10">
          <h2 className="text-3xl font-bold text-center font-serif">Frequently Asked <span className="text-primary">Questions</span></h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(idx)} 
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <span className="font-bold text-white">{faq.question}</span>
                  <motion.div animate={{ rotate: openFaq === idx ? 180 : 0 }}>
                    <ChevronDown className="text-secondary" size={20} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === idx && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-6 pb-6"
                    >
                      <p className="text-secondary text-sm leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
