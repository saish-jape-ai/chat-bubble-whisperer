
import { ExternalLink, MessageCircle, Smartphone, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MessageCircle className="w-4 h-4" />
            AI Chatbot Widget
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Embeddable AI Chatbot
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"> Widget</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A beautiful, responsive chatbot widget that can be embedded into any website with just one script tag. 
            Connect to your AI backend and provide instant support to your users.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => window.open('/demo.html', '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Easy Integration</CardTitle>
              <CardDescription>
                Add the chatbot to any website with just one script tag in the head section.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm">
                &lt;script src="chatbot-widget.js"&gt;&lt;/script&gt;
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Responsive Design</CardTitle>
              <CardDescription>
                Beautiful UI that works perfectly on desktop, tablet, and mobile devices.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Smooth animations</li>
                <li>• Soft shadows & rounded corners</li>
                <li>• Mobile-optimized popup</li>
                <li>• Accessible design</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Smart Features</CardTitle>
              <CardDescription>
                Advanced chat functionality with typing indicators and context awareness.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Typing animations</li>
                <li>• Loading spinners</li>
                <li>• Context warnings</li>
                <li>• Error handling</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* API Integration Section */}
        <Card className="border-0 shadow-lg mb-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">API Integration</CardTitle>
            <CardDescription>
              The widget connects to your AI backend automatically
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Request Details</h4>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="text-sm font-mono space-y-2">
                    <div><span className="text-purple-600">POST</span> http://127.0.0.1:8000/ask-question</div>
                    <div className="text-gray-600">Content-Type: application/json</div>
                    <div className="text-gray-600">Accept: application/json</div>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Request Body</h4>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <pre className="text-sm font-mono text-gray-700">{`{
  "question": "USER_QUESTION",
  "collection_name": "baapcompany"
}`}</pre>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Implementation Guide */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Implementation Guide</CardTitle>
            <CardDescription>
              Get started in under 2 minutes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-semibold mb-2">Download the Widget</h4>
                  <p className="text-gray-600">Get the <code className="bg-gray-100 px-2 py-1 rounded">chatbot-widget.js</code> file and host it on your server.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-semibold mb-2">Add Script Tag</h4>
                  <p className="text-gray-600">Include the script in your website's head section.</p>
                  <div className="bg-gray-100 p-3 rounded-lg mt-2 font-mono text-sm">
                    &lt;script src="path/to/chatbot-widget.js"&gt;&lt;/script&gt;
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</div>
                <div>
                  <h4 className="font-semibold mb-2">Configure Your API</h4>
                  <p className="text-gray-600">Make sure your AI backend is running on the configured endpoint and ready to receive requests.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
