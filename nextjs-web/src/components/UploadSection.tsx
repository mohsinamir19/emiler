import { useState } from 'react';
import { Upload, Link2, FileSpreadsheet, CheckCircle2, HelpCircle } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { motion } from 'motion/react';

interface UploadSectionProps {
  onDataLoaded: (data: any[], columns: string[]) => void;
}

export function UploadSection({ onDataLoaded }: UploadSectionProps) {
  const [uploadMethod, setUploadMethod] = useState<'csv' | 'link'>('csv');
  const [linkUrl, setLinkUrl] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFileName(file.name);
      // Mock CSV parsing - in production, use Papa Parse or similar
      const mockData = [
        { email: 'john.doe@example.com', first_name: 'John', last_name: 'Doe', company: 'Tech Corp' },
        { email: 'jane.smith@example.com', first_name: 'Jane', last_name: 'Smith', company: 'Design Studio' },
        { email: 'bob.johnson@example.com', first_name: 'Bob', last_name: 'Johnson', company: 'Marketing Inc' },
        { email: 'alice.williams@example.com', first_name: 'Alice', last_name: 'Williams', company: 'Sales Pro' },
        { email: 'charlie.brown@example.com', first_name: 'Charlie', last_name: 'Brown', company: 'Dev Agency' },
      ];
      const columns = ['email', 'first_name', 'last_name', 'company'];
      onDataLoaded(mockData, columns);
      setIsUploaded(true);
    }
  };

  const handleLinkSubmit = () => {
    if (linkUrl) {
      // Mock data fetching from link
      const mockData = [
        { email: 'sarah.davis@example.com', first_name: 'Sarah', last_name: 'Davis', company: 'Cloud Services' },
        { email: 'mike.wilson@example.com', first_name: 'Mike', last_name: 'Wilson', company: 'AI Labs' },
        { email: 'emma.taylor@example.com', first_name: 'Emma', last_name: 'Taylor', company: 'Growth Hacks' },
      ];
      const columns = ['email', 'first_name', 'last_name', 'company'];
      onDataLoaded(mockData, columns);
      setIsUploaded(true);
      setFileName('Google Sheet');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
        {/* Subtle glow effect */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#A8DADC]/10 rounded-full blur-3xl"></div>
        
        <div className="relative p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#A8DADC] to-[#A8DADC]/70 rounded-lg">
              <Upload className="w-5 h-5 text-[#0D1B2A]" />
            </div>
            <h2 className="text-[#F1FAEE]">Step 1: Upload Recipients</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="ml-auto p-0 h-auto hover:bg-transparent">
                    <HelpCircle className="w-4 h-4 text-[#A8DADC]/60 hover:text-[#A8DADC] transition-colors" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-[#1B2A3A] border-[#A8DADC]/30 text-[#F1FAEE] max-w-xs">
                  <p>Upload a CSV file with email addresses or provide a link to your Google Sheet. Your CSV should include an "email" column and optional columns like "first_name" for personalization.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v as 'csv' | 'link')} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#0D1B2A] border border-[#A8DADC]/20">
              <TabsTrigger value="csv" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#A8DADC] data-[state=active]:to-[#A8DADC]/80 data-[state=active]:text-[#0D1B2A] text-[#A8DADC]/60 transition-all">
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                CSV File
              </TabsTrigger>
              <TabsTrigger value="link" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#A8DADC] data-[state=active]:to-[#A8DADC]/80 data-[state=active]:text-[#0D1B2A] text-[#A8DADC]/60 transition-all">
                <Link2 className="w-4 h-4 mr-2" />
                Link
              </TabsTrigger>
            </TabsList>

            <TabsContent value="csv" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="csv-upload" className="text-[#A8DADC]/80 mb-2 block">
                    Upload CSV file with email addresses and optional data columns
                  </Label>
                  <div className="flex items-center gap-3">
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="bg-[#0D1B2A] border-[#A8DADC]/30 text-[#F1FAEE] file:bg-gradient-to-r file:from-[#A8DADC] file:to-[#A8DADC]/80 file:text-[#0D1B2A] file:border-0 file:px-4 file:py-2 file:mr-4 hover:border-[#A8DADC]/50 transition-colors"
                    />
                  </div>
                </div>
                {isUploaded && uploadMethod === 'csv' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-[#A8DADC] bg-[#0D1B2A] p-3 rounded-lg border border-[#A8DADC]/30"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>File uploaded: {fileName}</span>
                  </motion.div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="link" className="mt-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="link-input" className="text-[#A8DADC]/80 mb-2 block">
                    Enter Google Sheet URL or other data source
                  </Label>
                  <div className="flex gap-3">
                    <Input
                      id="link-input"
                      type="url"
                      placeholder="https://docs.google.com/spreadsheets/..."
                      value={linkUrl}
                      onChange={(e) => setLinkUrl(e.target.value)}
                      className="bg-[#0D1B2A] border-[#A8DADC]/30 text-[#F1FAEE] placeholder:text-[#A8DADC]/40 focus:border-[#A8DADC] focus:ring-[#A8DADC]/20"
                    />
                    <Button 
                      onClick={handleLinkSubmit}
                      className="bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 hover:from-[#A8DADC]/90 hover:to-[#A8DADC]/70 text-[#0D1B2A] transition-all"
                    >
                      Fetch
                    </Button>
                  </div>
                </div>
                {isUploaded && uploadMethod === 'link' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 text-[#A8DADC] bg-[#0D1B2A] p-3 rounded-lg border border-[#A8DADC]/30"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Data loaded from: {fileName}</span>
                  </motion.div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {isUploaded && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 pt-4 border-t border-[#A8DADC]/20"
            >
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-[#A8DADC] to-[#A8DADC]/80 text-[#0D1B2A] hover:from-[#A8DADC]/90 hover:to-[#A8DADC]/70">
                  {uploadMethod === 'csv' ? '5' : '3'} recipients loaded
                </Badge>
                <Badge variant="outline" className="border-[#A8DADC]/30 text-[#A8DADC]/70">
                  Columns: email, first_name, last_name, company
                </Badge>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}
