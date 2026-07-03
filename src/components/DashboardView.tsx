import React from 'react';
import { StudentProfile, WalkthroughFeatureId } from '../types';

interface DashboardViewProps {
  studentProfile: StudentProfile;
  dashboardData?: any;
  onCycleBranch: () => void;
  onRegisterDrive: (companyId: string, day: number) => void;
  onRequestWaiver: (companyId: string, day: number) => void;
  onWatchDemo: (featureId: WalkthroughFeatureId) => void;
  onOpenDiagnostic: () => void;
  onLaunchSandbox: () => void;
  onScanResume: () => void;
  onNavigateToCalendar?: () => void;
  onNavigateToResumeBuilder?: () => void;
  onNavigateToMockInterview?: () => void;
  onNavigateToAptitude?: () => void;
  onNavigateToCoding?: () => void;
  onNavigateToTechnical?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  studentProfile,
  dashboardData,
  onOpenDiagnostic,
  onNavigateToCalendar,
  onNavigateToResumeBuilder,
  onNavigateToMockInterview,
  onNavigateToAptitude,
  onNavigateToCoding,
  onNavigateToTechnical,
}) => {
  // Extract dynamic metrics with fallbacks
  const upcomingDrives = dashboardData?.upcomingDrives || [];
  const continuePractice = dashboardData?.continuePractice || {
    aptitude: { topic: "Probability & Combinatorics", progress: studentProfile.subScores.apt },
    coding: { topic: "Dynamic Programming", solved: 125, total: 300, progress: studentProfile.subScores.code },
    technical: { topic: "Virtual Memory & Paging", course: "Operating Systems", progress: studentProfile.subScores.tech }
  };
  const standing = dashboardData?.standing || {
    rank: 24,
    total: 180,
    percentile: 15,
    weeklyChange: "↑ 5 Positions",
    score: 78
  };
  // Get time-based greeting
  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = studentProfile.name.split(' ')[0] || studentProfile.name;

  return (
    <div className="new-dashboard">
      {/* ── 1. Hero Section ── */}
      <section 
        className="new-dashboard-hero" 
        onClick={onNavigateToCoding}
        style={{ cursor: 'pointer' }}
      >
        <div className="hero-content">
          <div className="hero-eyebrow">READY TO PREPARE</div>
          <h1 className="hero-title">
            {getGreeting()}, {firstName}
          </h1>
          <p className="hero-subtitle">
            Your readiness score is at {studentProfile.readiness}%. Keep up the momentum to hit your target packages.
          </p>
        </div>
        <div className="hero-action-area">
          <span className="hero-action-link">Continue Preparing &rarr;</span>
        </div>
      </section>

      {/* ── Dashboard Two-Column Grid ── */}
      <div className="new-dashboard-grid">
        
        {/* Left Column (70%) */}
        <div className="new-dashboard-left-col">
          
          {/* ── 3. Continue Preparation ── */}
          <section className="dashboard-section-block">
            <h2 className="dashboard-section-title">Continue Preparing</h2>
            <div className="prep-modules-grid">
              
              {/* Aptitude Prep */}
              <div 
                className="prep-large-card" 
                onClick={onNavigateToAptitude}
              >
                <div className="prep-card-header">
                  <div className="prep-card-meta">
                    <span className="prep-icon-box">📊</span>
                    <div>
                      <h3 className="prep-card-title">Aptitude Prep</h3>
                      <p className="prep-card-desc">Quantitative, logical, and verbal reasoning</p>
                    </div>
                  </div>
                </div>
                <div className="prep-card-body">
                  <div className="prep-topic-row">
                    <span className="prep-label">Current Topic</span>
                    <span className="prep-val">{continuePractice.aptitude.topic}</span>
                  </div>
                  <div className="prep-progress-container">
                    <div className="prep-progress-bar-wrap">
                      <div 
                        className="prep-progress-bar-fill fill-blue" 
                        style={{ width: `${continuePractice.aptitude.progress}%` }}
                      />
                    </div>
                    <span className="prep-progress-pct">{continuePractice.aptitude.progress}% Mastered</span>
                  </div>
                </div>
                <div className="prep-card-action">
                  <span className="prep-action-btn">Continue Practice &rarr;</span>
                </div>
              </div>

              {/* Coding Practice */}
              <div 
                className="prep-large-card" 
                onClick={onNavigateToCoding}
              >
                <div className="prep-card-header">
                  <div className="prep-card-meta">
                    <span className="prep-icon-box">💻</span>
                    <div>
                      <h3 className="prep-card-title">Coding Practice</h3>
                      <p className="prep-card-desc">Data structures, algorithms, and sandbox challenges</p>
                    </div>
                  </div>
                </div>
                <div className="prep-card-body">
                  <div className="prep-topic-row">
                    <span className="prep-label">Current Topic</span>
                    <span className="prep-val font-semibold text-primary">{continuePractice.coding.topic}</span>
                  </div>
                  <div className="prep-topic-row mt-1">
                    <span className="prep-label">Next Milestone</span>
                    <span className="prep-val">Graph Algorithms</span>
                  </div>
                  <div className="prep-progress-container">
                    <div className="prep-progress-bar-wrap">
                      <div 
                        className="prep-progress-bar-fill fill-green" 
                        style={{ width: `${continuePractice.coding.progress}%` }}
                      />
                    </div>
                    <span className="prep-progress-pct">{continuePractice.coding.solved} / {continuePractice.coding.total} Solved</span>
                  </div>
                </div>
                <div className="prep-card-action">
                  <span className="prep-action-btn">Continue Coding &rarr;</span>
                </div>
              </div>

              {/* Technical Core */}
              <div 
                className="prep-large-card" 
                onClick={onNavigateToTechnical}
              >
                <div className="prep-card-header">
                  <div className="prep-card-meta">
                    <span className="prep-icon-box">⚙️</span>
                    <div>
                      <h3 className="prep-card-title">Continue {continuePractice.technical.course}</h3>
                      <p className="prep-card-desc">Core concepts, CPU scheduling, and memory locks</p>
                    </div>
                  </div>
                </div>
                <div className="prep-card-body">
                  <div className="prep-topic-row">
                    <span className="prep-label">Current Topic</span>
                    <span className="prep-val">{continuePractice.technical.topic}</span>
                  </div>
                  <div className="prep-progress-container">
                    <div className="prep-progress-bar-wrap">
                      <div 
                        className="prep-progress-bar-fill fill-violet" 
                        style={{ width: `${continuePractice.technical.progress}%` }}
                      />
                    </div>
                    <span className="prep-progress-pct">{continuePractice.technical.progress}% Complete</span>
                  </div>
                </div>
                <div className="prep-card-action">
                  <span className="prep-action-btn">Continue Learning &rarr;</span>
                </div>
              </div>

            </div>
          </section>

          {/* ── 4. Upcoming Placement Drive ── */}
          <section className="dashboard-section-block">
            <h2 className="dashboard-section-title">Upcoming Placement Drives</h2>
            
            {upcomingDrives.length > 0 && (
              <div className="featured-drive-card">
                <div className="drive-card-header">
                  <div className="drive-company-info">
                    <div className="drive-avatar-logo">
                      {upcomingDrives[0].logoText || upcomingDrives[0].company.charAt(0)}
                    </div>
                    <div>
                      <h3 className="drive-company-name">{upcomingDrives[0].company}</h3>
                      <span className="drive-role">{upcomingDrives[0].role}</span>
                    </div>
                  </div>
                  <span className="drive-badge-package">{upcomingDrives[0].package}</span>
                </div>

                <div className="drive-details-row">
                  <div className="drive-detail-item">
                    <span className="drive-detail-label">Registration</span>
                    <span className={`drive-detail-val ${upcomingDrives[0].status === 'Registered' ? 'text-green font-semibold' : ''}`}>
                      {upcomingDrives[0].status === 'Registered' ? "You're Registered ✓" : upcomingDrives[0].status}
                    </span>
                  </div>
                  <div className="drive-detail-item">
                    <span className="drive-detail-label">Assessment Date</span>
                    <span className="drive-detail-val">{upcomingDrives[0].date}</span>
                  </div>
                  <div className="drive-detail-item">
                    <span className="drive-detail-label">Preparation Status</span>
                    <span className="drive-detail-val">{upcomingDrives[0].prepStatus}</span>
                  </div>
                </div>

                <div className="drive-card-action">
                  <button 
                    className="tpo-btn tpo-btn-primary" 
                    onClick={onNavigateToCalendar}
                    style={{ width: '100%' }}
                  >
                    Open Calendar to Prepare &rarr;
                  </button>
                </div>
              </div>
            )}

            {/* Compact upcoming list */}
            <div className="upcoming-drives-list">
              {upcomingDrives.slice(1).map((drive: any, idx: number) => (
                <div 
                  key={idx}
                  className="compact-drive-row" 
                  onClick={onNavigateToCalendar}
                >
                  <div className="compact-drive-left">
                    <span className="compact-drive-dot" />
                    <span className="compact-drive-name">{drive.company}</span>
                    <span className="compact-drive-role">· {drive.role}</span>
                  </div>
                  <span className={`compact-drive-badge ${drive.badgeClass || 'badge-blue'}`}>
                    {drive.badge || drive.date}
                  </span>
                </div>
              ))}
            </div>

          </section>

        </div>

        {/* Right Column (30%) */}
        <div className="new-dashboard-right-col">
          
          {/* ── 5. Department Standing ── */}
          <section className="dashboard-section-block">
            <h2 className="dashboard-section-title">Department Standing</h2>
            <div className="standing-card">
              <div className="standing-metric-grid">
                <div className="standing-metric-item">
                  <span className="standing-lbl">RANK</span>
                  <span className="standing-val">{standing.rank} / {standing.total}</span>
                  <span className="standing-sub">Top {standing.percentile}% in {studentProfile.branch.split('·')[0].trim() || 'CSE'}</span>
                </div>
                <div className="standing-metric-item">
                  <span className="standing-lbl">WEEKLY CHANGE</span>
                  <span className="standing-val text-green">{standing.weeklyChange}</span>
                  <span className="standing-sub">Active Standing</span>
                </div>
              </div>
              
              <div className="standing-score-row">
                <span className="standing-lbl">PREPARATION SCORE</span>
                <div className="score-badge-wrap">
                  <span className="score-badge">{standing.score}</span>
                  <span className="score-max">/ 100</span>
                </div>
              </div>

              <button 
                className="tpo-btn tpo-btn-secondary" 
                style={{ width: '100%', marginTop: '16px' }}
                onClick={() => alert('Leaderboard is currently syncing with department ranks.')}
              >
                View Leaderboard &rarr;
              </button>
            </div>
          </section>

          {/* ── 6. Quick Actions ── */}
          <section className="dashboard-section-block">
            <h2 className="dashboard-section-title">Quick Actions</h2>
            <div className="quick-actions-grid">
              
              <button className="quick-action-card" onClick={onNavigateToResumeBuilder}>
                <span className="quick-action-icon bg-blue-tint">📄</span>
                <div className="quick-action-info">
                  <h4 className="quick-action-title">Resume Builder</h4>
                  <p className="quick-action-desc">Build your placement resume</p>
                </div>
              </button>

              <button className="quick-action-card" onClick={onNavigateToMockInterview}>
                <span className="quick-action-icon bg-violet-tint">🗣️</span>
                <div className="quick-action-info">
                  <h4 className="quick-action-title">Mock Interview</h4>
                  <p className="quick-action-desc">Practice mock interviews</p>
                </div>
              </button>

              <button className="quick-action-card" onClick={onOpenDiagnostic}>
                <span className="quick-action-icon bg-amber-tint">⚡</span>
                <div className="quick-action-info">
                  <h4 className="quick-action-title">Diagnostic Test</h4>
                  <p className="quick-action-desc">Assess your readiness score</p>
                </div>
              </button>

              <button className="quick-action-card" onClick={onNavigateToCalendar}>
                <span className="quick-action-icon bg-green-tint">📅</span>
                <div className="quick-action-info">
                  <h4 className="quick-action-title">Drive Calendar</h4>
                  <p className="quick-action-desc">Check upcoming deadlines</p>
                </div>
              </button>

            </div>
          </section>

        </div>

      </div>
    </div>
  );
};
