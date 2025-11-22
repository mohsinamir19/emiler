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
  const [personalizedEmails, setPersonalizedEmails] = useState([]);

  // Load data from CSV / upload
  const handleDataLoaded = (data, columns) => {
    setRecipients(data);
    setAvailableColumns(columns.filter(col => col !== 'email'));
  };

  // Shared state updater for Chatbot + Editor
  const handleEmailChange = (subject, body) => {
    setEmailSubject(subject);
    setEmailBody(body);
  };

  // AI suggestion object for Editor
  const aiSuggestion = { subject: emailSubject, body: emailBody };

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-[#F1FAEE] relative overflow-hidden">
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
          <section className="space-y-6">
            <UploadSection onDataLoaded={handleDataLoaded} />

            {/* Chatbot Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ChatbotSection
                subject={emailSubject}
                body={emailBody}
                onEmailChange={handleEmailChange}
              />
            </motion.section>

            {/* Email Editor */}
            <EmailEditor
              subject={emailSubject}
              body={emailBody}
              isPersonalized={isPersonalized}
              onPersonalizationToggle={setIsPersonalized}
              onEmailChange={handleEmailChange}
              availableColumns={availableColumns}
              aiSuggestion={aiSuggestion} // ✅ Pass AI suggestion
            />

            <PreviewSection
              recipients={recipients}
              subject={emailSubject}
              body={emailBody}
              isPersonalized={isPersonalized}

              personalizedEmails={personalizedEmails}
              setPersonalizedEmails={setPersonalizedEmails}
            />


            <ApprovalSection
              recipients={recipients}
              subject={emailSubject}
              body={emailBody}
              isPersonalized={isPersonalized}
              personalizedEmails={personalizedEmails}
            />

          </section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[#A8DADC]/20 bg-[#1B2A3A]/50 backdrop-blur-md mt-12">
        {/* footer content */}
      </footer>

      <Toaster />
    </div>
  );
}
