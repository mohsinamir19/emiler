'use client';

import { useState } from 'react';
import { Sparkles, Mail, ArrowLeft } from 'lucide-react';
import { AnimatedBackground } from './AnimatedBackground';
import { UploadSection } from './UploadSection';
import { EmailEditor } from './EmailEditor';
import { PreviewSection } from './PreviewSection';
import { ApprovalSection } from './ApprovalSection';
import { ChatbotSection } from './ChatbotSection';
import { Toaster } from './ui/sonner';
import { Button } from './ui/button';
import { motion } from 'motion/react';

export function EmailManager({ onBack }) {
  const [recipients, setRecipients] = useState([]);
  const [availableColumns, setAvailableColumns] = useState([]);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const handleDataLoaded = (data, columns) => {
    setRecipients(data);
    setAvailableColumns(columns.filter(col => col !== 'email'));
  };

  const handleEmailChange = (subject, body) => {
    setEmailSubject(subject);
    setEmailBody(body);
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-[#F1FAEE] relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <header className="relative z-10 border-b border-[#A8DADC]/20 bg-[#1B2A3A]/50 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-[#A8DADC] via-[#A8DADC]/90 to-[#A8DADC]/70 rounded-xl shadow-lg shadow-[#A8DADC]/20">
                <Sparkles className="w-7 h-7 text-[#0D1B2A]" />
              </div>
              <div>
                <h1 className="text-[#F1FAEE] flex items-center gap-2">
                  AI Email Campaign Manager
                  <Mail className="w-5 h-5 text-[#A8DADC]" />
                </h1>
                <p className="text-[#A8DADC]/70">
                  Create personalized email campaigns with AI-powered assistance
                </p>
              </div>
            </div>
            <Button
              onClick={onBack}
              variant="outline"
              className="border-[#A8DADC]/30 text-[#A8DADC] hover:bg-[#A8DADC]/10 hover:border-[#A8DADC] transition-all"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Email Campaign Manager Section */}
          <section className="space-y-6">
            {/* Upload Section */}
            <UploadSection onDataLoaded={handleDataLoaded} />

          {/* AI Chatbot Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <ChatbotSection />
          </motion.section>
            {/* Email Editor */}
            <EmailEditor
              isPersonalized={isPersonalized}
              onPersonalizationToggle={setIsPersonalized}
              onEmailChange={handleEmailChange}
              availableColumns={availableColumns}
            />

            {/* Preview Section */}
            <PreviewSection
              recipients={recipients}
              subject={emailSubject}
              body={emailBody}
              isPersonalized={isPersonalized}
            />

            {/* Approval Section */}
            <ApprovalSection
              recipients={recipients}
              subject={emailSubject}
              body={emailBody}
              isPersonalized={isPersonalized}
            />
          </section>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative py-8"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#A8DADC]/20"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0D1B2A] px-4 text-[#A8DADC]/60">
                Need help? Ask the AI Assistant below
              </span>
            </div>
          </motion.div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#A8DADC]/20 bg-[#1B2A3A]/50 backdrop-blur-md mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#A8DADC]/60">
              Built with React, TailwindCSS & Motion • Modern Dark Theme Design
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[#A8DADC]/60">Powered by AI</span>
              <div className="relative">
                <div className="w-2 h-2 bg-[#A8DADC] rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-2 h-2 bg-[#A8DADC] rounded-full animate-ping opacity-75"></div>
              </div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#A8DADC]/10 text-center">
            <p className="text-[#A8DADC]/50">
              <span className="inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                AI features are simulated. Integrate OpenAI API for production use.
              </span>
            </p>
            <p className="text-[#A8DADC]/50 mt-1">
              For email sending, integrate with SendGrid, Resend, or similar email service providers.
            </p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
