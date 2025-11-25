require('dotenv').config();
const express = require('express');
const path = require('path');
const Joi = require('joi');
const { analyzeCommunicationHealth } = require('./workflow/graph');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Email validation schema
const emailSchema = Joi.object({
    id: Joi.string().required(),
    from: Joi.string().email().required(),
    to: Joi.array().items(Joi.string().email()).min(1).required(),
    cc: Joi.array().items(Joi.string().email()).default([]),
    subject: Joi.string().required(),
    body: Joi.string().min(1).required(),
    timestamp: Joi.string().isoDate().required(),
    priority: Joi.string().valid('low', 'normal', 'high', 'urgent').default('normal'),
    isReply: Joi.boolean().default(false),
    replyToId: Joi.string().allow(null).default(null)
});

// Meeting transcript schema
const meetingTranscriptSchema = Joi.object({
    id: Joi.string().required(),
    speaker: Joi.string().required(),
    text: Joi.string().min(1).required(),
    timestamp: Joi.string().isoDate().required(),
    duration: Joi.number().positive().optional() // seconds
});

// Combined conversation schema - supports both emails and meeting transcripts
const conversationSchema = Joi.object({
    conversationId: Joi.string().required(),
    type: Joi.string().valid('email', 'meeting', 'mixed').required(),
    participants: Joi.array().items(Joi.string()).min(2).required(), // Can be emails or names
    
    // For email conversations
    emails: Joi.array().items(emailSchema).when('type', {
        is: Joi.string().valid('email', 'mixed'),
        then: Joi.required(),
        otherwise: Joi.optional().default([])
    }),
    
    // For meeting conversations
    transcript: Joi.array().items(meetingTranscriptSchema).when('type', {
        is: Joi.string().valid('meeting', 'mixed'),
        then: Joi.required(),
        otherwise: Joi.optional().default([])
    }),
    
    metadata: Joi.object({
        source: Joi.string().valid('outlook', 'gmail', 'teams', 'zoom', 'manual').default('manual'),
        extractedAt: Joi.string().isoDate().default(() => new Date().toISOString()),
        version: Joi.string().default('1.0'),
        meetingDuration: Joi.number().positive().optional(), // for meeting type
        meetingDate: Joi.string().isoDate().optional()
    }).default({})
});

// Routes
app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/analyze', async (req, res) => {
    try {
        console.log('\n=== NEW ANALYSIS REQUEST ===');
        console.log('Timestamp:', new Date().toISOString());
        
        // Validate input
        const { error, value: validatedData } = conversationSchema.validate(req.body);
        if (error) {
            console.log('❌ Validation Error:', error.details[0].message);
            return res.status(400).json({
                success: false,
                error: 'Invalid input format',
                details: error.details[0].message
            });
        }

        console.log('✅ Input validation passed');
        
        // Log the received data (summary only)
        console.log('\n📧 CONVERSATION DATA:');
        console.log('Conversation ID:', validatedData.conversationId);
        console.log('Type:', validatedData.type);
        console.log('Participants:', validatedData.participants.join(', '));
        console.log('Source:', validatedData.metadata.source);
        
        if (validatedData.type === 'email' || validatedData.type === 'mixed') {
            console.log('Number of emails:', validatedData.emails.length);
        }
        
        if (validatedData.type === 'meeting' || validatedData.type === 'mixed') {
            console.log('Transcript entries:', validatedData.transcript.length);
        }
        
        // Run the LangGraph workflow
        console.log('\n🚀 Running Communication Health Analysis Workflow...');
        
        // Check if GROQ API key is configured
        if (!process.env.GROQ_API_KEY) {
            console.log('❌ GROQ_API_KEY not configured');
            return res.status(500).json({
                success: false,
                error: 'Configuration Error',
                message: 'GROQ_API_KEY environment variable is required but not configured',
                details: 'Please set your GROQ API key in the .env file. Get a free key at https://console.groq.com'
            });
        }
        
        try {
            // Execute the LangGraph workflow
            const analysisResult = await analyzeCommunicationHealth(validatedData);
            
            if (analysisResult.success) {
                console.log('\n🎯 COMMUNICATION HEALTH ANALYSIS COMPLETED!');
                console.log('📊 Overall Score:', analysisResult.data.overallScore);
                console.log('🏷️ Status:', analysisResult.data.status);
                
                const response = {
                    success: true,
                    data: {
                        conversationId: validatedData.conversationId,
                        type: validatedData.type,
                        status: 'analyzed',
                        message: 'Communication health analysis completed successfully',
                        healthReport: analysisResult.data,
                        emailCount: validatedData.emails ? validatedData.emails.length : 0,
                        transcriptCount: validatedData.transcript ? validatedData.transcript.length : 0,
                        totalParticipants: validatedData.participants.length,
                        processedAt: new Date().toISOString()
                    }
                };
                
                console.log('\n✅ Sending analysis results to client');
                console.log('=== END ANALYSIS REQUEST ===\n');
                
                res.json(response);
            } else {
                console.log('\n❌ Analysis failed:', analysisResult.error);
                
                res.status(500).json({
                    success: false,
                    error: 'Communication health analysis failed',
                    details: analysisResult.error,
                    partialResults: analysisResult.partialResults || null
                });
            }
            
        } catch (workflowError) {
            console.error('\n❌ Workflow execution error:', workflowError);
            
            res.status(500).json({
                success: false,
                error: 'Workflow execution failed',
                details: workflowError.message
            });
        }
        
    } catch (error) {
        console.error('\n❌ Server Error:', error.message);
        console.error('Stack:', error.stack);
        
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: error.message
        });
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Communication Health Analyzer running on http://localhost:${PORT}`);
    console.log(`📊 Ready to analyze email communication health`);
    console.log(`🛠️  Development mode - check console for detailed logs`);
});

module.exports = app;