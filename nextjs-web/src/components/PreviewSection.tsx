import { useState } from 'react';
import { Eye, ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion } from 'motion/react';

interface PreviewSectionProps {
  recipients: any[];
  subject: string;
  body: string;
  isPersonalized: boolean;
}

export function PreviewSection({ recipients, subject, body, isPersonalized }: PreviewSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderPersonalizedContent = (template: string, recipient: any) => {
    let content = template;
    Object.keys(recipient).forEach((key) => {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(placeholder, recipient[key] || '');
    });
    return content;
  };

  const currentRecipient = recipients[currentIndex];
  const displaySubject = isPersonalized && currentRecipient 
    ? renderPersonalizedContent(subject, currentRecipient)
    : subject;
  const displayBody = isPersonalized && currentRecipient
    ? renderPersonalizedContent(body, currentRecipient)
    : body;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : recipients.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < recipients.length - 1 ? prev + 1 : 0));
  };

  if (recipients.length === 0 || !subject || !body) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-gradient-to-br from-[#A8DADC] to-[#A8DADC]/70 rounded-lg opacity-50">
                <Eye className="w-5 h-5 text-[#0D1B2A]" />
              </div>
              <h2 className="text-[#F1FAEE]">Step 3: Preview</h2>
            </div>
            <div className="text-center py-12 text-[#A8DADC]/60">
              Upload recipients and compose an email to see preview
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
        {/* Subtle glow effect */}
        <div className="absolute top-1/2 -right-20 w-40 h-40 bg-[#F1FAEE]/10 rounded-full blur-3xl"></div>
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-[#A8DADC] to-[#A8DADC]/70 rounded-lg">
                <Eye className="w-5 h-5 text-[#0D1B2A]" />
              </div>
              <h2 className="text-[#F1FAEE]">Step 3: Preview</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                      <HelpCircle className="w-4 h-4 text-[#A8DADC]/60 hover:text-[#A8DADC] transition-colors" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1B2A3A] border-[#A8DADC]/30 text-[#F1FAEE] max-w-xs">
                    <p>Preview how your email will look to recipients. For personalized emails, use the navigation to preview different recipients.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {isPersonalized && recipients.length > 1 && (
              <div className="flex items-center gap-3 bg-[#0D1B2A]/50 px-3 py-2 rounded-lg border border-[#A8DADC]/20">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-[#A8DADC]/30 text-[#A8DADC] hover:bg-[#A8DADC]/10 hover:border-[#A8DADC] transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-[#A8DADC]/80">
                  {currentIndex + 1} / {recipients.length}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNext}
                  className="border-[#A8DADC]/30 text-[#A8DADC] hover:bg-[#A8DADC]/10 hover:border-[#A8DADC] transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {isPersonalized && currentRecipient && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="mb-4 flex items-center gap-2"
            >
              <Badge className="bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 text-[#0D1B2A]">
                Preview for: {currentRecipient.email}
              </Badge>
            </motion.div>
          )}

          <div className="bg-[#0D1B2A] rounded-lg border border-[#A8DADC]/30 overflow-hidden">
            {/* Email Header */}
            <div className="border-b border-[#A8DADC]/20 p-4 space-y-3">
              <div className="flex items-start">
                <span className="text-[#A8DADC]/60 w-20">From:</span>
                <span className="text-[#F1FAEE]">your.email@company.com</span>
              </div>
              <div className="flex items-start">
                <span className="text-[#A8DADC]/60 w-20">To:</span>
                <span className="text-[#F1FAEE]">
                  {isPersonalized && currentRecipient
                    ? currentRecipient.email
                    : `${recipients.length} recipients`}
                </span>
              </div>
              <div className="flex items-start">
                <span className="text-[#A8DADC]/60 w-20">Subject:</span>
                <span className="text-[#F1FAEE]">{displaySubject || '(No subject)'}</span>
              </div>
            </div>

            {/* Email Body */}
            <ScrollArea className="h-[300px]">
              <div className="p-4">
                <pre className="text-[#F1FAEE]/90 whitespace-pre-wrap font-sans">
                  {displayBody || '(No content)'}
                </pre>
              </div>
            </ScrollArea>
          </div>

          {!isPersonalized && (
            <div className="mt-4 p-3 bg-[#0D1B2A]/70 rounded-lg border border-[#A8DADC]/30">
              <p className="text-[#A8DADC]/70">
                This email will be sent to all {recipients.length} recipients with the same content.
              </p>
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
