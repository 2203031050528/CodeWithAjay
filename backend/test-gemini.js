require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function checkModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // If the library exposes a way to fetch models, or we can just fetch it manually via HTTP.
    // The SDK does not natively expose listModels easily in old versions, but in recent ones it might not either.
    // Let's just make a raw fetch call to the REST API to see exactly what's up.
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error fetching models:', err);
  }
}

checkModels();
