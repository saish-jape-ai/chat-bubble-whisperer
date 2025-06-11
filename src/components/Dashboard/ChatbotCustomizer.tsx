
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download, Palette, MessageSquare } from 'lucide-react';

interface ChatbotCustomizerProps {
  collectionName: string;
  onComplete?: () => void;
}

export const ChatbotCustomizer: React.FC<ChatbotCustomizerProps> = ({ 
  collectionName, 
  onComplete 
}) => {
  const [customTitle, setCustomTitle] = useState('AI Assistant');
  const [customSubtitle, setCustomSubtitle] = useState('Always here to help');
  const [customColor, setCustomColor] = useState('#3B82F6');
  const { toast } = useToast();

  const generateIframeCode = () => {
    return `<!-- ChatBot Widget - Add this to your website's <head> section -->
<script>
  window.chatbotConfig = {
    title: '${customTitle}',
    subtitle: '${customSubtitle}',
    primaryColor: '${customColor}',
    collectionName: '${collectionName}',
    apiUrl: 'http://127.0.0.1:8000/api'
  };
</script>
<script src="https://your-domain.com/chatbot-widget.js"></script>

<!-- Alternative: Direct HTML embed -->
<div id="chatbot-container" style="
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  background: ${customColor};
  border-radius: 12px;
  padding: 16px;
  color: white;
  font-family: system-ui, sans-serif;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
">
  <div style="font-weight: bold; margin-bottom: 4px;">${customTitle}</div>
  <div style="font-size: 14px; opacity: 0.9;">${customSubtitle}</div>
  <div style="margin-top: 8px; font-size: 12px;">
    Collection: ${collectionName}
  </div>
</div>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateIframeCode());
    toast({
      title: "Copied!",
      description: "Iframe code copied to clipboard",
    });
  };

  const downloadCode = () => {
    const blob = new Blob([generateIframeCode()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'chatbot-embed.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleComplete = () => {
    toast({
      title: "Customization Complete!",
      description: "Your chatbot is ready for deployment",
    });
    onComplete?.();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Customization Form */}
      <Card className="p-8 bg-white/80 backdrop-blur-md shadow-xl border-0">
        <div className="flex items-center gap-3 mb-6">
          <Palette className="w-6 h-6 text-purple-500" />
          <h3 className="text-2xl font-bold text-gray-900">Customize Appearance</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Chatbot Title</label>
            <Input
              value={customTitle}
              onChange={(e) => setCustomTitle(e.target.value)}
              placeholder="AI Assistant"
              className="h-12 border-gray-200 focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Subtitle</label>
            <Input
              value={customSubtitle}
              onChange={(e) => setCustomSubtitle(e.target.value)}
              placeholder="Always here to help"
              className="h-12 border-gray-200 focus:border-purple-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Primary Color</label>
            <div className="flex gap-3">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-16 h-12 rounded-lg border-2 border-gray-200 cursor-pointer"
              />
              <Input
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="flex-1 h-12 border-gray-200 focus:border-purple-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Collection ID</label>
            <Input
              value={collectionName}
              disabled
              className="h-12 bg-gray-50 border-gray-200"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Preview
          </h4>
          <div className="relative">
            <div 
              className="inline-block p-4 rounded-xl text-white shadow-lg transform rotate-1 hover:rotate-0 transition-transform"
              style={{ backgroundColor: customColor }}
            >
              <div className="font-bold text-lg">{customTitle}</div>
              <div className="text-sm opacity-90 mt-1">{customSubtitle}</div>
              <div className="text-xs opacity-75 mt-2">💬 Click to chat</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Embed Code */}
      <Card className="p-8 bg-white/80 backdrop-blur-md shadow-xl border-0">
        <div className="flex items-center gap-3 mb-6">
          <Copy className="w-6 h-6 text-blue-500" />
          <h3 className="text-2xl font-bold text-gray-900">Embed Code</h3>
        </div>
        
        <div className="bg-gray-900 rounded-xl p-6 mb-6">
          <pre className="text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
            {generateIframeCode()}
          </pre>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={copyToClipboard} 
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
          >
            <Copy className="w-4 h-4" />
            Copy Embed Code
          </Button>
          <Button 
            onClick={downloadCode} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download HTML File
          </Button>
          <Button 
            onClick={handleComplete}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 ml-auto"
          >
            Complete Setup
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">📋 Deployment Instructions:</h4>
          <ol className="text-blue-800 text-sm space-y-1 list-decimal list-inside">
            <li>Copy the embed code above</li>
            <li>Paste it into your website's HTML &lt;head&gt; section</li>
            <li>The chatbot will automatically appear in the bottom-right corner</li>
            <li>Your visitors can now interact with your AI assistant!</li>
          </ol>
        </div>
      </Card>
    </div>
  );
};
