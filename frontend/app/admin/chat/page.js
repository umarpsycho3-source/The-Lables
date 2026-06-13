'use client';

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { motion } from 'framer-motion';
import { Send, User, MessageSquare } from 'lucide-react';

export default function AdminLiveChat() {
  const [socket, setSocket] = useState(null);
  const [activeChats, setActiveChats] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [input, setInput] = useState('');
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io('https://the-lables.onrender.com');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('admin_login');
    });

    newSocket.on('all_active_chats', (chats) => {
      setActiveChats(chats);
    });

    newSocket.on('new_chat', (chat) => {
      setActiveChats(prev => [...prev, chat]);
    });

    newSocket.on('user_message', (data) => {
      setActiveChats(prev => prev.map(chat => {
        if (chat.id === data.socketId) {
          return { ...chat, messages: [...chat.messages, data.message] };
        }
        return chat;
      }));
    });

    newSocket.on('chat_ended', (socketId) => {
      setActiveChats(prev => prev.filter(c => c.id !== socketId));
      if (selectedChatId === socketId) {
        setSelectedChatId(null);
      }
    });

    return () => newSocket.close();
  }, [selectedChatId]);

  const selectedChat = activeChats.find(c => c.id === selectedChatId);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChat?.messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !selectedChatId) return;

    const messageObj = { sender: 'admin', text: input, time: new Date() };

    // Optimistically add to UI
    setActiveChats(prev => prev.map(chat => {
      if (chat.id === selectedChatId) {
        return { ...chat, messages: [...chat.messages, messageObj] };
      }
      return chat;
    }));

    socket.emit('admin_message', { targetSocketId: selectedChatId, msg: input });
    setInput('');
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex gap-6">
      {/* Sidebar - Active Chats */}
      <div className="w-80 bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-black/20">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare size={20} className="text-primary" /> Active Chats ({activeChats.length})
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
          {activeChats.length === 0 ? (
            <p className="text-sm text-gray-500 text-center p-4">No active chats right now.</p>
          ) : (
            activeChats.map(chat => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full text-left p-4 rounded-xl transition-colors border ${selectedChatId === chat.id ? 'bg-primary/10 border-primary' : 'bg-transparent border-transparent hover:bg-white/5 hover:border-white/10'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-bold text-white text-sm truncate">{chat.name}</span>
                  {chat.messages.length > 0 && (
                    <span className="text-xs bg-primary text-black px-2 py-0.5 rounded-full font-bold">
                      {chat.messages.length}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {chat.email || 'No email provided'}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex flex-col overflow-hidden relative">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 bg-black/20 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-white">{selectedChat.name}</h3>
                <p className="text-xs text-gray-400">{selectedChat.email || 'Guest'}</p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {selectedChat.messages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                  Customer hasn't sent a message yet.
                </div>
              ) : (
                selectedChat.messages.map((msg, idx) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div key={idx} className={`flex gap-3 max-w-[70%] ${isAdmin ? 'self-end flex-row-reverse ml-auto' : 'self-start'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isAdmin ? 'bg-primary text-black' : 'bg-white/10 text-white'}`}>
                        {isAdmin ? <span className="font-bold text-xs">You</span> : <User size={14} />}
                      </div>
                      <div className={`p-4 rounded-2xl text-sm ${isAdmin ? 'bg-primary text-black rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                        {msg.text}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-black/20 flex gap-4">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type your reply to the customer..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              />
              <button 
                type="submit"
                disabled={!input.trim()}
                className="bg-primary hover:bg-emerald-500 text-black px-6 rounded-xl font-bold transition-colors disabled:opacity-50 disabled:hover:bg-primary flex items-center gap-2"
              >
                Send <Send size={16} />
              </button>
            </form>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-500">
            <MessageSquare size={48} className="mb-4 opacity-20" />
            <p>Select a chat from the sidebar to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
