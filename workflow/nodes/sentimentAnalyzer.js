const { callGroqAPI, cleanJsonResponse } = require('../utils/groqApi');

// 2. Sentiment Analyzer Node
async function sentimentAnalyzer(state) {
    console.log('🔄 Processing Sentiment Analyzer Node...');

    try {
        let content = '';
        let contentItems = [];

        // Prepare content from emails or transcript
        if (state.parsedEmails && state.parsedEmails.length > 0) {
            contentItems = state.parsedEmails.map(email => ({
                id: email.id,
                sender: email.from,
                content: email.body,
                timestamp: email.timestamp
            }));
            content = state.parsedEmails.map((email, idx) =>
                `Email ${idx + 1} (${email.from}): ${email.body}`
            ).join('\n\n');
        } else if (state.parsedTranscript && state.parsedTranscript.length > 0) {
            contentItems = state.parsedTranscript.map(entry => ({
                id: entry.id,
                sender: entry.speaker,
                content: entry.text,
                timestamp: entry.timestamp
            }));
            content = state.parsedTranscript.map((entry, idx) =>
                `${entry.speaker}: ${entry.text}`
            ).join('\n\n');
        }

        const systemMessage = `You are an expert emotional intelligence analyst specializing in workplace communication sentiment analysis. Analyze the emotional tone and sentiment patterns in professional conversations.`;

        const prompt = `
Analyze the sentiment of this ${state.type} conversation between ${state.participants.join(', ')}.

CONVERSATION CONTENT:
${content}

Return ONLY a valid JSON object with this exact structure:
{
    "overallSentiment": [0-100 number],
    "sentimentTrend": "[improving|declining|stable]",
    "emotionalVolatility": [0-100 number],
    "individualItems": [
        {
            "itemId": "email-001 or transcript-001",
            "sentiment": [0-100 number],
            "emotion": "[positive|neutral|worried|frustrated|angry|excited]",
            "confidence": [0-1 number],
            "emotionalKeywords": ["word1", "word2"]
        }
    ],
    "emotionalPattern": {
        "dominantEmotion": "[emotion name]",
        "emotionalRange": [0-100 number],
        "positiveCount": [number],
        "neutralCount": [number],
        "negativeCount": [number]
    }
}

Guidelines:
- Score 0-100 where 0=very negative, 50=neutral, 100=very positive
- Consider workplace context and professional communication norms
- Detect subtle emotions like concern, frustration, enthusiasm
- Identify emotional keywords that drive sentiment scores
`;

        const response = await callGroqAPI(prompt, systemMessage);
        const cleanedResponse = cleanJsonResponse(response);
        const sentimentResults = JSON.parse(cleanedResponse);

        console.log('✅ Sentiment Analyzer completed');
        return { sentimentResults };

    } catch (error) {
        console.error('❌ Sentiment Analyzer error:', error);
        return {
            sentimentResults: null,
            sentimentError: error.message
        };
    }
}

module.exports = { sentimentAnalyzer };