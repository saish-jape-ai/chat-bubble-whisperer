
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Upload, Globe, FileText, Sparkles, ArrowRight, AlertTriangle } from 'lucide-react';
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
  const { token, user, logout } = useAuth();

  console.log('UploadSection - Token present:', token ? 'Yes' : 'No');
  console.log('UploadSection - User present:', user ? 'Yes' : 'No');
  console.log('UploadSection - User ID:', user?.id);

  const handleAuthError = () => {
    toast({
      title: "Authentication Error",
      description: "Your session has expired. Please login again.",
      variant: "destructive",
    });
    logout();
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    if (!token || !user) {
      console.error('Missing authentication:', { token: !!token, user: !!user });
      handleAuthError();
      return;
    }

    setIsProcessing(true);
    try {
      console.log('Starting URL scraping for:', url);
      console.log('With user ID:', user.id);
      console.log('Token available:', !!token);
      
      const response = await scrapeUrl(url);
      console.log('Scrape response:', response);
      
      onProcessStart(response.task_id);
      toast({
        title: "Success! 🎉",
        description: "URL scraping started successfully",
      });
      setUrl('');
    } catch (error) {
      console.error('Scraping error details:', error);
      if (error instanceof Error && error.message.includes('Authentication')) {
        handleAuthError();
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to start scraping",
          variant: "destructive",
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    console.log('=== FILE SELECTION ===');
    console.log('Selected file:', selectedFile.name);
    console.log('File type:', selectedFile.type);
    console.log('File size:', selectedFile.size);

    // Validate file type
    if (!selectedFile.type.includes('pdf') && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      toast({
        title: "Invalid File Type",
        description: "Please select a PDF file only",
        variant: "destructive",
      });
      e.target.value = ''; // Reset input
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (selectedFile.size > maxSize) {
      toast({
        title: "File Too Large",
        description: "Please select a PDF file smaller than 10MB",
        variant: "destructive",
      });
      e.target.value = ''; // Reset input
      return;
    }

    if (!token || !user) {
      console.error('Missing authentication for file upload:', { token: !!token, user: !!user });
      handleAuthError();
      e.target.value = ''; // Reset input
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);
    
    try {
      console.log('Starting file upload for:', selectedFile.name);
      console.log('With user ID:', user.id);
      console.log('File size:', selectedFile.size);
      console.log('Token available:', !!token);
      
      const response = await uploadFile(selectedFile);
      console.log('Upload response:', response);
      
      onProcessStart(response.task_id);
      toast({
        title: "Success! 🎉",
        description: "File upload started successfully",
      });
      
      // Reset file input after successful upload
      e.target.value = '';
      setFile(null);
    } catch (error) {
      console.error('Upload error details:', error);
      if (error instanceof Error && error.message.includes('Authentication')) {
        handleAuthError();
      } else {
        toast({
          title: "Upload Error",
          description: error instanceof Error ? error.message : "Failed to upload file",
          variant: "destructive",
        });
      }
      // Reset file input on error
      e.target.value = '';
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  // Show authentication warning if no token
  if (!token || !user) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h3 className="text-xl font-bold text-yellow-800 mb-2">Authentication Required</h3>
            <p className="text-yellow-700">Please login to upload content and create your chatbot.</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {/* Website Scraping Card */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-purple-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Globe className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Scrape Website</h3>
              <p className="text-sm text-gray-600">Extract content from any website</p>
            </div>
          </div>
          
          <form onSubmit={handleUrlSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Website URL</label>
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="h-12 pl-4 pr-12 border-2 border-gray-200 focus:border-blue-500 transition-colors rounded-xl"
                  required
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" 
              disabled={isProcessing || !url.trim()}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  Start Scraping
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-800">
              💡 <strong>Tip:</strong> Make sure the website is publicly accessible and doesn't require authentication.
            </p>
          </div>

          {/* Debug Info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 bg-gray-100 rounded text-xs">
              <p>Debug: Token: {token ? 'Present' : 'Missing'}</p>
              <p>Debug: User: {user ? user.username : 'Missing'}</p>
              <p>Debug: User ID: {user?.id || 'N/A'}</p>
            </div>
          )}
        </div>
      </Card>

      {/* PDF Upload Card */}
      <Card className="group relative overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-100 border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <div className="relative p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Upload PDF</h3>
              <p className="text-sm text-gray-600">Upload your PDF documents</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">Choose PDF File</label>
              <div className="relative">
                <Input
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileUpload}
                  disabled={isProcessing}
                  className="h-12 border-2 border-gray-200 focus:border-emerald-500 transition-colors rounded-xl file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>
            
            {file && (
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <div className="flex items-center gap-3">
                  <Upload className="w-5 h-5 text-emerald-600" />
                  <div>
                    <p className="text-sm font-semibold text-emerald-800">Selected File:</p>
                    <p className="text-xs text-emerald-600">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                  </div>
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm font-semibold text-yellow-800">Processing your PDF...</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-xs text-emerald-800">
              📄 <strong>Supported:</strong> PDF files up to 10MB. Text-based PDFs work best for content extraction.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
