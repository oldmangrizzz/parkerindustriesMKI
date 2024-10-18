import React, { useState } from 'react';
import huggingFaceSpacesService from '../services/huggingFaceSpacesService';

const HuggingFaceIntegration: React.FC = () => {
  const [spaces, setSpaces] = useState<any[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  const fetchSpaces = async () => {
    const fetchedSpaces = await huggingFaceSpacesService.listSpaces();
    setSpaces(fetchedSpaces);
  };

  const invokeSpace = async () => {
    if (!selectedSpace || !input) return;
    const [author, name] = selectedSpace.split('/');
    const result = await huggingFaceSpacesService.invokeSpaceAPI(author, name, { input });
    setOutput(JSON.stringify(result, null, 2));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">HuggingFace Integration</h3>
      <button onClick={fetchSpaces} className="bg-blue-500 text-white p-2 rounded mb-2">Fetch Spaces</button>
      <select 
        value={selectedSpace} 
        onChange={(e) => setSelectedSpace(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select a Space</option>
        {spaces.map((space, index) => (
          <option key={index} value={`${space.author}/${space.id}`}>{space.title}</option>
        ))}
      </select>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter input for the selected Space"
        className="w-full p-2 mb-2 border rounded"
      />
      <button onClick={invokeSpace} className="bg-green-500 text-white p-2 rounded mb-2">Invoke Space</button>
      {output && (
        <pre className="bg-gray-100 p-2 rounded overflow-auto">
          {output}
        </pre>
      )}
    </div>
  );
};

export default HuggingFaceIntegration;