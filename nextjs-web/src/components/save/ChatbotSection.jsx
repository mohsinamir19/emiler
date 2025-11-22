'use client';
import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RotateCw, Lightbulb } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { motion, AnimatePresence } from 'motion/react';

export function ChatbotSection() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI email assistant. I can help you write better emails. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef(null);

  const suggestions = [
    "Help me write a  email for school PTM for x school",
    "Help me write a professional email for client cold reach to advertise my company",
    " write a professional email for my staff to thanks for the cgristmas evet arrangments",
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);


  const handleResetChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: "Hi! I'm your AI email assistant. I can help you write better emails. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setInput('');
  };

  const handleSend = async () => {
    try {
      const response = await fetch("http://localhost:8000/generate-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_message: input,
          history: messages.map(({ role, content }) => ({ role, content })),
        }),
      });

      if (!response.ok) throw new Error("AI generation failed");

      const result = await response.json();

      const aiMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: `**${result.subject}**\n\n${result.body}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setInput(''); // ✅ This clears the input box
      setIsTyping(true);

    } catch (error) {
      console.error("AI error:", error);
      const errorMessage = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Sorry, I couldn't generate a response. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
      {/* Glow effect */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#A8DADC]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FFE066]/10 rounded-full blur-3xl"></div>

      <div className="relative p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gradient-to-br from-[#A8DADC] to-[#A8DADC]/70 rounded-lg">
            <Bot className="w-5 h-5 text-[#0D1B2A]" />
          </div>
          <div>
            <h2 className="text-[#F1FAEE]">AI Assistant</h2>
            <p className="text-[#A8DADC]/70">Ask me anything about email campaigns</p>
          </div>
          <div className="ml-auto">

            <Button
              onClick={handleResetChat}
              className="bg-[#0D1B2A] text-[#A8DADC] border border-[#A8DADC]/30 hover:bg-[#A8DADC]/10 transition-all"
            >
              New Chat
            </Button>


          </div>
        </div>

        {/* Chat Messages */}
        <ScrollArea className="h-[400px] pr-4 mb-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.role === 'user'
                      ? 'bg-[#FFE066]/20'
                      : 'bg-[#A8DADC]/20'
                      }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-[#FFE066]" />
                    ) : (
                      <Bot className="w-4 h-4 text-[#A8DADC]" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'
                      }`}
                  >
                    <div
                      className={`px-4 py-3 rounded-2xl ${message.role === 'user'
                        ? 'bg-[#FFE066]/10 border border-[#FFE066]/20 rounded-tr-sm'
                        : 'bg-[#1B2A3A] border border-[#A8DADC]/20 rounded-tl-sm'
                        }`}
                    >



                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className={message.role === 'user' ? 'text-[#F1FAEE]' : 'text-[#F1FAEE]/90'}>
                              {children}
                            </p>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold text-[#FFE066]">{children}</strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc list-inside text-[#F1FAEE]/80">{children}</ul>
                          ),
                          li: ({ children }) => (
                            <li className="ml-4">{children}</li>
                          ),
                          a: ({ href, children }) => (
                            <a href={href} className="text-[#A8DADC] underline hover:text-[#F1FAEE]">
                              {children}
                            </a>
                          ),
                        }}
                      >
                        {message.content || ''}
                      </ReactMarkdown>
                    </div>
                    <span className="text-[#A8DADC]/40 px-4 mt-1 block">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#A8DADC]/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#A8DADC]" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-[#1B2A3A] border border-[#A8DADC]/20 rounded-tl-sm">
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-[#A8DADC] rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[#A8DADC] rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-[#A8DADC] rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-[#FFE066]" />
              <span className="text-[#A8DADC]/70">Quick suggestions:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="bg-[#1B2A3A]/50 border-[#A8DADC]/20 text-[#A8DADC] hover:bg-[#A8DADC]/10 hover:border-[#A8DADC]/40 transition-all"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about email campaigns..."
            className="flex-1 bg-[#1B2A3A] border-[#A8DADC]/30 text-[#F1FAEE] placeholder:text-[#A8DADC]/40 focus:border-[#A8DADC] focus:ring-[#A8DADC]/20"
            disabled={isTyping}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 hover:from-[#A8DADC]/90 hover:to-[#A8DADC]/70 text-[#0D1B2A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isTyping ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* AI Integration Note */}
        <div className="mt-3 text-center text-[#A8DADC]/40">
          <span className="flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3" />
            AI responses are simulated. Integrate OpenAI API for real conversations.
          </span>
        </div>
      </div>
    </Card>
  );
}
