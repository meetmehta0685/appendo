import React from 'react';
import { StudentProfile } from '../types';
import { calendarEvents } from '../data/mockData';

interface CalendarViewProps {
  studentProfile: StudentProfile;
  selectedDay: number;
  onSelectDay: (day: number) => void;
  onRegisterDrive: (companyId: string, day: number) => void;
  onRequestWaiver: (companyId: string, day: number) => void;
  onNavigateToDashboard?: () => void;
}

const prepRecommendations = {
  google: {
    name: 'Google',
    topic: 'Graph Algorithms & Trees',
    questions: [
      { name: 'Number of Islands', diff: 'medium' },
      { name: 'Course Schedule', diff: 'medium' },
      { name: 'Word Ladder', diff: 'hard' }
    ]
  },
  ms: {
    name: 'Microsoft',
    topic: 'Arrays & Binary Trees',
    questions: [
      { name: 'Binary Tree Zigzag Level Order', diff: 'medium' },
      { name: 'Merge k Sorted Lists', diff: 'hard' },
      { name: 'Longest Palindromic Substring', diff: 'medium' }
    ]
  },
  amazon: {
    name: 'Amazon',
    topic: 'Design & Priority Queues',
    questions: [
      { name: 'K Closest Points to Origin', diff: 'medium' },
      { name: 'LRU Cache', diff: 'medium' },
      { name: 'Top K Frequent Elements', diff: 'medium' }
    ]
  },
  tcs: {
    name: 'TCS Digital',
    topic: 'Core Coding Patterns',
    questions: [
      { name: 'Two Sum', diff: 'easy' },
      { name: 'Valid Parentheses', diff: 'easy' },
      { name: 'Reverse Linked List', diff: 'easy' }
    ]
  },
  general: {
    name: 'Upcoming Recruiter',
    topic: 'Essential Data Structures',
    questions: [
      { name: 'Longest Common Subsequence', diff: 'medium' },
      { name: 'Product of Array Except Self', diff: 'medium' },
      { name: 'Edit Distance', diff: 'hard' }
    ]
  }
};

const getAvatarStyle = (companyId: string) => {
  if (companyId === 'google') {
    return { bg: 'var(--accent-blue-bg)', color: 'var(--accent-blue)', initial: 'G' };
  }
  if (companyId === 'tcs') {
    return { bg: 'var(--border-soft)', color: 'var(--text-primary)', initial: 'T' };
  }
  if (companyId === 'ms') {
    return { bg: 'var(--accent-blue-bg)', color: 'var(--accent-blue)', initial: 'M' };
  }
  if (companyId === 'amazon') {
    return { bg: 'var(--accent-orange-bg)', color: 'var(--accent-orange)', initial: 'A' };
  }
  if (companyId === 'adobe') {
    return { bg: 'var(--accent-red-bg)', color: 'var(--accent-red)', initial: 'A' };
  }
  if (companyId === 'cts') {
    return { bg: 'var(--accent-green-bg)', color: 'var(--accent-green)', initial: 'C' };
  }
  return { bg: 'var(--border-soft)', color: 'var(--text-secondary)', initial: '?' };
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  studentProfile,
  selectedDay,
  onSelectDay,
  onRegisterDrive,
  onRequestWaiver,
  onNavigateToDashboard,
}) => {
  const sortedDays = Object.keys(calendarEvents).map(Number).sort((a, b) => a - b);

  // Group events chronologically
  const timeframeGroups = {
    today: sortedDays.filter(day => day === 2 || day === 8), // Today (July 2) / Immediate TCS (July 8)
    thisWeek: sortedDays.filter(day => day === 5), // Google Closes July 5
    nextWeek: sortedDays.filter(day => day === 15 || day === 22), // Microsoft July 15, Cognizant July 22
    later: sortedDays.filter(day => day === 29) // Adobe July 29
  };

  const getUrgencyBadge = (day: number, ev: any, status: string) => {
    if (status === 'registered') {
      return { text: 'Registered ✓', className: 'badge-shortlisted' };
    }
    if (status === 'waiver_pending') {
      return { text: 'Waiver Pending', className: 'badge-open' };
    }

    const diff = day - 2; // Relative to July 2nd
    if (diff < 0) return { text: 'Closed', className: 'badge-deadline' };

    if (ev.statusType === 'deadline') {
      if (diff === 0) return { text: '🚨 Ends Tonight', className: 'badge-deadline urgent' };
      if (diff <= 3) return { text: `⏳ Closes in ${diff}d`, className: 'badge-deadline urgent' };
      return { text: `⏳ Closes in ${diff}d`, className: 'badge-open' };
    }

    if (ev.statusType === 'exam') {
      if (diff === 0) return { text: '🚨 Assessment Today', className: 'badge-exam urgent' };
      return { text: `Exam in ${diff}d`, className: 'badge-exam' };
    }

    return { text: ev.eventType, className: 'badge-open' };
  };

  const renderDetailsPanel = () => {
    const ev = calendarEvents[selectedDay];
    if (!ev) {
      return (
        <div className="planner-empty-state">
          <span className="planner-empty-icon">📅</span>
          <h3 className="planner-empty-title">Select a drive on the timeline</h3>
          <p className="planner-empty-desc">
            Choose any company event card from the timeline planner on the left to inspect eligibility requirements, custom pipelines, and launch study guides.
          </p>
        </div>
      );
    }

    const isEligible = studentProfile.gpa >= ev.minGpa;
    const originalStatus = studentProfile.drives[ev.companyId];
    const status = (originalStatus === 'registered' || originalStatus === 'waiver_pending')
      ? originalStatus
      : (isEligible ? 'eligible' : 'ineligible_gpa');

    const avatarInfo = getAvatarStyle(ev.companyId);
    const recKey = ev.companyId as keyof typeof prepRecommendations;
    const rec = prepRecommendations[recKey] || prepRecommendations.general;

    return (
      <div className="planner-detail-scroller">
        {/* Header */}
        <div className="details-card-header" style={{ padding: 0, marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              className="company-avatar"
              style={{
                background: avatarInfo.bg,
                color: avatarInfo.color,
                width: '40px',
                height: '40px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '18px',
                flexShrink: 0
              }}
            >
              {avatarInfo.initial}
            </span>
            <div>
              <h3 className="details-company-title" style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>
                {ev.companyName}
              </h3>
              <span className="details-role-name" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                {ev.role}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="details-stats-grid" style={{ marginBottom: '16px' }}>
          <div className="details-stat-box">
            <span className="details-stat-label">Salary CTC</span>
            <div className="details-stat-value package" style={{ color: 'var(--text-primary)', fontWeight: 700 }}>
              {ev.package}
            </div>
          </div>
          <div className="details-stat-box">
            <span className="details-stat-label">Eligibility GPA</span>
            <div className="details-stat-value" style={{ fontWeight: 700 }}>
              {ev.minGpa.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Eligibility Check Banner */}
        {isEligible ? (
          <div className="eligibility-match-box eligible" style={{ padding: '10px 12px', fontSize: '12px', marginBottom: '20px' }}>
            <span>✓ You meet the academic CGPA threshold ({studentProfile.gpa} / {ev.minGpa}).</span>
          </div>
        ) : (
          <div className="eligibility-match-box ineligible" style={{ padding: '10px 12px', fontSize: '12px', marginBottom: '20px' }}>
            <span>❌ GPA check failed: You are {studentProfile.gpa} (Required {ev.minGpa}). TPO waiver requested to proceed.</span>
          </div>
        )}

        {/* Prep roadmap section */}
        <div className="company-prep-box" style={{ marginBottom: '20px' }}>
          <span className="details-section-title">Company Practice Roadmap</span>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 10px 0' }}>
            Most frequently asked topic: <strong>{rec.topic}</strong>
          </p>
          <div className="empty-prep-questions-list">
            {rec.questions.map((q, idx) => (
              <div key={idx} className="empty-prep-question-card" style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span className="question-name" style={{ fontSize: '12.5px', fontWeight: 600 }}>{q.name}</span>
                  <span className={`question-difficulty ${q.diff}`} style={{ marginLeft: '8px', fontSize: '9px', textTransform: 'uppercase', padding: '2px 6px', borderRadius: '4px' }}>
                    {q.diff}
                  </span>
                </div>
                <button
                  className="view-calendar-btn"
                  onClick={() => alert(`Launching compiler sandbox simulation for ${q.name}...`)}
                  style={{ fontSize: '11px', padding: '4px 8px' }}
                >
                  Solve
                </button>
              </div>
            ))}
          </div>
          <button
            className="tpo-btn tpo-btn-secondary"
            style={{ width: '100%', marginTop: '12px' }}
            onClick={() => onNavigateToDashboard && onNavigateToDashboard()}
          >
            Start Branch Practice Session &rarr;
          </button>
        </div>

        {/* Funnel Pipeline */}
        <span className="details-section-title">Recruitment Pipeline Funnel</span>
        <div className="details-timeline-funnel" style={{ margin: '12px 0 24px 0' }}>
          {ev.funnel.map((step, idx) => {
            const isCompleted = status === 'registered' && idx === 0;
            const isActive = (status === 'registered' && idx === 1) || (status !== 'registered' && idx === 0);
            return (
              <div key={idx} className={`funnel-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`} style={{ opacity: isCompleted ? 0.7 : 1 }}>
                <div className="funnel-step-bullet"></div>
                <span className="funnel-step-label">{step.name}</span>
                <span className="funnel-step-date">{step.date}</span>
              </div>
            );
          })}
        </div>

        {/* Action Button footer */}
        <div className="details-status-container" style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '16px' }}>
          <div className="details-status-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="details-status-label" style={{ fontSize: '12px', fontWeight: 600 }}>Status:</span>
            {status === 'registered' && <span className="status-pill registered">Registered</span>}
            {status === 'waiver_pending' && <span className="status-pill pending">Waiver Pending</span>}
            {status === 'ineligible_gpa' && <span className="status-pill ineligible">Ineligible</span>}
            {status === 'eligible' && <span className="status-pill eligible">Eligible</span>}
          </div>

          {status === 'registered' && (
            <button className="tpo-btn tpo-btn-disabled" style={{ width: '100%' }} disabled>
              Registered for Drive ✓
            </button>
          )}
          {status === 'waiver_pending' && (
            <button className="tpo-btn tpo-btn-disabled" style={{ width: '100%' }} disabled>
              Waiver Pending Approval
            </button>
          )}
          {status === 'ineligible_gpa' && (
            <button
              className="tpo-btn tpo-btn-primary"
              style={{ width: '100%' }}
              onClick={() => onRequestWaiver(ev.companyId, selectedDay)}
            >
              Request TPO GPA Waiver
            </button>
          )}
          {status === 'eligible' && (
            <button
              className="tpo-btn tpo-btn-primary"
              style={{ width: '100%' }}
              onClick={() => onRegisterDrive(ev.companyId, selectedDay)}
            >
              Register Drive Now
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderTimelineGroup = (title: string, days: number[]) => {
    if (days.length === 0) return null;

    return (
      <div className="timeline-group">
        <h4 className="timeline-group-title">{title}</h4>
        <div className="timeline-group-stack">
          {days.map(day => {
            const ev = calendarEvents[day];
            const status = studentProfile.drives[ev.companyId];
            const urgency = getUrgencyBadge(day, ev, status);
            const avatarInfo = getAvatarStyle(ev.companyId);
            const isSelected = selectedDay === day;
            const isEligible = studentProfile.gpa >= ev.minGpa;

            return (
              <div
                key={day}
                className={`timeline-event-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectDay(day)}
              >
                <div className="event-card-left">
                  <div
                    className="event-card-avatar"
                    style={{ background: avatarInfo.bg, color: avatarInfo.color }}
                  >
                    {avatarInfo.initial}
                  </div>
                  <div className="event-card-info">
                    <div className="event-card-meta-row">
                      <span className="event-card-date">July {day}</span>
                      <span className={`calendar-event-badge ${urgency.className}`}>
                        {urgency.text}
                      </span>
                    </div>
                    <h5 className="event-card-title">{ev.companyName}</h5>
                    <span className="event-card-subtitle">{ev.role} · {ev.package}</span>
                  </div>
                </div>
                <div className="event-card-eligibility">
                  {isEligible ? (
                    <span className="eligibility-tag eligible">Eligible</span>
                  ) : (
                    <span className="eligibility-tag ineligible">Waiver Needed</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="timeline-planner-layout">
      {/* Left Timeline Panel */}
      <section className="planner-timeline-column">
        <div className="planner-header">
          <div>
            <h2 className="section-title-large">Placement Planner</h2>
            <p className="registry-header-sub">Chronological timeline of active placement drives and events</p>
          </div>
          <button
            className="view-calendar-btn"
            style={{ fontSize: '11px', padding: '6px 12px' }}
            onClick={() => alert('Recruitment calendar synced successfully to local calendar! 🔄')}
          >
            🔄 Sync Timeline
          </button>
        </div>

        <div className="timeline-scroll-area">
          {renderTimelineGroup('TODAY & IMMEDIATE ACTIONS', timeframeGroups.today)}
          {renderTimelineGroup('CLOSING THIS WEEK', timeframeGroups.thisWeek)}
          {renderTimelineGroup('UPCOMING NEXT WEEK', timeframeGroups.nextWeek)}
          {renderTimelineGroup('LATER IN MONTH', timeframeGroups.later)}
        </div>
      </section>

      {/* Right Details Panel */}
      <section className="bento-card planner-details-panel">
        {renderDetailsPanel()}
      </section>
    </div>
  );
};
