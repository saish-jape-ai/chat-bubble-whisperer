
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Download } from 'lucide-react';

interface ChatbotCustomizerProps {
  collectionName: string;
}

export const ChatbotCustomizer: React.FC<ChatbotCustomizerProps> = ({ collectionName }) => {
  const [selectedTheme, setSelectedTheme] = useState('greenish');
  const [customTitle, setCustomTitle] = useState('AI Assistant');
  const [customSubtitle, setCustomSubtitle] = useState('Always here to help');
  const { toast } = useToast();

  const themes = [
    'greenish', 'ocean', 'sunset', 'royal', 'crimson', 'forest', 'slate', 'amber',
    'midnight', 'lavender', 'mint', 'coral', 'neon', 'tropical', 'galaxy', 'aurora'
  ];

  const generateIframeCode = () => {
    return `<!-- Chatbot Widget -->
<script>
  window.chatbotConfig = {
    theme: '${selectedTheme}',
    title: '${customTitle}',
    subtitle: '${customSubtitle}',
    collectionName: '${collectionName}'
  };
</script>
<script src="https://your-domain.com/chatbot-widget.js"></script>`;
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

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-6">Customize Your Chatbot</h3>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Chatbot Title</label>
          <Input
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="AI Assistant"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Subtitle</label>
          <Input
            value={customSubtitle}
            onChange={(e) => setCustomSubtitle(e.target.value)}
            placeholder="Always here to help"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <div className="grid grid-cols-4 gap-2">
            {themes.map((theme) => (
              <button
                key={theme}
                onClick={() => setSelectedTheme(theme)}
                className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${
                  selectedTheme === theme
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {theme}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Embed Code</label>
          <div className="bg-gray-100 p-4 rounded-lg">
            <pre className="text-sm overflow-x-auto">
              {generateIframeCode()}
            </pre>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={copyToClipboard} variant="outline" className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copy Code
          </Button>
          <Button onClick={downloadCode} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
        </div>
      </div>
    </Card>
  );
};
