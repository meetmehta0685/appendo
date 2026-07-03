import React, { useState, useEffect } from 'react';
import { StudentProfile } from '../types';

interface MockInterviewViewProps {
  studentProfile: StudentProfile;
  onUpdateProfile: (p: StudentProfile) => void;
}

interface InterviewAttempt {
  id: string;
  type: 'HR' | 'Technical' | 'Behavioral' | 'Company Specific';
  typeName: string;
  date: string;
  score: number;
  duration: string;
  feedback: {
    strengths: string[];
    improvements: string[];
    summary: string;
  };
  transcript: {
    question: string;
    answer: string;
    modelAnswer: string;
  }[];
}

interface InterviewQuestion {
  question: string;
  modelAnswer: string;
}

// Branch specific technical and company questions
const GET_QUESTIONS = (branch: string, type: string): InterviewQuestion[] => {
  const branchName = branch.toLowerCase();
  const isCSE = branchName.includes('cse') || branchName.includes('co') || branchName.includes('computer') || branchName.includes('software');
  const isME = branchName.includes('mechanical') || branchName.includes('me');
  
  if (type === 'HR') {
    return [
      {
        question: "Tell me about yourself and walk me through your background.",
        modelAnswer: "Provide a chronological overview of your studies, highlight 1-2 major technical projects, mention campus activities, and explain why you are excited about this specific role."
      },
      {
        question: "Why do you want to join our organization specifically?",
        modelAnswer: "Focus on the company's technical reputation, its recent innovations, how your skills align with their engineering culture, and your desire to solve their unique engineering challenges."
      },
      {
        question: "Where do you see yourself in five years?",
        modelAnswer: "Express a desire to deepen your technical expertise, progress into a technical leadership role, and contribute to scaling core product engineering."
      }
    ];
  } else if (type === 'Behavioral') {
    return [
      {
        question: "Describe a situation where you had a conflict with a team member during a project. How did you resolve it?",
        modelAnswer: "Use the STAR method: Describe the Situation/Task, explain how you held a private conversation to understand their perspective (Action), reached a compromise, and delivered the project on time (Result)."
      },
      {
        question: "Tell me about a time you failed or made a mistake. What did you do to rectify it?",
        modelAnswer: "Explain a genuine mistake (Situation), own the responsibility (Action), detail the corrective measures, and highlight the key learnings you implemented in future projects (Result)."
      },
      {
        question: "How do you handle tight deadlines or pressure when working on multiple assignments?",
        modelAnswer: "Explain how you prioritize tasks based on impact and deadlines, utilize tools like calendars or task planners, delegate when appropriate, and communicate transparently with stakeholders."
      }
    ];
  } else if (type === 'Technical') {
    if (isCSE) {
      return [
        {
          question: "Explain the difference between SQL and NoSQL databases, and when would you use which?",
          modelAnswer: "SQL databases are relational, structured, and use schemas with ACID properties for transaction safety. NoSQL databases are non-relational, flexible, and scale horizontally. Use SQL for banking or structured schemas; use NoSQL for high-write feeds, unstructured content, or real-time document caching."
        },
        {
          question: "What is virtual memory and how does paging solve memory fragmentation?",
          modelAnswer: "Virtual memory maps process address spaces to physical frames in RAM. Paging divides memory into fixed-size chunks (pages and frames), eliminating external fragmentation. Address translation is accelerated via the TLB (Translation Lookaside Buffer)."
        },
        {
          question: "What is the difference between a binary tree and a binary search tree (BST)?",
          modelAnswer: "A binary tree is a general tree where each node has at most two children. A binary search tree is a binary tree with the ordering property: for any node, the values in its left subtree are less, and the values in its right subtree are greater."
        }
      ];
    } else if (isME) {
      return [
        {
          question: "Explain the Second Law of Thermodynamics in your own words.",
          modelAnswer: "The second law asserts that entropy in an isolated system always increases over time. No heat engine can be 100% efficient (Kelvin-Planck statement), and heat cannot spontaneously transfer from a colder to a hotter body (Clausius statement)."
        },
        {
          question: "What is the difference between Stress and Strain, and how are they related inside the elastic limit?",
          modelAnswer: "Stress is the internal resisting force per unit area of a material. Strain is the deformation per unit length. They are related linearly within the elastic limit by Hooke's Law: Stress = Young's Modulus * Strain."
        },
        {
          question: "What are the primary differences between casting and forging, and when would you choose one over the other?",
          modelAnswer: "Casting involves pouring liquid metal into a mold cavity (good for complex shapes). Forging involves shaping metal using localized compressive forces (improves grain structure and strength). Choose forging for high-strength parts (e.g., crankshafts); choose casting for complex casings."
        }
      ];
    } else {
      // Electrical
      return [
        {
          question: "How does a 3-phase induction motor start, and why is it self-starting while single-phase is not?",
          modelAnswer: "Three-phase stator winding creates a rotating magnetic field (RMF) that induces currents in the rotor, producing torque (self-starting). Single-phase supplies produce pulsating fields, requiring starting mechanisms like capacitors to split phase angles."
        },
        {
          question: "What is the difference between an open circuit test and a short circuit test on a transformer?",
          modelAnswer: "The open circuit test is conducted at rated voltage on the low-voltage side (high-voltage open) to measure core losses. The short circuit test is conducted at reduced voltage on the high-voltage side (low-voltage shorted) to measure copper losses."
        },
        {
          question: "What is the physical significance of Phase Margin and Gain Margin in stability analysis?",
          modelAnswer: "They represent relative stability in control systems. Phase margin indicates how much additional phase lag can be added before the system becomes unstable. Gain margin indicates how much open-loop gain can be increased before oscillation begins."
        }
      ];
    }
  } else {
    // Company Specific
    if (isCSE) {
      return [
        {
          question: "How would you design a scalable rate limiter for an API endpoint? (Google Specific)",
          modelAnswer: "Explain Token Bucket or Leaky Bucket algorithms. Use Redis to store rate limits (IP key with counter and expiration TTL). Discuss horizontal scaling, handling race conditions using Lua scripts, and fallback HTTP 429 Too Many Requests status codes."
        },
        {
          question: "Given a Binary Search Tree (BST), explain how you find the Lowest Common Ancestor (LCA) of two nodes. (Microsoft Specific)",
          modelAnswer: "Start at the root. If both target nodes are smaller than the current node, search the left subtree. If both are larger, search the right subtree. If one is smaller and one is larger (or current is one of the nodes), the current node is the LCA. Time complexity is O(h)."
        },
        {
          question: "How do you implement a thread-safe Singleton design pattern in Java? (Amazon Specific)",
          modelAnswer: "Use double-checked locking with volatile keyword for the instance reference, or the initialization-on-demand holder idiom (Bill Pugh classloader method), which guarantees thread safety and lazy loading without synchronization overhead."
        }
      ];
    } else if (isME) {
      return [
        {
          question: "What materials and manufacturing processes are used for automobile cylinder blocks? (Tata Motors Specific)",
          modelAnswer: "Cylinder blocks are typically made of grey cast iron (excellent damping capacity, wear resistance, and thermal conductivity) or aluminum alloys (lightweight). They are manufactured using sand casting, followed by boring and precision honing operations."
        },
        {
          question: "How would you inspect weld quality in high-pressure steam pipes? (L&T Specific)",
          modelAnswer: "Use non-destructive testing (NDT) methods: Radiographic Testing (X-ray/Gamma-ray) to check internal flaws, Ultrasonic Testing for sub-surface crack detection, and Dye Penetrant or Magnetic Particle Testing for surface discontinuities."
        },
        {
          question: "What is the role of tolerances in gear design, and how does interference fit differ from clearance fit? (Maruti Suzuki Specific)",
          modelAnswer: "Tolerances prevent mechanical binding and control backlash. An interference fit has a negative clearance (shaft is larger than hole, requiring force to assemble). A clearance fit has positive clearance (shaft is smaller than hole, allowing free rotation)."
        }
      ];
    } else {
      // Electrical
      return [
        {
          question: "What is SCADA, and what role does it play in modern smart grids? (Siemens Specific)",
          modelAnswer: "SCADA (Supervisory Control and Data Acquisition) gathers real-time data from remote sensors and RTUs/IEDs in substations, allowing control operators to monitor grid stability, operate breakers, manage load shedding, and isolate faults dynamically."
        },
        {
          question: "Explain the differential protection scheme for high-voltage power transformers. (Power Grid Specific)",
          modelAnswer: "Differential protection works on Merz-Price circulating current principle. It compares currents entering and leaving the transformer windings using CTs. If an internal fault occurs, a difference current flows through the operating coil of the differential relay, instantly tripping circuit breakers."
        },
        {
          question: "What is the difference between a surge arrester and a lightning conductor? (BHEL Specific)",
          modelAnswer: "A lightning conductor is installed at the top of structures to attract and discharge atmospheric lightning safely to earth. A surge arrester is connected between power conductors and ground near substations to protect internal electrical equipment from voltage surges."
        }
      ];
    }
  }
};

// Initial default attempts history
const DEFAULT_ATTEMPTS: InterviewAttempt[] = [
  {
    id: 'att-1',
    type: 'HR',
    typeName: 'HR Fit Round',
    date: 'June 25, 2026',
    score: 82,
    duration: '12 mins',
    feedback: {
      summary: "Good structured communication. Strong background explanation, but could align personal goals closer to the job details.",
      strengths: ["Clear project highlights", "Professional articulation", "Good pace and volume"],
      improvements: ["Connect resume bullets directly to company goals", "Be more specific with technical achievements"]
    },
    transcript: [
      {
        question: "Tell me about yourself and walk me through your background.",
        answer: "I am a senior engineering student specializing in core projects. I have completed internships in system design and want to apply my problem-solving skills at a fast-growing company.",
        modelAnswer: "Provide a chronological overview of your studies, highlight 1-2 major technical projects, mention campus activities, and explain why you are excited about this specific role."
      },
      {
        question: "Why do you want to join our organization specifically?",
        answer: "Your company has a great culture and is a leader in technology. I want to work with smart people and learn how to build scalable products.",
        modelAnswer: "Focus on the company's technical reputation, its recent innovations, how your skills align with their engineering culture, and your desire to solve their unique engineering challenges."
      }
    ]
  },
  {
    id: 'att-2',
    type: 'Behavioral',
    typeName: 'STAR behavioral check',
    date: 'June 29, 2026',
    score: 75,
    duration: '15 mins',
    feedback: {
      summary: "Good use of the STAR method, but missing concrete metrics. Results described were too generic.",
      strengths: ["Logical structure", "Honest description of conflict resolution"],
      improvements: ["Use quantitative metrics for the 'Result' section", "State clearly what YOU did vs the team"]
    },
    transcript: [
      {
        question: "Describe a situation where you had a conflict with a team member during a project. How did you resolve it?",
        answer: "We had a disagreement on using a specific framework. I talked to him and we decided to merge both designs which worked out fine.",
        modelAnswer: "Use the STAR method: Describe the Situation/Task, explain how you held a private conversation to understand their perspective (Action), reached a compromise, and delivered the project on time (Result)."
      }
    ]
  }
];

export const MockInterviewView: React.FC<MockInterviewViewProps> = ({ studentProfile, onUpdateProfile }) => {
  const [viewState, setViewState] = useState<'list' | 'active-test' | 'review-attempt'>('list');
  const [attempts, setAttempts] = useState<InterviewAttempt[]>([]);
  const [selectedAttempt, setSelectedAttempt] = useState<InterviewAttempt | null>(null);

  // Active Interview state
  const [selectedType, setSelectedType] = useState<'HR' | 'Technical' | 'Behavioral' | 'Company Specific'>('HR');
  const [activeQuestions, setActiveQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentAnswerText, setCurrentAnswerText] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioTimer, setAudioTimer] = useState<number>(0);
  const [recordingInterval, setRecordingInterval] = useState<any>(null);

  // Load attempts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`interview_attempts_${studentProfile.roll}`);
    if (saved) {
      setAttempts(JSON.parse(saved));
    } else {
      localStorage.setItem(`interview_attempts_${studentProfile.roll}`, JSON.stringify(DEFAULT_ATTEMPTS));
      setAttempts(DEFAULT_ATTEMPTS);
    }
  }, [studentProfile.roll]);

  // Handle Voice Recording Simulation
  const handleToggleRecord = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      clearInterval(recordingInterval);
      setRecordingInterval(null);
      // Append a mock transcribed text
      const mockTranscripts = [
        "Based on my experience, I believe resolving key bottlenecks requires systematic debugging and collaborative review.",
        "In our academic projects, we designed models and achieved an accuracy bump of 12% under load testing conditions.",
        "I approach this by prioritizing tasks by critical dependency chains, optimizing the critical path first."
      ];
      const selectedMockText = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setCurrentAnswerText((prev) => (prev ? prev + " " + selectedMockText : selectedMockText));
    } else {
      // Start recording
      setIsRecording(true);
      setAudioTimer(0);
      const interval = setInterval(() => {
        setAudioTimer((t) => t + 1);
      }, 1000);
      setRecordingInterval(interval);
    }
  };

  // Clean interval on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
    };
  }, [recordingInterval]);

  // Start interview runner
  const handleStartInterview = (type: 'HR' | 'Technical' | 'Behavioral' | 'Company Specific') => {
    setSelectedType(type);
    const questions = GET_QUESTIONS(studentProfile.branch, type);
    setActiveQuestions(questions);
    setCurrentQIndex(0);
    setUserAnswers([]);
    setCurrentAnswerText('');
    setViewState('active-test');
  };

  // Go to next question or complete
  const handleNextQuestion = () => {
    const answers = [...userAnswers];
    answers[currentQIndex] = currentAnswerText.trim() || "(No response typed/recorded)";
    setUserAnswers(answers);

    if (currentQIndex < activeQuestions.length - 1) {
      setCurrentQIndex((idx) => idx + 1);
      setCurrentAnswerText(answers[currentQIndex + 1] || '');
    } else {
      // Finalize interview and generate AI feedback
      handleSubmitInterview(answers);
    }
  };

  // Previous question (allow editing responses)
  const handlePrevQuestion = () => {
    if (currentQIndex > 0) {
      const answers = [...userAnswers];
      answers[currentQIndex] = currentAnswerText.trim();
      setUserAnswers(answers);
      setCurrentQIndex((idx) => idx - 1);
      setCurrentAnswerText(answers[currentQIndex - 1] || '');
    }
  };

  const handleSubmitInterview = (finalAnswers: string[]) => {
    // Generate simulated detailed feedback
    const randomScore = Math.floor(70 + Math.random() * 25); // 70 to 95%
    
    // Strengths and Improvements lists
    const strengthsConfig = {
      HR: ["Clear articulation of background", "Strong interest in company research", "Good confidence"],
      Technical: ["Accurate definition of core terms", "Good understanding of memory/efficiency tradeoffs", "Logical approach to solving coding/design models"],
      Behavioral: ["Use of STAR framework structure", "Good detail on collaborative conflicts", "Shows leadership capability"],
      'Company Specific': ["Understood company scale requirements", "Focused on relevant domain constraints", "Solid technical logic"]
    };

    const improvementsConfig = {
      HR: ["Connect achievements to quantitative business metrics", "Keep answers more concise and avoid rambling"],
      Technical: ["Explain underlying hardware/system mechanisms in more detail", "Detail time/space complexity before coding"],
      Behavioral: ["Quantify success (use numbers in results)", "Clearly differentiate your actions from group work"],
      'Company Specific': ["Master platform architectural details (e.g. caching, indices)", "Align systems design strictly with constraints"]
    };

    const newAttempt: InterviewAttempt = {
      id: `att-${Date.now()}`,
      type: selectedType,
      typeName: `${selectedType} AI Practice`,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      score: randomScore,
      duration: '10 mins',
      feedback: {
        summary: `You performed well during this ${selectedType} session. Your communication was structured and professional, though some responses could benefit from more detailed metrics and technical depth.`,
        strengths: strengthsConfig[selectedType],
        improvements: improvementsConfig[selectedType]
      },
      transcript: activeQuestions.map((q, idx) => ({
        question: q.question,
        answer: finalAnswers[idx] || "(No response typed/recorded)",
        modelAnswer: q.modelAnswer
      }))
    };

    const updatedAttempts = [newAttempt, ...attempts];
    setAttempts(updatedAttempts);
    localStorage.setItem(`interview_attempts_${studentProfile.roll}`, JSON.stringify(updatedAttempts));

    // Update student profile subScores
    // Slightly bump the interview subScore
    const newInterviewScore = Math.min(100, Math.round(
      (studentProfile.subScores.interview * 3 + randomScore) / 4
    ));
    
    const updatedProfile = {
      ...studentProfile,
      subScores: {
        ...studentProfile.subScores,
        interview: newInterviewScore
      },
      readiness: Math.min(100, Math.round(
        (studentProfile.subScores.apt + studentProfile.subScores.code + studentProfile.subScores.tech + newInterviewScore + studentProfile.subScores.resume) / 5
      ))
    };
    onUpdateProfile(updatedProfile);

    // Set selected attempt for review screen
    setSelectedAttempt(newAttempt);
    setViewState('review-attempt');
    alert(`AI evaluation complete! Score: ${randomScore}%. Check out your feedback report.`);
  };

  const handleOpenReview = (attempt: InterviewAttempt) => {
    setSelectedAttempt(attempt);
    setViewState('review-attempt');
  };

  const getInterviewTypeDesc = (type: string) => {
    switch (type) {
      case 'HR':
        return 'Standard cultural alignment, resume walk-through, and motivational check.';
      case 'Technical':
        return 'In-depth domain questions covering subjects specific to your engineering branch.';
      case 'Behavioral':
        return 'STAR method-based questions testing team collaboration, failures, and pressure handling.';
      default:
        return 'Simulated recruiter interviews for key companies hiring in your branch.';
    }
  };

  const averageScore = attempts.length > 0 
    ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length)
    : 0;

  return (
    <div className="mock-interview-view">
      {/* 1. VIEW PORTAL GREETING */}
      <div className="dashboard-greeting-row" style={{ marginBottom: '24px' }}>
        <div>
          <span className="dashboard-greeting-date">AI MOCK INTERVIEW PORTAL</span>
          <h1 className="dashboard-greeting-title">Mock Interview Practice</h1>
          <p className="dashboard-greeting-sub">
            Practice mock interviews with automated AI transcriptions, scoring metrics, and personalized feedback.
          </p>
        </div>
        
        {viewState === 'list' && attempts.length > 0 && (
          <div className="tech-score-card">
            <div className="tech-score-circle">
              <span className="score-num">{averageScore}%</span>
              <span className="score-label">Avg Accuracy</span>
            </div>
          </div>
        )}
      </div>

      {/* 2. LIST VIEW: SELECTION & PAST ATTEMPTS */}
      {viewState === 'list' && (
        <div className="interview-list-layout">
          {/* Left panel: Tracks selection */}
          <div className="interview-tracks-card bento-card">
            <span className="section-title-label" style={{ marginBottom: '16px', display: 'block' }}>
              Select Interview Practice Track
            </span>
            <div className="interview-tracks-grid">
              {(['HR', 'Technical', 'Behavioral', 'Company Specific'] as const).map((type) => (
                <div key={type} className="interview-track-item">
                  <div className="track-info">
                    <h3 className="track-title-text">{type} Round</h3>
                    <p className="track-desc-text">{getInterviewTypeDesc(type)}</p>
                  </div>
                  <button
                    className="tpo-btn tpo-btn-primary"
                    style={{ marginTop: '12px', alignSelf: 'start' }}
                    onClick={() => handleStartInterview(type)}
                  >
                    Start {type} Practice
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Right panel: History of attempts */}
          <div className="interview-history-card bento-card">
            <span className="section-title-label" style={{ marginBottom: '16px', display: 'block' }}>
              Your Practice History
            </span>

            {attempts.length === 0 ? (
              <div className="no-history-prompt">
                <span className="icon">💬</span>
                <p>No interview attempts recorded yet. Start a session above to receive your first transcript report.</p>
              </div>
            ) : (
              <div className="attempts-history-list">
                {attempts.map((att) => (
                  <div key={att.id} className="attempt-row-item" onClick={() => handleOpenReview(att)}>
                    <div className="attempt-meta-info">
                      <span className="attempt-type-badge">{att.type}</span>
                      <span className="attempt-date">{att.date}</span>
                    </div>
                    <div className="attempt-score-indicator">
                      <span className={`score-badge ${att.score >= 80 ? 'green' : att.score >= 70 ? 'orange' : 'red'}`}>
                        {att.score}%
                      </span>
                      <span className="view-link">&rarr;</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. ACTIVE TEST VIEW: INTERVIEW RUNNER */}
      {viewState === 'active-test' && (
        <div className="active-interview-layout bento-card">
          {/* Header */}
          <div className="interview-runner-header">
            <div>
              <span className="active-track-label">{selectedType} INTERVIEW IN PROGRESS</span>
              <h3>Question {currentQIndex + 1} of {activeQuestions.length}</h3>
            </div>
            <button
              className="tpo-btn tpo-btn-secondary"
              onClick={() => {
                if (confirm("Are you sure you want to cancel the interview? Your progress will be lost.")) {
                  setViewState('list');
                }
              }}
            >
              Cancel Interview
            </button>
          </div>

          {/* Interviewer Display & Question Box */}
          <div className="interview-q-area">
            <div className="interviewer-avatar-card">
              <div className="interviewer-face">🤖</div>
              <div className="interviewer-details">
                <span className="name">Alex</span>
                <span className="title">AI Placement Coordinator</span>
              </div>
            </div>

            <div className="question-speech-bubble">
              <p className="question-bubble-text">
                {activeQuestions[currentQIndex]?.question}
              </p>
            </div>
          </div>

          {/* Answer Workspace */}
          <div className="interview-answer-workspace">
            <span className="input-label-row">
              <span>YOUR TRANSCRIPTION RESPONSE</span>
              {isRecording && <span className="recording-status-tag">● RECORDING ({audioTimer}s)</span>}
            </span>

            {/* Premium Simulated Microphone / Voice Recorder */}
            <div className="voice-mic-simulator">
              <button 
                className={`mic-pulsing-btn ${isRecording ? 'active' : ''}`}
                onClick={handleToggleRecord}
                aria-label={isRecording ? 'Stop Recording' : 'Start Voice Recording'}
              >
                <svg className="mic-svg" viewBox="0 0 24 24" width="24" height="24">
                  <path fill="currentColor" d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                  <path fill="currentColor" d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
              </button>
              
              <div className="waveform-container">
                {isRecording ? (
                  <div className="voice-wave-bars animate">
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                  </div>
                ) : (
                  <span className="mic-status-text">Click the microphone to simulate audio recording, or write directly below.</span>
                )}
              </div>
            </div>

            <textarea
              className="answer-textarea-box"
              placeholder="Type your structured response here. If using voice simulation, text will be transcribed automatically..."
              value={currentAnswerText}
              onChange={(e) => setCurrentAnswerText(e.target.value)}
            />

            {/* Navigation buttons */}
            <div className="runner-nav-row">
              <button
                className="tpo-btn tpo-btn-secondary"
                onClick={handlePrevQuestion}
                disabled={currentQIndex === 0}
              >
                &larr; Previous Question
              </button>
              <button
                className="tpo-btn tpo-btn-primary"
                onClick={handleNextQuestion}
              >
                {currentQIndex === activeQuestions.length - 1 ? 'Submit Interview &rarr;' : 'Next Question &rarr;'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. REVIEW VIEW: FEEDBACK & TRANSCRIPTS */}
      {viewState === 'review-attempt' && selectedAttempt && (
        <div className="review-interview-layout">
          {/* Header */}
          <div className="review-header-card bento-card">
            <div className="review-header-left">
              <button className="tpo-btn tpo-btn-secondary back-btn" onClick={() => setViewState('list')}>
                &larr; Back to Dashboard
              </button>
              <h2 className="review-attempt-title">
                Evaluation Report: {selectedAttempt.typeName}
              </h2>
              <span className="review-attempt-date">Taken on {selectedAttempt.date}</span>
            </div>
            
            <div className="score-badge-circle-large">
              <span className="score-num">{selectedAttempt.score}%</span>
              <span className="score-label">Overall Score</span>
            </div>
          </div>

          {/* Core feedback panel */}
          <div className="feedback-report-grid">
            {/* Actionable Feedback */}
            <div className="bento-card feedback-summary-card">
              <span className="section-title-label" style={{ marginBottom: '16px', display: 'block' }}>
                Actionable AI Evaluation
              </span>
              <p className="summary-desc-text">{selectedAttempt.feedback.summary}</p>
              
              <div className="feedback-columns-split">
                <div className="strengths-box">
                  <span className="column-header green-text">✓ KEY STRENGTHS</span>
                  <ul className="bullet-list green-bullets">
                    {selectedAttempt.feedback.strengths.map((str, sIdx) => (
                      <li key={sIdx}>{str}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="improvements-box">
                  <span className="column-header red-text">⚠ AREAS FOR IMPROVEMENT</span>
                  <ul className="bullet-list red-bullets">
                    {selectedAttempt.feedback.improvements.map((imp, iIdx) => (
                      <li key={iIdx}>{imp}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Complete Transcripts */}
            <div className="bento-card transcripts-card">
              <span className="section-title-label" style={{ marginBottom: '16px', display: 'block' }}>
                Question & Answer Transcripts
              </span>
              
              <div className="transcripts-q-stack">
                {selectedAttempt.transcript.map((item, idx) => (
                  <div key={idx} className="transcript-qa-item">
                    <h4 className="trans-question-title">
                      Q{idx + 1}: {item.question}
                    </h4>
                    
                    <div className="student-response-block">
                      <span className="block-label">YOUR ANSWER:</span>
                      <p className="block-text">{item.answer}</p>
                    </div>

                    <div className="model-answer-block">
                      <span className="block-label">SUGGESTED ANSWER KEY:</span>
                      <p className="block-text">{item.modelAnswer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
