import React, { useState, useEffect, useRef } from 'react';
import { Mic, StopCircle, Play } from 'lucide-react';
import { transcribeAudio, generateAudio, playAudio } from '../services/audioService';
import { generateSwarmResponse } from '../services/huggingFaceService';
import livekitService from '../services/livekitService';

const AudioInteraction: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [transcription, setTranscription] = useState('');
  const [response, setResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // Connect to LiveKit room
    const connectToLiveKit = async () => {
      try {
        // You need to implement a way to get the LiveKit token
        const token = await getLiveKitToken();
        await livekitService.connect(token);
      } catch (error) {
        console.error('Error connecting to LiveKit:', error);
      }
    };

    connectToLiveKit();

    return () => {
      livekitService.disconnect();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const audioChunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processAudio = async () => {
    if (!audioBlob) return;

    setIsProcessing(true);
    try {
      const transcribedText = await transcribeAudio(audioBlob);
      setTranscription(transcribedText);

      const swarmResponse = await generateSwarmResponse(transcribedText);
      setResponse(swarmResponse);

      const audioBuffer = await generateAudio(swarmResponse, 'e2');
      playAudio(audioBuffer);
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-center space-x-4 mb-4">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
          >
            <Mic size={24} />
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-gray-500 text-white p-2 rounded-full hover:bg-gray-600"
          >
            <StopCircle size={24} />
          </button>
        )}
        {audioBlob && !isProcessing && (
          <button
            onClick={processAudio}
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600"
          >
            <Play size={24} />
          </button>
        )}
      </div>
      {transcription && (
        <div className="mb-4">
          <h3 className="font-bold">Transcription:</h3>
          <p>{transcription}</p>
        </div>
      )}
      {response && (
        <div>
          <h3 className="font-bold">Response:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
};

// Temporary function to get LiveKit token
const getLiveKitToken = async () => {
  // In a real application, you would fetch this from your server
  return 'your_livekit_token_here';
};

export default AudioInteraction;