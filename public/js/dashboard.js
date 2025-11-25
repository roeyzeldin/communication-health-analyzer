// Dashboard rendering functions for the Communication Health Analyzer

function renderHealthDashboard(healthReport, analysisData) {
    const responseContent = document.getElementById('responseContent');
    
    // Generate dashboard HTML
    responseContent.innerHTML = `
        <div class="dashboard show">
            ${renderHealthOverview(healthReport)}
            ${renderMetricsGrid(healthReport)}
            ${renderParticipantsSection(healthReport)}
            ${renderAlertsSection(healthReport)}
            ${renderInsightsSection(healthReport)}
            ${renderJsonToggleSection(healthReport)}
        </div>
    `;
}

function renderHealthOverview(healthReport) {
    const statusEmoji = {
        'excellent': '🟢',
        'good': '🟡',
        'moderate': '🟠',
        'at-risk': '🔴',
        'critical': '🚨'
    };

    return `
        <div class="health-overview">
            <div class="health-score">${healthReport.overallScore}/100</div>
            <div class="health-status">${statusEmoji[healthReport.status]} ${healthReport.status}</div>
            <p style="margin-top: 15px; opacity: 0.9;">${healthReport.summary}</p>
        </div>
    `;
}

function renderMetricsGrid(healthReport) {
    const breakdown = healthReport.breakdown;
    const isEmail = healthReport.type === 'email' || healthReport.type === 'mixed';
    
    let metricsCards = `
        ${renderMetricCard('💝 Emotional Health', breakdown.emotionalHealth.score, '#e91e63')}
    `;
    
    // Only show responsiveness for email communications
    if (isEmail && breakdown.responsivenessHealth.weight > 0) {
        metricsCards += renderMetricCard('⚡ Responsiveness', breakdown.responsivenessHealth.score, '#2196f3');
    }
    
    metricsCards += `
        ${renderMetricCard('⚖️ Conflict Management', breakdown.conflictHealth.score, '#ff9800')}
        ${renderMetricCard('🤝 Relationship Health', breakdown.relationshipHealth.score, '#4caf50')}
    `;
    
    // Adjust grid columns based on number of metrics
    const gridColumns = isEmail && breakdown.responsivenessHealth.weight > 0 ? 'repeat(auto-fit, minmax(250px, 1fr))' : 'repeat(auto-fit, minmax(280px, 1fr))';
    
    return `
        <div class="metrics-grid" style="grid-template-columns: ${gridColumns};">
            ${metricsCards}
        </div>
    `;
}

function renderMetricCard(title, score, color) {
    const progressColor = score >= 70 ? '#4caf50' : score >= 50 ? '#ff9800' : '#f44336';
    
    return `
        <div class="metric-card">
            <h3>${title}</h3>
            <div class="metric-score" style="color: ${color};">${score}</div>
            <div class="metric-label">Score out of 100</div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${score}%; background-color: ${progressColor};"></div>
            </div>
        </div>
    `;
}

function renderParticipantsSection(healthReport) {
    const participantTags = healthReport.participants.map(p =>
        `<span class="participant-tag">${p}</span>`
    ).join('');
    
    return `
        <div class="participants-section">
            <h3>👥 Participants (${healthReport.participants.length})</h3>
            <div class="participant-list">${participantTags}</div>
            <p style="margin-top: 15px; color: #666;">
                <strong>Conversation:</strong> ${healthReport.conversationId} •
                <strong>Type:</strong> ${healthReport.type} •
                <strong>Analyzed:</strong> ${new Date(healthReport.analysisMetadata.analyzedAt).toLocaleString()}
            </p>
        </div>
    `;
}

function renderAlertsSection(healthReport) {
    if (!healthReport.alerts || healthReport.alerts.length === 0) {
        return '';
    }

    const alertItems = healthReport.alerts.map(alert => {
        const alertClass = `alert-${alert.severity}`;
        const alertEmoji = {
            'critical': '🚨',
            'medium': '⚠️',
            'low': 'ℹ️'
        };
        
        return `
            <div class="alert-item ${alertClass}">
                <div style="font-size: 1.2rem;">${alertEmoji[alert.severity]}</div>
                <div>
                    <strong>${alert.message}</strong>
                    <p style="margin-top: 5px;">${alert.recommendation}</p>
                </div>
            </div>
        `;
    }).join('');

    return `
        <div class="alert-section">
            <h3 style="color: #f44336; margin-bottom: 15px;">🚨 Alerts</h3>
            ${alertItems}
        </div>
    `;
}

function renderInsightsSection(healthReport) {
    const insights = healthReport.insights;
    
    const strengthItems = insights.strengths.map(strength =>
        `<div class="insight-item insight-strength">✅ ${strength}</div>`
    ).join('');
    
    const concernItems = insights.concerns.map(concern =>
        `<div class="insight-item insight-concern">⚠️ ${concern}</div>`
    ).join('');
    
    const recommendationItems = insights.recommendations.map(rec =>
        `<div class="insight-item insight-recommendation">
            <strong>${rec.priority.toUpperCase()}:</strong> ${rec.action}
            <small style="display: block; margin-top: 5px; opacity: 0.7;">${rec.expectedImpact}</small>
        </div>`
    ).join('');

    return `
        <div class="insights-section">
            <h3>💡 Insights & Recommendations</h3>
            
            <h4 style="color: #4caf50; margin: 20px 0 10px 0;">Strengths</h4>
            ${strengthItems}
            
            <h4 style="color: #ff9800; margin: 20px 0 10px 0;">Areas of Concern</h4>
            ${concernItems}
            
            <h4 style="color: #9c27b0; margin: 20px 0 10px 0;">Recommendations</h4>
            ${recommendationItems}
        </div>
    `;
}

function renderJsonToggleSection(healthReport) {
    return `
        <div class="json-toggle-section">
            <button class="btn btn-secondary" onclick="toggleRawJson()">📋 View Raw JSON</button>
            <div id="rawJsonSection" class="raw-json">
                <h4>Raw Analysis Data:</h4>
                <pre>${JSON.stringify(healthReport, null, 2)}</pre>
            </div>
        </div>
    `;
}

function toggleRawJson() {
    const rawJsonSection = document.getElementById('rawJsonSection');
    rawJsonSection.classList.toggle('show');
}

// Export functions for global use
window.renderHealthDashboard = renderHealthDashboard;
window.toggleRawJson = toggleRawJson;