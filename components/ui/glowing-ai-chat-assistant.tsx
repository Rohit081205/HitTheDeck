"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Mic, Send, Info, X, Sparkles, User } from 'lucide-react';
import { CapIcon } from './cap-icon';
import { cn } from "@/lib/utils";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface FloatingAiAssistantProps {
  onSend?: (message: string) => void;
  loading?: boolean;
  groundName?: string;
  messages?: Message[];
}

const FloatingAiAssistant = ({ onSend, loading, groundName, messages = [] }: FloatingAiAssistantProps) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 2000;
  const chatRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    setCharCount(value.length);
  };

  const handleSend = () => {
    if (message.trim() && onSend) {
      onSend(message);
      setMessage('');
      setCharCount(0);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        const target = event.target as HTMLElement;
        if (!target.closest('.floating-ai-button')) {
          setIsChatOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        className={cn(
          "floating-ai-button relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 transform shadow-2xl overflow-visible",
          isChatOpen ? 'rotate-90' : 'rotate-0'
        )}
        onClick={() => setIsChatOpen(!isChatOpen)}
        style={{
          background: 'linear-gradient(135deg, #115e59 0%, #0d9488 100%)',
          boxShadow: '0 0 20px rgba(45, 212, 191, 0.4), 0 0 40px rgba(20, 184, 166, 0.2)',
          border: '2px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-30"></div>
        <div className="absolute inset-0 rounded-full border-2 border-white/5"></div>
        
        <div className="relative z-10">
          { isChatOpen ? <X className="text-white" /> : <CapIcon className="w-8 h-8 text-zinc-50" />}
        </div>
        
        {!isChatOpen && (
          <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-teal-400"></div>
        )}
      </button>

      {/* Chat Interface */}
      {isChatOpen && (
        <div 
          ref={chatRef}
          className="absolute bottom-20 right-0 w-[90vw] max-w-[440px] transition-all duration-300 origin-bottom-right"
          style={{
            animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
          }}
        >
          <div className="relative flex flex-col rounded-[2.5rem] bg-zinc-900/95 border border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)] backdrop-blur-2xl overflow-hidden min-h-[500px] max-h-[70vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-20">
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"></div>
                  <span className="text-sm font-bold text-zinc-50 uppercase tracking-widest">Scout Assistant</span>
                </div>
                {groundName && (
                  <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.15em] mt-1 italic">
                    Analyzing {groundName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 rounded-full hover:bg-white/5 transition-colors text-zinc-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Message Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
            >
              {messages.length === 0 && !loading && (
                <div className="h-full flex flex-col items-center justify-center text-center px-10">
                   <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center mb-4 border border-teal-500/20">
                      <CapIcon className="text-teal-400 w-6 h-6" />
                   </div>
                   <p className="text-sm font-bold text-zinc-50 uppercase tracking-widest mb-2">Systems Ready</p>
                   <p className="text-xs text-zinc-500 leading-relaxed font-medium">Ask about toss strategy, weather impact, or specific match behavior for this venue.</p>
                </div>
              )}

              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1.5 px-2">
                    {msg.role === 'assistant' ? (
                      <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">AI Scout</span>
                    ) : (
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">You</span>
                    )}
                  </div>
                  <div className={cn(
                    "p-4 rounded-2xl text-[13px] font-medium leading-[1.6] shadow-sm animate-in fade-in slide-in-from-bottom-2",
                    msg.role === 'user' 
                      ? "bg-zinc-800 text-zinc-50 rounded-tr-none border border-white/5" 
                      : "bg-teal-500/10 text-zinc-200 rounded-tl-none border border-teal-500/20"
                  )}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex flex-col items-start max-w-[85%] animate-pulse">
                  <div className="flex items-center gap-2 mb-1.5 px-2">
                    <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest">AI Scout is thinking...</span>
                  </div>
                  <div className="bg-teal-500/5 border border-teal-500/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-teal-500/40 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-teal-500/40 rounded-full animate-bounce [animation-delay:150ms]" />
                    <div className="w-1.5 h-1.5 bg-teal-500/40 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input Section */}
            <div className="p-6 bg-zinc-900/80 backdrop-blur-md border-t border-white/5 sticky bottom-0">
              <div className="relative group bg-zinc-800/50 rounded-3xl border border-white/10 p-2 transition-all focus-within:border-teal-500/50">
                <textarea
                  value={message}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  className="w-full px-4 py-3 bg-transparent border-none outline-none resize-none text-sm font-medium leading-relaxed max-h-[120px] text-zinc-100 placeholder-zinc-600 overflow-y-auto"
                  placeholder="Type your query..."
                />
                
                <div className="flex items-center justify-between px-2 pb-2">
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] font-bold text-zinc-700 tracking-widest px-2">
                      {charCount}/{maxChars}
                    </span>
                  </div>

                  <button 
                    onClick={handleSend}
                    disabled={loading || !message.trim()}
                    className={cn(
                      "p-3 rounded-2xl transition-all duration-300 shadow-xl flex items-center justify-center",
                      loading || !message.trim() 
                        ? "bg-zinc-800 text-zinc-700 grayscale cursor-not-allowed" 
                        : "bg-teal-400 text-zinc-950 hover:scale-105 active:scale-95"
                    )}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
              

            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.9) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .floating-ai-button:hover {
          transform: translateY(-4px) scale(1.05);
          box-shadow: 0 0 30px rgba(45, 212, 191, 0.6);
        }
      `}</style>
    </div>
  );
};

export {FloatingAiAssistant};
