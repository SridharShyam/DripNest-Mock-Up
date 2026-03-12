'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

interface Message {
  role: 'assistant' | 'user';
  content: string;
  products?: any[];
}

export function AIStylist() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Welcome to DripNest. I'm your personal AI Stylist. Looking for a specific vibe or help with an outfit today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(async () => {
      let response: Message = { role: 'assistant', content: '' };
      
      const lowerInput = userMsg.toLowerCase();
      
      if (lowerInput.includes('jacket') || lowerInput.includes('outerwear')) {
        response.content = "Great choice! For the current season, I highly recommend our Utility Bomber or the Classic Trench. They're trending heavily right now. Here are some top picks:";
        // Fetch some products (simulated)
        const products = await fetch('/api/products/search?q=jacket').then(res => res.json());
        response.products = products.slice(0, 2);
      } else if (lowerInput.includes('sale') || lowerInput.includes('cheap') || lowerInput.includes('offer')) {
        response.content = "Everyone loves a good deal! We have an ongoing flash sale with up to 50% off. Check out these steals:";
        const products = await fetch('/api/products/search?q=sale').then(res => res.json());
        response.products = products.slice(0, 2);
      } else if (lowerInput.includes('suit') || lowerInput.includes('formal')) {
        response.content = "Stepping up the game? Our tailored essentials collection is perfect for that sharp, polished look. Consider these:";
        const products = await fetch('/api/products/search?q=shirt').then(res => res.json());
        response.products = products.slice(0, 2);
      } else {
        response.content = "That sounds interesting! To give you the best advice, could you tell me a bit more about the occasion? Or perhaps a specific colour you're vibing with?";
      }

      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-[60] w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-2xl border-4 border-violet group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-violet/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <Sparkles className="w-8 h-8 text-violet group-hover:animate-pulse" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 100, scale: 0.9, x: 20 }}
            className="fixed bottom-8 right-8 z-[70] w-[90vw] md:w-[400px] h-[600px] bg-white rounded-2xl shadow-[0_32px_128px_-16px_rgba(0,0,0,0.3)] border border-neutral-100 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg leading-tight">AI Stylist</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green rounded-full animate-pulse" />
                    <span className="text-[10px] uppercase font-black tracking-widest text-neutral-400">Online & Ready</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 bg-mist/30 miniscroll"
            >
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-violet text-white rounded-tr-none shadow-lg' 
                      : 'bg-white text-black border border-neutral-100 rounded-tl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                  
                  {msg.products && (
                    <div className="grid grid-cols-1 gap-3 mt-4 w-full">
                      {msg.products.map((p) => {
                        const imgs = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
                        return (
                          <div key={p.id} className="bg-white border border-neutral-100 p-3 rounded-xl flex gap-3 hover:shadow-md transition-shadow">
                            <div className="relative w-16 h-20 flex-shrink-0 bg-mist rounded-lg overflow-hidden">
                              <Image src={imgs[0]} alt={p.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-center min-w-0">
                               <p className="font-bold text-xs truncate">{p.name}</p>
                               <p className="text-violet font-black text-sm">{formatPrice(p.price)}</p>
                               <Link href={`/shop/${p.slug}`} className="mt-1 inline-flex items-center gap-1 text-[10px] font-black uppercase text-neutral-400 hover:text-black">
                                 View Item <ArrowRight className="w-3 h-3" />
                               </Link>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-1.5 p-4 bg-white border border-neutral-100 rounded-2xl rounded-tl-none w-16">
                  <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 bg-neutral-300 rounded-full animate-bounce" />
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-neutral-100">
               <div className="relative flex items-center">
                  <input 
                    type="text"
                    placeholder="Ask me anything style related..."
                    className="w-full bg-mist border-0 rounded-full py-4 pl-6 pr-14 text-sm font-medium focus:ring-2 focus:ring-violet/20 transition-all"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="absolute right-2 p-3 bg-black text-white rounded-full disabled:opacity-30 hover:bg-violet transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
               </div>
               <div className="flex justify-center gap-4 mt-3">
                 <button onClick={() => setInput('Trending jackets')} className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-violet underline underline-offset-4">Jacket Inspo</button>
                 <button onClick={() => setInput('What is on sale?')} className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-violet underline underline-offset-4">Best Deals</button>
                 <button onClick={() => setInput('Formal recommendations')} className="text-[9px] font-black uppercase tracking-widest text-neutral-400 hover:text-violet underline underline-offset-4">Formal Wear</button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
