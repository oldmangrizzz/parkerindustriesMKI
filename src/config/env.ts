export const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
export const HUGGING_FACE_API_KEY = import.meta.env.VITE_HUGGING_FACE_API_KEY;
export const WEBSOCKET_URL = import.meta.env.VITE_WEBSOCKET_URL;
export const DEEPGRAM_API_KEY = import.meta.env.VITE_DEEPGRAM_API_KEY;
export const LIVEKIT_API_KEY = import.meta.env.VITE_LIVEKIT_API_KEY;
export const LIVEKIT_API_SECRET = import.meta.env.VITE_LIVEKIT_API_SECRET;
export const LIVEKIT_WS_URL = import.meta.env.VITE_LIVEKIT_WS_URL;
export const CONVEX_URL = import.meta.env.VITE_CONVEX_URL;
export const CONVEX_DEPLOY_KEY = import.meta.env.VITE_CONVEX_DEPLOY_KEY;
export const CONVEX_HTTP_URL = import.meta.env.VITE_CONVEX_HTTP_URL;
export const REPLIT_API_KEY = import.meta.env.VITE_REPLIT_API_KEY;
export const E2B_API_KEY = import.meta.env.VITE_E2B_API_KEY;

if (!MAPBOX_ACCESS_TOKEN || !HUGGING_FACE_API_KEY || !WEBSOCKET_URL || !DEEPGRAM_API_KEY || 
    !LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_WS_URL || !CONVEX_URL || 
    !CONVEX_DEPLOY_KEY || !CONVEX_HTTP_URL || !REPLIT_API_KEY || !E2B_API_KEY) {
  console.warn('Some environment variables are missing. Make sure to set them for full functionality.');
}