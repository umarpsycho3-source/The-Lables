'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react';
import { io } from 'socket.io-client';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import Link from 'next/link';

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const { user, orders } = useAuth();
  const { products } = useProducts();
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  const [isAdminOnline, setIsAdminOnline] = useState(false);
  const [isAgentMode, setIsAgentMode] = useState(false);
  
  const [socket, setSocket] = useState(null);
  
  const messagesEndRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname && pathname.startsWith('/admin')) return;

    // Only connect if the chat is open to save resources, or connect initially to check status
    const newSocket = io('https://the-lables.onrender.com');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('check_admin_status');
    });

    newSocket.on('admin_status', (data) => {
      setIsAdminOnline(data.online);
    });

    newSocket.on('admin_reply', (msg) => {
      setMessages(prev => [...prev, { sender: 'admin', text: msg }]);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Auto-start chat if logged in and widget is opened
  useEffect(() => {
    if (isOpen && user && !chatStarted && socket) {
      setChatStarted(true);
      const userName = user.name || 'User';
      socket.emit('start_chat', { name: userName, email: user.email });
      
      setMessages([
        { sender: 'bot', text: `Hi ${userName}! 👋 I am the LUXE Bot.` },
        { sender: 'bot', text: 'How can we help you today?' },
        { sender: 'bot', isOptions: true }
      ]);
    }
  }, [isOpen, user, chatStarted, socket]);

  // Handle user logout to reset chat
  useEffect(() => {
    if (!user && chatStarted) {
      setChatStarted(false);
      setMessages([]);
      setIsAgentMode(false);
      if (socket) socket.emit('end_chat');
    }
  }, [user, chatStarted, socket]);

  const handleEndChat = () => {
    setChatStarted(false);
    setMessages([]);
    setIsAgentMode(false);
    if (socket) socket.emit('end_chat');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { sender: 'user', text: input }]);
    socket.emit('user_message', input);
    setInput('');
    
    if (!isAgentMode) {
      setTimeout(() => {
        handleBotReply(input);
      }, 1000);
    }
  };

  const handleBotReply = (text) => {
    const lowerText = text.toLowerCase();

    // 1. Direct Agent Request
    if (lowerText.includes('agent') || lowerText.includes('human') || lowerText.includes('support')) {
      requestAgent(false);
      return;
    }

    let reply = "I couldn't quite catch that. You can browse our collections or click 'Talk to an Agent' below!";
    let customRender = null; // Used to optionally push buttons/components to messages

    // 2. Order Tracking
    if (lowerText.includes('track') || lowerText.includes('order')) {
      if (user && orders && orders.length > 0) {
        // Sort orders by most recent
        const sortedOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestOrder = sortedOrders[0];
        reply = `I found your latest order (${latestOrder.id}). Its current status is **${latestOrder.status}**.`;
      } else if (user) {
        reply = "You don't seem to have any orders in your account yet. Let me know if I can help you find something!";
      } else {
        reply = "Please login to track your orders, or provide your Order ID here and I will connect you to an agent!";
      }
    } 
    // 3. Size / Availability
    else if (lowerText.includes('available') || lowerText.includes('stock') || lowerText.includes('size')) {
      reply = "We offer sizes ranging from S to XXL for most jerseys. You can check real-time availability on the specific product page!";
    } 
    // 4. Contact
    else if (lowerText.includes('contact') || lowerText.includes('email') || lowerText.includes('phone') || lowerText.includes('whatsapp')) {
      reply = "You can reach us at thelabel225@gmail.com or via WhatsApp at 0706990579. Alternatively, just click 'Talk to an Agent' here!";
    } 
    // 5. Price / Offers
    else if (lowerText.includes('price') || lowerText.includes('offer') || lowerText.includes('discount')) {
      reply = "Our jerseys are premium player-issue versions. Prices are listed in LKR on each product page. Keep an eye on our 'New Arrivals' for seasonal offers!";
    } 
    // 6. Custom Name Printing
    else if (lowerText.includes('custom') || lowerText.includes('name') || lowerText.includes('print')) {
      reply = "Yes! We offer custom name and number printing. Just select the 'Custom Print' option when adding a jersey to your cart and enter the details.";
    } 
    // 7. Greetings
    else if (lowerText.includes('hello') || lowerText.includes('hi ') || lowerText === 'hi') {
      reply = "Hello! How can I assist you with our jerseys today?";
    }
    // 8. Dynamic Product Search (Fallback)
    else {
      // Look for a product match
      const matchedProducts = products.filter(p => lowerText.includes(p.name.toLowerCase().split(' ')[0]) || lowerText.includes(p.name.toLowerCase().split(' ')[1]));
      
      // Additional explicit check for 'madrid' etc.
      const exactMatches = products.filter(p => lowerText.includes('madrid') && p.name.toLowerCase().includes('madrid') || lowerText.includes('argentina') && p.name.toLowerCase().includes('argentina'));
      
      const finalMatches = exactMatches.length > 0 ? exactMatches : matchedProducts;

      if (finalMatches.length > 0) {
        reply = `I found something that might match your search!`;
        customRender = (
          <div className="flex flex-col gap-2 mt-2">
            {finalMatches.slice(0, 2).map(product => (
              <Link key={product._id} href={`/product/${product._id}`}>
                <div className="flex items-center gap-3 bg-white/5 border border-white/10 hover:border-primary/50 p-2 rounded-lg transition-colors cursor-pointer">
                  <img src={product.image} className="w-10 h-10 object-cover rounded-md" alt={product.name} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-white font-bold truncate">{product.name}</p>
                    <p className="text-xs text-primary font-bold">Rs. {product.price.toLocaleString()}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        );
      }
    }

    setMessages(prev => [...prev, { sender: 'bot', text: reply, customRender }]);
  };

  const requestAgent = (fromButton = true) => {
    setIsAgentMode(true);
    if (fromButton) {
      setMessages(prev => [...prev, { sender: 'user', text: 'Talk to an Agent' }]);
    }
    
    setTimeout(() => {
      if (isAdminOnline) {
        setMessages(prev => [...prev, { sender: 'bot', text: 'An agent will be with you shortly...' }]);
        socket.emit('user_message', '[SYSTEM: Customer requested an Agent]');
      } else {
        setIsAgentMode(false); // Reset so the bot keeps answering
        setMessages(prev => [...prev, { sender: 'bot', text: 'Our agents are not currently available. Please leave a message and we will email you back shortly.' }]);
      }
    }, 500);
  };

  if (pathname && pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-primary text-black rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center justify-center z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageSquare size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[350px] bg-[#0a0f1c] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            style={{ height: '500px', maxHeight: 'calc(100vh - 48px)' }}
          >
            {/* Header */}
            <div className="bg-primary p-4 flex justify-between items-center text-black">
              <div>
                <h3 className="font-bold text-lg flex items-center gap-2">
                  The Label Support
                </h3>
                <p className="text-xs font-medium opacity-80 flex items-center gap-1">
                  {isAdminOnline ? (
                    <><span className="w-2 h-2 rounded-full bg-white animate-pulse" /> Agents Online</>
                  ) : (
                    <><span className="w-2 h-2 rounded-full bg-black/50" /> Agents Offline</>
                  )}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {chatStarted && (
                  <button 
                    onClick={handleEndChat} 
                    className="text-xs bg-black/20 hover:bg-black/40 px-2 py-1 rounded-md transition-colors font-semibold"
                  >
                    End Chat
                  </button>
                )}
                <button onClick={() => setIsOpen(false)} className="hover:bg-black/10 p-1 rounded-lg transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 bg-white/5 overflow-y-auto p-4 custom-scrollbar">
              {!chatStarted ? (
                /* Not Logged In State */
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="space-y-6 h-full flex flex-col justify-center"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary">
                      <User size={32} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-lg">Hey there! 👋</h4>
                      <p className="text-sm text-gray-400 mt-2">Please login to start a conversation with our support team.</p>
                    </div>
                    
                    <Link href="/login" className="block">
                      <button className="w-full bg-primary hover:bg-emerald-500 text-black font-bold py-3 rounded-xl transition-colors mt-4">
                        Login
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ) : (
                /* Chat Messages */
                <div className="space-y-4 flex flex-col">
                  {messages.map((msg, idx) => {
                    if (msg.isOptions) {
                      return !isAgentMode ? (
                        <div key={idx} className="flex flex-col gap-2 pl-10 mt-2">
                          <button onClick={() => requestAgent()} className="text-left text-sm bg-white/5 border border-primary/30 hover:border-primary hover:bg-primary/10 text-white p-2 rounded-lg transition-colors">
                            🙋 Talk to an Agent
                          </button>
                          <button onClick={() => {
                            setMessages(prev => [...prev, { sender: 'user', text: 'Track my Order' }]);
                            setTimeout(() => handleBotReply('track order'), 1000);
                          }} className="text-left text-sm bg-white/5 border border-white/10 hover:border-white/30 text-white p-2 rounded-lg transition-colors">
                            📦 Track my Order
                          </button>
                          <button onClick={() => {
                            setMessages(prev => [...prev, { sender: 'user', text: 'Size availability' }]);
                            setTimeout(() => handleBotReply('size'), 1000);
                          }} className="text-left text-sm bg-white/5 border border-white/10 hover:border-white/30 text-white p-2 rounded-lg transition-colors">
                            👕 Size availability
                          </button>
                          <button onClick={() => {
                            setMessages(prev => [...prev, { sender: 'user', text: 'Custom Name Printing' }]);
                            setTimeout(() => handleBotReply('custom name'), 1000);
                          }} className="text-left text-sm bg-white/5 border border-white/10 hover:border-white/30 text-white p-2 rounded-lg transition-colors">
                            ✨ Custom Name Printing
                          </button>
                          <button onClick={() => {
                            setMessages(prev => [...prev, { sender: 'user', text: 'Contact Info' }]);
                            setTimeout(() => handleBotReply('contact'), 1000);
                          }} className="text-left text-sm bg-white/5 border border-white/10 hover:border-white/30 text-white p-2 rounded-lg transition-colors">
                            📞 Contact Info
                          </button>
                        </div>
                      ) : null;
                    }

                    const isUser = msg.sender === 'user';
                    return (
                      <div key={idx} className={`flex gap-3 max-w-[85%] ${isUser ? 'self-end flex-row-reverse' : 'self-start'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isUser ? 'bg-primary/20 text-primary' : (msg.sender === 'bot' ? 'bg-blue-500/20 text-blue-400' : 'bg-primary text-black')}`}>
                          {isUser ? <User size={14} /> : (msg.sender === 'bot' ? <Bot size={14} /> : <span className="font-bold text-xs">A</span>)}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm ${isUser ? 'bg-primary text-black rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                          {msg.text}
                          {msg.customRender && msg.customRender}
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Area */}
            {chatStarted && (
              <form onSubmit={handleSendMessage} className="p-4 bg-black/50 border-t border-white/5 flex gap-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..." 
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-primary transition-colors"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim()}
                  className="w-10 h-10 bg-primary hover:bg-emerald-500 disabled:opacity-50 disabled:hover:bg-primary text-black rounded-full flex items-center justify-center transition-colors shrink-0"
                >
                  <Send size={16} />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
