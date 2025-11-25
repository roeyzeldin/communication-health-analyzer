// 1. Email Parser Node
async function emailParser(state) {
    console.log('🔄 Processing Email Parser Node...');

    try {
        const { conversationId, type, participants, emails, transcript, metadata } = state;

        let parsedEmails = [];
        let parsedTranscript = [];

        // Process emails if present
        if (emails && emails.length > 0) {
            parsedEmails = emails.map((email, index) => ({
                ...email,
                wordCount: email.body.split(' ').length,
                threadPosition: index + 1,
                responseTime: index > 0 ?
                    new Date(email.timestamp) - new Date(emails[index - 1].timestamp) : null
            }));
        }

        // Process transcript if present
        if (transcript && transcript.length > 0) {
            parsedTranscript = transcript.map((entry, index) => ({
                ...entry,
                wordCount: entry.text.split(' ').length,
                position: index + 1,
                speakingTime: entry.duration || 0
            }));
        }

        console.log('✅ Email Parser completed');
        return {
            parsedEmails,
            parsedTranscript,
            parsingMetadata: {
                totalEmails: parsedEmails.length,
                totalTranscriptEntries: parsedTranscript.length,
                avgEmailLength: parsedEmails.length > 0 ?
                    parsedEmails.reduce((sum, e) => sum + e.wordCount, 0) / parsedEmails.length : 0,
                avgTranscriptLength: parsedTranscript.length > 0 ?
                    parsedTranscript.reduce((sum, e) => sum + e.wordCount, 0) / parsedTranscript.length : 0,
                processedAt: new Date().toISOString()
            }
        };

    } catch (error) {
        console.error('❌ Email Parser error:', error);
        return { parsingError: error.message };
    }
}

module.exports = { emailParser };