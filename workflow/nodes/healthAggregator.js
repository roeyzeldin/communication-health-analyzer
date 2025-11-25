const { callGroqAPI, cleanJsonResponse } = require('../utils/groqApi');

// 5. Health Aggregator Node
async function healthAggregator(state) {
    console.log('🔄 Processing Health Aggregator Node...');

    try {
        // Extract component scores
        const emotionalHealth = state.sentimentResults ? state.sentimentResults.overallSentiment : 50;
        const responsivenessHealth = state.responseTimeResults ? state.responseTimeResults.responseTimeScore : 100;
        const conflictHealth = state.conflictResults ?
            Math.max(0, 100 - (state.conflictResults.conflictLevel * 10)) : 100;
        const relationshipHealth = state.conflictResults ?
            state.conflictResults.relationshipHealth : 75;

        // Calculate weighted overall score (different weights for email vs meeting)
        let weights, overallScore;
        
        if (state.type === 'meeting') {
            // For meetings: exclude responsiveness, redistribute weights
            weights = {
                emotionalHealth: 0.30,
                responsivenessHealth: 0.00, // Not applicable for meetings
                conflictHealth: 0.40,
                relationshipHealth: 0.30
            };
            
            overallScore = Math.round(
                emotionalHealth * weights.emotionalHealth +
                conflictHealth * weights.conflictHealth +
                relationshipHealth * weights.relationshipHealth
            );
        } else {
            // For emails: include all metrics
            weights = {
                emotionalHealth: 0.20,
                responsivenessHealth: 0.25,
                conflictHealth: 0.30,
                relationshipHealth: 0.25
            };
            
            overallScore = Math.round(
                emotionalHealth * weights.emotionalHealth +
                responsivenessHealth * weights.responsivenessHealth +
                conflictHealth * weights.conflictHealth +
                relationshipHealth * weights.relationshipHealth
            );
        }

        // Determine status
        let status;
        if (overallScore >= 85) status = 'excellent';
        else if (overallScore >= 70) status = 'good';
        else if (overallScore >= 50) status = 'moderate';
        else if (overallScore >= 30) status = 'at-risk';
        else status = 'critical';

        // Generate insights using LLM
        const insights = await generateInsights(state, overallScore, status, emotionalHealth, responsivenessHealth, conflictHealth, relationshipHealth);

        // Create alerts
        const alerts = createAlerts(state, responsivenessHealth);

        const healthReport = {
            conversationId: state.conversationId,
            type: state.type,
            participants: state.participants,
            overallScore,
            status,
            breakdown: {
                emotionalHealth: { score: emotionalHealth, weight: weights.emotionalHealth },
                responsivenessHealth: { score: responsivenessHealth, weight: weights.responsivenessHealth },
                conflictHealth: { score: conflictHealth, weight: weights.conflictHealth },
                relationshipHealth: { score: relationshipHealth, weight: weights.relationshipHealth }
            },
            alerts,
            insights: insights.insights,
            summary: insights.summary,
            analysisMetadata: {
                analyzedAt: new Date().toISOString(),
                processingTimeMs: Date.now() - new Date(state.parsingMetadata.processedAt).getTime(),
                confidenceScore: 0.85,
                version: '1.0'
            }
        };

        console.log('✅ Health Aggregator completed');
        console.log('\n🎯 FINAL HEALTH REPORT:');
        console.log(JSON.stringify(healthReport, null, 2));

        return { healthReport };

    } catch (error) {
        console.error('❌ Health Aggregator error:', error);
        return {
            healthReport: null,
            aggregatorError: error.message
        };
    }
}

// Helper function to generate insights using LLM
async function generateInsights(state, overallScore, status, emotionalHealth, responsivenessHealth, conflictHealth, relationshipHealth) {
    const systemMessage = `You are a senior organizational psychologist and communication health expert. Provide actionable insights and recommendations for improving communication health.`;

    // Build metrics description based on communication type
    let metricsDescription = `
OVERALL SCORE: ${overallScore}/100 (${status})
- Emotional Health: ${emotionalHealth}/100
- Conflict Management: ${conflictHealth}/100
- Relationship Health: ${relationshipHealth}/100`;

    // Only include responsiveness for email communications
    if (state.type !== 'meeting') {
        metricsDescription += `
- Responsiveness: ${responsivenessHealth}/100`;
    }

    // Build category list for recommendations
    const categoryList = state.type === 'meeting'
        ? '[communication_style|conflict_resolution|relationship_building|meeting_dynamics]'
        : '[communication_style|conflict_resolution|response_time|relationship_building]';

    const insightsPrompt = `
Based on this communication health analysis, provide insights and recommendations:

${metricsDescription}

CONVERSATION TYPE: ${state.type}
PARTICIPANTS: ${state.participants.join(', ')}

${state.type === 'meeting' ? 'NOTE: This is a meeting transcript - focus on real-time communication dynamics, not response times.' : ''}

Return ONLY a valid JSON object:
{
    "summary": "[2-3 sentence executive summary]",
    "insights": {
        "strengths": ["strength1", "strength2"],
        "concerns": ["concern1", "concern2"],
        "recommendations": [
            {
                "priority": "[high|medium|low]",
                "category": "${categoryList.replace(/[\[\]]/g, '')}",
                "action": "[specific actionable recommendation]",
                "expectedImpact": "[+X points improvement expected]"
            }
        ]
    }
}
`;

    const insightsResponse = await callGroqAPI(insightsPrompt, systemMessage);
    const cleanedInsightsResponse = cleanJsonResponse(insightsResponse);
    return JSON.parse(cleanedInsightsResponse);
}

// Helper function to create alerts
function createAlerts(state, responsivenessHealth) {
    const alerts = [];
    
    if (state.conflictResults && state.conflictResults.conflictLevel >= 7) {
        alerts.push({
            type: 'critical_conflict',
            severity: 'critical',
            message: 'High conflict level detected requiring immediate attention',
            recommendation: 'Schedule urgent mediation or supervisor intervention'
        });
    }

    if (responsivenessHealth < 40) {
        alerts.push({
            type: 'poor_responsiveness',
            severity: 'medium',
            message: 'Poor response times affecting communication effectiveness',
            recommendation: 'Establish clear response time expectations and protocols'
        });
    }

    return alerts;
}

module.exports = { healthAggregator };