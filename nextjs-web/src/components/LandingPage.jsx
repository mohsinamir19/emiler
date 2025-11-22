'use client';

import { motion } from 'motion/react';
import { Sparkles, Mail, Zap, Users, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { AnimatedBackground } from './AnimatedBackground';

export function LandingPage({ onGetStarted }) {
  return (
    <div className="min-h-screen bg-[#0D1B2A] text-[#F1FAEE] relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Hero Section */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
                className="p-3 bg-gradient-to-br from-[#A8DADC] via-[#A8DADC]/90 to-[#A8DADC]/70 rounded-2xl shadow-2xl shadow-[#A8DADC]/30"
              >
                <Sparkles className="w-10 h-10 text-[#0D1B2A]" />
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-[#F1FAEE] mb-4"
            >
              AI-Powered Email Campaigns
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-[#A8DADC]/80 max-w-2xl mx-auto mb-8"
            >
              Create, personalize, and send professional email campaigns with the power of AI.
              Simple enough for beginners, powerful enough for professionals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Button
                onClick={onGetStarted}
                className="bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 hover:from-[#A8DADC]/90 hover:to-[#A8DADC]/70 text-[#0D1B2A] px-8 py-6 text-lg group transition-all shadow-lg shadow-[#A8DADC]/20 hover:shadow-xl hover:shadow-[#A8DADC]/30"
              >
                Get Started
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-20"
          >
            {/* Feature 1 */}
            <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 p-6 hover:border-[#A8DADC]/40 transition-all group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#A8DADC]/10 rounded-full blur-2xl group-hover:bg-[#A8DADC]/20 transition-all"></div>
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-[#A8DADC]/20 to-[#A8DADC]/10 rounded-lg w-fit mb-4">
                  <Users className="w-6 h-6 text-[#A8DADC]" />
                </div>
                <h3 className="text-[#F1FAEE] mb-2">Easy Upload</h3>
                <p className="text-[#A8DADC]/70">
                  Upload CSV files or link Google Sheets with your recipient lists
                </p>
              </div>
            </Card>

            {/* Feature 2 */}
            <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#FFE066]/20 p-6 hover:border-[#FFE066]/40 transition-all group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFE066]/10 rounded-full blur-2xl group-hover:bg-[#FFE066]/20 transition-all"></div>
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-[#FFE066]/20 to-[#FFE066]/10 rounded-lg w-fit mb-4">
                  <Zap className="w-6 h-6 text-[#FFE066]" />
                </div>
                <h3 className="text-[#F1FAEE] mb-2">AI Generation</h3>
                <p className="text-[#A8DADC]/70">
                  Let AI write compelling subject lines and email content for you
                </p>
              </div>
            </Card>

            {/* Feature 3 */}
            <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 p-6 hover:border-[#A8DADC]/40 transition-all group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#A8DADC]/10 rounded-full blur-2xl group-hover:bg-[#A8DADC]/20 transition-all"></div>
              <div className="relative">
                <div className="p-3 bg-gradient-to-br from-[#A8DADC]/20 to-[#A8DADC]/10 rounded-lg w-fit mb-4">
                  <Mail className="w-6 h-6 text-[#A8DADC]" />
                </div>
                <h3 className="text-[#F1FAEE] mb-2">Personalization</h3>
                <p className="text-[#A8DADC]/70">
                  Customize each email with recipient-specific information
                </p>
              </div>
            </Card>
          </motion.div>

          {/* How It Works */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="text-[#F1FAEE] mb-4">How It Works</h2>
              <p className="text-[#A8DADC]/70">
                Four simple steps to send professional email campaigns
              </p>
            </div>

            <div className="space-y-4">
              {[
                { step: '1', title: 'Upload Recipients', desc: 'Import your email list from CSV or Google Sheets' },
                { step: '2', title: 'Compose Email', desc: 'Write or generate content with AI assistance' },
                { step: '3', title: 'Preview & Test', desc: 'See how your emails will look to recipients' },
                { step: '4', title: 'Send Campaign', desc: 'Review and send to all recipients at once' },
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                >
                  <Card className="bg-[#1B2A3A]/50 backdrop-blur-sm border-[#A8DADC]/20 p-4 hover:border-[#A8DADC]/40 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#A8DADC] to-[#A8DADC]/80 rounded-full flex items-center justify-center text-[#0D1B2A]">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-[#F1FAEE] mb-1">{item.title}</h4>
                        <p className="text-[#A8DADC]/60">{item.desc}</p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-[#A8DADC]/40" />
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Assistant Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="max-w-3xl mx-auto mt-20"
          >
            <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 p-8">
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-[#FFE066]/10 rounded-full blur-3xl"></div>
              <div className="relative text-center">
                <div className="inline-flex p-3 bg-gradient-to-br from-[#FFE066]/20 to-[#FFE066]/10 rounded-lg mb-4">
                  <MessageSquare className="w-8 h-8 text-[#FFE066]" />
                </div>
                <h3 className="text-[#F1FAEE] mb-2">Built-in AI Assistant</h3>
                <p className="text-[#A8DADC]/70 mb-6">
                  Get help anytime with our intelligent chatbot. Ask questions, get tips, or request custom email content.
                </p>
                <div className="flex items-center justify-center gap-2 text-[#A8DADC]/60">
                  <Sparkles className="w-4 h-4" />
                  <span>Powered by AI</span>
                  <div className="w-2 h-2 bg-[#A8DADC] rounded-full animate-pulse"></div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="text-center mt-20"
          >
            <Button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 hover:from-[#A8DADC]/90 hover:to-[#A8DADC]/70 text-[#0D1B2A] px-12 py-6 text-lg group transition-all shadow-lg shadow-[#A8DADC]/20 hover:shadow-xl hover:shadow-[#A8DADC]/30"
            >
              Start Creating Campaigns
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t border-[#A8DADC]/20 bg-[#1B2A3A]/50 backdrop-blur-md mt-20">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-[#A8DADC]/60">
                Built with React, TailwindCSS & Motion
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[#A8DADC]/60">Ready to scale</span>
                <div className="relative">
                  <div className="w-2 h-2 bg-[#A8DADC] rounded-full animate-pulse"></div>
                  <div className="absolute inset-0 w-2 h-2 bg-[#A8DADC] rounded-full animate-ping opacity-75"></div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
