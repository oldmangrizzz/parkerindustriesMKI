import React, { useState, useEffect } from 'react';
import convexService from '../services/convexService';

const MemoryInsights: React.FC = () => {
  const [memories, setMemories] = useState<any[]>([]);

  useEffect(() => {
    const fetchMemories = async () => {
      const fetchedMemories = await convexService.listMemories();
      setMemories(fetchedMemories);
    };
    fetchMemories();
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-2">Memory Insights</h3>
      <ul className="space-y-2">
        {memories.map((memory, index) => (
          <li key={index} className="border-b pb-2">
            <strong>Key:</strong> {memory.key}<br />
            <strong>Value:</strong> {JSON.stringify(memory.value)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MemoryInsights;