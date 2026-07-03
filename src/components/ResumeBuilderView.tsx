import React, { useState } from 'react';
import { StudentProfile } from '../types';

interface ResumeBuilderViewProps {
  studentProfile: StudentProfile;
}

/* ── placeholder data ────────────────────────────────────────────── */

const TEMPLATES = [
  { id: 'classic', name: 'Classic Professional', ats: true, recommended: true, accent: '#2563eb' },
  { id: 'modern', name: 'Modern Minimal', ats: true, recommended: false, accent: '#7c3aed' },
  { id: 'executive', name: 'Executive Clean', ats: true, recommended: false, accent: '#059669' },
  { id: 'creative', name: 'Creative Edge', ats: false, recommended: false, accent: '#e11d48' },
];

const RESUME_SECTIONS = [
  {
    id: 'personal', title: 'Personal Information', icon: '👤',
    items: ['Dhrumit Patel', 'dhrumit@dtu.ac.in', '+91 98765 43210', 'New Delhi, India', 'linkedin.com/in/dhrumit-patel'],
  },
  {
    id: 'education', title: 'Education', icon: '🎓',
    items: ['B.Tech Computer Science & Engineering', 'Delhi Technological University (2021 – 2025)', 'CGPA: 8.74 / 10', 'Relevant Coursework: DSA, DBMS, OS, CN, ML'],
  },
  {
    id: 'skills', title: 'Technical Skills', icon: '⚡',
    items: ['Languages: C++, Python, JavaScript, TypeScript, SQL', 'Frameworks: React, Node.js, Express, TailwindCSS', 'Tools: Git, Docker, AWS, Firebase, Figma', 'Databases: PostgreSQL, MongoDB, Redis'],
  },
  {
    id: 'projects', title: 'Projects', icon: '🚀',
    items: ['Tyroo Placement OS — Full-stack placement management platform', 'CodeArena — Real-time competitive coding platform', 'SmartPark — IoT-based smart parking solution', 'HealthSync — ML-powered health monitoring dashboard'],
  },
  {
    id: 'experience', title: 'Internship / Experience', icon: '💼',
    items: ['Software Engineering Intern — Microsoft (May 2024 – Jul 2024)', 'Built internal dashboard reducing ticket resolution time by 35%', 'Frontend Developer Intern — Razorpay (Dec 2023 – Feb 2024)', 'Developed payment flow components used by 2M+ merchants'],
  },
  {
    id: 'certifications', title: 'Certifications', icon: '📜',
    items: ['AWS Cloud Practitioner — Amazon Web Services', 'Full Stack Web Development — Coursera (Meta)', 'Machine Learning Specialization — Stanford Online', 'Data Structures & Algorithms — LeetCode (400+ problems)'],
  },
  {
    id: 'achievements', title: 'Achievements', icon: '🏆',
    items: ['Google Code Jam — Advanced to Round 2 (Top 5%)', 'Smart India Hackathon 2024 — National Finalist', 'ACM-ICPC Regionalist 2023', 'Dean\'s List — 4 consecutive semesters'],
  },
  {
    id: 'por', title: 'Positions of Responsibility', icon: '🎯',
    items: ['Technical Lead — DTU Developer Society', 'Core Committee Member — Placement Cell', 'Campus Ambassador — GitHub Education', 'Mentor — Google Developer Student Club'],
  },
  {
    id: 'languages', title: 'Languages', icon: '🌐',
    items: ['English — Professional Proficiency', 'Hindi — Native', 'Gujarati — Native', 'French — Elementary'],
  },
];

const VERSIONS = [
  { id: 'v3', name: 'Dhrumit_Resume_v3.pdf', updated: 'Jul 1, 2025', template: 'Classic Professional', version: 'v3.0', isDefault: true },
  { id: 'v2', name: 'Dhrumit_Resume_v2.pdf', updated: 'Jun 15, 2025', template: 'Modern Minimal', version: 'v2.1', isDefault: false },
  { id: 'v1', name: 'Dhrumit_Resume_v1.pdf', updated: 'May 28, 2025', template: 'Classic Professional', version: 'v1.0', isDefault: false },
];

const QUICK_ACTIONS = [
  { id: 'create', label: 'Create New', icon: '✨', color: '#2563eb' },
  { id: 'duplicate', label: 'Duplicate', icon: '📋', color: '#7c3aed' },
  { id: 'preview', label: 'Preview', icon: '👁️', color: '#059669' },
  { id: 'download', label: 'Download PDF', icon: '📥', color: '#d97706' },
  { id: 'share', label: 'Share', icon: '🔗', color: '#0891b2' },
  { id: 'ats', label: 'ATS Analysis', icon: '🔍', color: '#e11d48' },
];

const TIPS = [
  { title: 'Keep it to one page', desc: 'Recruiters spend ~7 seconds on initial screening. A concise, one-page resume maximizes your impact.' },
  { title: 'Quantify achievements', desc: 'Use numbers to showcase impact — "Improved load time by 40%" is stronger than "Improved performance".' },
  { title: 'Highlight relevant skills', desc: 'Tailor your technical skills section to match the job description. ATS systems scan for keyword matches.' },
  { title: 'Customize per company', desc: 'Adapt your resume for each application. Emphasize the skills and projects most relevant to the role.' },
  { title: 'Use strong action verbs', desc: 'Start bullets with verbs like Built, Designed, Implemented, Optimized, Led, Reduced, Automated.' },
];

const ATS_KEYWORDS_MISSING = ['Agile', 'CI/CD', 'Unit Testing', 'System Design', 'REST APIs'];
const ATS_RECOMMENDATIONS = [
  'Add measurable achievements to your experience section.',
  'Improve project descriptions with specific technologies used.',
  'Include relevant technical keywords from job descriptions.',
  'Add internship experience with quantified impact metrics.',
  'Use standard section headings for better ATS parsing.',
];

/* ── component ───────────────────────────────────────────────────── */

export const ResumeBuilderView: React.FC<ResumeBuilderViewProps> = ({ studentProfile }) => {
  const [activeView, setActiveView] = useState<'dashboard' | 'editor' | 'preview'>('dashboard');
  const [selectedTemplate, setSelectedTemplate] = useState('classic');
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  /* ── Empty State ──────────────────────────────────────────────── */
  if (showEmptyState) {
    return (
      <div className="rb-page">
        <div className="rb-empty-state">
          <div className="rb-empty-illustration">
            <div className="rb-empty-doc">
              <div className="rb-empty-doc-line rb-line-w80" />
              <div className="rb-empty-doc-line rb-line-w60" />
              <div className="rb-empty-doc-line rb-line-w90" />
              <div className="rb-empty-doc-line rb-line-w40" />
              <div className="rb-empty-doc-line rb-line-w70" />
            </div>
            <div className="rb-empty-sparkle rb-sparkle-1">✦</div>
            <div className="rb-empty-sparkle rb-sparkle-2">✦</div>
            <div className="rb-empty-sparkle rb-sparkle-3">✦</div>
          </div>
          <h2 className="rb-empty-title">Build your first resume</h2>
          <p className="rb-empty-desc">
            Create a professional, ATS-optimized resume tailored for campus placements. Our guided builder makes it easy to get started.
          </p>
          <button className="tpo-btn tpo-btn-primary rb-empty-cta" onClick={() => setShowEmptyState(false)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Create Resume
          </button>
        </div>
      </div>
    );
  }

  /* ── Preview Sub-view ─────────────────────────────────────────── */
  if (activeView === 'preview') {
    return (
      <div className="rb-page">
        <div className="rb-preview-topbar">
          <button className="tpo-btn tpo-btn-secondary" onClick={() => setActiveView('dashboard')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Dashboard
          </button>
          <h2 className="rb-preview-topbar-title">Resume Preview</h2>
          <div className="rb-preview-topbar-actions">
            <button className="tpo-btn tpo-btn-secondary" onClick={() => alert('Download PDF triggered (UI only)')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download PDF
            </button>
            <button className="tpo-btn tpo-btn-primary" onClick={() => setActiveView('editor')}>Edit Resume</button>
          </div>
        </div>

        <div className="rb-preview-wrapper">
          <div className="rb-a4-page">
            {/* Header */}
            <div className="rb-a4-header">
              <h1 className="rb-a4-name">{studentProfile.name}</h1>
              <div className="rb-a4-contact">
                <span>dhrumit@dtu.ac.in</span>
                <span className="rb-a4-sep">|</span>
                <span>+91 98765 43210</span>
                <span className="rb-a4-sep">|</span>
                <span>linkedin.com/in/dhrumit-patel</span>
                <span className="rb-a4-sep">|</span>
                <span>github.com/dhrumit-patel</span>
              </div>
            </div>

            {/* Education */}
            <div className="rb-a4-section">
              <h2 className="rb-a4-section-title">Education</h2>
              <div className="rb-a4-entry">
                <div className="rb-a4-entry-header">
                  <strong>Delhi Technological University</strong>
                  <span className="rb-a4-date">2021 – 2025</span>
                </div>
                <div className="rb-a4-entry-sub">B.Tech Computer Science & Engineering — CGPA: 8.74/10</div>
                <div className="rb-a4-entry-detail">Relevant Coursework: Data Structures, Algorithms, DBMS, Operating Systems, Computer Networks, Machine Learning</div>
              </div>
            </div>

            {/* Experience */}
            <div className="rb-a4-section">
              <h2 className="rb-a4-section-title">Experience</h2>
              <div className="rb-a4-entry">
                <div className="rb-a4-entry-header">
                  <strong>Software Engineering Intern — Microsoft</strong>
                  <span className="rb-a4-date">May 2024 – Jul 2024</span>
                </div>
                <ul className="rb-a4-bullets">
                  <li>Built an internal dashboard used by 500+ engineers, reducing ticket resolution time by 35%</li>
                  <li>Implemented role-based access control and automated deployment pipeline using Azure DevOps</li>
                  <li>Collaborated with cross-functional teams to redesign the issue triage workflow</li>
                </ul>
              </div>
              <div className="rb-a4-entry">
                <div className="rb-a4-entry-header">
                  <strong>Frontend Developer Intern — Razorpay</strong>
                  <span className="rb-a4-date">Dec 2023 – Feb 2024</span>
                </div>
                <ul className="rb-a4-bullets">
                  <li>Developed payment flow components used by 2M+ merchants across the platform</li>
                  <li>Reduced checkout page load time by 40% through code splitting and lazy loading</li>
                </ul>
              </div>
            </div>

            {/* Projects */}
            <div className="rb-a4-section">
              <h2 className="rb-a4-section-title">Projects</h2>
              <div className="rb-a4-entry">
                <div className="rb-a4-entry-header">
                  <strong>Tyroo Placement OS</strong>
                  <span className="rb-a4-date">React, TypeScript, Node.js</span>
                </div>
                <ul className="rb-a4-bullets">
                  <li>Full-stack placement management platform serving 3,000+ students across 5 departments</li>
                  <li>Features: ATS resume scanner, drive calendar, diagnostic assessments, real-time analytics</li>
                </ul>
              </div>
              <div className="rb-a4-entry">
                <div className="rb-a4-entry-header">
                  <strong>CodeArena</strong>
                  <span className="rb-a4-date">Next.js, WebSocket, Redis</span>
                </div>
                <ul className="rb-a4-bullets">
                  <li>Real-time competitive coding platform with live leaderboard and code execution sandbox</li>
                  <li>Handles 500+ concurrent users with sub-100ms latency using WebSocket connections</li>
                </ul>
              </div>
            </div>

            {/* Skills */}
            <div className="rb-a4-section">
              <h2 className="rb-a4-section-title">Technical Skills</h2>
              <div className="rb-a4-skills-grid">
                <div><strong>Languages:</strong> C++, Python, JavaScript, TypeScript, SQL</div>
                <div><strong>Frameworks:</strong> React, Node.js, Express, Next.js, TailwindCSS</div>
                <div><strong>Tools:</strong> Git, Docker, AWS, Firebase, Figma, Postman</div>
                <div><strong>Databases:</strong> PostgreSQL, MongoDB, Redis</div>
              </div>
            </div>

            {/* Achievements */}
            <div className="rb-a4-section">
              <h2 className="rb-a4-section-title">Achievements</h2>
              <ul className="rb-a4-bullets">
                <li>Google Code Jam — Advanced to Round 2 (Top 5% globally)</li>
                <li>Smart India Hackathon 2024 — National Finalist</li>
                <li>ACM-ICPC Regionalist 2023</li>
                <li>Dean's List — 4 consecutive semesters for academic excellence</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Editor Sub-view ──────────────────────────────────────────── */
  if (activeView === 'editor') {
    return (
      <div className="rb-page">
        <div className="rb-preview-topbar">
          <button className="tpo-btn tpo-btn-secondary" onClick={() => setActiveView('dashboard')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Dashboard
          </button>
          <h2 className="rb-preview-topbar-title">Edit Resume</h2>
          <div className="rb-preview-topbar-actions">
            <button className="tpo-btn tpo-btn-secondary" onClick={() => setActiveView('preview')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Preview
            </button>
            <button className="tpo-btn tpo-btn-primary" onClick={() => alert('Resume saved (UI only)')}>Save Resume</button>
          </div>
        </div>

        {/* Templates */}
        <section className="rb-section">
          <h3 className="rb-section-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            Choose Template
          </h3>
          <div className="rb-template-grid">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                className={`rb-template-card ${selectedTemplate === t.id ? 'rb-template-selected' : ''}`}
                onClick={() => setSelectedTemplate(t.id)}
              >
                {/* CSS-only template preview */}
                <div className="rb-template-preview" style={{ '--tpl-accent': t.accent } as React.CSSProperties}>
                  <div className="rb-tpl-header-bar" />
                  <div className="rb-tpl-line rb-tpl-w70" />
                  <div className="rb-tpl-line rb-tpl-w50" />
                  <div className="rb-tpl-divider" />
                  <div className="rb-tpl-line rb-tpl-w90" />
                  <div className="rb-tpl-line rb-tpl-w60" />
                  <div className="rb-tpl-line rb-tpl-w80" />
                  <div className="rb-tpl-divider" />
                  <div className="rb-tpl-line rb-tpl-w70" />
                  <div className="rb-tpl-line rb-tpl-w40" />
                </div>
                <div className="rb-template-info">
                  <span className="rb-template-name">{t.name}</span>
                  <div className="rb-template-badges">
                    {t.ats && <span className="rb-badge rb-badge-ats">ATS Friendly</span>}
                    {t.recommended && <span className="rb-badge rb-badge-rec">Recommended</span>}
                  </div>
                </div>
                {selectedTemplate === t.id && (
                  <div className="rb-template-check">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Section Cards */}
        <section className="rb-section">
          <h3 className="rb-section-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Resume Sections
          </h3>
          <div className="rb-sections-list">
            {RESUME_SECTIONS.map((sec) => {
              const isExpanded = expandedSection === sec.id;
              return (
                <div key={sec.id} className={`rb-section-card ${isExpanded ? 'rb-section-expanded' : ''}`}>
                  <button className="rb-section-card-header" onClick={() => setExpandedSection(isExpanded ? null : sec.id)}>
                    <div className="rb-section-card-left">
                      <span className="rb-section-icon">{sec.icon}</span>
                      <span className="rb-section-card-title">{sec.title}</span>
                      <span className="rb-section-item-count">{sec.items.length} items</span>
                    </div>
                    <div className="rb-section-card-right">
                      <span className="rb-section-status-dot" />
                      <svg className={`rb-section-chevron ${isExpanded ? 'rb-chevron-open' : ''}`} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="rb-section-card-body">
                      <ul className="rb-section-items">
                        {sec.items.map((item, i) => (
                          <li key={i} className="rb-section-item">{item}</li>
                        ))}
                      </ul>
                      <button className="tpo-btn tpo-btn-secondary rb-section-edit-btn" onClick={() => alert(`Edit ${sec.title} (UI only)`)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Edit Section
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    );
  }

  /* ── Dashboard (Default) ──────────────────────────────────────── */
  return (
    <div className="rb-page">
      {/* Page Header */}
      <div className="rb-page-header">
        <div>
          <h1 className="rb-page-title">Resume Builder</h1>
          <p className="rb-page-subtitle">Create, manage, and optimize your placement resume</p>
        </div>
        <div className="rb-page-header-actions">
          <button className="tpo-btn tpo-btn-secondary rb-toggle-empty" onClick={() => setShowEmptyState(true)}>
            View Empty State
          </button>
        </div>
      </div>

      {/* ──── 1. Resume Dashboard Card ─────────────────────────── */}
      <section className="rb-dashboard-card">
        <div className="rb-dash-left">
          <div className="rb-score-ring" style={{ '--score': 78 } as React.CSSProperties}>
            <svg viewBox="0 0 120 120" className="rb-ring-svg">
              <circle className="rb-ring-track" cx="60" cy="60" r="52" />
              <circle className="rb-ring-fill" cx="60" cy="60" r="52" />
            </svg>
            <div className="rb-ring-label">
              <span className="rb-ring-value">78</span>
              <span className="rb-ring-unit">ATS Score</span>
            </div>
          </div>
          <div className="rb-dash-stats">
            <div className="rb-dash-stat">
              <span className="rb-dash-stat-label">Status</span>
              <span className="rb-dash-stat-value rb-status-active">
                <span className="rb-status-dot-live" />Active
              </span>
            </div>
            <div className="rb-dash-stat">
              <span className="rb-dash-stat-label">Completion</span>
              <div className="rb-completion-bar-wrap">
                <div className="rb-completion-bar" style={{ width: '85%' }} />
                <span className="rb-completion-pct">85%</span>
              </div>
            </div>
            <div className="rb-dash-stat">
              <span className="rb-dash-stat-label">Last Updated</span>
              <span className="rb-dash-stat-value">Jul 1, 2025</span>
            </div>
            <div className="rb-dash-stat">
              <span className="rb-dash-stat-label">Default Resume</span>
              <span className="rb-dash-stat-value">Dhrumit_Resume_v3.pdf</span>
            </div>
          </div>
        </div>
        <div className="rb-dash-right">
          <button className="tpo-btn tpo-btn-primary rb-edit-cta" onClick={() => setActiveView('editor')}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Resume
          </button>
          <button className="tpo-btn tpo-btn-secondary" onClick={() => setActiveView('preview')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            Preview Resume
          </button>
        </div>
      </section>

      {/* ──── 7. Quick Actions ─────────────────────────────────── */}
      <section className="rb-section">
        <h3 className="rb-section-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          Quick Actions
        </h3>
        <div className="rb-quick-grid">
          {QUICK_ACTIONS.map((a) => (
            <button
              key={a.id}
              className="rb-quick-card"
              onClick={() => {
                if (a.id === 'preview') setActiveView('preview');
                else if (a.id === 'create') setActiveView('editor');
                else alert(`${a.label} triggered (UI only)`);
              }}
            >
              <span className="rb-quick-icon" style={{ background: `${a.color}14`, color: a.color }}>{a.icon}</span>
              <span className="rb-quick-label">{a.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ──── 2. Resume Templates ──────────────────────────────── */}
      <section className="rb-section">
        <h3 className="rb-section-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Resume Templates
        </h3>
        <div className="rb-template-grid">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              className={`rb-template-card ${selectedTemplate === t.id ? 'rb-template-selected' : ''}`}
              onClick={() => setSelectedTemplate(t.id)}
            >
              <div className="rb-template-preview" style={{ '--tpl-accent': t.accent } as React.CSSProperties}>
                <div className="rb-tpl-header-bar" />
                <div className="rb-tpl-line rb-tpl-w70" />
                <div className="rb-tpl-line rb-tpl-w50" />
                <div className="rb-tpl-divider" />
                <div className="rb-tpl-line rb-tpl-w90" />
                <div className="rb-tpl-line rb-tpl-w60" />
                <div className="rb-tpl-line rb-tpl-w80" />
                <div className="rb-tpl-divider" />
                <div className="rb-tpl-line rb-tpl-w70" />
                <div className="rb-tpl-line rb-tpl-w40" />
              </div>
              <div className="rb-template-info">
                <span className="rb-template-name">{t.name}</span>
                <div className="rb-template-badges">
                  {t.ats && <span className="rb-badge rb-badge-ats">ATS Friendly</span>}
                  {t.recommended && <span className="rb-badge rb-badge-rec">Recommended</span>}
                </div>
              </div>
              {selectedTemplate === t.id && (
                <div className="rb-template-check">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ──── 5. ATS Resume Analysis ───────────────────────────── */}
      <section className="rb-section">
        <h3 className="rb-section-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          ATS Resume Analysis
        </h3>
        <div className="rb-ats-grid">
          {/* Score */}
          <div className="rb-ats-score-card">
            <div className="rb-score-ring rb-score-ring-sm" style={{ '--score': 78 } as React.CSSProperties}>
              <svg viewBox="0 0 120 120" className="rb-ring-svg">
                <circle className="rb-ring-track" cx="60" cy="60" r="52" />
                <circle className="rb-ring-fill" cx="60" cy="60" r="52" />
              </svg>
              <div className="rb-ring-label">
                <span className="rb-ring-value">78</span>
                <span className="rb-ring-unit">/ 100</span>
              </div>
            </div>
            <span className="rb-ats-score-title">ATS Compatibility</span>
          </div>
          {/* Metrics */}
          <div className="rb-ats-metrics">
            <div className="rb-ats-metric">
              <div className="rb-ats-metric-header">
                <span>Resume Completeness</span><span className="rb-ats-metric-pct">85%</span>
              </div>
              <div className="rb-ats-bar-track"><div className="rb-ats-bar-fill rb-ats-green" style={{ width: '85%' }} /></div>
            </div>
            <div className="rb-ats-metric">
              <div className="rb-ats-metric-header">
                <span>Formatting Status</span><span className="rb-ats-metric-pct">92%</span>
              </div>
              <div className="rb-ats-bar-track"><div className="rb-ats-bar-fill rb-ats-blue" style={{ width: '92%' }} /></div>
            </div>
            <div className="rb-ats-metric">
              <div className="rb-ats-metric-header">
                <span>Section Completeness</span><span className="rb-ats-metric-pct">77%</span>
              </div>
              <div className="rb-ats-bar-track"><div className="rb-ats-bar-fill rb-ats-amber" style={{ width: '77%' }} /></div>
            </div>
            <div className="rb-ats-keywords">
              <span className="rb-ats-kw-label">Missing Keywords</span>
              <div className="rb-ats-kw-list">
                {ATS_KEYWORDS_MISSING.map((kw) => (
                  <span key={kw} className="rb-ats-kw-chip">{kw}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Recommendations */}
          <div className="rb-ats-recs">
            <h4 className="rb-ats-recs-title">Recommendations</h4>
            <ul className="rb-ats-recs-list">
              {ATS_RECOMMENDATIONS.map((rec, i) => (
                <li key={i} className="rb-ats-rec-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ──── 6. Resume Versions ───────────────────────────────── */}
      <section className="rb-section">
        <h3 className="rb-section-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="12 8 12 12 14 14"/><circle cx="12" cy="12" r="10"/></svg>
          Resume Versions
        </h3>
        <div className="rb-versions-list">
          {VERSIONS.map((v) => (
            <div key={v.id} className={`rb-version-row ${v.isDefault ? 'rb-version-default' : ''}`}>
              <div className="rb-version-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              </div>
              <div className="rb-version-info">
                <span className="rb-version-name">{v.name}</span>
                <span className="rb-version-meta">{v.template} · {v.version} · {v.updated}</span>
              </div>
              <div className="rb-version-actions">
                {v.isDefault && <span className="rb-badge rb-badge-default">Default</span>}
                {!v.isDefault && (
                  <button className="tpo-btn tpo-btn-secondary rb-version-btn" onClick={() => alert(`Set ${v.name} as default (UI only)`)}>Set Default</button>
                )}
                <button className="tpo-btn tpo-btn-secondary rb-version-btn" onClick={() => alert(`Download ${v.name} (UI only)`)}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──── 8. Resume Tips ───────────────────────────────────── */}
      <section className="rb-section">
        <h3 className="rb-section-heading">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>
          Resume Tips
        </h3>
        <div className="rb-tips-grid">
          {TIPS.map((tip, i) => (
            <div key={i} className="rb-tip-card">
              <div className="rb-tip-number">{String(i + 1).padStart(2, '0')}</div>
              <h4 className="rb-tip-title">{tip.title}</h4>
              <p className="rb-tip-desc">{tip.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
