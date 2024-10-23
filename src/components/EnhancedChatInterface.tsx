import React from 'react';

interface EnhancedChatInterfaceProps {
  transcript: string;
  resetTranscript: () => void;
}

const EnhancedChatInterface: React.FC<EnhancedChatInterfaceProps> = ({ transcript, resetTranscript }) => {
  return (
    <div>
      <h2>Enhanced Chat Interface</h2>
      <p>Transcript: {transcript}</p>
      <button onClick={resetTranscript}>Reset Transcript</button>
    </div>
  );
};

export default EnhancedChatInterface;
