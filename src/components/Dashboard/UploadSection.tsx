
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Globe } from 'lucide-react';
import { uploadFile, scrapeUrl } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface UploadSectionProps {
  onProcessStart: (taskId: string) => void;
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onProcessStart }) => {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { token, user } = useAuth();

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    if (!token || !user) {
      toast({
        title: "Error",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Starting URL scraping for:', url);
      const response = await scrapeUrl(url);
      console.log('Scrape response:', response);
      
      onProcessStart(response.task_id);
      toast({
        title: "Success",
        description: "URL scraping started",
      });
      setUrl(''); // Clear the input after successful submission
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start scraping",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!token || !user) {
      toast({
        title: "Error",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    
    try {
      console.log('Starting file upload for:', selectedFile.name);
      const response = await uploadFile(selectedFile);
      console.log('Upload response:', response);
      
      onProcessStart(response.task_id);
      toast({
        title: "Success",
        description: "File upload started",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5" />
          Scrape Website
        </h3>
        <form onSubmit={handleUrlSubmit} className="space-y-4">
          <Input
            type="url"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={isProcessing || !token}>
            {isProcessing ? 'Starting...' : 'Start Scraping'}
          </Button>
        </form>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload PDF
        </h3>
        <div className="space-y-4">
          <Input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            disabled={isProcessing || !token}
          />
          {file && (
            <p className="text-sm text-gray-600">
              Selected: {file.name}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
