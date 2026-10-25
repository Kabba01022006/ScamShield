// Central API configuration for ScamShieldAI
// In local development, defaults to http://localhost:5001
// In production (Vercel, Render, Railway), set VITE_API_URL in environment variables
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
