// Main nodes export file - aggregates all individual node modules
const { emailParser } = require('./emailParser');
const { sentimentAnalyzer } = require('./sentimentAnalyzer');
const { responseTimeAnalyzer } = require('./responseTimeAnalyzer');
const { conflictDetector } = require('./conflictDetector');
const { healthAggregator } = require('./healthAggregator');

module.exports = {
    emailParser,
    sentimentAnalyzer,
    responseTimeAnalyzer,
    conflictDetector,
    healthAggregator
};