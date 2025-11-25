const axios = require('axios');

// GROQ API configuration
const GROQ_API_BASE = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Helper function to clean JSON response from LLM
function cleanJsonResponse(response) {
    // Remove markdown code blocks if present
    let cleaned = response.trim();
    
    // Remove ```json and ``` if present
    if (cleaned.startsWith('```json')) {
        cleaned = cleaned.replace(/^```json\s*/, '');
    } else if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```\s*/, '');
    }
    
    if (cleaned.endsWith('```')) {
        cleaned = cleaned.replace(/\s*```$/, '');
    }
    
    return cleaned.trim();
}

// Helper function to call GROQ API
async function callGroqAPI(prompt, systemMessage = null, temperature = 0.3) {
    try {
        const messages = [];
        if (systemMessage) {
            messages.push({ role: 'system', content: systemMessage });
        }
        messages.push({ role: 'user', content: prompt });

        const response = await axios.post(GROQ_API_BASE, {
            model: "llama-3.3-70b-versatile",
            messages: messages,
            temperature: temperature,
            max_tokens: 1000
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('GROQ API Error:', error.response?.data || error.message);
        throw new Error(`GROQ API call failed: ${error.message}`);
    }
}

module.exports = {
    callGroqAPI,
    cleanJsonResponse
};