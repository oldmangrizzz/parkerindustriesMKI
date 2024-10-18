import React, { useEffect, useState } from 'react';
import { User, Brain, Zap, Database, Cloud } from 'lucide-react';

const agents = [
  { icon: User, name: 'Peter Parker' },
  { icon: Brain, name: 'AI Research' },
  { icon: Zap, name: 'Web Dev' },
  { icon: Database, name: 'Data Analysis' },
  { icon: Cloud, name: 'Cloud Computing' },
];

const FloatingAgents: React.FC = () => {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    const updatePositions = () => {
      setPositions(
        agents.map(() => ({
          x: Math.random() * (window.innerWidth - 100),
          y: Math.random() * (window.innerHeight - 100),
        }))
      );
    };

    updatePositions();
    const interval = setInterval(updatePositions, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {agents.map((Agent, index) => (
        <div
          key={index}
          className="absolute transition-all duration-1000 ease-in-out"
          style={{
            left: `${positions[index]?.x || 0}px`,
            top: `${positions[index]?.y || 0}px`,
          }}
        >
          <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-full p-3 shadow-lg">
            <Agent.icon size={24} className="text-white" />
          </div>
          <div className="text-white text-xs mt-1 text-center">{Agent.name}</div>
        </div>
      ))}
    </>
  );
};

export default FloatingAgents;