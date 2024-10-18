import React, { useState, useEffect } from 'react';
import { MessageSquare, Send, Map, Box, Mic, Code, BarChart2, Zap, Brain, Network, GitBranch, Cpu } from 'lucide-react';
import ChatInterface from './components/ChatInterface';
import MapView from './components/MapView';
import VFusion3DView from './components/VFusion3DView';
import AudioInteraction from './components/AudioInteraction';
import CodeExecution from './components/CodeExecution';
import DynamicBackground from './components/DynamicBackground';
import FloatingAgents from './components/FloatingAgents';
import SwarmVisualization from './components/SwarmVisualization';
import MemoryInsights from './components/MemoryInsights';
import ModelPerformance from './components/ModelPerformance';
import HuggingFaceIntegration from './components/HuggingFaceIntegration';
import E2BWorkspace from './components/E2BWorkspace';
import agentService from './services/agentService';
import websocketService from './services/websocketService';
import e2bService from './services/e2bService';
import convexService from './services/convexService';

function App() {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showVFusion3D, setShowVFusion3D] = useState(false);
  const [showAudioInteraction, setShowAudioInteraction] = useState(false);
  const [showCodeExecution, setShowCodeExecution] = useState(false);
  const [showSwarmVisualization, setShowSwarmVisualization] = useState(false);
  const [showMemoryInsights, setShowMemoryInsights] = useState(false);
  const [showModelPerformance, setShowModelPerformance] = useState(false);
  const [showHuggingFaceIntegration, setShowHuggingFaceIntegration] = useState(false);
  const [showE2BWorkspace, setShowE2BWorkspace] = useState(false);
  const [swarmData, setSwarmData] = useState([]);
  const [modelInsights, setModelInsights] = useState([]);

  useEffect(() => {
    e2bService.initialize();
    convexService.initialize();
    websocketService.on('aiResult', handleAIResult);
    return () => {
      websocketService.off('aiResult', handleAIResult);
    };
  }, []);

  const handleAIResult = (result: string) => {
    setMessages(prev => [...prev, { text: result, sender: 'ai' }]);
    setIsProcessing(false);
  };

  const sendMessage = async () => {
    if (input.trim() === '') return;
    setIsProcessing(true);
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    websocketService.emit('processAIInput', { input });
    setInput('');
  };

  const updateSwarmVisualization = (data: any) => {
    setSwarmData(data.agents);
    setModelInsights(data.insights);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex flex-col">
      <DynamicBackground />
      <header className="bg-opacity-80 bg-blue-800 text-white p-4 z-10">
        <h1 className="text-3xl font-bold flex items-center">
          <Brain className="mr-2" /> Parker Industries AI Interface
        </h1>
      </header>
      <div className="flex-grow flex p-4 z-10">
        <div className="w-3/5 pr-4">
          <ChatInterface messages={messages} />
          <div className="mt-4 flex">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow border rounded-l p-2 bg-opacity-80 bg-white backdrop-filter backdrop-blur-lg"
              placeholder="Type your message..."
              disabled={isProcessing}
            />
            <button
              onClick={sendMessage}
              className={`bg-blue-500 text-white p-2 rounded-r hover:bg-blue-600 transition-colors duration-200 ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isProcessing}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
        <div className="w-2/5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setShowMap(!showMap)}
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
            >
              <Map size={20} className="mr-2" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
            <button
              onClick={() => setShowVFusion3D(!showVFusion3D)}
              className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition-colors duration-200 flex items-center justify-center"
            >
              <Box size={20} className="mr-2" />
              {showVFusion3D ? 'Hide 3D View' : 'Show 3D View'}
            </button>
            <button
              onClick={() => setShowAudioInteraction(!showAudioInteraction)}
              className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
            >
              <Mic size={20} className="mr-2" />
              {showAudioInteraction ? 'Hide Audio' : 'Show Audio'}
            </button>
            <button
              onClick={() => setShowCodeExecution(!showCodeExecution)}
              className="bg-indigo-500 text-white p-2 rounded hover:bg-indigo-600 transition-colors duration-200 flex items-center justify-center"
            >
              <Code size={20} className="mr-2" />
              {showCodeExecution ? 'Hide Code Execution' : 'Show Code Execution'}
            </button>
            <button
              onClick={() => setShowSwarmVisualization(!showSwarmVisualization)}
              className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors duration-200 flex items-center justify-center"
            >
              <Network size={20} className="mr-2" />
              {showSwarmVisualization ? 'Hide Swarm' : 'Show Swarm'}
            </button>
            <button
              onClick={() => setShowMemoryInsights(!showMemoryInsights)}
              className="bg-pink-500 text-white p-2 rounded hover:bg-pink-600 transition-colors duration-200 flex items-center justify-center"
            >
              <GitBranch size={20} className="mr-2" />
              {showMemoryInsights ? 'Hide Memory' : 'Show Memory'}
            </button>
            <button
              onClick={() => setShowModelPerformance(!showModelPerformance)}
              className="bg-teal-500 text-white p-2 rounded hover:bg-teal-600 transition-colors duration-200 flex items-center justify-center"
            >
              <Cpu size={20} className="mr-2" />
              {showModelPerformance ? 'Hide Performance' : 'Show Performance'}
            </button>
            <button
              onClick={() => setShowHuggingFaceIntegration(!showHuggingFaceIntegration)}
              className="bg-orange-500 text-white p-2 rounded hover:bg-orange-600 transition-colors duration-200 flex items-center justify-center"
            >
              <Zap size={20} className="mr-2" />
              {showHuggingFaceIntegration ? 'Hide HuggingFace' : 'Show HuggingFace'}
            </button>
          </div>
          {showMap && <MapView />}
          {showVFusion3D && <VFusion3DView swarmData={swarmData} modelInsights={modelInsights} />}
          {showAudioInteraction && <AudioInteraction />}
          {showCodeExecution && <CodeExecution />}
          {showSwarmVisualization && <SwarmVisualization data={swarmData} />}
          {showMemoryInsights && <MemoryInsights />}
          {showModelPerformance && <ModelPerformance />}
          {showHuggingFaceIntegration && <HuggingFaceIntegration />}
          {showE2BWorkspace && <E2BWorkspace />}
        </div>
      </div>
      <FloatingAgents />
    </div>
  );
}

export default App;