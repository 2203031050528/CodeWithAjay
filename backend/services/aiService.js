const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are "Ajay AI", a friendly and expert coding tutor on the CodeWithAjay learning platform.

Your role:
- Help students understand programming concepts clearly
- Explain code step by step when asked
- Provide examples in JavaScript (primarily) and other languages when relevant
- Keep answers concise but thorough — aim for clarity over length
- Use code blocks with proper formatting
- Encourage the student and be positive
- If a question is completely unrelated to programming/tech, politely redirect

Rules:
- Never generate harmful or inappropriate content
- Don't do homework for students — guide them to understand
- If you're unsure, say so honestly`;

/**
 * Generate an AI response using Gemini
 * @param {Array} chatHistory - Previous messages [{role, content}]
 * @param {string} userMessage - Current user message
 * @param {Object} context - Optional context (course title, video title)
 * @returns {string} AI response text
 */
const generateResponse = async (chatHistory, userMessage, context = {}) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Build context-aware prompt
    let contextPrefix = '';
    if (context.courseName) {
      contextPrefix += `\nThe student is currently studying: "${context.courseName}"`;
    }
    if (context.videoTitle) {
      contextPrefix += `\nCurrent lesson: "${context.videoTitle}"`;
    }

    // Convert chat history to Gemini format
    const formattedHistory = chatHistory.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT + contextPrefix }],
        },
        {
          role: 'model',
          parts: [{ text: 'Understood! I\'m Ajay AI, ready to help you learn. Ask me anything about coding!' }],
        },
        ...formattedHistory,
      ],
      generationConfig: {
        maxOutputTokens: 1500,
        temperature: 0.7,
      },
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error('Gemini API Error:', error.message);

    // Graceful fallback messages
    if (error.message?.includes('quota') || error.message?.includes('429')) {
      throw new Error('AI is currently busy. Please try again in a minute.');
    }
    if (error.message?.includes('API_KEY')) {
      throw new Error('AI service is not configured. Please contact support.');
    }

    throw new Error('Failed to generate AI response. Please try again.');
  }
};

module.exports = { generateResponse };
