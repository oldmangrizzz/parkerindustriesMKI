// @ts-nocheck
import React, { useState, useEffect, useCallback, useRef } from 'react';

// Animations
const fadeIn = `@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`;
const floatAnimation = `
  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
    100% { transform: translateY(0px); }
  }
`;

// Mock components and icons
const DynamicBackground = () => (
  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-purple-900 animate-gradient-x"></div>
);

const FloatingAgents = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <style>{floatAnimation}</style>
    <div className="w-4 h-4 bg-blue-500 rounded-full absolute top-1/4 left-1/4 animate-[float_6s_ease-in-out_infinite]"></div>
    <div className="w-3 h-3 bg-purple-500 rounded-full absolute top-3/4 left-3/4 animate-[float_8s_ease-in-out_infinite_0.5s]"></div>
    <div className="w-5 h-5 bg-green-500 rounded-full absolute top-1/2 left-1/2 animate-[float_7s_ease-in-out_infinite_1s]"></div>
  </div>
);

const ChatInterface = React.memo(({ messages }) => (
  <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-4">
    <style>{fadeIn}</style>
    {messages.map((msg, index) => (
      <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} animate-[fadeIn_0.5s_ease-out]`}>
        <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-md ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}>
          {msg.text}
          <div className="text-xs mt-1 opacity-75">{new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    ))}
  </div>
));

const Icon = React.memo(({ name, className = '' }) => (
  <span className={`material-icons ${className}`} aria-hidden="true">{name}</span>
));

// Mock websocket service
const websocketService = {
  connect: () => {},
  on: (event, callback) => {},
  off: (event, callback) => {},
  disconnect: () => {},
  emit: (event, data) => {},
};

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeComponent, setActiveComponent] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  const handleAIResult = useCallback((result) => {
    setMessages(prev => [...prev, { text: result, sender: 'ai' }]);
    setIsProcessing(false);
  }, []);

  useEffect(() => {
    try {
      websocketService.connect();
      websocketService.on('aiResult', handleAIResult);
    } catch (err) {
      setError('Failed to connect to AI service');
    }
    return () => {
      websocketService.off('aiResult', handleAIResult);
      websocketService.disconnect();
    };
  }, [handleAIResult]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (input.trim() === '') return;
    setIsProcessing(true);
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    try {
      websocketService.emit('processAIInput', { input });
    } catch (err) {
      setError('Failed to send message');
      setIsProcessing(false);
    }
    setInput('');
    inputRef.current?.focus();
  };

  const toggleComponent = useCallback((componentName) => {
    setActiveComponent(prev => prev === componentName ? null : componentName);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-100">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <Icon name="error" className="text-red-500 text-4xl mb-4" />
          <p className="text-red-500 font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  // Component toggle buttons
  const ActiveButton = ({ name, onClick }) => (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-700 ring-2 ring-white"
      aria-label={`Hide ${name} component`}
      aria-pressed="true"
    >
      <Icon name={name.toLowerCase()} className="mr-2" />
      <span className="sr-only">Hide {name}</span>
      <span aria-hidden="true">{name}</span>
    </button>
  );

  const InactiveButton = ({ name, onClick }) => (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-700"
      aria-label={`Show ${name} component`}
      aria-pressed="false"
    >
      <Icon name={name.toLowerCase()} className="mr-2" />
      <span className="sr-only">Show {name}</span>
      <span aria-hidden="true">{name}</span>
    </button>
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden font-sans">
      <DynamicBackground />
      <header className="bg-opacity-80 bg-blue-800 text-white p-4 z-10 relative shadow-md">
        <h1 className="text-3xl font-bold flex items-center">
          <Icon name="psychology" className="mr-2" /> Parker Industries AI Interface
        </h1>
      </header>
      <main className="flex-grow flex flex-col md:flex-row p-4 z-10 relative">
        <section className="w-full md:w-3/5 pr-0 md:pr-4 mb-4 md:mb-0">
          <ChatInterface messages={messages} />
          <div ref={chatEndRef} />
          <div className="mt-4 flex">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-grow border rounded-l p-2 bg-opacity-80 bg-white backdrop-filter backdrop-blur-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Type your message..."
              disabled={isProcessing}
              aria-label="Message input"
            />
            <button
              onClick={sendMessage}
              className={`bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-700 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isProcessing}
              aria-label="Send message"
            >
              <Icon name="send" />
            </button>
          </div>
          {isProcessing && (
            <div className="mt-2 text-blue-500 flex items-center">
              <Icon name="autorenew" className="animate-spin mr-2" /> Processing...
            </div>
          )}
        </section>
        <aside className="w-full md:w-2/5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {['Map', 'VFusion3D', 'Audio', 'Code', 'Swarm', 'Memory', 'Performance', 'HuggingFace'].map((name) => (
              activeComponent === name ? (
                <ActiveButton key={name} name={name} onClick={() => toggleComponent(name)} />
              ) : (
                <InactiveButton key={name} name={name} onClick={() => toggleComponent(name)} />
              )
            ))}
          </div>
          {activeComponent && (
            <div className="bg-opacity-80 bg-gray-800 text-white rounded-lg p-4 backdrop-filter backdrop-blur-lg animate-[fadeIn_0.3s_ease-out]">
              <h2 className="text-xl font-semibold mb-2">Active Component: {activeComponent}</h2>
              <p>Component details and controls would go here.</p>
            </div>
          )}
        </aside>
      </main>
      <FloatingAgents />
    </div>
  );
};

export default App;
