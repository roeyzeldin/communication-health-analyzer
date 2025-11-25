const { callGroqAPI, cleanJsonResponse } = require('../utils/groqApi');
const { format } = require('date-fns');

// 4. Conflict Detector Node
async function conflictDetector(state) {
    console.log('🔄 Processing Conflict Detector Node...');

    try {
        let content = '';
        let sentimentContext = '';

        // Prepare content and sentiment context
        if (state.parsedEmails && state.parsedEmails.length > 0) {
            content = state.parsedEmails.map((email, idx) =>
                `Email ${idx + 1} (${format(new Date(email.timestamp), 'HH:mm')}):\nFrom: ${email.from}\nTo: ${email.to.join(', ')}\nSubject: ${email.subject}\nContent: "${email.body}"\n`
            ).join('\n---\n');
        } else if (state.parsedTranscript && state.parsedTranscript.length > 0) {
            content = state.parsedTranscript.map((entry, idx) =>
                `Entry ${idx + 1} (${format(new Date(entry.timestamp), 'HH:mm')}):\nSpeaker: ${entry.speaker}\nText: "${entry.text}"\n`
            ).join('\n---\n');
        }

        if (state.sentimentResults) {
            sentimentContext = `Current sentiment context: Overall sentiment ${state.sentimentResults.overallSentiment}/100, trend: ${state.sentimentResults.sentimentTrend}, volatility: ${state.sentimentResults.emotionalVolatility}/100`;
        }

        const systemMessage = `You are a professional communication analyst and conflict resolution expert specializing in workplace relationship dynamics. Detect conflicts, tensions, and relationship health issues in professional conversations.`;

        const prompt = `
Analyze this ${state.type} conversation for conflict patterns, escalation trends, and relationship dynamics.

PARTICIPANTS: ${state.participants.join(', ')}
${sentimentContext}

CONVERSATION:
${content}

Return ONLY a valid JSON object with this exact structure:
{
    "conflictLevel": [0-10 number],
    "conflictType": "[none|professional disagreement|personal tension|hostile conflict]",
    "escalationPattern": "[stable|escalating|de-escalating]",
    "riskFlags": ["flag1", "flag2"],
    "conflictIndicators": {
        "defensiveLanguage": [true|false],
        "blameAttribution": [true|false],
        "personalAttacks": [true|false],
        "aggressiveTone": [true|false],
        "powerStruggle": [true|false],
        "communicationBreakdown": [true|false]
    },
    "relationshipHealth": [0-100 number],
    "relationshipDynamics": {
        "powerBalance": "[balanced|slightly imbalanced|imbalanced]",
        "dominantParty": "[participant name or null]",
        "reciprocity": [0-100 number],
        "trustIndicators": [0-100 number],
        "collaborationLevel": [0-100 number]
    }
}

Conflict Level Scale: 0=harmonious, 2=minor disagreement, 5=moderate conflict, 8=significant conflict, 10=hostile
Look for: dismissive language, blame, authority assertion, passive aggression, collaboration vs competition
`;

        const response = await callGroqAPI(prompt, systemMessage);
        const cleanedResponse = cleanJsonResponse(response);
        const conflictResults = JSON.parse(cleanedResponse);

        console.log('✅ Conflict Detector completed');
        return { conflictResults };

    } catch (error) {
        console.error('❌ Conflict Detector error:', error);
        return {
            conflictResults: null,
            conflictError: error.message
        };
    }
}

module.exports = { conflictDetector };