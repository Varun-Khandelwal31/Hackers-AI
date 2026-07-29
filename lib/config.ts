/**
 * Centralized Configuration Constants for HackOps AI
 */

// Primary Google Gemini LLM Model (gemini-2.5-flash is cheap, fast, stable)
export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
export const GEMINI_MODEL_FALLBACKS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
export const GEMINI_MODEL_DISPLAY_NAME = 'Gemini 2.5 Flash';

// Primary Groq High-Speed LLM Model
export const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
export const GROQ_MODEL_DISPLAY_NAME = 'Llama 3.3 70B';
