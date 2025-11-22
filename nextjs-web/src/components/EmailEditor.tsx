import { useState } from 'react';
import { Mail, Sparkles, RotateCw, HelpCircle, Wand2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion } from 'motion/react';

interface EmailEditorProps {
  isPersonalized: boolean;
  onPersonalizationToggle: (value: boolean) => void;
  onEmailChange: (subject: string, body: string) => void;
  availableColumns: string[];
}

export function EmailEditor({ 
  isPersonalized, 
  onPersonalizationToggle, 
  onEmailChange,
  availableColumns 
}: EmailEditorProps) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubjectChange = (value: string) => {
    setSubject(value);
    onEmailChange(value, body);
  };

  const handleBodyChange = (value: string) => {
    setBody(value);
    onEmailChange(subject, value);
  };

  const generateAISubject = () => {
    setIsGenerating(true);
    // Mock AI generation - Replace with OpenAI API call
    setTimeout(() => {
      const suggestions = [
        'Exciting Partnership Opportunity',
        'Transform Your Business with AI',
        "Let's Collaborate on Something Amazing",
        'Exclusive Invitation for Industry Leaders',
      ];
      const randomSubject = suggestions[Math.floor(Math.random() * suggestions.length)];
      setSubject(randomSubject);
      onEmailChange(randomSubject, body);
      setIsGenerating(false);
    }, 1000);
  };

  const generateAIBody = () => {
    setIsGenerating(true);
    // Mock AI generation - Replace with OpenAI API call
    setTimeout(() => {
      const template = isPersonalized
        ? `Hi {{first_name}},

I hope this email finds you well. I came across {{company}} and was impressed by your work in the industry.

I wanted to reach out because I believe there's a great opportunity for us to collaborate. Our innovative solutions have helped companies like yours achieve remarkable results.

Would you be open to a brief call next week to explore how we can work together?

Best regards,
Your Name`
        : `Hello,

I hope this email finds you well. I'm reaching out to share an exciting opportunity that I believe could be valuable for you.

Our team has been working on innovative solutions that have helped many organizations transform their operations and achieve their goals.

I'd love to connect and discuss how we might be able to help you too.

Looking forward to hearing from you!

Best regards,
Your Name`;
      
      setBody(template);
      onEmailChange(subject, template);
      setIsGenerating(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
        {/* Subtle glow effect */}
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FFE066]/10 rounded-full blur-3xl"></div>
        
        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-[#FFE066] to-[#FFE066]/70 rounded-lg">
                <Mail className="w-5 h-5 text-[#0D1B2A]" />
              </div>
              <h2 className="text-[#F1FAEE]">Step 2: Compose Email</h2>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                      <HelpCircle className="w-4 h-4 text-[#A8DADC]/60 hover:text-[#A8DADC] transition-colors" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#1B2A3A] border-[#A8DADC]/30 text-[#F1FAEE] max-w-xs">
                    <p>Write your email or let AI generate it for you. Toggle "Personalize Emails" to use placeholders like {`{{first_name}}`} that will be replaced with recipient data.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-3 bg-[#0D1B2A]/50 px-3 py-2 rounded-lg border border-[#A8DADC]/20">
              <Label htmlFor="personalization-toggle" className="text-[#A8DADC]/80">
                Personalize Emails
              </Label>
              <Switch
                id="personalization-toggle"
                checked={isPersonalized}
                onCheckedChange={onPersonalizationToggle}
                className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#A8DADC] data-[state=checked]:to-[#A8DADC]/80"
              />
            </div>
          </div>

          {isPersonalized && availableColumns.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 p-3 bg-[#0D1B2A]/70 rounded-lg border border-[#A8DADC]/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="w-4 h-4 text-[#FFE066]" />
                <p className="text-[#A8DADC]/80">Click to insert placeholders:</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {availableColumns.map((col) => (
                  <Badge 
                    key={col} 
                    variant="outline" 
                    className="border-[#A8DADC]/40 text-[#A8DADC] cursor-pointer hover:bg-gradient-to-r hover:from-[#A8DADC] hover:to-[#A8DADC]/80 hover:text-[#0D1B2A] hover:border-transparent transition-all"
                    onClick={() => {
                      const placeholder = `{{${col}}}`;
                      setBody(body + placeholder);
                      onEmailChange(subject, body + placeholder);
                    }}
                  >
                    {`{{${col}}}`}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="email-subject" className="text-[#A8DADC]/80">
                  Subject Line
                </Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={generateAISubject}
                  disabled={isGenerating}
                  className="text-[#A8DADC] hover:text-[#A8DADC]/80 hover:bg-[#0D1B2A]/50 transition-colors"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  AI Generate
                </Button>
              </div>
              <Input
                id="email-subject"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="bg-[#0D1B2A] border-[#A8DADC]/30 text-[#F1FAEE] placeholder:text-[#A8DADC]/40 focus:border-[#A8DADC] focus:ring-[#A8DADC]/20 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="email-body" className="text-[#A8DADC]/80">
                  Email Body
                </Label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={generateAIBody}
                  disabled={isGenerating}
                  className="text-[#A8DADC] hover:text-[#A8DADC]/80 hover:bg-[#0D1B2A]/50 transition-colors"
                >
                  {isGenerating ? (
                    <>
                      <RotateCw className="w-4 h-4 mr-1 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-1" />
                      AI Generate
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                id="email-body"
                placeholder={
                  isPersonalized
                    ? "Enter your email content... Use {{first_name}}, {{last_name}}, etc. for personalization"
                    : "Enter your email content..."
                }
                value={body}
                onChange={(e) => handleBodyChange(e.target.value)}
                className="bg-[#0D1B2A] border-[#A8DADC]/30 text-[#F1FAEE] placeholder:text-[#A8DADC]/40 focus:border-[#A8DADC] focus:ring-[#A8DADC]/20 min-h-[250px] resize-y transition-all"
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
