'use client';

import { useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion } from 'motion/react';

export function UploadSection({ onDataLoaded }) {
  const [uploadMethod, setUploadMethod] = useState('csv');
  const [linkUrl, setLinkUrl] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState([]);

  const uploadAndValidateCSV = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8000/validate-csv", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Validation failed");
      }

      const result = await response.json();

      const validData = result.valid_rows.map((row) => ({
        first_name: row.first_name ,
        last_name: row.last_name ,
        email: row.email
      }));

      setTableData(validData);
      setColumns(["first_name", "last_name", "email"]);
      onDataLoaded?.(validData, columns);
      setIsUploaded(true);
      setFileName(file.name);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to validate CSV. Check console for details.");
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAndValidateCSV(file);
    }
  };

  const handleLinkSubmit = () => {
    if (linkUrl) {
      const mockData = [];
      const cols = ["first_name", "last_name", "email"];
      setTableData(mockData);
      setColumns(cols);
      onDataLoaded?.(mockData, cols);
      setIsUploaded(true);
      setFileName('Google Sheet');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="relative overflow-hidden bg-[#1B2A3A]/80 backdrop-blur-sm border-[#A8DADC]/20 shadow-xl">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#A8DADC]/10 rounded-full blur-3xl"></div>

        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-[#A8DADC] to-[#A8DADC]/70 rounded-lg">
              <Upload className="w-5 h-5 text-[#A8DADC]" />
            </div>
            <h2 className="text-[#F1FAEE]">Step 1: Upload Recipients</h2>
          </div>

          {/* Tabs */}
          <Tabs value={uploadMethod} onValueChange={(v) => setUploadMethod(v)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#0D1B2A] border border-[#A8DADC]/20">
              <TabsTrigger value="csv">CSV File</TabsTrigger>
              <TabsTrigger value="link">Link</TabsTrigger>
            </TabsList>

            {/* CSV Upload */}
            <TabsContent value="csv" className="mt-4">
              <Label htmlFor="csv-upload" className="text-[#A8DADC]/80 mb-2 block">
                Upload CSV file
              </Label>

              <Input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="bg-[#0D1B2A] border-[#A8DADC]/30 text-[#A8DADC]/80"
              />

              {isUploaded && uploadMethod === 'csv' && (
                <div className="flex items-center gap-2 text-[#A8DADC] bg-[#0D1B2A] p-3 rounded-lg border border-[#A8DADC]/30 mt-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>File uploaded: {fileName}</span>
                </div>
              )}
            </TabsContent>

            {/* Link Upload */}
            <TabsContent value="link" className="mt-4">
              <Label className="text-[#A8DADC]/80 mb-2 block">Google Sheet URL</Label>

              <div className="flex gap-3">
                <Input
                  type="url"
                  placeholder="https://docs.google.com/..."
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="bg-[#0D1B2A] border-[#A8DADC]/30 text-[#F1FAEE]"
                />
                <Button onClick={handleLinkSubmit}>Fetch</Button>
              </div>

              {isUploaded && uploadMethod === 'link' && (
                <div className="flex items-center gap-2 text-[#A8DADC] bg-[#0D1B2A] p-3 rounded-lg border border-[#A8DADC]/30 mt-3">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Data loaded from: {fileName}</span>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Loaded Section + TABLE */}
          {isUploaded && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 pt-4 border-t border-[#A8DADC]/20 text-[#A8DADC]">
              <div className="flex items-center gap-2 mb-3 text-[#A8DADC]">
                <Badge>{tableData.length} recipients loaded</Badge>
                <Badge variant="outline">Columns: {columns.join(', ')}</Badge>
              </div>

              <div className="max-h-1/12 overflow-y-scroll border border-[#A8DADC]/20 rounded-lg">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-[#0D1B2A] text-[#A8DADC] sticky top-0">
                    <tr>
                      <th className="p-2 text-left border-b border-[#A8DADC]/20">first_name</th>
                      <th className="p-2 text-left border-b border-[#A8DADC]/20">last_name</th>
                      <th className="p-2 text-left border-b border-[#A8DADC]/20">email</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#A8DADC]">
                    {tableData.map((row, i) => (
                      <tr key={i} className="border-b border-[#A8DADC]/10 hover:bg-[#1B2A3A]/40 transition">
                        <td className="p-2">{row.first_name}</td>
                        <td className="p-2">{row.last_name}</td>
                        <td className="p-2">{row.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </motion.div>
  );
}