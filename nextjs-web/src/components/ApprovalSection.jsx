'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, TrendingUp, HelpCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion } from 'motion/react';

export function ApprovalSection({ recipients, subject, body, isPersonalized, personalizedEmails = [] }) {
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [isSent, setIsSent] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [sendResult, setSendResult] = useState({ sent: [], failed: [] });
  const [error, setError] = useState('');

  const canSend = recipients.length > 0 && subject && (isPersonalized ? personalizedEmails.length > 0 : true);

  const handleSend = async () => {
    setIsSending(true);
    setSendProgress(0);
    setError('');

    try {
      // Map personalizedEmails correctly for backend
      const emailsPayload = personalizedEmails.map(item => ({
        email: typeof item.email === 'string' ? item.email : item.email.email, // ensure string
        rendered_body: item.rendered_body // already personalized content
      }));

      const payload = {
        subject,
        emails: emailsPayload
      };

      console.log("Send payload:", payload);

      // Simulate sending progress until API responds
      const interval = setInterval(() => {
        setSendProgress(prev => (prev < 90 ? prev + 5 : prev));
      }, 200);

      const res = await fetch('http://127.0.0.1:8000/send-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || 'Failed to send emails');

      clearInterval(interval);
      setSendProgress(100);
      setIsSent(true);
      setShowAnalytics(true);
      setSendResult(data);

    } catch (err) {
      console.error(err);
      setError(err.message || 'Email sending failed');
      setSendResult({ sent: [], failed: [] });
    } finally {
      setIsSending(false);
    }
  };


  const mockAnalytics = {
    sent: sendResult.sent.length,
    delivered: Math.floor(sendResult.sent.length * 0.98),
    opened: Math.floor(sendResult.sent.length * 0.45),
    clicked: Math.floor(sendResult.sent.length * 0.12),
    replied: Math.floor(sendResult.sent.length * 0.05),
  };

  if (isSent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-60 h-60 bg-[#A8DADC]/20 rounded-full blur-3xl"></div>

          <div className="relative p-6">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="w-6 h-6 text-[#A8DADC]" />
              <h2 className="text-[#F1FAEE]">Campaign Sent Successfully!</h2>
            </div>

            <Alert className="mb-6 bg-[#0D1B2A]/70 border-[#A8DADC]/40">
              <CheckCircle2 className="h-4 w-4 text-[#A8DADC]" />
              <AlertDescription className="text-[#F1FAEE]/90">
                Sent: {sendResult.sent.length} {isPersonalized ? 'personalized emails' : 'emails'}.
                {sendResult.failed.length > 0 && ` Failed: ${sendResult.failed.length}`}
              </AlertDescription>
            </Alert>

            {showAnalytics && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#A8DADC]" />
                  <h3 className="text-[#F1FAEE]">Campaign Analytics </h3>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(mockAnalytics).map(([key, value], idx) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * (idx + 1) }}
                      className="bg-[#0D1B2A]/70 p-4 rounded-lg border border-[#A8DADC]/30"
                    >
                      <div className="text-[#A8DADC]/70 mb-1">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      <div className="text-[#F1FAEE] text-2xl">{value}</div>
                      <Badge className="mt-2 bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 text-[#0D1B2A]">
                        {Math.round((value / mockAnalytics.sent) * 100)}%
                      </Badge>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={() => {
                    setIsSent(false);
                    setShowAnalytics(false);
                    setSendProgress(0);
                    setSendResult({ sent: [], failed: [] });
                  }}
                  className="w-full bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 hover:from-[#A8DADC]/90 hover:to-[#A8DADC]/70 text-[#0D1B2A] mt-4 transition-all"
                >
                  Send Another Campaign
                </Button>
              </motion.div>
            )}
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-[#FFE066]/10 rounded-full blur-3xl"></div>

        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#FFE066] to-[#FFE066]/70 rounded-lg">
              <Send className="w-5 h-5 text-[#0D1B2A]" />
            </div>
            <h2 className="text-[#F1FAEE]">Step 4: Review & Send</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent">
                    <HelpCircle className="w-4 h-4 text-[#A8DADC]/60 hover:text-[#A8DADC] transition-colors" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1B2A3A] border-[#A8DADC]/30 text-[#F1FAEE] max-w-xs">
                  <p>Review your campaign details and click send when ready. Emails will be sent to all recipients.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {!canSend && (
            <Alert className="mb-4 bg-[#0D1B2A]/70 border-[#FFE066]/40">
              <AlertCircle className="h-4 w-4 text-[#FFE066]" />
              <AlertDescription className="text-[#F1FAEE]/90">
                Please complete all previous steps before sending.
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert className="mb-4 bg-[#1B2A3A]/70 border-red-500/50">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">{error}</AlertDescription>
            </Alert>
          )}

          {isSending && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#A8DADC]/70">Sending emails...</span>
                <span className="text-[#A8DADC]">{sendProgress}%</span>
              </div>
              <Progress value={sendProgress} className="h-2 bg-[#0D1B2A]" />
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-[#0D1B2A]/70 rounded-lg border border-[#A8DADC]/30">
              <span className="text-[#A8DADC]/80">Recipients</span>
              <Badge className="bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 text-[#0D1B2A]">
                {recipients.length} {recipients.length === 1 ? 'recipient' : 'recipients'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0D1B2A]/70 rounded-lg border border-[#A8DADC]/30">
              <span className="text-[#A8DADC]/80">Email Type</span>
              <Badge variant="outline" className="border-[#A8DADC]/40 text-[#A8DADC]">
                {isPersonalized ? 'Personalized' : 'Single Email for All'}
              </Badge>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0D1B2A]/70 rounded-lg border border-[#A8DADC]/30">
              <span className="text-[#A8DADC]/80">Subject</span>
              <span className="text-[#F1FAEE] max-w-[200px] truncate">{subject || 'Not set'}</span>
            </div>
          </div>

          <Button
            onClick={handleSend}
            disabled={!canSend || isSending}
            className="w-full bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 hover:from-[#A8DADC]/90 hover:to-[#A8DADC]/70 text-[#0D1B2A] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSending ? 'Sending...' : `Send Campaign to ${recipients.length} Recipients`}
          </Button>

          {canSend && !isSending && (
            <p className="text-[#A8DADC]/60 text-center mt-4">
              Review all details before sending. This action cannot be undone.
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
