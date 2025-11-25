// 3. Response Time Analyzer Node
async function responseTimeAnalyzer(state) {
    console.log('🔄 Processing Response Time Analyzer Node...');

    try {
        if (!state.parsedEmails || state.parsedEmails.length < 2) {
            console.log('⚠️ Insufficient emails for response time analysis');
            return {
                responseTimeResults: {
                    averageResponseTime: null,
                    responseTimeScore: 100, // Default high score for single messages
                    timelinessPattern: 'insufficient_data',
                    responseTimes: []
                }
            };
        }

        const emails = state.parsedEmails;
        const responseTimes = [];

        for (let i = 1; i < emails.length; i++) {
            const currentEmail = emails[i];
            const previousEmail = emails[i - 1];

            if (currentEmail.replyToId === previousEmail.id ||
                currentEmail.from !== previousEmail.from) {

                const responseTimeMs = new Date(currentEmail.timestamp) - new Date(previousEmail.timestamp);
                const responseTimeHours = responseTimeMs / (1000 * 60 * 60);

                // Determine urgency level based on subject and priority
                let urgencyLevel = 'normal';
                if (currentEmail.priority === 'urgent' || previousEmail.priority === 'urgent') {
                    urgencyLevel = 'urgent';
                } else if (currentEmail.priority === 'high' || previousEmail.priority === 'high') {
                    urgencyLevel = 'high';
                } else if (currentEmail.subject.toLowerCase().includes('urgent') ||
                    previousEmail.subject.toLowerCase().includes('urgent')) {
                    urgencyLevel = 'urgent';
                }

                // Calculate expected response time
                let expectedMaxTime;
                switch (urgencyLevel) {
                    case 'urgent': expectedMaxTime = 2; break;
                    case 'high': expectedMaxTime = 8; break;
                    default: expectedMaxTime = 24; break;
                }

                const timelinessScore = Math.max(0, 100 - (responseTimeHours / expectedMaxTime) * 100);

                responseTimes.push({
                    fromEmailId: previousEmail.id,
                    toEmailId: currentEmail.id,
                    responseTimeMs,
                    responseTimeHours: Math.round(responseTimeHours * 100) / 100,
                    urgencyLevel,
                    expectedMaxTime,
                    timelinessScore: Math.round(timelinessScore),
                    isDelayed: responseTimeHours > expectedMaxTime
                });
            }
        }

        const avgResponseTime = responseTimes.length > 0 ?
            responseTimes.reduce((sum, rt) => sum + rt.responseTimeMs, 0) / responseTimes.length : 0;

        const avgTimelinessScore = responseTimes.length > 0 ?
            responseTimes.reduce((sum, rt) => sum + rt.timelinessScore, 0) / responseTimes.length : 100;

        // Determine trend
        let timelinessPattern = 'stable';
        if (responseTimes.length >= 3) {
            const firstHalf = responseTimes.slice(0, Math.floor(responseTimes.length / 2));
            const secondHalf = responseTimes.slice(Math.floor(responseTimes.length / 2));
            const firstAvg = firstHalf.reduce((sum, rt) => sum + rt.responseTimeHours, 0) / firstHalf.length;
            const secondAvg = secondHalf.reduce((sum, rt) => sum + rt.responseTimeHours, 0) / secondHalf.length;

            if (secondAvg > firstAvg * 1.5) {
                timelinessPattern = 'deteriorating';
            } else if (secondAvg < firstAvg * 0.7) {
                timelinessPattern = 'improving';
            }
        }

        const responseTimeResults = {
            averageResponseTime: avgResponseTime,
            responseTimeScore: Math.round(avgTimelinessScore),
            timelinessPattern,
            responseTimes,
            patterns: {
                gettingSlower: timelinessPattern === 'deteriorating',
                averageDelayTrend: timelinessPattern,
                consistencyScore: responseTimes.length > 1 ?
                    100 - (Math.max(...responseTimes.map(rt => rt.responseTimeHours)) -
                        Math.min(...responseTimes.map(rt => rt.responseTimeHours))) * 5 : 100
            }
        };

        console.log('✅ Response Time Analyzer completed');
        return { responseTimeResults };

    } catch (error) {
        console.error('❌ Response Time Analyzer error:', error);
        return {
            responseTimeResults: null,
            responseTimeError: error.message
        };
    }
}

module.exports = { responseTimeAnalyzer };