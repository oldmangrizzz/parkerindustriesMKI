import React from 'react';

interface ErrorMessageProps {
  message: string;
  onClose: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onClose }) => {
  return (
    <div className="error-message">
      <p>{message}</p>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ErrorMessage;
