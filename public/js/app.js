// Main application logic for Communication Health Analyzer

// Utility functions
function showJsonFormat() {
    const formatSection = document.getElementById('jsonFormatSection');
    formatSection.classList.toggle('show');
}

function clearForm() {
    document.getElementById('jsonInput').value = '';
    document.getElementById('responseSection').classList.remove('show');
    document.getElementById('jsonFormatSection').classList.remove('show');
}

function validateJson() {
    const jsonInput = document.getElementById('jsonInput').value.trim();
    const responseSection = document.getElementById('responseSection');
    const responseContent = document.getElementById('responseContent');
    
    if (!jsonInput) {
        responseSection.classList.add('show');
        responseContent.innerHTML = '<div class="error">❌ Please enter some JSON to validate.</div>';
        return;
    }

    try {
        const parsed = JSON.parse(jsonInput);
        
        // Basic validation
        const requiredFields = ['conversationId', 'type', 'participants'];
        const missingFields = requiredFields.filter(field => !parsed[field]);
        
        if (missingFields.length > 0) {
            throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
        }

        if (!['email', 'meeting', 'mixed'].includes(parsed.type)) {
            throw new Error('type must be "email", "meeting", or "mixed"');
        }

        let contentInfo = '';
        if (parsed.type === 'email' || parsed.type === 'mixed') {
            if (!Array.isArray(parsed.emails) || parsed.emails.length === 0) {
                throw new Error('emails must be a non-empty array for email type');
            }
            contentInfo += `<p><strong>Number of Emails:</strong> ${parsed.emails.length}</p>`;
        }
        
        if (parsed.type === 'meeting' || parsed.type === 'mixed') {
            if (!Array.isArray(parsed.transcript) || parsed.transcript.length === 0) {
                throw new Error('transcript must be a non-empty array for meeting type');
            }
            contentInfo += `<p><strong>Transcript Entries:</strong> ${parsed.transcript.length}</p>`;
        }

        responseSection.classList.add('show');
        responseContent.innerHTML = `
            <div class="success">
                <h3>✅ JSON is Valid!</h3>
                <p><strong>Conversation ID:</strong> ${parsed.conversationId}</p>
                <p><strong>Type:</strong> ${parsed.type}</p>
                <p><strong>Participants:</strong> ${parsed.participants.join(', ')}</p>
                ${contentInfo}
                <p>Ready for analysis!</p>
            </div>
        `;
    } catch (error) {
        responseSection.classList.add('show');
        responseContent.innerHTML = `
            <div class="error">
                <h3>❌ JSON Validation Error</h3>
                <p><strong>Error:</strong> ${error.message}</p>
                <p>Please check your JSON format and try again.</p>
            </div>
        `;
    }
}

// Scenario loading functions
function loadEmailScenario() {
    const scenario = document.getElementById('emailScenario').value;
    if (!scenario) {
        alert('Please select an email scenario first!');
        return;
    }
    
    const scenarios = getEmailScenarios();
    const selectedScenario = scenarios[scenario];
    
    document.getElementById('jsonInput').value = JSON.stringify(selectedScenario, null, 2);
    document.getElementById('responseSection').classList.remove('show');
    
    // Reset the dropdown
    document.getElementById('emailScenario').value = '';
}

function loadMeetingScenario() {
    const scenario = document.getElementById('meetingScenario').value;
    if (!scenario) {
        alert('Please select a meeting scenario first!');
        return;
    }
    
    const scenarios = getMeetingScenarios();
    const selectedScenario = scenarios[scenario];
    
    document.getElementById('jsonInput').value = JSON.stringify(selectedScenario, null, 2);
    document.getElementById('responseSection').classList.remove('show');
    
    // Reset the dropdown
    document.getElementById('meetingScenario').value = '';
}

function loadMixedScenario() {
    const scenario = document.getElementById('mixedScenario').value;
    if (!scenario) {
        alert('Please select a mixed scenario first!');
        return;
    }
    
    const scenarios = getMixedScenarios();
    const selectedScenario = scenarios[scenario];
    
    document.getElementById('jsonInput').value = JSON.stringify(selectedScenario, null, 2);
    document.getElementById('responseSection').classList.remove('show');
    
    // Reset the dropdown
    document.getElementById('mixedScenario').value = '';
}

// Form submission handler
function initializeApp() {
    document.getElementById('emailForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const jsonInput = document.getElementById('jsonInput').value.trim();
        const responseSection = document.getElementById('responseSection');
        const responseContent = document.getElementById('responseContent');
        
        if (!jsonInput) {
            responseSection.classList.add('show');
            responseContent.innerHTML = '<div class="error">❌ Please enter JSON data to analyze.</div>';
            return;
        }
        
        // Show loading
        responseSection.classList.add('show');
        responseContent.innerHTML = '<div class="loading">🔄 Analyzing communication health...</div>';
        
        try {
            // Parse and validate JSON
            const emailData = JSON.parse(jsonInput);
            
            console.log('Sending email data:', emailData);
            
            // Send to server
            const response = await fetch('/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(emailData)
            });
            
            const result = await response.json();
            
            if (result.success && result.data.healthReport) {
                renderHealthDashboard(result.data.healthReport, result.data);
            } else if (result.success) {
                // Fallback for when analysis is processing
                let contentSummary = '';
                if (result.data.emailCount > 0) {
                    contentSummary += `<p><strong>Emails Analyzed:</strong> ${result.data.emailCount}</p>`;
                }
                if (result.data.transcriptCount > 0) {
                    contentSummary += `<p><strong>Transcript Entries:</strong> ${result.data.transcriptCount}</p>`;
                }
                
                responseContent.innerHTML = `
                    <div class="success">
                        <h3>✅ Analysis Request Processed</h3>
                        <p><strong>Message:</strong> ${result.data.message}</p>
                        <p><strong>Conversation ID:</strong> ${result.data.conversationId}</p>
                        <p><strong>Type:</strong> ${result.data.type}</p>
                        ${contentSummary}
                        <p><strong>Total Participants:</strong> ${result.data.totalParticipants}</p>
                        <p><strong>Processed At:</strong> ${new Date(result.data.processedAt).toLocaleString()}</p>
                        <p><em>Check the console in your browser developer tools and the server console for detailed logs.</em></p>
                    </div>
                `;
            } else {
                responseContent.innerHTML = `
                    <div class="error">
                        <h3>❌ Analysis Failed</h3>
                        <p><strong>Error:</strong> ${result.error}</p>
                        <p><strong>Details:</strong> ${result.details || 'No additional details'}</p>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Error:', error);
            if (error instanceof SyntaxError) {
                responseContent.innerHTML = `
                    <div class="error">
                        <h3>❌ JSON Parse Error</h3>
                        <p>Invalid JSON format. Please check your JSON and try again.</p>
                        <p><strong>Error:</strong> ${error.message}</p>
                    </div>
                `;
            } else {
                responseContent.innerHTML = `
                    <div class="error">
                        <h3>❌ Network Error</h3>
                        <p>Failed to connect to the analysis server. Please check that the server is running.</p>
                        <p><strong>Error:</strong> ${error.message}</p>
                    </div>
                `;
            }
        }
    });
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Export functions for global use
window.showJsonFormat = showJsonFormat;
window.clearForm = clearForm;
window.validateJson = validateJson;
window.loadEmailScenario = loadEmailScenario;
window.loadMeetingScenario = loadMeetingScenario;
window.loadMixedScenario = loadMixedScenario;