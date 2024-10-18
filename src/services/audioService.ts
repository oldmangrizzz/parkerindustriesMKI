import { DEEPGRAM_API_KEY, HUGGING_FACE_API_KEY } from '../config/env';
import axios from 'axios';

const DEEPGRAM_API_URL = 'https://api.deepgram.com/v1/listen';

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
  const formData = new FormData();
  formData.append('audio', audioBlob);

  try {
    const response = await axios.post(DEEPGRAM_API_URL, formData, {
      headers: {
        'Authorization': `Token ${DEEPGRAM_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
      params: {
        model: 'general',
        smart_format: 'true',
      },
    });

    return response.data.results?.channels[0]?.alternatives[0]?.transcript || '';
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio');
  }
};

const E2_TTS_API_URL = 'https://api-inference.huggingface.co/models/facebook/mms-tts-eng';
const F5_TTS_API_URL = 'https://api-inference.huggingface.co/models/facebook/fastspeech2-en-ljspeech';

export const generateAudio = async (text: string, model: 'e2' | 'f5'): Promise<ArrayBuffer> => {
  const apiUrl = model === 'e2' ? E2_TTS_API_URL : F5_TTS_API_URL;

  try {
    const response = await axios.post(
      apiUrl,
      { inputs: text },
      {
        headers: {
          'Authorization': `Bearer ${HUGGING_FACE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error generating audio:', error);
    throw new Error('Failed to generate audio');
  }
};

export const playAudio = (audioBuffer: ArrayBuffer) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  audioContext.decodeAudioData(audioBuffer, (buffer) => {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
  });
};