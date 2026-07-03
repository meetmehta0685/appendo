import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile } from '../types';

interface AptitudeViewProps {
  studentProfile: StudentProfile;
}

interface Question {
  id: string;
  category: 'quantitative' | 'logical' | 'verbal' | 'company';
  topic: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface UnfinishedSession {
  module: 'quantitative' | 'logical' | 'verbal' | 'company';
  topic: string;
  questionIndex: number;
  totalQuestions: number;
  progress: number;
  mode: 'untimed' | 'timed' | 'company' | 'revision' | 'bookmark';
}

interface Attempt {
  id: string;
  date: string;
  topic: string;
  module: 'quantitative' | 'logical' | 'verbal' | 'company';
  score: string;
  accuracy: number;
  mode: string;
  questionsSolved: number;
  timeSpent: string;
}

const mockQuestions: Question[] = [
  // Quantitative - Arithmetic
  {
    id: 'q1',
    category: 'quantitative',
    topic: 'Arithmetic',
    question: "A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:",
    options: ["45 km/hr", "50 km/hr", "54 km/hr", "55 km/hr"],
    correctAnswerIndex: 1,
    explanation: "Relative speed = (125/10) m/s = 12.5 m/s = 12.5 * (18/5) = 45 km/hr. Since the man is running in the same direction, Speed of Train - Speed of Man = 45. Speed of Train = 45 + 5 = 50 km/hr."
  },
  {
    id: 'q2',
    category: 'quantitative',
    topic: 'Arithmetic',
    question: "The cost price of 20 articles is the same as the selling price of x articles. If the profit is 25%, then the value of x is:",
    options: ["15", "16", "18", "25"],
    correctAnswerIndex: 1,
    explanation: "Profit % = [(20 - x) / x] * 100 = 25. Therefore, (20 - x) / x = 0.25 => 20 - x = 0.25x => 1.25x = 20 => x = 16."
  },
  // Quantitative - Probability
  {
    id: 'q3',
    category: 'quantitative',
    topic: 'Probability',
    question: "Two cards are drawn together from a pack of 52 cards. What is the probability that one is a spade and one is a heart?",
    options: ["3/20", "29/34", "13/102", "13/51"],
    correctAnswerIndex: 2,
    explanation: "Total sample space is 52C2 = (52 * 51) / 2 = 1326 ways. The number of ways to draw 1 spade (out of 13) and 1 heart (out of 13) is 13C1 * 13C1 = 13 * 13 = 169. Probability = 169 / 1326 = 13/102."
  },
  // Quantitative - Percentage
  {
    id: 'q4',
    category: 'quantitative',
    topic: 'Percentage',
    question: "If A's salary is 20% less than B's salary, then how much percent is B's salary more than A's?",
    options: ["20%", "22.5%", "25%", "30%"],
    correctAnswerIndex: 2,
    explanation: "Let B's salary be 100. Then A's salary is 80. B's salary is more than A's by (20/80) * 100 = 25%."
  },
  // Quantitative - Time & Work
  {
    id: 'q5',
    category: 'quantitative',
    topic: 'Time & Work',
    question: "A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, what fraction of the work is left?",
    options: ["1/4", "1/10", "7/15", "8/15"],
    correctAnswerIndex: 3,
    explanation: "A's 1-day work = 1/15. B's 1-day work = 1/20. Together, their 1-day work = (1/15 + 1/20) = 7/60. In 4 days, work completed = 4 * (7/60) = 7/15. Remaining work = 1 - 7/15 = 8/15."
  },
  // Quantitative - Number System
  {
    id: 'q6',
    category: 'quantitative',
    topic: 'Number System',
    question: "Which of the following numbers is divisible by 9?",
    options: ["235678", "456781", "345780", "123456"],
    correctAnswerIndex: 2,
    explanation: "A number is divisible by 9 if the sum of its digits is divisible by 9. Sum of digits of 345780 = 3+4+5+7+8+0 = 27, which is divisible by 9."
  },
  // Quantitative - Permutation & Combination
  {
    id: 'q7',
    category: 'quantitative',
    topic: 'Permutation & Combination',
    question: "In how many ways can the letters of the word 'LEADER' be arranged?",
    options: ["72", "144", "360", "720"],
    correctAnswerIndex: 2,
    explanation: "The word 'LEADER' contains 6 letters: L, E, A, D, E, R. The letter 'E' appears twice. Therefore, the total number of unique arrangements is 6! / 2! = 720 / 2 = 360 arrangements."
  },
  // Logical - Syllogisms
  {
    id: 'q8',
    category: 'logical',
    topic: 'Syllogisms',
    question: "Statements: All bags are pockets. All pockets are boxes. Conclusions: I. All bags are boxes. II. Some boxes are bags. Which conclusion(s) follow?",
    options: ["Only I follows", "Only II follows", "Either I or II follows", "Both I and II follow"],
    correctAnswerIndex: 3,
    explanation: "Since all bags are pockets and all pockets are boxes, then all bags must be boxes (Conclusion I follows). Since all bags are boxes, some of the boxes must be bags (Conclusion II follows)."
  },
  // Logical - Blood Relations
  {
    id: 'q9',
    category: 'logical',
    topic: 'Blood Relations',
    question: "Pointing to a photograph, Vipul said, 'She is the daughter of my grandfather's only son.' How is Vipul related to the girl in the photograph?",
    options: ["Father", "Brother", "Cousin", "Uncle"],
    correctAnswerIndex: 1,
    explanation: "Vipul's grandfather's only son is Vipul's father. The daughter of Vipul's father is Vipul's sister. Therefore, Vipul is the girl's brother."
  },
  // Logical - Seating Arrangements
  {
    id: 'q10',
    category: 'logical',
    topic: 'Seating Arrangements',
    question: "A, B, C, D, E and F are sitting in a circle facing the center. D is between F and B. A is second to the left of D and second to the right of E. Who is facing D?",
    options: ["A", "C", "E", "F"],
    correctAnswerIndex: 2,
    explanation: "Tracing the circular order: D is between F and B. A is second to the left of D (positions: D, _, A). A is second to right of E (positions: E, _, A). Placing them in a circle of 6: order is D, B, C, A, E, F. E is opposite D."
  },
  // Verbal - Sentence Correction
  {
    id: 'q11',
    category: 'verbal',
    topic: 'Sentence Correction',
    question: "Identify the grammatically correct sentence:",
    options: [
      "He is one of those men who does not compromise on principles.",
      "He is one of those men who do not compromise on principles.",
      "He is one of those men whom does not compromise on principles.",
      "He is one of those men which do not compromise on principles."
    ],
    correctAnswerIndex: 1,
    explanation: "The relative pronoun 'who' refers to the plural noun 'men'. Thus, the subsequent verb must be plural ('do not compromise' instead of 'does not compromise')."
  },
  // Verbal - Reading Comprehension
  {
    id: 'q12',
    category: 'verbal',
    topic: 'Reading Comprehension',
    question: "Read the snippet: 'The rise of AI has disrupted traditional work structures. However, instead of making human labor obsolete, it creates demand for high-cognition oversight.' What is the author's main tone?",
    options: ["Alarmist", "Defeatist", "Pragmatic & Optimistic", "Sarcastic"],
    correctAnswerIndex: 2,
    explanation: "The author notes that while AI disrupts traditional structures, it changes rather than destroys human demand, indicating a pragmatic and optimistic perspective."
  },
  // Verbal - Synonyms & Antonyms
  {
    id: 'q13',
    category: 'verbal',
    topic: 'Synonyms & Antonyms',
    question: "Select the word closest in meaning to 'MITIGATE':",
    options: ["Aggravate", "Alleviate", "Instigate", "Obscure"],
    correctAnswerIndex: 1,
    explanation: "'Mitigate' means to make less severe, serious, or painful. 'Alleviate' is a direct synonym."
  },
  // Company - TCS
  {
    id: 'q14',
    category: 'company',
    topic: 'TCS',
    question: "TCS NQT Numerical Ability: What is the unit digit of 7^105?",
    options: ["1", "3", "7", "9"],
    correctAnswerIndex: 2,
    explanation: "The unit digit of powers of 7 follows a cycle of 4: 7^1 = 7, 7^2 = 9, 7^3 = 3, 7^4 = 1. Dividing 105 by 4 gives a remainder of 1. Therefore, the unit digit is the same as 7^1 = 7."
  },
  // Company - Infosys
  {
    id: 'q15',
    category: 'company',
    topic: 'Infosys',
    question: "Infosys Logical Quiz: Find the next term in the series: 3, 12, 27, 48, 75, ?",
    options: ["96", "108", "120", "132"],
    correctAnswerIndex: 1,
    explanation: "The terms are 3 * 1^2, 3 * 2^2, 3 * 3^2, 3 * 4^2, 3 * 5^2. The next term is 3 * 6^2 = 3 * 36 = 108."
  },
  // Company - Accenture
  {
    id: 'q16',
    category: 'company',
    topic: 'Accenture',
    question: "Accenture English: Choose the correct preposition: 'She has been living here ___ ten years.'",
    options: ["for", "since", "from", "during"],
    correctAnswerIndex: 0,
    explanation: "'For' is used to denote a period of time (ten years), whereas 'since' is used for a specific point in time."
  }
];

const topicsByModule: Record<string, { id: string; name: string; totalQuestions: number; progress: number }[]> = {
  quantitative: [
    { id: 'arithmetic', name: 'Arithmetic', totalQuestions: 30, progress: 60 },
    { id: 'probability', name: 'Probability', totalQuestions: 15, progress: 20 },
    { id: 'percentage', name: 'Percentage', totalQuestions: 25, progress: 100 },
    { id: 'time-work', name: 'Time & Work', totalQuestions: 20, progress: 0 },
    { id: 'number-system', name: 'Number System', totalQuestions: 30, progress: 50 },
    { id: 'permutation-combination', name: 'Permutation & Combination', totalQuestions: 15, progress: 80 }
  ],
  logical: [
    { id: 'syllogisms', name: 'Syllogisms', totalQuestions: 15, progress: 40 },
    { id: 'blood-relations', name: 'Blood Relations', totalQuestions: 15, progress: 80 },
    { id: 'seating-arrangements', name: 'Seating Arrangements', totalQuestions: 20, progress: 10 },
    { id: 'coding-decoding', name: 'Coding-Decoding', totalQuestions: 25, progress: 90 },
    { id: 'data-sufficiency', name: 'Data Sufficiency', totalQuestions: 10, progress: 0 }
  ],
  verbal: [
    { id: 'sentence-correction', name: 'Sentence Correction', totalQuestions: 30, progress: 70 },
    { id: 'reading-comprehension', name: 'Reading Comprehension', totalQuestions: 10, progress: 50 },
    { id: 'synonyms-antonyms', name: 'Synonyms & Antonyms', totalQuestions: 40, progress: 30 },
    { id: 'vocabulary', name: 'Vocabulary', totalQuestions: 25, progress: 0 },
    { id: 'spotting-errors', name: 'Spotting Errors', totalQuestions: 20, progress: 15 }
  ],
  company: [
    { id: 'tcs', name: 'TCS', totalQuestions: 50, progress: 40 },
    { id: 'infosys', name: 'Infosys', totalQuestions: 40, progress: 65 },
    { id: 'accenture', name: 'Accenture', totalQuestions: 45, progress: 20 },
    { id: 'capgemini', name: 'Capgemini', totalQuestions: 35, progress: 0 },
    { id: 'cognizant', name: 'Cognizant', totalQuestions: 40, progress: 80 },
    { id: 'wipro', name: 'Wipro', totalQuestions: 30, progress: 10 }
  ]
};

export const AptitudeView: React.FC<AptitudeViewProps> = ({ studentProfile }) => {
  // Navigation / Workflow State
  const [activeView, setActiveView] = useState<'home' | 'topics' | 'mode' | 'solving' | 'results' | 'review'>('home');
  const [selectedModule, setSelectedModule] = useState<'quantitative' | 'logical' | 'verbal' | 'company'>('quantitative');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedTopicName, setSelectedTopicName] = useState<string>('');
  const [selectedMode, setSelectedMode] = useState<'untimed' | 'timed' | 'company' | 'revision' | 'bookmark'>('untimed');

  // Custom styling state persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['q3', 'q8']);
  const [wrongQuestionIds, setWrongQuestionIds] = useState<string[]>(['q1', 'q4', 'q9']);
  
  // Streak state
  const [streak, setStreak] = useState({ current: 5, best: 12, solved: 148 });

  // Unfinished Practice Session slot
  const [unfinishedSession, setUnfinishedSession] = useState<UnfinishedSession | null>({
    module: 'quantitative',
    topic: 'Probability',
    questionIndex: 18,
    totalQuestions: 30,
    progress: 60,
    mode: 'timed'
  });

  // Previous Attempts History
  const [attempts, setAttempts] = useState<Attempt[]>([
    { id: 'att-1', date: 'July 2, 2026', topic: 'Permutation & Combination', module: 'quantitative', score: '8/10', accuracy: 80, mode: 'Timed Test', questionsSolved: 10, timeSpent: '08:42' },
    { id: 'att-2', date: 'June 29, 2026', topic: 'Syllogisms', module: 'logical', score: '7/8', accuracy: 87.5, mode: 'Practice Mode', questionsSolved: 8, timeSpent: '05:10' },
    { id: 'att-3', date: 'June 25, 2026', topic: 'TCS', module: 'company', score: '15/20', accuracy: 75, mode: 'Company Mock', questionsSolved: 20, timeSpent: '22:15' }
  ]);

  // Solver Engine State
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({}); // index -> selectedOption index
  const [submittedAnswers, setSubmittedAnswers] = useState<Record<number, boolean>>({}); // index -> hasSubmitted
  
  // Timed Test Mode countdown details
  const [secondsRemaining, setSecondsRemaining] = useState<number>(60);
  const timerRef = useRef<any>(null);

  // Results Review Details
  const [lastAttemptResults, setLastAttemptResults] = useState<{
    topic: string;
    module: 'quantitative' | 'logical' | 'verbal' | 'company';
    questions: Question[];
    answers: Record<number, number>;
    mode: string;
    timeSpent: string;
  } | null>(null);

  // Load questions based on category, topic and mode
  const setupSessionQuestions = (category: 'quantitative' | 'logical' | 'verbal' | 'company', topic: string, mode: 'untimed' | 'timed' | 'company' | 'revision' | 'bookmark') => {
    let list: Question[] = [];

    if (mode === 'bookmark') {
      list = mockQuestions.filter(q => bookmarkedIds.includes(q.id));
    } else if (mode === 'revision') {
      list = mockQuestions.filter(q => wrongQuestionIds.includes(q.id));
    } else {
      // Find matching mock questions
      list = mockQuestions.filter(q => q.category === category && q.topic.toLowerCase() === topic.toLowerCase());
    }

    // Dynamic Generator Fallback if list is empty
    if (list.length === 0) {
      list = [
        {
          id: `gen-${topic}-1`,
          category: category,
          topic: topic,
          question: `Concept Assessment - ${topic}: A sequence or process follows basic parameters outlined in the curriculum. If an adjustment of 25% is applied to a base value of 240, what is the resulting value?`,
          options: ["180", "200", "280", "300"],
          correctAnswerIndex: 3,
          explanation: `For ${topic}, a 25% increase on 240 is 240 * 1.25 = 300. (240 + 60 = 300).`
        },
        {
          id: `gen-${topic}-2`,
          category: category,
          topic: topic,
          question: `Foundational Application - ${topic}: Two parameters are combined in a ratio of 3:5. If the total combined value is 480, find the difference between the larger and smaller portions.`,
          options: ["60", "120", "180", "240"],
          correctAnswerIndex: 1,
          explanation: `Let the parts be 3x and 5x. 3x + 5x = 480 => 8x = 480 => x = 60. The difference is 5x - 3x = 2x = 2 * 60 = 120.`
        },
        {
          id: `gen-${topic}-3`,
          category: category,
          topic: topic,
          question: `Mock Preparation Question - ${topic}: If an operative rate of progress is constant, and it takes 6 hours to complete 40% of a milestone, how much total time is required for the entire milestone?`,
          options: ["10 hours", "12 hours", "15 hours", "18 hours"],
          correctAnswerIndex: 2,
          explanation: `Rate is 40% / 6 hrs = 6.66% per hour. Total time = 100% / 6.66% = 15 hours.`
        }
      ];
    }

    setSessionQuestions(list);
    setCurrentQuestionIdx(0);
    setUserAnswers({});
    setSubmittedAnswers({});
    setSecondsRemaining(60);
  };

  // Timer runner for Timed Test
  useEffect(() => {
    if (activeView === 'solving' && selectedMode === 'timed') {
      setSecondsRemaining(60);
      timerRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            handleTimerExpiry();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [activeView, currentQuestionIdx, selectedMode]);

  const handleTimerExpiry = () => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: prev[currentQuestionIdx] !== undefined ? prev[currentQuestionIdx] : -1
    }));
    setSubmittedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: true
    }));
    setTimeout(() => {
      goToNextQuestionOrFinish();
    }, 1000);
  };

  const goToNextQuestionOrFinish = () => {
    if (currentQuestionIdx < sessionQuestions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
    } else {
      finishPracticeSession();
    }
  };

  const startPracticeSession = (module: 'quantitative' | 'logical' | 'verbal' | 'company', topic: string, mode: 'untimed' | 'timed' | 'company' | 'revision' | 'bookmark') => {
    setSelectedModule(module);
    setSelectedTopic(topic);
    setSelectedMode(mode);
    
    const matches = topicsByModule[module]?.find(t => t.id === topic);
    const name = matches ? matches.name : topic.toUpperCase();
    setSelectedTopicName(name);

    setupSessionQuestions(module, topic, mode);
    setActiveView('solving');
  };

  const resumeUnfinishedSession = () => {
    if (!unfinishedSession) return;
    const { module, topic, mode } = unfinishedSession;
    startPracticeSession(module, topic.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'), mode);
    setUnfinishedSession(null);
  };

  const toggleBookmark = (qId: string) => {
    setBookmarkedIds(prev => 
      prev.includes(qId) ? prev.filter(id => id !== qId) : [...prev, qId]
    );
  };

  const handleSubmitAnswer = () => {
    if (userAnswers[currentQuestionIdx] === undefined) return;
    setSubmittedAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: true
    }));

    const q = sessionQuestions[currentQuestionIdx];
    const isCorrect = userAnswers[currentQuestionIdx] === q.correctAnswerIndex;
    if (!isCorrect) {
      setWrongQuestionIds(prev => prev.includes(q.id) ? prev : [...prev, q.id]);
    } else {
      setWrongQuestionIds(prev => prev.filter(id => id !== q.id));
    }
  };

  const finishPracticeSession = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    sessionQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans === undefined || ans === -1) skipped++;
      else if (ans === q.correctAnswerIndex) correct++;
      else incorrect++;
    });

    const total = sessionQuestions.length;
    const accuracyVal = total > 0 ? Math.round((correct / total) * 100) : 0;
    const scoreStr = `${correct}/${total}`;

    const newAttempt: Attempt = {
      id: `att-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      topic: selectedTopicName,
      module: selectedModule,
      score: scoreStr,
      accuracy: accuracyVal,
      mode: selectedMode === 'timed' ? 'Timed Test' : selectedMode === 'company' ? 'Company Pattern' : 'Practice Mode',
      questionsSolved: total,
      timeSpent: selectedMode === 'timed' ? '05:00' : '04:12'
    };

    setAttempts(prev => [newAttempt, ...prev]);
    setStreak(prev => ({
      ...prev,
      solved: prev.solved + total,
      current: prev.current + 1,
      best: Math.max(prev.best, prev.current + 1)
    }));

    setLastAttemptResults({
      topic: selectedTopicName,
      module: selectedModule,
      questions: sessionQuestions,
      answers: userAnswers,
      mode: newAttempt.mode,
      timeSpent: newAttempt.timeSpent
    });

    setActiveView('results');
  };

  const handleReviewAttempt = (attempt: Attempt) => {
    const mockAttemptQuestions = mockQuestions.filter(q => q.category === attempt.module).slice(0, 3);
    const reviewList = mockAttemptQuestions.length > 0 ? mockAttemptQuestions : [
      {
        id: 'rev-q1',
        category: attempt.module,
        topic: attempt.topic,
        question: `Review Question: A candidate prepares under simulated conditions. Which methodology yields optimal accuracy under pressure?`,
        options: ["Rote memorization", "Paced practice sets", "Flash card drills", "Mock environments"],
        correctAnswerIndex: 1,
        explanation: "Paced practice sets establish consistent memory pathways and reduce mental anxiety."
      }
    ];

    const mockAns: Record<number, number> = {
      0: 0,
      1: reviewList[1] ? reviewList[1].correctAnswerIndex : 1,
      2: 3
    };

    setLastAttemptResults({
      topic: attempt.topic,
      module: attempt.module,
      questions: reviewList,
      answers: mockAns,
      mode: attempt.mode,
      timeSpent: attempt.timeSpent
    });

    setActiveView('review');
  };

  const getAIRecommendation = () => {
    if (attempts.length === 0) return "Start a new session on Quantitative Aptitude to analyze your baseline skills.";
    const sorted = [...attempts].sort((a, b) => a.accuracy - b.accuracy);
    const worst = sorted[0];
    return `Your weakest performance was in ${worst.topic} (${worst.accuracy}% accuracy). Recommendation: Practice ${worst.topic} Set 2 in untimed mode to master the core formulas.`;
  };

  const recommendation = {
    topic: 'Probability',
    module: 'quantitative',
    accuracy: 42
  };

  return (
    <div className="apt-wrapper">
      {/* SCOPED PREMIUM DESIGN STYLES */}
      <style>{`
        .apt-wrapper {
          max-width: 1100px;
          margin: 0 auto;
          padding: var(--space-4) 0;
          color: var(--text-primary);
          display: flex;
          flex-direction: column;
          gap: 32px;
          font-family: var(--font-body);
        }
        
        .apt-title {
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .apt-subtitle {
          font-size: 14.5px;
          color: var(--text-secondary);
          max-width: 600px;
          line-height: 1.5;
        }

        .apt-grid-3-1 {
          display: grid;
          grid-template-columns: 2.2fr 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 900px) {
          .apt-grid-3-1 {
            grid-template-columns: 1fr;
          }
        }

        .apt-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-card);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          transition: var(--transition-smooth);
        }

        .apt-card:hover {
          border-color: var(--text-muted);
          box-shadow: var(--shadow-md);
        }

        .apt-card-interactive {
          cursor: pointer;
        }

        .apt-card-interactive:hover {
          transform: translateY(-2px);
          border-color: var(--accent-blue);
        }

        .continue-practice-card {
          background: linear-gradient(135deg, var(--bg-card) 0%, var(--accent-blue-bg) 100%);
          border: 1px solid var(--accent-blue);
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        body.dark .continue-practice-card {
          background: linear-gradient(135deg, var(--bg-card) 0%, #0d284a 100%);
          border-color: #1d4ed8;
        }

        .continue-practice-badge {
          background: var(--accent-blue);
          color: white;
          padding: 3px 8px;
          border-radius: var(--radius-pill);
          font-size: 9px;
          font-weight: 700;
          text-transform: uppercase;
          width: max-content;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }

        .apt-modules-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        @media (max-width: 600px) {
          .apt-modules-grid {
            grid-template-columns: 1fr;
          }
        }

        .module-card {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 190px;
        }

        .module-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          margin-bottom: 16px;
        }

        .icon-quant { background: #eff6ff; color: var(--accent-blue); }
        .icon-logical { background: #faf5ff; color: var(--accent-violet); }
        .icon-verbal { background: #f0fdf4; color: var(--accent-green); }
        .icon-mock { background: #fffbeb; color: var(--accent-orange); }

        body.dark .icon-quant { background: #0c2540; color: #60a5fa; }
        body.dark .icon-logical { background: #2e104e; color: #c084fc; }
        body.dark .icon-verbal { background: #062f1d; color: #34d399; }
        body.dark .icon-mock { background: #451a03; color: #fbbf24; }

        .module-cta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: var(--accent-blue);
          margin-top: 20px;
          font-size: 13px;
        }

        .streak-container {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .streak-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          text-align: center;
        }

        .streak-item {
          padding: 8px;
          background: var(--border-soft);
          border-radius: var(--radius-sm);
        }

        .streak-value {
          font-size: 20px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .streak-label {
          font-size: 10.5px;
          color: var(--text-secondary);
        }

        .reco-card {
          border-left: 4px solid var(--accent-orange);
          background: var(--accent-orange-bg);
        }

        /* History Table */
        .history-table-container {
          overflow-x: auto;
          margin-top: 16px;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .history-table th {
          padding: 10px 14px;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          border-bottom: 1px solid var(--border);
        }

        .history-table td {
          padding: 14px;
          border-bottom: 1px solid var(--border-soft);
          font-size: 13px;
        }

        .history-table tr:hover td {
          background-color: var(--border-soft);
        }

        /* Topic Grid */
        .topic-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 800px) {
          .topic-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 500px) {
          .topic-grid {
            grid-template-columns: 1fr;
          }
        }

        .topic-card {
          height: 140px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
        }

        .topic-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .topic-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
        }

        .topic-meta {
          font-size: 11.5px;
          color: var(--text-secondary);
        }

        /* Mode Selection styles */
        .mode-selection-container {
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .mode-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mode-option {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px;
          border: 1px solid var(--border);
          border-radius: var(--radius-card);
          cursor: pointer;
          transition: var(--transition-smooth);
          background: var(--bg-card);
        }

        .mode-option:hover {
          border-color: var(--text-muted);
          background: var(--border-soft);
        }

        .mode-option.selected {
          border-color: var(--accent-blue);
          background: var(--accent-blue-bg);
        }

        .mode-bullet {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 2px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mode-bullet.active {
          border-color: var(--accent-blue);
        }

        .mode-bullet-inner {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--accent-blue);
        }

        .mode-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .mode-title {
          font-size: 15px;
          font-weight: 700;
          color: var(--text-primary);
        }

        .mode-desc {
          font-size: 12px;
          color: var(--text-secondary);
        }

        /* Dynamic Breadcrumbs */
        .crumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13.5px;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .crumbs span {
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .crumbs span:hover {
          color: var(--accent-blue);
        }

        .crumbs .separator {
          color: var(--text-muted);
          cursor: default;
        }

        /* Distraction-Free Fullscreen Solver Overlay */
        .solver-overlay {
          position: fixed;
          inset: 0;
          background-color: var(--bg-page);
          z-index: 99999;
          display: flex;
          flex-direction: column;
          animation: solve-fadeIn 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes solve-fadeIn {
          from { opacity: 0; transform: scale(0.99); }
          to { opacity: 1; transform: scale(1); }
        }

        .solver-header {
          height: 64px;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border);
          background: var(--bg-card);
        }

        .solver-exit-btn {
          background: none;
          border: none;
          font-size: 22px;
          cursor: pointer;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          transition: var(--transition-smooth);
        }

        .solver-exit-btn:hover {
          background: var(--border-soft);
          color: var(--text-primary);
        }

        .solver-timer {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-mono);
          font-size: 14.5px;
          font-weight: 700;
          padding: 6px 12px;
          background: var(--border-soft);
          border-radius: var(--radius-sm);
          color: var(--text-primary);
        }

        .solver-progress-text {
          font-size: 13.5px;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .solver-progress-bar-wrap {
          width: 140px;
          height: 6px;
          background: var(--border-soft);
          border-radius: var(--radius-pill);
          overflow: hidden;
        }

        .solver-progress-bar-fill {
          height: 100%;
          background: var(--accent-blue);
          transition: width 0.3s ease;
        }

        .solver-main {
          flex-grow: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          overflow-y: auto;
        }

        .solver-card {
          width: 100%;
          max-width: 700px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-card);
          box-shadow: var(--shadow-xl);
          padding: 40px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .solver-qnum {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--accent-blue);
        }

        .solver-qtext {
          font-size: 17px;
          font-weight: 600;
          line-height: 1.6;
          color: var(--text-primary);
        }

        .solver-options-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .solver-option-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .solver-option-item:hover {
          background: var(--border-soft);
          border-color: var(--text-muted);
        }

        .solver-option-item.selected {
          border-color: var(--accent-blue);
          background: var(--accent-blue-bg);
        }

        .solver-option-item.correct {
          border-color: var(--accent-green);
          background: var(--accent-green-bg);
        }

        .solver-option-item.incorrect {
          border-color: var(--accent-red);
          background: var(--accent-red-bg);
        }

        .solver-bullet {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
        }

        .solver-bullet.selected {
          border-color: var(--accent-blue);
          background: var(--accent-blue);
          color: white;
        }

        .solver-bullet.correct {
          border-color: var(--accent-green);
          background: var(--accent-green);
          color: white;
        }

        .solver-bullet.incorrect {
          border-color: var(--accent-red);
          background: var(--accent-red);
          color: white;
        }

        .solver-explanation-box {
          background: var(--border-soft);
          border-radius: var(--radius-md);
          padding: 18px;
          font-size: 13px;
          line-height: 1.5;
        }

        .solver-footer {
          height: 72px;
          padding: 0 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border);
          background: var(--bg-card);
        }

        .btn-solve-primary {
          background: var(--accent-blue);
          color: white;
          border: none;
          padding: 10px 22px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-solve-primary:hover {
          background: var(--primary-hover);
        }

        .btn-solve-primary:disabled {
          background: var(--text-muted);
          cursor: not-allowed;
        }

        .btn-solve-secondary {
          background: var(--bg-card);
          color: var(--text-primary);
          border: 1px solid var(--border);
          padding: 10px 22px;
          border-radius: var(--radius-sm);
          font-weight: 700;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-solve-secondary:hover {
          background: var(--border-soft);
        }

        .btn-solve-secondary:disabled {
          color: var(--text-muted);
          border-color: var(--border-soft);
          cursor: not-allowed;
        }

        /* Results Screen Grid */
        .results-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
          margin-top: 24px;
        }

        @media (max-width: 700px) {
          .results-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .results-metric-card {
          padding: 20px;
          text-align: center;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: var(--radius-card);
        }

        .results-metric-val {
          font-size: 28px;
          font-weight: 800;
          color: var(--text-primary);
        }

        .results-metric-lbl {
          font-size: 11px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        .results-questions-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .results-question-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          background: var(--bg-card);
        }

        .results-status-tag {
          font-size: 11.5px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: var(--radius-pill);
        }

        .status-correct {
          background: var(--accent-green-bg);
          color: var(--accent-green);
        }

        .status-incorrect {
          background: var(--accent-red-bg);
          color: var(--accent-red);
        }

        .status-skipped {
          background: var(--border-soft);
          color: var(--text-secondary);
        }

        /* Review Details Screen */
        .review-card-list {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 24px;
        }

        .review-card-item {
          padding: 24px;
          border: 1px solid var(--border);
          border-radius: var(--radius-card);
          background: var(--bg-card);
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .review-option-badge {
          display: inline-block;
          font-size: 11.5px;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: var(--radius-sm);
        }

        .topic-progress-bar-container {
          width: 100%;
          height: 6px;
          background: var(--border-soft);
          border-radius: 3px;
          overflow: hidden;
          margin-top: 12px;
        }

        .topic-progress-bar-fill {
          height: 100%;
          background: var(--accent-blue);
          border-radius: 3px;
        }

        .df-timer-warning {
          color: var(--accent-red);
          background: var(--accent-red-bg);
        }
      `}</style>

      {/* ----------------- APTITUDE HOME VIEW ----------------- */}
      {activeView === 'home' && (
        <>
          {/* Header */}
          <div className="apt-header">
            <span className="continue-practice-badge" style={{ background: 'var(--accent-blue-bg)', color: 'var(--accent-blue)' }}>Aptitude module</span>
            <h1 className="apt-title">Aptitude Preparation</h1>
            <p className="apt-subtitle">
              Interactive, guided modules for {studentProfile.name} to master quantitative, logical, and verbal preparation for premium placement drives.
            </p>
          </div>

          {/* Continue Practice (if available) */}
          {unfinishedSession && (
            <div className="apt-card continue-practice-card">
              <div className="details-box">
                <span className="continue-practice-badge">Active Session</span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, margin: 0 }}>
                  {unfinishedSession.topic} ({unfinishedSession.module === 'quantitative' ? 'Quantitative' : unfinishedSession.module === 'logical' ? 'Logical' : 'Verbal'} Aptitude)
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Question {unfinishedSession.questionIndex}/30 · {unfinishedSession.progress}% Progress
                </p>
              </div>
              <button 
                className="btn-solve-primary"
                onClick={resumeUnfinishedSession}
              >
                Continue Practice
              </button>
            </div>
          )}

          {/* Main Grid */}
          <div className="apt-grid-3-1">
            {/* Left side: The Four Core Module Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.02em', borderBottom: '1px solid var(--border-soft)', paddingBottom: '10px' }}>
                Practice Modules
              </h2>
              
              <div className="apt-modules-grid">
                {/* Quantitative Aptitude */}
                <div 
                  className="apt-card apt-card-interactive module-card"
                  onClick={() => {
                    setSelectedModule('quantitative');
                    setActiveView('topics');
                  }}
                >
                  <div>
                    <div className="module-icon-box icon-quant">∑</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Quantitative Aptitude</h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      Arithmetic, Probability, Percentage, Time & Work, Permutations, Number Systems.
                    </p>
                  </div>
                  <div className="module-cta">
                    <span>Select Topic</span> &rarr;
                  </div>
                </div>

                {/* Logical Reasoning */}
                <div 
                  className="apt-card apt-card-interactive module-card"
                  onClick={() => {
                    setSelectedModule('logical');
                    setActiveView('topics');
                  }}
                >
                  <div>
                    <div className="module-icon-box icon-logical">🧠</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Logical Reasoning</h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      Syllogisms, Blood Relations, Seating Arrangements, Coding-Decoding, Data Sufficiency.
                    </p>
                  </div>
                  <div className="module-cta" style={{ color: 'var(--accent-violet)' }}>
                    <span>Select Topic</span> &rarr;
                  </div>
                </div>

                {/* Verbal Ability */}
                <div 
                  className="apt-card apt-card-interactive module-card"
                  onClick={() => {
                    setSelectedModule('verbal');
                    setActiveView('topics');
                  }}
                >
                  <div>
                    <div className="module-icon-box icon-verbal">📖</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Verbal Ability</h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      Sentence Correction, Reading Comprehension, Synonyms & Antonyms, Vocabulary rules.
                    </p>
                  </div>
                  <div className="module-cta" style={{ color: 'var(--accent-green)' }}>
                    <span>Select Topic</span> &rarr;
                  </div>
                </div>

                {/* Company Mock Tests */}
                <div 
                  className="apt-card apt-card-interactive module-card"
                  onClick={() => {
                    setSelectedModule('company');
                    setActiveView('topics');
                  }}
                >
                  <div>
                    <div className="module-icon-box icon-mock">🏢</div>
                    <h3 style={{ fontSize: '16px', fontWeight: 800 }}>Company Mock Tests</h3>
                    <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      Simulated exam patterns for TCS, Infosys, Accenture, Capgemini, Cognizant, Wipro.
                    </p>
                  </div>
                  <div className="module-cta" style={{ color: 'var(--accent-orange)' }}>
                    <span>Select Company</span> &rarr;
                  </div>
                </div>
              </div>

              {/* History / Previous Attempts */}
              <div className="apt-card" style={{ marginTop: '12px' }}>
                <h3 className="apt-card-title">Previous Attempts</h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
                  Review score history, mistakes, and pacing accuracy from your past practice.
                </p>

                <div className="history-table-container">
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Topic / Test</th>
                        <th>Mode</th>
                        <th>Score</th>
                        <th>Accuracy</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {attempts.map(att => (
                        <tr key={att.id}>
                          <td style={{ color: 'var(--text-secondary)' }}>{att.date}</td>
                          <td>
                            <strong>{att.topic}</strong>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                              {att.module === 'quantitative' ? 'Quantitative' : att.module === 'logical' ? 'Logical' : att.module === 'verbal' ? 'Verbal' : 'Company Mock'}
                            </div>
                          </td>
                          <td style={{ color: 'var(--text-secondary)' }}>{att.mode}</td>
                          <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{att.score}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 700, color: att.accuracy >= 80 ? 'var(--accent-green)' : att.accuracy >= 60 ? 'var(--accent-orange)' : 'var(--accent-red)' }}>
                                {att.accuracy}%
                              </span>
                            </div>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="btn-solve-secondary" 
                              style={{ padding: '6px 12px', fontSize: '12px' }}
                              onClick={() => handleReviewAttempt(att)}
                            >
                              Review
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right side: Streak and Recommendations */}
            <div className="side-stats-stack">
              {/* Learning Streak Card */}
              <div className="apt-card streak-container">
                <h3 className="apt-card-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  🔥 Learning Streak
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: 0 }}>
                  Keep the momentum going by answering questions daily.
                </p>

                <div className="streak-grid">
                  <div className="streak-item">
                    <div className="streak-value">{streak.current}d</div>
                    <div className="streak-label">Current</div>
                  </div>
                  <div className="streak-item">
                    <div className="streak-value">{streak.best}d</div>
                    <div className="streak-label">Best Streak</div>
                  </div>
                  <div className="streak-item">
                    <div className="streak-value">{streak.solved}</div>
                    <div className="streak-label">Solved</div>
                  </div>
                </div>

                {/* Small visual calendar view of the week */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', borderTop: '1px solid var(--border-soft)', paddingTop: '12px' }}>
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => {
                    const activeDays = [1, 2, 3, 4, 5]; // Sun to Thu
                    const isActive = activeDays.includes(idx);
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 700 }}>{day}</span>
                        <div style={{ 
                          width: '20px', 
                          height: '20px', 
                          borderRadius: '50%', 
                          background: isActive ? 'var(--accent-green)' : 'var(--border-soft)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          color: isActive ? 'white' : 'var(--text-muted)',
                          fontSize: '9px',
                          fontWeight: 700
                        }}>
                          {isActive ? '✓' : ''}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Today's Recommendation Card */}
              <div className="apt-card reco-card">
                <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-orange)' }}>
                  Today's Recommendation
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, marginTop: '8px', marginBottom: '4px' }}>
                  {recommendation.topic}
                </h3>
                <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)', margin: '0 0 16px 0', lineHeight: 1.4 }}>
                  Based on your weak topics: Accuracy of <strong>{recommendation.accuracy}%</strong>.
                </p>
                <button 
                  className="btn-solve-primary" 
                  style={{ width: '100%', background: 'var(--accent-orange)', color: 'white' }}
                  onClick={() => startPracticeSession(recommendation.module as any, recommendation.topic.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'), 'untimed')}
                >
                  Practice Now
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ----------------- TOPIC SELECTION VIEW ----------------- */}
      {activeView === 'topics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Breadcrumbs */}
          <div className="crumbs">
            <span onClick={() => setActiveView('home')}>Aptitude Home</span>
            <span className="separator">&rarr;</span>
            <span style={{ textTransform: 'capitalize', fontWeight: 700, color: 'var(--text-primary)' }}>
              {selectedModule === 'company' ? 'Company Mock Tests' : `${selectedModule} Aptitude`}
            </span>
          </div>

          <div className="topic-list-header">
            <div>
              <h1 className="apt-title" style={{ textTransform: 'capitalize' }}>
                {selectedModule === 'company' ? 'Select Company Pattern' : `Select a Topic`}
              </h1>
              <p className="apt-subtitle">
                Select from standard syllabus categories below to launch your practice session controls.
              </p>
            </div>
          </div>

          {/* Topics Grid */}
          <div className="topic-grid">
            {topicsByModule[selectedModule]?.map(topic => (
              <div 
                key={topic.id}
                className="apt-card apt-card-interactive topic-card"
                onClick={() => {
                  setSelectedTopic(topic.id);
                  setSelectedTopicName(topic.name);
                  setActiveView('mode');
                }}
              >
                <div className="topic-header">
                  <span className="topic-title">{topic.name}</span>
                  <span className="topic-meta">{topic.totalQuestions} Questions</span>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                    <span>Practice Progress</span>
                    <span style={{ fontWeight: 700 }}>{topic.progress}%</span>
                  </div>
                  <div className="topic-progress-bar-container">
                    <div className="topic-progress-bar-fill" style={{ width: `${topic.progress}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ----------------- PRACTICE MODE VIEW ----------------- */}
      {activeView === 'mode' && (
        <div className="mode-selection-container">
          {/* Breadcrumbs */}
          <div className="crumbs">
            <span onClick={() => setActiveView('home')}>Aptitude Home</span>
            <span className="separator">&rarr;</span>
            <span style={{ textTransform: 'capitalize' }} onClick={() => setActiveView('topics')}>{selectedModule === 'company' ? 'Company Tests' : `${selectedModule} Aptitude`}</span>
            <span className="separator">&rarr;</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{selectedTopicName}</span>
          </div>

          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <h1 className="apt-title">Choose Practice Mode</h1>
            <p className="apt-subtitle" style={{ margin: '6px auto 0 auto' }}>
              Configure your practice settings for <strong>{selectedTopicName}</strong> to optimize your workflow.
            </p>
          </div>

          <div className="mode-list">
            {/* Practice Mode (No Timer) */}
            <div 
              className={`mode-option ${selectedMode === 'untimed' ? 'selected' : ''}`}
              onClick={() => setSelectedMode('untimed')}
            >
              <div className={`mode-bullet ${selectedMode === 'untimed' ? 'active' : ''}`}>
                {selectedMode === 'untimed' && <div className="mode-bullet-inner"></div>}
              </div>
              <div className="mode-details">
                <span className="mode-title">Practice Mode (No Timer)</span>
                <span className="mode-desc">Learn at your own pace. Explanations shown immediately after submitting each question.</span>
              </div>
            </div>

            {/* Timed Test */}
            <div 
              className={`mode-option ${selectedMode === 'timed' ? 'selected' : ''}`}
              onClick={() => setSelectedMode('timed')}
            >
              <div className={`mode-bullet ${selectedMode === 'timed' ? 'active' : ''}`}>
                {selectedMode === 'timed' && <div className="mode-bullet-inner"></div>}
              </div>
              <div className="mode-details">
                <span className="mode-title">Timed Test</span>
                <span className="mode-desc">Simulate exam stress. 60 seconds timer per question. Performance report shown at completion.</span>
              </div>
            </div>

            {/* Company Pattern */}
            <div 
              className={`mode-option ${selectedMode === 'company' ? 'selected' : ''}`}
              onClick={() => setSelectedMode('company')}
            >
              <div className={`mode-bullet ${selectedMode === 'company' ? 'active' : ''}`}>
                {selectedMode === 'company' && <div className="mode-bullet-inner"></div>}
              </div>
              <div className="mode-details">
                <span className="mode-title">Company Pattern</span>
                <span className="mode-desc">Uses actual question frequency and difficulty mapping for core placement drives.</span>
              </div>
            </div>

            {/* Revision */}
            <div 
              className={`mode-option ${selectedMode === 'revision' ? 'selected' : ''}`}
              onClick={() => setSelectedMode('revision')}
            >
              <div className={`mode-bullet ${selectedMode === 'revision' ? 'active' : ''}`}>
                {selectedMode === 'revision' && <div className="mode-bullet-inner"></div>}
              </div>
              <div className="mode-details">
                <span className="mode-title">Revision (Wrong Questions)</span>
                <span className="mode-desc">Re-practice and correct questions from this topic you answered incorrectly in previous attempts.</span>
              </div>
            </div>

            {/* Bookmarked Questions */}
            <div 
              className={`mode-option ${selectedMode === 'bookmark' ? 'selected' : ''}`}
              onClick={() => setSelectedMode('bookmark')}
            >
              <div className={`mode-bullet ${selectedMode === 'bookmark' ? 'active' : ''}`}>
                {selectedMode === 'bookmark' && <div className="mode-bullet-inner"></div>}
              </div>
              <div className="mode-details">
                <span className="mode-title">Bookmarked Questions</span>
                <span className="mode-desc">Focus exclusively on questions you flagged as important or difficult.</span>
              </div>
            </div>
          </div>

          <button 
            className="btn-solve-primary" 
            style={{ width: '100%', padding: '14px', fontSize: '15px' }}
            onClick={() => startPracticeSession(selectedModule, selectedTopic, selectedMode)}
          >
            Start Practice Session &rarr;
          </button>
        </div>
      )}

      {/* ----------------- DISTRACTION-FREE SOLVER OVERLAY ----------------- */}
      {activeView === 'solving' && (
        <div className="solver-overlay">
          {/* Header */}
          <div className="solver-header">
            <div className="solver-header-left">
              <button 
                className="solver-exit-btn"
                title="Exit Practice"
                onClick={() => {
                  if (confirm("Are you sure you want to exit? Your current session progress will be saved.")) {
                    setUnfinishedSession({
                      module: selectedModule,
                      topic: selectedTopicName,
                      questionIndex: currentQuestionIdx + 1,
                      totalQuestions: sessionQuestions.length,
                      progress: Math.round(((currentQuestionIdx) / sessionQuestions.length) * 100),
                      mode: selectedMode
                    });
                    setActiveView('home');
                  }
                }}
              >
                &times;
              </button>
              <span style={{ fontWeight: 800, fontSize: '16px' }}>
                {selectedTopicName}
              </span>
            </div>

            {/* Progress status indicators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span className="solver-progress-text">
                Question {currentQuestionIdx + 1} of {sessionQuestions.length}
              </span>
              <div className="solver-progress-bar-wrap">
                <div 
                  className="solver-progress-bar-fill"
                  style={{ width: `${((currentQuestionIdx + 1) / sessionQuestions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Timer Block */}
            <div style={{ width: '120px', display: 'flex', justifyContent: 'flex-end' }}>
              {selectedMode === 'timed' && (
                <div className={`solver-timer ${secondsRemaining <= 15 ? 'df-timer-warning' : ''}`}>
                  ⏱️ {secondsRemaining}s
                </div>
              )}
            </div>
          </div>

          {/* Main Solver Area */}
          <div className="solver-main">
            {sessionQuestions.length > 0 ? (
              <div className="solver-card">
                <div className="solver-qnum">
                  Question {currentQuestionIdx + 1}
                </div>

                <div className="solver-qtext">
                  {sessionQuestions[currentQuestionIdx].question}
                </div>

                {/* Option selection stack */}
                <div className="solver-options-list">
                  {sessionQuestions[currentQuestionIdx].options.map((opt, idx) => {
                    const isSelected = userAnswers[currentQuestionIdx] === idx;
                    const hasSubmitted = submittedAnswers[currentQuestionIdx];
                    const isCorrectOption = idx === sessionQuestions[currentQuestionIdx].correctAnswerIndex;

                    let optClass = '';
                    if (hasSubmitted) {
                      if (isCorrectOption) optClass = 'correct';
                      else if (isSelected) optClass = 'incorrect';
                    } else if (isSelected) {
                      optClass = 'selected';
                    }

                    return (
                      <div 
                        key={idx}
                        className={`solver-option-item ${optClass}`}
                        onClick={() => {
                          if (hasSubmitted) return;
                          setUserAnswers(prev => ({
                            ...prev,
                            [currentQuestionIdx]: idx
                          }));
                        }}
                      >
                        <div className={`solver-bullet ${
                          hasSubmitted && isCorrectOption ? 'correct' : 
                          hasSubmitted && isSelected && !isCorrectOption ? 'incorrect' : 
                          isSelected ? 'selected' : ''
                        }`}>
                          {String.fromCharCode(65 + idx)}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 550, color: 'var(--text-primary)' }}>
                          {opt}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Show explanation block if submitted */}
                {submittedAnswers[currentQuestionIdx] && (
                  <div className="solver-explanation-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span style={{ 
                        fontWeight: 700, 
                        color: userAnswers[currentQuestionIdx] === sessionQuestions[currentQuestionIdx].correctAnswerIndex ? 'var(--accent-green)' : 'var(--accent-red)'
                      }}>
                        {userAnswers[currentQuestionIdx] === sessionQuestions[currentQuestionIdx].correctAnswerIndex ? '✓ Correct' : '❌ Incorrect'}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                      {sessionQuestions[currentQuestionIdx].explanation}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p>No questions matching criteria.</p>
            )}
          </div>

          {/* Footer Controls */}
          <div className="solver-footer">
            <div style={{ display: 'flex', gap: '12px' }}>
              {/* Bookmark */}
              {sessionQuestions[currentQuestionIdx] && (
                <button 
                  className={`bookmark-btn-df ${bookmarkedIds.includes(sessionQuestions[currentQuestionIdx].id) ? 'active' : ''}`}
                  title="Bookmark Question"
                  onClick={() => toggleBookmark(sessionQuestions[currentQuestionIdx].id)}
                >
                  {bookmarkedIds.includes(sessionQuestions[currentQuestionIdx].id) ? '★' : '☆'}
                </button>
              )}

              {/* Prev */}
              {selectedMode !== 'timed' && (
                <button 
                  className="btn-solve-secondary"
                  disabled={currentQuestionIdx === 0}
                  onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                >
                  Previous
                </button>
              )}
            </div>

            {/* Next or Submit Action */}
            <div>
              {submittedAnswers[currentQuestionIdx] ? (
                <button 
                  className="btn-solve-primary"
                  onClick={goToNextQuestionOrFinish}
                >
                  {currentQuestionIdx === sessionQuestions.length - 1 ? 'Finish & View Results' : 'Next Question &rarr;'}
                </button>
              ) : (
                <button 
                  className="btn-solve-primary"
                  disabled={userAnswers[currentQuestionIdx] === undefined}
                  onClick={handleSubmitAnswer}
                >
                  Submit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ----------------- RESULTS VIEW ----------------- */}
      {activeView === 'results' && lastAttemptResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <span className="continue-practice-badge" style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>Session Completed</span>
            <h1 className="apt-title">{lastAttemptResults.topic}</h1>
            <p className="apt-subtitle">
              Session completed under <strong>{lastAttemptResults.mode}</strong>. Detailed results report below.
            </p>
          </div>

          {/* High level results stats grid */}
          <div className="results-grid">
            <div className="results-metric-card">
              <div className="results-metric-val">{
                lastAttemptResults.questions.filter((q, idx) => lastAttemptResults.answers[idx] === q.correctAnswerIndex).length
              }/{lastAttemptResults.questions.length}</div>
              <div className="results-metric-lbl">Total Score</div>
            </div>

            <div className="results-metric-card">
              <div className="results-metric-val" style={{ color: 'var(--accent-green)' }}>
                {(() => {
                  const corr = lastAttemptResults.questions.filter((q, idx) => lastAttemptResults.answers[idx] === q.correctAnswerIndex).length;
                  return Math.round((corr / lastAttemptResults.questions.length) * 100);
                })()}%
              </div>
              <div className="results-metric-lbl">Accuracy</div>
            </div>

            <div className="results-metric-card">
              <div className="results-metric-val" style={{ color: 'var(--accent-blue)' }}>{lastAttemptResults.timeSpent}</div>
              <div className="results-metric-lbl">Time Taken</div>
            </div>

            <div className="results-metric-card">
              <div className="results-metric-val" style={{ color: 'var(--accent-orange)' }}>
                {lastAttemptResults.questions.filter((_, idx) => lastAttemptResults.answers[idx] === -1 || lastAttemptResults.answers[idx] === undefined).length}
              </div>
              <div className="results-metric-lbl">Skipped</div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="apt-card reco-card" style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-orange)' }}>
              ⚡️ AI Recommendation
            </span>
            <p style={{ fontSize: '13.5px', color: 'var(--text-primary)', fontWeight: 600, margin: '8px 0 0 0' }}>
              {getAIRecommendation()}
            </p>
          </div>

          {/* Question Breakdown lists */}
          <div className="apt-card">
            <h3 className="apt-card-title">Detailed Response Summary</h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Review answers, explanations and correct choices for each problem in this set.
            </p>

            <div className="results-questions-list">
              {lastAttemptResults.questions.map((q, idx) => {
                const ans = lastAttemptResults.answers[idx];
                const isCorrect = ans === q.correctAnswerIndex;
                const isSkipped = ans === -1 || ans === undefined;

                return (
                  <div key={q.id} className="results-question-item">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '80%' }}>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)' }}>QUESTION {idx + 1}</span>
                      <p style={{ margin: 0, fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {q.question}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className={`results-status-tag ${isCorrect ? 'status-correct' : isSkipped ? 'status-skipped' : 'status-incorrect'}`}>
                        {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Incorrect'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA controls */}
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px' }}>
            <button 
              className="btn-solve-primary"
              onClick={() => setActiveView('home')}
            >
              Return to Aptitude Home
            </button>
            <button 
              className="btn-solve-secondary"
              onClick={() => {
                setActiveView('review');
              }}
            >
              Review Mistakes
            </button>
          </div>
        </div>
      )}

      {/* ----------------- REVIEW MISTAKES VIEW ----------------- */}
      {activeView === 'review' && lastAttemptResults && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Breadcrumbs */}
          <div className="crumbs">
            <span onClick={() => setActiveView('home')}>Aptitude Home</span>
            <span className="separator">&rarr;</span>
            <span onClick={() => setActiveView('results')}>Results</span>
            <span className="separator">&rarr;</span>
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>Review Mistakes</span>
          </div>

          <div>
            <h1 className="apt-title">Review Session Mistakes</h1>
            <p className="apt-subtitle">
              Study the step-by-step solutions for questions you missed or skipped to improve next time.
            </p>
          </div>

          <div className="review-card-list">
            {lastAttemptResults.questions.map((q, idx) => {
              const ans = lastAttemptResults.answers[idx];
              const isCorrect = ans === q.correctAnswerIndex;
              const isSkipped = ans === -1 || ans === undefined;

              if (isCorrect) return null; // Only review mistakes / skipped

              return (
                <div key={q.id} className="review-card-item">
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--accent-red)', textTransform: 'uppercase' }}>
                      Question {idx + 1} · {isSkipped ? 'Skipped' : 'Incorrect Response'}
                    </span>
                    <h3 style={{ fontSize: '16px', fontWeight: 600, marginTop: '8px', lineHeight: 1.5 }}>
                      {q.question}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '13px' }}>
                      <span className="review-option-badge" style={{ background: 'var(--accent-red-bg)', color: 'var(--accent-red)' }}>Your Answer:</span>
                      <span style={{ marginLeft: '12px', fontWeight: 550 }}>
                        {isSkipped ? 'No selection / Skipped' : q.options[ans] || 'N/A'}
                      </span>
                    </div>

                    <div style={{ fontSize: '13px' }}>
                      <span className="review-option-badge" style={{ background: 'var(--accent-green-bg)', color: 'var(--accent-green)' }}>Correct Answer:</span>
                      <span style={{ marginLeft: '12px', fontWeight: 550 }}>
                        {q.options[q.correctAnswerIndex]}
                      </span>
                    </div>
                  </div>

                  <div className="solver-explanation-box" style={{ margin: 0 }}>
                    <strong style={{ display: 'block', marginBottom: '4px', fontSize: '12.5px' }}>Solution &amp; Explanation:</strong>
                    <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                      {q.explanation}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* If there are no wrong questions in the set */}
            {lastAttemptResults.questions.every((q, idx) => lastAttemptResults.answers[idx] === q.correctAnswerIndex) && (
              <div className="apt-card" style={{ textAlign: 'center', padding: '40px' }}>
                <span style={{ fontSize: '40px' }}>🏆</span>
                <h3 style={{ marginTop: '16px' }}>Perfect Session!</h3>
                <p style={{ color: 'var(--text-secondary)' }}>You made 0 mistakes in this session. Return to home to select a new topic.</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '12px' }}>
            <button 
              className="btn-solve-primary"
              onClick={() => setActiveView('home')}
            >
              Return to Aptitude Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
