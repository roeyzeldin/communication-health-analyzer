// Sample data scenarios for the Communication Health Analyzer

function getEmailScenarios() {
    return {
        good: {
            "conversationId": "email-good-001",
            "type": "email",
            "participants": ["sarah@company.com", "mike@company.com", "jen@company.com"],
            "emails": [
                {
                    "id": "email-001",
                    "from": "sarah@company.com",
                    "to": ["mike@company.com", "jen@company.com"],
                    "cc": [],
                    "subject": "Project Alpha - Great Progress Update! 🎉",
                    "body": "Hi team! I'm thrilled to share that we've completed the initial phase ahead of schedule. The client feedback has been overwhelmingly positive. Thank you all for your excellent work and collaboration. Let's discuss next steps in tomorrow's standup.",
                    "timestamp": "2024-01-15T09:00:00.000Z",
                    "priority": "normal",
                    "isReply": false,
                    "replyToId": null
                },
                {
                    "id": "email-002",
                    "from": "mike@company.com",
                    "to": ["sarah@company.com", "jen@company.com"],
                    "cc": [],
                    "subject": "RE: Project Alpha - Great Progress Update! 🎉",
                    "body": "That's fantastic news, Sarah! The team chemistry has been amazing on this project. I'm excited about the next phase. Jen, your UI designs really made the difference. Looking forward to tomorrow's meeting!",
                    "timestamp": "2024-01-15T11:15:00.000Z",
                    "priority": "normal",
                    "isReply": true,
                    "replyToId": "email-001"
                },
                {
                    "id": "email-003",
                    "from": "jen@company.com",
                    "to": ["sarah@company.com", "mike@company.com"],
                    "cc": [],
                    "subject": "RE: Project Alpha - Great Progress Update! 🎉",
                    "body": "Thanks Mike! I appreciate the recognition. Sarah, your project management has been stellar - keeping us all aligned and motivated. I have some ideas for phase 2 that I think you'll both love. Can't wait to share tomorrow!",
                    "timestamp": "2024-01-15T13:45:00.000Z",
                    "priority": "normal",
                    "isReply": true,
                    "replyToId": "email-002"
                }
            ],
            "metadata": {
                "source": "outlook",
                "extractedAt": "2024-01-16T10:00:00.000Z",
                "version": "1.0"
            }
        },
        medium: {
            "conversationId": "email-medium-001",
            "type": "email",
            "participants": ["alex@company.com", "jordan@company.com"],
            "emails": [
                {
                    "id": "email-001",
                    "from": "alex@company.com",
                    "to": ["jordan@company.com"],
                    "cc": [],
                    "subject": "Budget Concerns - Need Discussion",
                    "body": "Hi Jordan, I've been reviewing the quarterly budget and I'm concerned about some of the spending in your department. We're 15% over budget and I need to understand what's driving these costs.",
                    "timestamp": "2024-01-15T09:00:00.000Z",
                    "priority": "high",
                    "isReply": false,
                    "replyToId": null
                },
                {
                    "id": "email-002",
                    "from": "jordan@company.com",
                    "to": ["alex@company.com"],
                    "cc": [],
                    "subject": "RE: Budget Concerns - Need Discussion",
                    "body": "Alex, I understand your concern. The overspend is due to the emergency server upgrades that were necessary after the security incident last month. I sent a memo about this but maybe it got lost. These were critical infrastructure investments.",
                    "timestamp": "2024-01-15T14:30:00.000Z",
                    "priority": "normal",
                    "isReply": true,
                    "replyToId": "email-001"
                },
                {
                    "id": "email-003",
                    "from": "alex@company.com",
                    "to": ["jordan@company.com"],
                    "cc": [],
                    "subject": "RE: Budget Concerns - Need Discussion",
                    "body": "I don't recall receiving that memo, Jordan. Going forward, please ensure all major expenditures are approved through the proper channels. We need better communication to avoid these surprises. Can we set up a meeting to review the process?",
                    "timestamp": "2024-01-15T16:45:00.000Z",
                    "priority": "high",
                    "isReply": true,
                    "replyToId": "email-002"
                }
            ],
            "metadata": {
                "source": "outlook",
                "extractedAt": "2024-01-16T10:00:00.000Z",
                "version": "1.0"
            }
        },
        bad: {
            "conversationId": "email-bad-001",
            "type": "email",
            "participants": ["david@company.com", "lisa@company.com"],
            "emails": [
                {
                    "id": "email-001",
                    "from": "david@company.com",
                    "to": ["lisa@company.com"],
                    "cc": [],
                    "subject": "URGENT: Missed Deadline - This is Unacceptable",
                    "body": "Lisa, I am extremely disappointed that your team missed another critical deadline. This is the third time this quarter. Your lack of planning and execution is putting our entire department at risk. I expect an immediate explanation and action plan.",
                    "timestamp": "2024-01-15T08:30:00.000Z",
                    "priority": "urgent",
                    "isReply": false,
                    "replyToId": null
                },
                {
                    "id": "email-002",
                    "from": "lisa@company.com",
                    "to": ["david@company.com"],
                    "cc": [],
                    "subject": "RE: URGENT: Missed Deadline - This is Unacceptable",
                    "body": "David, your tone is completely unprofessional. My team has been working 60+ hour weeks with inadequate resources. Instead of attacking us, maybe you should look at the unrealistic expectations you keep setting. We need support, not blame.",
                    "timestamp": "2024-01-15T10:15:00.000Z",
                    "priority": "urgent",
                    "isReply": true,
                    "replyToId": "email-001"
                },
                {
                    "id": "email-003",
                    "from": "david@company.com",
                    "to": ["lisa@company.com"],
                    "cc": [],
                    "subject": "RE: URGENT: Missed Deadline - This is Unacceptable",
                    "body": "Don't talk to me about unprofessional behavior when you can't even manage your own team properly. Everyone else meets their deadlines with the same resources. This is clearly a management issue. I'm escalating this to HR.",
                    "timestamp": "2024-01-15T11:00:00.000Z",
                    "priority": "urgent",
                    "isReply": true,
                    "replyToId": "email-002"
                }
            ],
            "metadata": {
                "source": "outlook",
                "extractedAt": "2024-01-16T10:00:00.000Z",
                "version": "1.0"
            }
        }
    };
}

function getMeetingScenarios() {
    return {
        good: {
            "conversationId": "meeting-good-001",
            "type": "meeting",
            "participants": ["Emma Chen", "Carlos Rodriguez", "Maya Patel"],
            "transcript": [
                {
                    "id": "transcript-001",
                    "speaker": "Emma Chen",
                    "text": "Good morning everyone! I'm excited to discuss our Q1 strategy. I've reviewed both of your proposals and they're excellent. Carlos, your market analysis is spot-on, and Maya, your technical roadmap aligns perfectly with our goals.",
                    "timestamp": "2024-01-15T09:00:00.000Z",
                    "duration": 18
                },
                {
                    "id": "transcript-002",
                    "speaker": "Carlos Rodriguez",
                    "text": "Thanks Emma! I really appreciate Maya's input on the technical feasibility. Her feedback helped me refine the market entry strategy. I think we have a solid foundation for success.",
                    "timestamp": "2024-01-15T09:00:20.000Z",
                    "duration": 12
                },
                {
                    "id": "transcript-003",
                    "speaker": "Maya Patel",
                    "text": "This collaboration has been fantastic. Carlos's market insights really opened my eyes to some technical priorities I hadn't considered. Emma, your leadership in bringing us together has been invaluable. I'm confident we can exceed our targets.",
                    "timestamp": "2024-01-15T09:00:35.000Z",
                    "duration": 16
                },
                {
                    "id": "transcript-004",
                    "speaker": "Emma Chen",
                    "text": "I love the positive energy here! Let's build on this momentum. What do we need from each other to make Q1 a huge success? Let's be specific about how we can support one another.",
                    "timestamp": "2024-01-15T09:00:55.000Z",
                    "duration": 14
                }
            ],
            "metadata": {
                "source": "teams",
                "meetingDuration": 1800,
                "meetingDate": "2024-01-15T09:00:00.000Z",
                "extractedAt": "2024-01-15T10:30:00.000Z",
                "version": "1.0"
            }
        },
        medium: {
            "conversationId": "meeting-medium-001",
            "type": "meeting",
            "participants": ["Robert Kim", "Amanda Jones", "Tyler Brown"],
            "transcript": [
                {
                    "id": "transcript-001",
                    "speaker": "Robert Kim",
                    "text": "Let's get started. We need to address the delays in the product launch. Amanda, can you explain what's causing the holdups in marketing?",
                    "timestamp": "2024-01-15T09:00:00.000Z",
                    "duration": 10
                },
                {
                    "id": "transcript-002",
                    "speaker": "Amanda Jones",
                    "text": "Robert, the delays aren't just on marketing's side. We've been waiting for final product specs from Tyler's team for two weeks. How can we finalize campaigns without knowing the final features?",
                    "timestamp": "2024-01-15T09:00:12.000Z",
                    "duration": 12
                },
                {
                    "id": "transcript-003",
                    "speaker": "Tyler Brown",
                    "text": "That's fair, Amanda, but we've been dealing with some technical challenges that weren't anticipated. These features are complex. I'd rather deliver something solid than rush and create problems later.",
                    "timestamp": "2024-01-15T09:00:26.000Z",
                    "duration": 14
                },
                {
                    "id": "transcript-004",
                    "speaker": "Robert Kim",
                    "text": "I understand both perspectives. Tyler, can you give us a realistic timeline? Amanda, what's the minimum lead time you need once we have final specs? Let's work backward from our launch date.",
                    "timestamp": "2024-01-15T09:00:42.000Z",
                    "duration": 15
                },
                {
                    "id": "transcript-005",
                    "speaker": "Amanda Jones",
                    "text": "I need at least three weeks for a proper campaign rollout. Less than that and we're risking a poor market introduction.",
                    "timestamp": "2024-01-15T09:01:00.000Z",
                    "duration": 8
                }
            ],
            "metadata": {
                "source": "teams",
                "meetingDuration": 2400,
                "meetingDate": "2024-01-15T09:00:00.000Z",
                "extractedAt": "2024-01-15T11:30:00.000Z",
                "version": "1.0"
            }
        },
        bad: {
            "conversationId": "meeting-bad-001",
            "type": "meeting",
            "participants": ["Mark Sullivan", "Jessica Wong", "Brian Clarke"],
            "transcript": [
                {
                    "id": "transcript-001",
                    "speaker": "Mark Sullivan",
                    "text": "I called this meeting because I'm tired of the constant finger-pointing and excuses. Jessica, your team's performance has been subpar, and Brian, your lack of communication is making everything worse.",
                    "timestamp": "2024-01-15T09:00:00.000Z",
                    "duration": 16
                },
                {
                    "id": "transcript-002",
                    "speaker": "Jessica Wong",
                    "text": "Excuse me? My team has been working with impossible deadlines and zero support from Brian's infrastructure team. Maybe if we had proper resources instead of these accusations, we could deliver better results.",
                    "timestamp": "2024-01-15T09:00:18.000Z",
                    "duration": 14
                },
                {
                    "id": "transcript-003",
                    "speaker": "Brian Clarke",
                    "text": "This is ridiculous. My team has been firefighting issues caused by Jessica's poor requirements gathering. We can't build infrastructure on shifting requirements. And Mark, your unrealistic timelines aren't helping anyone.",
                    "timestamp": "2024-01-15T09:00:35.000Z",
                    "duration": 16
                },
                {
                    "id": "transcript-004",
                    "speaker": "Mark Sullivan",
                    "text": "I don't want to hear excuses. The client is threatening to pull the contract because of these delays. Someone needs to take responsibility here. This blame game needs to stop.",
                    "timestamp": "2024-01-15T09:00:55.000Z",
                    "duration": 12
                },
                {
                    "id": "transcript-005",
                    "speaker": "Jessica Wong",
                    "text": "Mark, threatening people isn't leadership. If you spent half as much time understanding the actual issues instead of just yelling, maybe we could solve this. This meeting is pointless.",
                    "timestamp": "2024-01-15T09:01:10.000Z",
                    "duration": 13
                }
            ],
            "metadata": {
                "source": "teams",
                "meetingDuration": 1200,
                "meetingDate": "2024-01-15T09:00:00.000Z",
                "extractedAt": "2024-01-15T10:15:00.000Z",
                "version": "1.0"
            }
        }
    };
}

function getMixedScenarios() {
    return {
        good: {
            "conversationId": "mixed-good-001",
            "type": "mixed",
            "participants": ["alice@company.com", "bob@company.com", "Carol Smith"],
            "emails": [
                {
                    "id": "email-001",
                    "from": "alice@company.com",
                    "to": ["bob@company.com"],
                    "cc": [],
                    "subject": "Project Alpha - Strategy Meeting Prep",
                    "body": "Hi Bob, I've prepared the slides for tomorrow's strategy meeting with Carol. The numbers look really promising! I think we should focus on the Q1 targets during the discussion. Looking forward to a productive session.",
                    "timestamp": "2024-01-15T14:00:00.000Z",
                    "priority": "normal",
                    "isReply": false,
                    "replyToId": null
                },
                {
                    "id": "email-002",
                    "from": "bob@company.com",
                    "to": ["alice@company.com"],
                    "cc": [],
                    "subject": "RE: Project Alpha - Strategy Meeting Prep",
                    "body": "Perfect Alice! Your analysis is spot on. I've reviewed the market data and we're well-positioned. I'll bring the technical feasibility report. This collaboration is exactly what we need for success.",
                    "timestamp": "2024-01-15T15:30:00.000Z",
                    "priority": "normal",
                    "isReply": true,
                    "replyToId": "email-001"
                }
            ],
            "transcript": [
                {
                    "id": "transcript-001",
                    "speaker": "Carol Smith",
                    "text": "Good morning Alice and Bob! I'm excited about this strategy session. I've reviewed your pre-meeting emails and I'm impressed with the preparation. Let's dive into the Q1 targets you mentioned.",
                    "timestamp": "2024-01-16T09:00:00.000Z",
                    "duration": 15
                },
                {
                    "id": "transcript-002",
                    "speaker": "alice@company.com",
                    "text": "Thank you Carol! Bob and I have been collaborating closely on this. We believe the market conditions are perfect for aggressive growth. Bob, would you like to share the technical insights?",
                    "timestamp": "2024-01-16T09:00:18.000Z",
                    "duration": 12
                },
                {
                    "id": "transcript-003",
                    "speaker": "bob@company.com",
                    "text": "Absolutely! The technical infrastructure is ready to scale. Alice's market analysis aligns perfectly with our capabilities. Carol, I think we can exceed the projected targets by 15%.",
                    "timestamp": "2024-01-16T09:00:32.000Z",
                    "duration": 14
                },
                {
                    "id": "transcript-004",
                    "speaker": "Carol Smith",
                    "text": "This is exactly the kind of synergy I was hoping for! Your teamwork is exemplary. Let's formalize these targets and I'll get executive approval. Fantastic work, both of you!",
                    "timestamp": "2024-01-16T09:00:48.000Z",
                    "duration": 13
                }
            ],
            "metadata": {
                "source": "teams",
                "extractedAt": "2024-01-16T10:00:00.000Z",
                "meetingDuration": 1800,
                "meetingDate": "2024-01-16T09:00:00.000Z",
                "version": "1.0"
            }
        },
        medium: {
            "conversationId": "mixed-medium-001", 
            "type": "mixed",
            "participants": ["project.manager@company.com", "dev.lead@company.com", "Sarah Wilson"],
            "emails": [
                {
                    "id": "email-001",
                    "from": "project.manager@company.com",
                    "to": ["dev.lead@company.com"],
                    "cc": [],
                    "subject": "Urgent: Release Delay Concerns",
                    "body": "Hi there, I'm getting pressure from stakeholders about the release timeline. The client is asking tough questions. We need to address this in tomorrow's meeting with Sarah. Can you prepare a realistic assessment?",
                    "timestamp": "2024-01-15T16:00:00.000Z",
                    "priority": "high",
                    "isReply": false,
                    "replyToId": null
                },
                {
                    "id": "email-002",
                    "from": "dev.lead@company.com",
                    "to": ["project.manager@company.com"],
                    "cc": [],
                    "subject": "RE: Urgent: Release Delay Concerns",
                    "body": "I understand the pressure, but we need to be realistic. The scope creep in the last month added significant complexity. I'll prepare an honest timeline for the meeting, but it might not be what stakeholders want to hear.",
                    "timestamp": "2024-01-15T18:15:00.000Z",
                    "priority": "high",
                    "isReply": true,
                    "replyToId": "email-001"
                }
            ],
            "transcript": [
                {
                    "id": "transcript-001",
                    "speaker": "Sarah Wilson",
                    "text": "Thank you both for joining. I've read your email exchange and I appreciate the transparency. Let's discuss the reality of our timeline challenges.",
                    "timestamp": "2024-01-16T10:00:00.000Z",
                    "duration": 10
                },
                {
                    "id": "transcript-002",
                    "speaker": "project.manager@company.com",
                    "text": "Sarah, the stakeholders are applying significant pressure. We need to find a way to meet the original deadline or at least minimize the delay. What options do we have?",
                    "timestamp": "2024-01-16T10:00:12.000Z",
                    "duration": 12
                },
                {
                    "id": "transcript-003",
                    "speaker": "dev.lead@company.com",
                    "text": "I appreciate the pressure, but cutting corners will create technical debt. We can deliver on time with reduced scope, or deliver full scope with a two-week delay. Quality shouldn't be compromised.",
                    "timestamp": "2024-01-16T10:00:26.000Z",
                    "duration": 16
                },
                {
                    "id": "transcript-004",
                    "speaker": "Sarah Wilson",
                    "text": "Both perspectives are valid. Let's find a middle ground that maintains quality while addressing stakeholder concerns. What are the most critical features we absolutely cannot compromise on?",
                    "timestamp": "2024-01-16T10:00:44.000Z",
                    "duration": 14
                }
            ],
            "metadata": {
                "source": "outlook",
                "extractedAt": "2024-01-16T11:00:00.000Z",
                "meetingDuration": 2400,
                "meetingDate": "2024-01-16T10:00:00.000Z",
                "version": "1.0"
            }
        },
        bad: {
            "conversationId": "mixed-bad-001",
            "type": "mixed", 
            "participants": ["director@company.com", "team.lead@company.com", "Executive VP"],
            "emails": [
                {
                    "id": "email-001",
                    "from": "director@company.com",
                    "to": ["team.lead@company.com"],
                    "cc": [],
                    "subject": "CRITICAL: Client Complaint - Immediate Response Required",
                    "body": "This is completely unacceptable. The client called me directly to complain about your team's deliverables. The quality is substandard and the attitude during client calls has been unprofessional. This ends now.",
                    "timestamp": "2024-01-15T17:00:00.000Z",
                    "priority": "urgent",
                    "isReply": false,
                    "replyToId": null
                },
                {
                    "id": "email-002",
                    "from": "team.lead@company.com",
                    "to": ["director@company.com"],
                    "cc": [],
                    "subject": "RE: CRITICAL: Client Complaint - Immediate Response Required",
                    "body": "I resent the accusation about unprofessional attitude. My team has been working with impossible deadlines and constantly changing requirements. Instead of attacking us, maybe address the root causes of these issues.",
                    "timestamp": "2024-01-15T19:30:00.000Z",
                    "priority": "urgent", 
                    "isReply": true,
                    "replyToId": "email-001"
                }
            ],
            "transcript": [
                {
                    "id": "transcript-001",
                    "speaker": "Executive VP",
                    "text": "I've called this emergency meeting because this conflict has escalated beyond acceptable levels. I've reviewed your email exchange and I'm deeply concerned about the breakdown in communication.",
                    "timestamp": "2024-01-16T08:00:00.000Z",
                    "duration": 16
                },
                {
                    "id": "transcript-002",
                    "speaker": "director@company.com",
                    "text": "The team lead's defensive attitude is exactly the problem. Taking responsibility seems impossible. The client is threatening to terminate the contract because of ongoing issues.",
                    "timestamp": "2024-01-16T08:00:18.000Z",
                    "duration": 14
                },
                {
                    "id": "transcript-003",
                    "speaker": "team.lead@company.com",
                    "text": "This is ridiculous! You're scapegoating my team for systemic problems. The director has been micromanaging and creating a toxic environment. No wonder the client relationships are suffering.",
                    "timestamp": "2024-01-16T08:00:34.000Z",
                    "duration": 15
                },
                {
                    "id": "transcript-004",
                    "speaker": "Executive VP",
                    "text": "Stop! This blame game ends here. Both of you are contributing to this dysfunction. We need immediate intervention or we'll lose this client and potentially more. This is a leadership failure at multiple levels.",
                    "timestamp": "2024-01-16T08:00:52.000Z",
                    "duration": 17
                }
            ],
            "metadata": {
                "source": "teams",
                "extractedAt": "2024-01-16T09:00:00.000Z",
                "meetingDuration": 1200,
                "meetingDate": "2024-01-16T08:00:00.000Z",
                "version": "1.0"
            }
        }
    };
}

// Export functions for use in other scripts
window.getEmailScenarios = getEmailScenarios;
window.getMeetingScenarios = getMeetingScenarios;
window.getMixedScenarios = getMixedScenarios;