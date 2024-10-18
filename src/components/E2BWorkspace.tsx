import React, { useState, useEffect } from 'react';
import e2bService from '../services/e2bService';

const E2BWorkspace: React.FC = () => {
  const [fragments, setFragments] = useState<any[]>([]);
  const [selectedFragment, setSelectedFragment] = useState<string>('');
  const [input, setInput] = useState<string>('');
  const [output, setOutput] = useState<string>('');

  useEffect(() => {
    fetchFragments();
  }, []);

  const fetchFragments = async () => {
    const fetchedFragments = await e2bService.listFragments();
    setFragments(fetchedFragments);
  };

  const createFragment = async () => {
    if (!input) return;
    const fragmentId = await e2bService.createFragment(input, 'javascript');
    await fetchFragments();
    setSelectedFragment(fragmentId);
  };

  const executeFragment = async () => {
    if (!selectedFragment) return;
    const result = await e2bService.executeFragment(selectedFragment);
    setOutput(JSON.stringify(result, null, 2));
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">E2B Workspace</h3>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter code fragment"
        className="w-full p-2 mb-2 border rounded"
      />
      <button onClick={createFragment} className="bg-blue-500 text-white p-2 rounded mb-2 mr-2">Create Fragment</button>
      <select 
        value={selectedFragment} 
        onChange={(e) => setSelectedFragment(e.target.value)}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="">Select a Fragment</option>
        {fragments.map((fragment, index) => (
          <option key={index} value={fragment.id}>{fragment.id}</option>
        ))}
      </select>
      <button onClick={executeFragment} className="bg-green-500 text-white p-2 rounded mb-2">Execute Fragment</button>
      {output && (
        <pre className="bg-gray-100 p-2 rounded overflow-auto">
          {output}
        </pre>
      )}
    </div>
  );
};

export default E2BWorkspace;