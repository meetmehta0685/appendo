import React, { useState, useEffect, useRef } from 'react';
import { StudentProfile } from '../types';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentProfile: StudentProfile | null;
  onGradingComplete: (newReadiness: number, newApt: number) => void;
}

interface ConsoleLine {
  text: string;
  type: 'comment' | 'normal' | 'success' | 'alert';
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  studentProfile,
  onGradingComplete,
}) => {
  const [step, setStep] = useState<3 | 4>(3);
  const [isSimulating, setIsSimulating] = useState(false);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([
    { text: '# Click Start Exam below to begin diagnostic grading...', type: 'comment' },
    { text: '> Waiting for assessment session launch', type: 'normal' },
  ]);
  const consoleOutputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (consoleOutputRef.current) {
      consoleOutputRef.current.scrollTop = consoleOutputRef.current.scrollHeight;
    }
  }, [consoleLines]);

  if (!isOpen || !studentProfile) return null;

  const handleStartExam = () => {
    if (isSimulating) return;

    setIsSimulating(true);
    setConsoleLines([]);
    setStep(3);

    const gradingLines = [
      { text: `> Connecting to ${studentProfile.college} placement grading engine...`, delay: 300, type: 'normal' as const },
      { text: '> Loading Quantitative Aptitude results: 18/20 Correct', delay: 700, type: 'success' as const },
      { text: '> Loading Logical Reasoning results: 16/20 Correct', delay: 1100, type: 'success' as const },
      { text: '> Evaluating Coding constraints: Space O(N), Time O(N)', delay: 1400, type: 'normal' as const },
      { text: '> Test Case 1/2: PASSED (0.05s)', delay: 1700, type: 'success' as const },
      { text: '> Test Case 2/2: PASSED (0.07s)', delay: 2000, type: 'success' as const },
      { text: '> Total Assessment Grade: 85% (Passing score: 65%)', delay: 2300, type: 'success' as const },
      { text: '> VERDICT: EXAMINATION CLEARED! Syncing status with TPO DB.', delay: 2700, type: 'success' as const },
    ];

    gradingLines.forEach((line) => {
      setTimeout(() => {
        setConsoleLines((prev) => [...prev, { text: line.text, type: line.type }]);

        if (line.text.includes('VERDICT: EXAMINATION CLEARED')) {
          setTimeout(() => {
            // Grading cleared! Update steps and boost readiness & aptitude
            setStep(4);
            const newReadiness = Math.min(100, studentProfile.readiness + 4);
            const newApt = Math.min(100, studentProfile.subScores.apt + 6);
            onGradingComplete(newReadiness, newApt);
            setIsSimulating(false);
          }, 400);
        }
      }, line.delay);
    });
  };

  return (
    <div className={`sim-modal-overlay show`}>
      <div className="sim-modal-card">
        <div className="modal-header">
          <h3 className="modal-title">TPO Diagnostic Assessment</h3>
          <button className="modal-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          <div className="sim-timeline">
            <div className="timeline-step completed" data-step="1">
              <div className="step-bullet">&#10003;</div>
              <span className="step-label">Quantitative</span>
            </div>
            <div className="timeline-step completed" data-step="2">
              <div className="step-bullet">&#10003;</div>
              <span className="step-label">Logical MCQ</span>
            </div>
            <div className={`timeline-step ${step === 3 ? 'active' : 'completed'}`} data-step="3">
              <div className="step-bullet">{step === 3 ? '3' : '✓'}</div>
              <span className="step-label">Verification</span>
            </div>
            <div className={`timeline-step ${step === 4 ? 'active' : ''}`} data-step="4">
              <div className="step-bullet">4</div>
              <span className="step-label">Submit</span>
            </div>
          </div>

          <div className="sim-console">
            <div className="console-head">
              <div className="dots">
                <span className="dot"></span>
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <span className="title">diagnostic_aptitude_test.sh</span>
            </div>
            <div className="console-output-lines" ref={consoleOutputRef} style={{ overflowY: 'auto' }}>
              {consoleLines.map((line, idx) => (
                <p key={idx} className={`line-${line.type}`}>
                  {line.text}
                </p>
              ))}
            </div>
          </div>

          <button className="cta-button" onClick={handleStartExam} disabled={isSimulating}>
            {isSimulating ? 'Submitting answers...' : 'Start Assessment Exam'}
          </button>
        </div>
      </div>
    </div>
  );
};
