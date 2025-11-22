'use client';
import ReactMarkdown from 'react-markdown';
import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, RotateCw, Lightbulb } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';

export function ChatbotSection({ subject, body, onEmailChange }) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content:
        "Hi! I'm your AI email assistant. I can help you write better emails. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Proper scroll ref (must be inside ScrollArea viewport)
  const scrollRef = useRef(null);

  const suggestions = [
    'Help me write a email for school PTM for x school',
    'Help me write a professional email for client cold reach to advertise my company',
    'write a professional email for my staff to thanks for the Christmas event arrangements',
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleResetChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content:
          "Hi! I'm your AI email assistant. I can help you write better emails. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setInput('');
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    // Update UI immediately
    setMessages((prev) => [...prev, userMessage]);

    setIsTyping(true);

    try {
      // Build the history correctly (includes NEW message)
      const fullHistory = [
        ...messages.map(({ role, content }) => ({ role, content })),
        { role: 'user', content: input },
      ];

      const response = await fetch('http://localhost:8000/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_message: input,
          history: fullHistory,
          subject,
          body,
        }),
      });

      if (!response.ok) throw new Error('AI generation failed');

      const result = await response.json();

      // Update parent shared subject & body
      onEmailChange(result.subject || '', result.body || '');

      const aiMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `**${result.subject || ''}**\n\n${result.body || ''}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setInput('');
    } catch (err) {
      console.error('Chatbot Error:', err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Sorry, I could not generate a response. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#A8DADC]/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FFE066]/10 rounded-full blur-3xl"></div>

      <div className="relative p-6">
        {/* Header */}
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
              className="bg-[#0D1B2A] text-[#A8DADC] border border-[#A8DADC]/30 hover:bg-[#A8DADC]/10"
            >
              New Chat
            </Button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="h-[400px] pr-4 mb-4">
          <div ref={scrollRef} className="space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
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

                  <div className="flex-1 max-w-[80%]">
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-[#FFE066]/10 border text-[#A8DADC] border-[#FFE066]/20 rounded-tr-sm'
                          : 'bg-[#1B2A3A] border text-[#A8DADC] border-[#A8DADC]/20 rounded-tl-sm'
                      }`}
                    >
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#A8DADC]/20 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-[#A8DADC]" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-[#1B2A3A] border border-[#A8DADC]/20">
                    <span className="text-[#A8DADC]">...</span>
                  </div>
                </div>
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
              {suggestions.map((s, i) => (
                <Button
                  key={i}
                  variant="outline"
                  size="sm"
                  onClick={() => setInput(s)}
                  className="bg-[#1B2A3A]/50 border-[#A8DADC]/20 text-[#A8DADC]"
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about email campaigns..."
            disabled={isTyping}
            className="flex-1 bg-[#1B2A3A] border-[#A8DADC]/30 text-[#F1FAEE]"
          />

          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 text-[#0D1B2A]"
          >
            {isTyping ? <RotateCw className="animate-spin" /> : <Send />}
          </Button>
        </div>

        <div className="mt-3 text-center text-[#A8DADC]/40">
          <Sparkles className="inline w-3 h-3 mr-1" />
          AI responses are simulated.
        </div>
      </div>
    </Card>
  );
}
