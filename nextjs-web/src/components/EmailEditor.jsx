'use client';

import { useState, useEffect, useRef } from 'react';
import { Mail, Wand2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

export function EmailEditor({
  isPersonalized,
  onPersonalizationToggle,
  onEmailChange,
  availableColumns,
  aiSuggestion = { subject: '', body: '' }
}) {
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  // Prevent loops from repeated AI suggestions
  const lastSuggestionRef = useRef('');
  // Track if user has manually edited input
  const userEditedRef = useRef(false);

  // Auto-apply AI suggestion if user hasn't typed
  useEffect(() => {
    if (userEditedRef.current) return; // Do not overwrite user input

    const suggestionKey = aiSuggestion.subject + aiSuggestion.body;

    if (suggestionKey && suggestionKey !== lastSuggestionRef.current) {
      lastSuggestionRef.current = suggestionKey;

      const cleanBody = aiSuggestion.body
        .replace(/\*\*(.*?)\*\*/g, '$1') // remove markdown bold
        .replace(/\\n/g, '\n'); // convert escaped newlines

      const cleanSubject = aiSuggestion.subject.replace(/\*\*(.*?)\*\*/g, '$1');

      setSubject(cleanSubject);
      setBody(cleanBody);
      onEmailChange(cleanSubject, cleanBody);
    }
  }, [aiSuggestion, onEmailChange]);

  // Handle manual editing
  const handleSubjectChange = (value) => {
    userEditedRef.current = true;
    setSubject(value);
    onEmailChange(value, body);
  };

  const handleBodyChange = (value) => {
    userEditedRef.current = true;
    setBody(value);
    onEmailChange(subject, value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#FFE066]/10 rounded-full blur-3xl"></div>

        <div className="relative p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-[#FFE066] to-[#FFE066]/70 rounded-lg">
                <Mail className="w-5 h-5 text-[#0D1B2A]" />
              </div>
              <h2 className="text-[#F1FAEE]">Step 2: Compose Email</h2>
            </div>
          </div>

          {/* Personalization section */}
          {isPersonalized && availableColumns.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 bg-[#0D1B2A]/70 rounded-lg border border-[#A8DADC]/30"
            >
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="w-4 h-4 text-[#FFE066]" />
                <p className="text-[#A8DADC]/80">Click to insert placeholders:</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableColumns.map((col) => {
                  const placeholder = `{{${col}}}`;
                  return (
                    <Badge
                      key={col}
                      className="border-[#A8DADC]/40 text-[#A8DADC] cursor-pointer hover:bg-gradient-to-r hover:from-[#A8DADC] hover:to-[#A8DADC]/80 hover:text-[#0D1B2A] transition-all"
                      variant="outline"
                      onClick={() => {
                        const updated = body + placeholder;
                        setBody(updated);
                        onEmailChange(subject, updated);
                        userEditedRef.current = true; // mark user edit
                      }}
                    >
                      {placeholder}
                    </Badge>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Subject + Body Inputs */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="email-subject" className="text-[#A8DADC]/80 mb-4">
                Subject Line
              </Label>
              <Input
                id="email-subject"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="bg-[#0D1B2A] border-[#A8DADC]/30 text-[#F1FAEE] focus:border-[#A8DADC] placeholder:text-[#A8DADC]/40"
              />
            </div>

            <div>
              <Label htmlFor="email-body" className="text-[#A8DADC]/80 mb-4">
                Email Body
              </Label>
              <Textarea
                id="email-body"
                placeholder={
                  isPersonalized
                    ? 'Enter email content... Use {{first_name}}, {{last_name}}...'
                    : 'Enter your email content...'
                }
                value={body}
                onChange={(e) => handleBodyChange(e.target.value)}
                className="bg-[#0D1B2A] border-[#A8DADC]/30 text-[#F1FAEE] min-h-[250px] focus:border-[#A8DADC]"
              />
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
