
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { saveChatbotConfig, getChatbotConfig } from '@/utils/api';
import { Copy, Download, Palette, MessageSquare, Type, Paintbrush, Settings } from 'lucide-react';

interface ChatbotCustomizerProps {
  collectionName: string;
  onComplete?: () => void;
}

const fontFamilies = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Lato', value: 'Lato, sans-serif' },
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Source Sans Pro', value: '"Source Sans Pro", sans-serif' },
  { name: 'Nunito', value: 'Nunito, sans-serif' },
];

const fontStyles = [
  { name: 'Normal', value: 'normal' },
  { name: 'Italic', value: 'italic' },
  { name: 'Bold', value: 'bold' },
  { name: 'Bold Italic', value: 'bold italic' },
];

export const ChatbotCustomizer: React.FC<ChatbotCustomizerProps> = ({ 
  collectionName, 
  onComplete 
}) => {
  const { user } = useAuth();
  const [customTitle, setCustomTitle] = useState('AI Assistant');
  const [customSubtitle, setCustomSubtitle] = useState('Always here to help');
  const [primaryColor, setPrimaryColor] = useState('#3B82F6');
  const [secondaryColor, setSecondaryColor] = useState('#F8FAFC');
  const [textColor, setTextColor] = useState('#1F2937');
  const [fontFamily, setFontFamily] = useState('Inter, sans-serif');
  const [fontSize, setFontSize] = useState('14');
  const [fontStyle, setFontStyle] = useState('normal');
  const [borderRadius, setBorderRadius] = useState('12');
  const [chatPosition, setChatPosition] = useState('bottom-right');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load existing configuration on component mount
  useEffect(() => {
    if (user?.id) {
      loadChatbotConfig();
    }
  }, [user?.id]);

  const loadChatbotConfig = async () => {
    try {
      const config = await getChatbotConfig(user!.id);
      if (config) {
        setCustomTitle(config.title || 'AI Assistant');
        setCustomSubtitle(config.subtitle || 'Always here to help');
        setPrimaryColor(config.primaryColor || '#3B82F6');
        setSecondaryColor(config.secondaryColor || '#F8FAFC');
        setTextColor(config.textColor || '#1F2937');
        setFontFamily(config.fontFamily || 'Inter, sans-serif');
        setFontSize(config.fontSize || '14');
        setFontStyle(config.fontStyle || 'normal');
        setBorderRadius(config.borderRadius || '12');
        setChatPosition(config.position || 'bottom-right');
      }
    } catch (error) {
      console.log('No existing config found, using defaults');
    }
  };

  const saveConfiguration = async () => {
    if (!user?.id) return;

    setIsSaving(true);
    try {
      const config = {
        userId: user.id,
        title: customTitle,
        subtitle: customSubtitle,
        primaryColor,
        secondaryColor,
        textColor,
        fontFamily,
        fontSize,
        fontStyle,
        borderRadius,
        position: chatPosition,
        collectionName
      };

      await saveChatbotConfig(config);
      toast({
        title: "Configuration Saved! 💾",
        description: "Your chatbot customization has been saved",
      });
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: "Error",
        description: "Failed to save configuration",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const generateIframeCode = () => {
    return `<!-- ChatBot Widget - Add this to your website's <head> section -->
<script>
  window.chatbotConfig = {
    title: '${customTitle}',
    subtitle: '${customSubtitle}',
    primaryColor: '${primaryColor}',
    secondaryColor: '${secondaryColor}',
    textColor: '${textColor}',
    fontFamily: '${fontFamily}',
    fontSize: '${fontSize}px',
    fontStyle: '${fontStyle}',
    borderRadius: '${borderRadius}px',
    position: '${chatPosition}',
    collectionName: '${collectionName}',
    userId: '${user?.id}',
    apiUrl: 'http://127.0.0.1:8000/api'
  };
</script>
<script src="https://your-domain.com/chatbot-widget.js"></script>

<!-- Alternative: Direct HTML embed -->
<div id="chatbot-container" style="
  position: fixed;
  ${chatPosition.includes('bottom') ? 'bottom: 20px;' : 'top: 20px;'}
  ${chatPosition.includes('right') ? 'right: 20px;' : 'left: 20px;'}
  z-index: 1000;
  background: ${primaryColor};
  border-radius: ${borderRadius}px;
  padding: 16px;
  color: ${textColor};
  font-family: ${fontFamily};
  font-size: ${fontSize}px;
  font-style: ${fontStyle.includes('italic') ? 'italic' : 'normal'};
  font-weight: ${fontStyle.includes('bold') ? 'bold' : 'normal'};
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  max-width: 300px;
  cursor: pointer;
">
  <div style="font-weight: bold; margin-bottom: 4px; color: white;">${customTitle}</div>
  <div style="font-size: 12px; opacity: 0.9; color: white;">${customSubtitle}</div>
  <div style="margin-top: 8px; font-size: 10px; color: white; opacity: 0.7;">
    User ID: ${user?.id || 'N/A'}
  </div>
</div>

<script>
// Add click handler to open chat
document.getElementById('chatbot-container').onclick = function() {
  // Initialize chat interface here
  console.log('Opening chat with config:', window.chatbotConfig);
};
</script>`;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateIframeCode());
    toast({
      title: "Copied! 📋",
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

  const handleComplete = async () => {
    await saveConfiguration();
    toast({
      title: "Customization Complete! 🎉",
      description: "Your chatbot is ready for deployment",
    });
    onComplete?.();
  };

  const getPositionText = (position: string) => {
    const positions = {
      'bottom-right': 'Bottom Right',
      'bottom-left': 'Bottom Left',
      'top-right': 'Top Right',
      'top-left': 'Top Left'
    };
    return positions[position as keyof typeof positions];
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mx-auto mb-4 flex items-center justify-center">
          <Palette className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Customize Your Chatbot</h2>
        <p className="text-gray-600">Personalize every aspect of your chatbot's appearance and behavior</p>
        <p className="text-sm text-blue-600 mt-2">Collection: {collectionName} | User: {user?.username}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Customization Form */}
        <div className="space-y-6">
          {/* Basic Settings */}
          <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Settings className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold text-gray-900">Basic Settings</h3>
              </div>
              <Button 
                onClick={saveConfiguration}
                disabled={isSaving}
                size="sm"
                className="bg-green-500 hover:bg-green-600"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Chatbot Title</label>
                <Input
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="AI Assistant"
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Subtitle</label>
                <Input
                  value={customSubtitle}
                  onChange={(e) => setCustomSubtitle(e.target.value)}
                  placeholder="Always here to help"
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Position</label>
                <Select value={chatPosition} onValueChange={setChatPosition}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bottom-right">Bottom Right</SelectItem>
                    <SelectItem value="bottom-left">Bottom Left</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                    <SelectItem value="top-left">Top Left</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Collection ID</label>
                <Input
                  value={collectionName}
                  disabled
                  className="h-11 bg-gray-100"
                />
              </div>
            </div>
          </Card>

          {/* Color Settings */}
          <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Paintbrush className="w-6 h-6 text-purple-500" />
              <h3 className="text-xl font-bold text-gray-900">Colors</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-11 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <Input
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 h-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-12 h-11 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <Input
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 h-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Text Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="w-12 h-11 rounded-lg border-2 border-gray-200 cursor-pointer"
                  />
                  <Input
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="flex-1 h-11"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Typography Settings */}
          <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Type className="w-6 h-6 text-green-500" />
              <h3 className="text-xl font-bold text-gray-900">Typography</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Font Family</label>
                <Select value={fontFamily} onValueChange={setFontFamily}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontFamilies.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Font Style</label>
                <Select value={fontStyle} onValueChange={setFontStyle}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {fontStyles.map((style) => (
                      <SelectItem key={style.value} value={style.value}>
                        {style.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Font Size (px)</label>
                <Input
                  type="number"
                  value={fontSize}
                  onChange={(e) => setFontSize(e.target.value)}
                  min="10"
                  max="24"
                  className="h-11"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Border Radius (px)</label>
                <Input
                  type="number"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value)}
                  min="0"
                  max="50"
                  className="h-11"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Preview and Code */}
        <div className="space-y-6">
          {/* Live Preview */}
          <Card className="p-6 bg-gradient-to-br from-gray-50 to-white border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-6 h-6 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-900">Live Preview</h3>
            </div>
            
            <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl p-8 h-64 overflow-hidden">
              <div className="text-sm text-gray-600 mb-4">Website Preview:</div>
              <div 
                className="absolute shadow-lg transform hover:scale-105 transition-transform cursor-pointer"
                style={{
                  [chatPosition.includes('bottom') ? 'bottom' : 'top']: '20px',
                  [chatPosition.includes('right') ? 'right' : 'left']: '20px',
                  backgroundColor: primaryColor,
                  borderRadius: `${borderRadius}px`,
                  padding: '16px',
                  color: 'white',
                  fontFamily: fontFamily,
                  fontSize: `${fontSize}px`,
                  fontStyle: fontStyle.includes('italic') ? 'italic' : 'normal',
                  fontWeight: fontStyle.includes('bold') ? 'bold' : 'normal',
                  maxWidth: '200px',
                  minWidth: '160px'
                }}
              >
                <div className="font-bold text-sm mb-1">{customTitle}</div>
                <div className="text-xs opacity-90">{customSubtitle}</div>
                <div className="text-xs opacity-75 mt-2">💬 Click to chat</div>
                <div className="text-xs opacity-60 mt-1">Position: {getPositionText(chatPosition)}</div>
              </div>
            </div>
          </Card>

          {/* Embed Code */}
          <Card className="p-6 bg-gradient-to-br from-white to-gray-50 border-0 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <Copy className="w-6 h-6 text-blue-500" />
              <h3 className="text-xl font-bold text-gray-900">Embed Code</h3>
            </div>
            
            <div className="bg-gray-900 rounded-xl p-4 mb-6 max-h-48 overflow-y-auto">
              <pre className="text-green-400 text-xs whitespace-pre-wrap">
                {generateIframeCode()}
              </pre>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={copyToClipboard} 
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
              >
                <Copy className="w-4 h-4" />
                Copy Code
              </Button>
              <Button 
                onClick={downloadCode} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
              <Button 
                onClick={handleComplete}
                className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 ml-auto"
              >
                Complete Setup ✨
              </Button>
            </div>
          </Card>

          {/* Instructions */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 shadow-lg">
            <h4 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
              📋 Deployment Instructions
            </h4>
            <ol className="text-blue-800 text-sm space-y-2 list-decimal list-inside">
              <li>Save your configuration using the "Save" button</li>
              <li>Copy the embed code above</li>
              <li>Paste it into your website's HTML &lt;head&gt; section</li>
              <li>The chatbot will automatically appear in the selected position</li>
              <li>Your visitors can now interact with your AI assistant!</li>
            </ol>
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-blue-800 text-xs">
                <strong>Note:</strong> The chatbot uses your User ID ({user?.id}) as the collection identifier.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
