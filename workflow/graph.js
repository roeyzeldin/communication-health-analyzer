const { StateGraph, START, END } = require('@langchain/langgraph');
const {
    emailParser,
    sentimentAnalyzer,
    responseTimeAnalyzer,
    conflictDetector,
    healthAggregator
} = require('./nodes');

// Define the workflow state structure (simple format for LangGraph 0.0.26)
const WorkflowState = {
    conversationId: null,
    type: null,
    participants: [],
    emails: [],
    transcript: [],
    metadata: {},
    parsedEmails: [],
    parsedTranscript: [],
    parsingMetadata: {},
    sentimentResults: null,
    responseTimeResults: null,
    conflictResults: null,
    healthReport: null,
    parsingError: null,
    sentimentError: null,
    responseTimeError: null,
    conflictError: null,
    aggregatorError: null
};

// Conditional router function to skip responseTimeAnalyzer for meetings
function routeAfterParser(state) {
    console.log(`🔀 Routing based on communication type: ${state.type}`);
    
    if (state.type === 'meeting') {
        console.log('⏭️ Skipping responseTimeAnalyzer (not relevant for meetings)');
        // Set default response time results for meetings
        state.responseTimeResults = {
            averageResponseTime: null,
            responseTimeScore: 100,
            timelinessPattern: 'not_applicable_for_meetings',
            responseTimes: []
        };
        return ['sentimentAnalyzer', 'conflictDetector'];
    } else {
        console.log('📧 Including responseTimeAnalyzer for email communication');
        return ['sentimentAnalyzer', 'responseTimeAnalyzer', 'conflictDetector'];
    }
}

// Create the workflow graph
function createCommunicationHealthWorkflow() {
    console.log('🏗️ Creating Communication Health Analysis Workflow...');

    const workflow = new StateGraph({
        channels: WorkflowState
    })

    // Add nodes to the workflow
    .addNode('emailParser', emailParser)
    .addNode('sentimentAnalyzer', sentimentAnalyzer)
    .addNode('responseTimeAnalyzer', responseTimeAnalyzer)
    .addNode('conflictDetector', conflictDetector)
    .addNode('healthAggregator', healthAggregator)

    // Add conditional routing from emailParser
    .addConditionalEdges('emailParser', routeAfterParser)

    // All analysis nodes feed into the health aggregator
    .addEdge('sentimentAnalyzer', 'healthAggregator')
    .addEdge('responseTimeAnalyzer', 'healthAggregator')
    .addEdge('conflictDetector', 'healthAggregator')

    // Set workflow start and end points
    .addEdge(START, 'emailParser')
    .addEdge('healthAggregator', END);

    console.log('✅ Workflow graph created successfully');
    return workflow.compile();
}

// Execute the workflow with error handling
async function analyzeCommunicationHealth(inputData) {
    console.log('\n🚀 Starting Communication Health Analysis...');
    console.log(`📋 Conversation ID: ${inputData.conversationId}`);
    console.log(`📊 Type: ${inputData.type}`);
    console.log(`👥 Participants: ${inputData.participants.join(', ')}`);

    const startTime = Date.now();

    try {
        // Create and execute the workflow
        const workflow = createCommunicationHealthWorkflow();

        console.log('\n⚡ Executing workflow...');
        const result = await workflow.invoke(inputData);

        const executionTime = Date.now() - startTime;
        console.log(`\n✅ Workflow completed in ${executionTime}ms`);

        // Return the health report or error information
        if (result.healthReport) {
            return {
                success: true,
                data: result.healthReport,
                executionTime,
                errors: {
                    parsing: result.parsingError,
                    sentiment: result.sentimentError,
                    responseTime: result.responseTimeError,
                    conflict: result.conflictError,
                    aggregator: result.aggregatorError
                }
            };
        } else {
            return {
                success: false,
                error: 'Workflow completed but no health report generated',
                executionTime,
                errors: {
                    parsing: result.parsingError,
                    sentiment: result.sentimentError,
                    responseTime: result.responseTimeError,
                    conflict: result.conflictError,
                    aggregator: result.aggregatorError
                },
                partialResults: {
                    parsing: result.parsingMetadata,
                    sentiment: result.sentimentResults,
                    responseTime: result.responseTimeResults,
                    conflict: result.conflictResults
                }
            };
        }

    } catch (error) {
        const executionTime = Date.now() - startTime;
        console.error(`\n❌ Workflow failed after ${executionTime}ms:`, error);

        return {
            success: false,
            error: error.message,
            executionTime,
            stack: error.stack
        };
    }
}

module.exports = {
    createCommunicationHealthWorkflow,
    analyzeCommunicationHealth,
    WorkflowState
};