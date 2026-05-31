const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// Initialize Gemini API
const apiKey = process.env.GEMINI_API_KEY;
let genAI;
if (apiKey && apiKey !== 'replace_with_your_gemini_api_key') {
  genAI = new GoogleGenerativeAI(apiKey);
} else {
  console.warn('⚠️ Warning: GEMINI_API_KEY environment variable is not defined or is set to placeholder.');
}

/**
 * Clean potential markdown-wrapped JSON response from Gemini
 */
function cleanJSONString(str) {
  let cleaned = str.trim();
  // Strip ```json and ``` if present
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '');
  }
  if (cleaned.endsWith('```')) {
    cleaned = cleaned.substring(0, cleaned.length - 3).trim();
  }
  return cleaned;
}

// 1. POST /api/generate-futureme
app.post('/api/generate-futureme', async (req, res) => {
  const { name, age, goal, struggle, oneYearVision, tone } = req.body;

  // Simple validation
  if (!name || !age || !goal || !struggle || !oneYearVision || !tone) {
    return res.status(400).json({
      success: false,
      error: 'Missing required reflection fields.'
    });
  }

  if (!genAI) {
    return res.status(503).json({
      success: false,
      error: 'Gemini API key is not configured on the server.'
    });
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: { responseMimeType: 'application/json' }
    });

    const systemPrompt = `You are FutureMe, the future successful version of the user. You are not a generic motivational coach. You speak with emotional intelligence, clarity, and deep personal understanding. Your job is to help the user see who they are becoming, what they must change, and what they should do next.

Write as if you are the user's future self speaking directly to their current self.

Tone selected by user: ${tone}
Adapt your tone mapping precisely to:
- Motivational: warm, inspiring, supportive
- Brutally Honest: direct, sharp, no excuses
- Calm Mentor: peaceful, wise, grounded
- CEO Mode: strategic, focused, execution-heavy

User details:
Name: ${name}
Age: ${age}
Goal: ${goal}
Current struggle: ${struggle}
One-year vision: ${oneYearVision}

Return only valid JSON in this exact format:
{
  "message": "A powerful 120-180 word message from the future self.",
  "futureIdentity": "A concise description of who the user is becoming.",
  "nextMoves": ["Action 1", "Action 2", "Action 3"],
  "habit": "One small daily habit they should start today.",
  "warning": "One mistake their future self warns them about.",
  "mantra": "A short memorable line they can repeat daily."
}

Make it specific. Avoid generic motivation. Avoid clichés. Make it emotional but practical.`;

    const result = await model.generateContent(systemPrompt);
    const responseText = await result.response.text();
    
    // Clean and parse the response
    const cleanedJson = cleanJSONString(responseText);
    const parsedData = JSON.parse(cleanedJson);

    return res.json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('Error generating FutureMe:', error);
    return res.status(500).json({
      success: false,
      error: 'FutureMe could not respond right now. Try again.'
    });
  }
});

// 2. POST /api/chat-futureme
app.post('/api/chat-futureme', async (req, res) => {
  const { userProfile, chatHistory, question } = req.body;

  if (!userProfile || !question) {
    return res.status(400).json({
      success: false,
      error: 'Missing profile or question data.'
    });
  }

  if (!genAI) {
    return res.status(503).json({
      success: false,
      error: 'Gemini API key is not configured on the server.'
    });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Format chat history
    let historyText = '';
    if (chatHistory && chatHistory.length > 0) {
      historyText = chatHistory.map(chat => {
        const speaker = chat.role === 'user' ? 'You (Current Self)' : 'FutureMe';
        return `${speaker}: ${chat.message}`;
      }).join('\n');
    } else {
      historyText = 'No prior messages.';
    }

    const chatPrompt = `You are FutureMe, the future version of the user who already achieved their one-year vision. Reply directly to the user's question. Be personal, sharp, honest, and useful. Do not sound like a normal AI assistant. Do not mention that you are Gemini or an AI model. Speak like the future self.

User profile:
Name: ${userProfile.name}
Age: ${userProfile.age}
Goal: ${userProfile.goal}
Struggle: ${userProfile.struggle}
One-year vision: ${userProfile.oneYearVision}
Tone: ${userProfile.tone}

Apply this tone profile to your reply:
- Motivational: warm, inspiring, supportive
- Brutally Honest: direct, sharp, no excuses
- Calm Mentor: peaceful, wise, grounded
- CEO Mode: strategic, focused, execution-heavy

Recent chat history:
${historyText}

Current question:
${question}

Reply in 2-5 short paragraphs. Give at least one clear action. Speak directly to the current self.`;

    const result = await model.generateContent(chatPrompt);
    const replyText = await result.response.text();

    return res.json({
      success: true,
      reply: replyText.trim()
    });

  } catch (error) {
    console.error('Error chatting with FutureMe:', error);
    return res.status(500).json({
      success: false,
      error: 'FutureMe could not respond right now. Try again.'
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 FutureMe Backend running on port ${PORT}`);
  console.log(`🌐 Accessible locally at http://localhost:${PORT}`);
});
