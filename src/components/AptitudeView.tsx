import React, { useState } from 'react';
import { StudentProfile } from '../types';

interface AptitudeViewProps {
  studentProfile: StudentProfile;
}

interface Question {
  id: string;
  topicId: string;
  category: 'quantitative' | 'logical' | 'verbal';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

const mockQuestions: Question[] = [
  {
    id: 'q1',
    topicId: 'pc',
    category: 'quantitative',
    question: "In how many ways can the letters of the word 'LEADER' be arranged?",
    options: ["72", "144", "360", "720"],
    correctAnswerIndex: 2, // 360
    explanation: "The word 'LEADER' contains 6 letters: L, E, A, D, E, R. The letter 'E' appears twice. Therefore, the total number of unique arrangements is 6! / 2! = 720 / 2 = 360 arrangements."
  },
  {
    id: 'q2',
    topicId: 'prob',
    category: 'quantitative',
    question: "Two cards are drawn together from a pack of 52 cards. What is the probability that one is a spade and one is a heart?",
    options: ["3/20", "29/34", "13/102", "13/51"],
    correctAnswerIndex: 2, // 13/102
    explanation: "Total sample space is 52C2 = (52 * 51) / 2 = 1326 ways. The number of ways to draw 1 spade (out of 13) and 1 heart (out of 13) is 13C1 * 13C1 = 13 * 13 = 169. Probability = 169 / 1326 = 13/102."
  },
  {
    id: 'q3',
    topicId: 'tw',
    category: 'quantitative',
    question: "A can do a work in 15 days and B in 20 days. If they work on it together for 4 days, what fraction of the work is left?",
    options: ["1/4", "1/10", "7/15", "8/15"],
    correctAnswerIndex: 3, // 8/15
    explanation: "A's 1-day work = 1/15. B's 1-day work = 1/20. Together, their 1-day work = (1/15 + 1/20) = 7/60. In 4 days, work completed = 4 * (7/60) = 7/15. Remaining work = 1 - 7/15 = 8/15."
  },
  {
    id: 'q4',
    topicId: 'syll',
    category: 'logical',
    question: "Statements: All bags are pockets. All pockets are boxes. Conclusions: I. All bags are boxes. II. Some boxes are bags. Which conclusion(s) follow?",
    options: ["Only I follows", "Only II follows", "Either I or II follows", "Both I and II follow"],
    correctAnswerIndex: 3, // Both
    explanation: "Since all bags are pockets and all pockets are boxes, then all bags must be boxes (Conclusion I follows). Since all bags are boxes, some of the boxes must be bags (Conclusion II follows)."
  },
  {
    id: 'q5',
    topicId: 'br',
    category: 'logical',
    question: "Pointing to a photograph, Vipul said, 'She is the daughter of my grandfather's only son.' How is Vipul related to the girl in the photograph?",
    options: ["Father", "Brother", "Cousin", "Uncle"],
    correctAnswerIndex: 1, // Brother
    explanation: "Vipul's grandfather's only son is Vipul's father. The daughter of Vipul's father is Vipul's sister. Therefore, Vipul is the girl's brother."
  },
  {
    id: 'q6',
    topicId: 'seating',
    category: 'logical',
    question: "A, B, C, D, E and F are sitting in a circle facing the center. D is between F and B. A is second to the left of D and second to the right of E. Who is facing D?",
    options: ["A", "C", "E", "F"],
    correctAnswerIndex: 2, // E
    explanation: "Tracing the circular order: D is between F and B. A is second to the left of D (positions: D, _, A). A is second to right of E (positions: E, _, A). Placing them in a circle of 6: order is D, B, C, A, E, F. E is opposite D."
  },
  {
    id: 'q7',
    topicId: 'sc',
    category: 'verbal',
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
  {
    id: 'q8',
    topicId: 'rc',
    category: 'verbal',
    question: "Read the snippet: 'The rise of AI has disrupted traditional work structures. However, instead of making human labor obsolete, it creates demand for high-cognition oversight.' What is the author's main tone?",
    options: ["Alarmist", "Defeatist", "Pragmatic & Optimistic", "Sarcastic"],
    correctAnswerIndex: 2,
    explanation: "The author notes that while AI disrupts traditional structures, it changes rather than destroys human demand, indicating a pragmatic and optimistic perspective."
  },
  {
    id: 'q9',
    topicId: 'syn',
    category: 'verbal',
    question: "Select the word closest in meaning to 'MITIGATE':",
    options: ["Aggravate", "Alleviate", "Instigate", "Obscure"],
    correctAnswerIndex: 1, // Alleviate
    explanation: "'Mitigate' means to make less severe, serious, or painful. 'Alleviate' is a direct synonym."
  }
];

export const AptitudeView: React.FC<AptitudeViewProps> = ({ studentProfile }) => {
  const [activeCategory, setActiveCategory] = useState<'quantitative' | 'logical' | 'verbal'>('quantitative');
  const [activeTopic, setActiveTopic] = useState<string>('pc');
  
  // Interactive Question State
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [solvedCount, setSolvedCount] = useState(24);
  const [correctCount, setCorrectCount] = useState(19);

  // Filter questions by selected category and topic
  const currentQuestions = mockQuestions.filter(
    (q) => q.category === activeCategory && q.topicId === activeTopic
  );
  
  // Active question defaults to first matched or generic fallback
  const activeQuestion = currentQuestions[0] || mockQuestions[0];

  const handleOptionSelect = (idx: number) => {
    if (isSubmitted) return;
    setSelectedOption(idx);
  };

  const handleSubmit = () => {
    if (selectedOption === null || isSubmitted) return;
    setIsSubmitted(true);
    setSolvedCount((c) => c + 1);
    if (selectedOption === activeQuestion.correctAnswerIndex) {
      setCorrectCount((c) => c + 1);
    }
  };

  const handleNextQuestion = () => {
    // Reset question solver state (in mock environment, just resets options)
    setSelectedOption(null);
    setIsSubmitted(false);
  };

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const accuracyRate = solvedCount > 0 ? Math.round((correctCount / solvedCount) * 100) : 0;

  // Topics configuration
  const topicsConfig = {
    quantitative: [
      { id: 'pc', name: 'Permutations & Combinations', count: 18, desc: 'Factorial arrangements and selection rules' },
      { id: 'prob', name: 'Probability & Distributions', count: 12, desc: 'Card draws, dice rolls, and coin setups' },
      { id: 'tw', name: 'Time & Work Rates', count: 15, desc: 'Efficiency ratios and pipe leakage rates' }
    ],
    logical: [
      { id: 'syll', name: 'Syllogisms & Venns', count: 10, desc: 'Logical deductions from dual statements' },
      { id: 'br', name: 'Blood Relations Mapping', count: 8, desc: 'Family lineage trees and photo pointer clues' },
      { id: 'seating', name: 'Circular Seating arrangements', count: 14, desc: 'Linear and radial constraints logic' }
    ],
    verbal: [
      { id: 'sc', name: 'Sentence Correction & Grammar', count: 20, desc: 'Subject-verb agreement and modifier shifts' },
      { id: 'rc', name: 'Reading Comprehension', count: 8, desc: 'Inference and tone interpretation' },
      { id: 'syn', name: 'Contextual Synonyms', count: 25, desc: 'High-frequency GRE/GMAT word meanings' }
    ]
  };

  const currentTopics = topicsConfig[activeCategory];

  return (
    <div className="aptitude-prep-view">
      {/* 1. TOP METRICS & PROGRESS TRACKING */}
      <div className="dashboard-greeting-row" style={{ marginBottom: '16px' }}>
        <div>
          <span className="dashboard-greeting-date">APTITUDE PRACTICE PORTAL</span>
          <h1 className="dashboard-greeting-title">Aptitude preparation</h1>
          <p className="dashboard-greeting-sub">
            Practice Quantitative, Logical, and Verbal modules with instant explanations. Synced to {studentProfile.college} curriculum.
          </p>
        </div>
      </div>

      <div className="aptitude-metric-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div className="dashboard-accent-card" style={{ minHeight: 'auto', padding: '16px' }}>
          <span className="dashboard-accent-card-label" style={{ fontSize: '10px' }}>Solved Questions</span>
          <span className="dashboard-accent-card-value text-accent-blue" style={{ fontSize: '20px', marginTop: '4px' }}>
            {solvedCount}
          </span>
        </div>
        <div className="dashboard-accent-card" style={{ minHeight: 'auto', padding: '16px' }}>
          <span className="dashboard-accent-card-label" style={{ fontSize: '10px' }}>Practice Accuracy</span>
          <span className="dashboard-accent-card-value text-accent-green" style={{ fontSize: '20px', marginTop: '4px' }}>
            {accuracyRate}%
          </span>
        </div>
        <div className="dashboard-accent-card" style={{ minHeight: 'auto', padding: '16px' }}>
          <span className="dashboard-accent-card-label" style={{ fontSize: '10px' }}>Sectional Mock Tests</span>
          <span className="dashboard-accent-card-value text-accent-orange" style={{ fontSize: '20px', marginTop: '4px' }}>
            4 / 12
          </span>
        </div>
        <div className="dashboard-accent-card" style={{ minHeight: 'auto', padding: '16px' }}>
          <span className="dashboard-accent-card-label" style={{ fontSize: '10px' }}>Bookmarked Items</span>
          <span className="dashboard-accent-card-value text-accent-violet" style={{ fontSize: '20px', marginTop: '4px' }}>
            {bookmarkedIds.length}
          </span>
        </div>
      </div>

      {/* 2. SPLIT LAYOUT */}
      <div className="aptitude-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'stretch' }}>
        
        {/* Left Column: Categories and Topic Pickers */}
        <section className="bento-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span className="section-title-label">Select Module Area</span>
          
          {/* Categories tab selector */}
          <div className="calendar-view-toggle" style={{ margin: 0, padding: '4px' }}>
            <button
              className={`calendar-toggle-btn ${activeCategory === 'quantitative' ? 'active' : ''}`}
              style={{ flex: 1, padding: '8px 4px' }}
              onClick={() => {
                setActiveCategory('quantitative');
                setActiveTopic('pc');
                handleNextQuestion();
              }}
            >
              Quantitative
            </button>
            <button
              className={`calendar-toggle-btn ${activeCategory === 'logical' ? 'active' : ''}`}
              style={{ flex: 1, padding: '8px 4px' }}
              onClick={() => {
                setActiveCategory('logical');
                setActiveTopic('syll');
                handleNextQuestion();
              }}
            >
              Logical
            </button>
            <button
              className={`calendar-toggle-btn ${activeCategory === 'verbal' ? 'active' : ''}`}
              style={{ flex: 1, padding: '8px 4px' }}
              onClick={() => {
                setActiveCategory('verbal');
                setActiveTopic('sc');
                handleNextQuestion();
              }}
            >
              Verbal
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
            <span className="details-section-title">Topic-wise practice sets</span>
            {currentTopics.map((topic) => {
              const isTopicActive = activeTopic === topic.id;
              return (
                <div
                  key={topic.id}
                  className={`mini-drive-row ${isTopicActive ? 'active-topic-row' : ''}`}
                  style={{
                    padding: '12px 16px',
                    borderColor: isTopicActive ? 'var(--accent-blue)' : 'var(--border-soft)',
                    background: isTopicActive ? 'var(--accent-blue-bg)' : '#FFF'
                  }}
                  onClick={() => {
                    setActiveTopic(topic.id);
                    handleNextQuestion();
                  }}
                >
                  <div>
                    <h5 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {topic.name}
                    </h5>
                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>
                      {topic.desc}
                    </p>
                  </div>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {topic.count} MCQs
                  </span>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-soft)' }}>
            <span className="details-section-title">Mock Tests & Papers</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button className="view-calendar-btn" style={{ padding: '10px' }} onClick={() => alert('Launching Sectional Mock Test: 15 Mins, 20 Questions...')}>
                ⏱️ Sectional Test
              </button>
              <button className="view-calendar-btn" style={{ padding: '10px' }} onClick={() => alert('Loading TCS NQT 2024 Aptitude Archive...')}>
                📄 Company Papers
              </button>
            </div>
          </div>
        </section>

        {/* Right Column: Distraction-free Practice Question Runner */}
        <section className="bento-card question-runner-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '420px' }}>
          <div className="hub-card-header" style={{ marginBottom: '16px' }}>
            <span className="section-title-label">Active Question Solver</span>
            <button
              onClick={() => toggleBookmark(activeQuestion.id)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                color: bookmarkedIds.includes(activeQuestion.id) ? 'var(--accent-orange)' : 'var(--text-muted)'
              }}
              title="Bookmark Question"
            >
              ★
            </button>
          </div>

          {activeQuestion ? (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <p className="question-text" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '20px' }}>
                {activeQuestion.question}
              </p>

              <div className="options-stack" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {activeQuestion.options.map((opt, idx) => {
                  const isSelected = selectedOption === idx;
                  const showSuccess = isSubmitted && idx === activeQuestion.correctAnswerIndex;
                  const showFailure = isSubmitted && isSelected && idx !== activeQuestion.correctAnswerIndex;

                  let optClass = '';
                  if (showSuccess) optClass = 'option-correct';
                  else if (showFailure) optClass = 'option-incorrect';
                  else if (isSelected) optClass = 'option-selected';

                  return (
                    <div
                      key={idx}
                      className={`option-item-row ${optClass}`}
                      onClick={() => handleOptionSelect(idx)}
                      style={{
                        padding: '12px 16px',
                        border: '1px solid var(--border)',
                        borderRadius: '6px',
                        cursor: isSubmitted ? 'default' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '13px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div className="option-bullet" style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        border: '2px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '10px',
                        fontWeight: 700
                      }}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="option-label">{opt}</span>
                    </div>
                  );
                })}
              </div>

              {/* Explanatory notes */}
              {isSubmitted && (
                <div className="explanation-alert-box" style={{
                  background: 'var(--border-soft)',
                  border: '1px solid var(--border)',
                  padding: '14px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  fontSize: '12px',
                  lineHeight: '1.5'
                }}>
                  <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: '4px' }}>
                    {selectedOption === activeQuestion.correctAnswerIndex ? '✓ Correct Answer' : '❌ Incorrect'}
                  </strong>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{activeQuestion.explanation}</p>
                </div>
              )}

              {/* Control Footer */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                {!isSubmitted ? (
                  <button
                    className="tpo-btn tpo-btn-primary"
                    style={{ width: '100%' }}
                    disabled={selectedOption === null}
                    onClick={handleSubmit}
                  >
                    Submit Answer
                  </button>
                ) : (
                  <button
                    className="tpo-btn tpo-btn-primary"
                    style={{ width: '100%' }}
                    onClick={handleNextQuestion}
                  >
                    Next Question &rarr;
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p>Select a topic to start practicing.</p>
          )}
        </section>

      </div>
    </div>
  );
};
