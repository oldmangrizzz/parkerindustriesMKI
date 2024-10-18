import React, { useState, useEffect } from 'react';
import { Play, BarChart2, Zap } from 'lucide-react';
import websocketService from '../services/websocketService';
import e2bService from '../services/e2bService';

const CodeExecution: React.FC = () => {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [result, setResult] = useState('');
  const [memoryUsage, setMemoryUsage] = useState<{ [key: string]: number }>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [useE2B, setUseE2B] = useState(false);

  useEffect(() => {
    websocketService.on('codeResult', (data: { result: string, cached: boolean }) => {
      setResult(data.result);
      setIsExecuting(false);
    });

    websocketService.on('memoryUsage', (usage: { [key: string]: number }) => {
      setMemoryUsage(usage);
    });

    return () => {
      websocketService.off('codeResult');
      websocketService.off('memoryUsage');
    };
  }, []);

  const executeCode = async () => {
    setIsExecuting(true);
    if (useE2B) {
      try {
        const fragmentId = await e2bService.createFragment(code, language);
        const result = await e2bService.executeFragment(fragmentId);
        setResult(JSON.stringify(result, null, 2));
      } catch (error) {
        console.error('Error executing code with E2B:', error);
        setResult('Error executing code with E2B');
      } finally {
        setIsExecuting(false);
      }
    } else {
      websocketService.emit('executeCode', { code, language });
    }
  };

  const getMemoryUsage = () => {
    websocketService.emit('getMemoryUsage');
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full h-40 p-2 border rounded"
        placeholder="Enter your code here..."
      />
      <div className="mt-4 flex space-x-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="ruby">Ruby</option>
        </select>
        <button
          onClick={executeCode}
          disabled={isExecuting}
          className={`bg-blue-500 text-white p-2 rounded hover:bg-blue-600 flex items-center ${
            isExecuting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Play size={20} className="mr-2" />
          {isExecuting ? 'Executing...' : 'Execute Code'}
        </button>
        <button
          onClick={getMemoryUsage}
          className="bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center"
        >
          <BarChart2 size={20} className="mr-2" />
          Get Memory Usage
        </button>
        <button
          onClick={() => setUseE2B(!useE2B)}
          className={`p-2 rounded flex items-center ${
            useE2B ? 'bg-purple-500 text-white hover:bg-purple-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Zap size={20} className="mr-2" />
          {useE2B ? 'Using E2B' : 'Use E2B'}
        </button>
      </div>
      {result && (
        <div className="mt-4">
          <h3 className="font-bold">Result:</h3>
          <pre className="bg-gray-100 p-2 rounded">{result}</pre>
        </div>
      )}
      {Object.keys(memoryUsage).length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Memory Usage:</h3>
          <ul>
            {Object.entries(memoryUsage).map(([key, value]) => (
              <li key={key}>
                {key}: {value} bytes
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CodeExecution;