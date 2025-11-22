'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { motion } from 'motion/react';

export function PreviewSection({
  recipients = [],
  subject,
  body,
  isPersonalized,
  personalizedEmails = [],
  setPersonalizedEmails,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localEmails, setLocalEmails] = useState([]); // fallback if parent doesn't provide
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  // Use parent state if available, otherwise local
  const emails = Array.isArray(personalizedEmails) && personalizedEmails.length > 0
    ? personalizedEmails
    : localEmails;

  // Reset index when inputs change
  useEffect(() => setCurrentIndex(0), [subject, body, recipients.length, isPersonalized]);

  // Fetch personalized emails from backend
  useEffect(() => {
    if (!subject || !body || recipients.length === 0) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (abortRef.current) abortRef.current.abort();
      abortRef.current = new AbortController();

      const safeRecipients = recipients.map(r =>
        typeof r === 'object' && r !== null ? { ...r } : { email: r || '' }
      );

      const payload = {
        subject,
        body,
        recipients: safeRecipients,
        mode: isPersonalized ? 'personalized' : 'bulk',
      };

      console.log('[PreviewSection] Sending payload:', payload);

      const callApi = async (retry = false) => {
        setLoading(true);
        setError('');

        try {
          const res = await fetch('http://127.0.0.1:8000/personalize-emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: abortRef.current.signal,
          });

          const text = await res.text();
          let data;
          try {
            data = text ? JSON.parse(text) : {};
          } catch {
            throw new Error(`Invalid JSON from server: ${text}`);
          }

          if (!res.ok) {
            const detail = data.detail || data.error || text || `HTTP ${res.status}`;
            throw new Error(detail);
          }

          const returnedEmails = data.emails || [];
          if (typeof setPersonalizedEmails === 'function') {
            setPersonalizedEmails(returnedEmails);
          } else {
            setLocalEmails(returnedEmails);
          }
        } catch (err) {
          console.error('[PreviewSection] personalization error:', err);
          if (!retry) setTimeout(() => callApi(true), 300);
          else {
            setError(err.message || 'Personalization failed');
            setLocalEmails([]);
            if (typeof setPersonalizedEmails === 'function') setPersonalizedEmails([]);
          }
        } finally {
          setLoading(false);
        }
      };

      callApi();
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    };
  }, [subject, body, JSON.stringify(recipients), isPersonalized, setPersonalizedEmails]);

  const handlePrevious = () => setCurrentIndex(prev => (prev > 0 ? prev - 1 : emails.length - 1));
  const handleNext = () => setCurrentIndex(prev => (prev < emails.length - 1 ? prev + 1 : 0));

  const currentEmail = emails && emails.length > 0 ? emails[currentIndex] : null;

  // Early render when no recipients or email content
  if (!subject || !body || recipients.length === 0) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
          <div className="relative p-6 text-center text-[#A8DADC]/60">
            Upload recipients and compose an email to see preview
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="relative overflow-hidden bg-[#1B2A3A]/80 border-[#A8DADC]/20 shadow-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-[#A8DADC]" />
            <h2 className="text-[#F1FAEE]">Step 3: Preview</h2>
          </div>

          {isPersonalized && emails.length > 1 && (
            <div className="flex items-center gap-3 bg-[#0D1B2A]/50 px-3 py-2 rounded-lg border border-[#A8DADC]/20">
              <Button size="sm" variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-[#A8DADC]/80">{currentIndex + 1} / {emails.length}</span>
              <Button size="sm" variant="outline" onClick={handleNext}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {isPersonalized && currentEmail && (
          <Badge className="mb-4 bg-[#A8DADC] text-[#0D1B2A]">Preview for: {currentEmail.email}</Badge>
        )}

        <div className="bg-[#0D1B2A] rounded-lg border border-[#A8DADC]/30 overflow-hidden">
          <div className="border-b border-[#A8DADC]/20 p-4 space-y-3">
            <div className="flex">
              <span className="text-[#A8DADC]/60 w-20">To:</span>
              <span className="text-[#F1FAEE]">
                {currentEmail ? currentEmail.email : `${recipients.length} recipients`}
              </span>
            </div>

            <div className="flex">
              <span className="text-[#A8DADC]/60 w-20">Subject:</span>
              <span className="text-[#F1FAEE]">
                {currentEmail && currentEmail.rendered_subject ? currentEmail.rendered_subject : subject}
              </span>
            </div>
          </div>

          <ScrollArea className="h-[300px]">
            <div className="p-4">
              <pre className="text-[#F1FAEE]/90 whitespace-pre-wrap font-sans">
                {currentEmail && currentEmail.rendered_body ? currentEmail.rendered_body : body}
              </pre>
              {loading && <div className="mt-2 text-[#A8DADC]/60">Loading preview...</div>}
              {error && <div className="mt-2 text-red-400">Preview error: {error}</div>}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </motion.div>
  );
}
