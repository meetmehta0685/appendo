import React from 'react';

interface SidebarProps {
  currentTab: 'dashboard' | 'calendar' | 'insights' | 'aptitude' | 'coding' | 'technical' | 'mock-interview' | 'resume-builder' | 'account-preferences';
  onTabChange: (tab: 'dashboard' | 'calendar' | 'insights' | 'aptitude' | 'coding' | 'technical' | 'mock-interview' | 'resume-builder' | 'account-preferences') => void;
  onLogout: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onTabChange, onLogout, isOpen, onClose }) => {
  return (
    <aside className={`sidebar ${isOpen ? 'show' : ''}`} aria-label="Main Navigation">
      <div className="sidebar-logo">
        <div className="brand-name">TYROO</div>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close Sidebar">
          &times;
        </button>
      </div>

      <nav className="sidebar-menu">
        <a
          href="#"
          className={`sidebar-nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          aria-current={currentTab === 'dashboard' ? 'page' : undefined}
          onClick={(e) => {
            e.preventDefault();
            onTabChange('dashboard');
          }}
        >
          <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </svg>
          <span>Dashboard</span>
        </a>

        <div className="sidebar-group-label">TRACKING</div>
        <a
          href="#"
          className={`sidebar-nav-item ${currentTab === 'calendar' ? 'active' : ''}`}
          aria-current={currentTab === 'calendar' ? 'page' : undefined}
          onClick={(e) => {
            e.preventDefault();
            onTabChange('calendar');
          }}
        >
          <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Drive Calendar</span>
        </a>
        <a
          href="#"
          className={`sidebar-nav-item ${currentTab === 'insights' ? 'active' : ''}`}
          aria-current={currentTab === 'insights' ? 'page' : undefined}
          onClick={(e) => {
            e.preventDefault();
            onTabChange('insights');
          }}
        >
          <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          <span>Campus Placement Insights</span>
        </a>

        <div className="sidebar-group-label">PREPARATION</div>
        <a
          href="#"
          className={`sidebar-nav-item ${currentTab === 'aptitude' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange('aptitude');
          }}
        >
          <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
          <span>Aptitude Prep</span>
        </a>
        <a
          href="#"
          className={`sidebar-nav-item ${currentTab === 'coding' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange('coding');
          }}
        >
          <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          <span>Coding Practice</span>
        </a>
        <a
          href="#"
          className={`sidebar-nav-item ${currentTab === 'technical' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange('technical');
          }}
        >
          <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
            <line x1="6" y1="6" x2="6.01" y2="6" />
            <line x1="6" y1="18" x2="6.01" y2="18" />
          </svg>
          <span>Technical Core</span>
        </a>
        <a
          href="#"
          className={`sidebar-nav-item ${currentTab === 'mock-interview' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange('mock-interview');
          }}
        >
          <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Mock Interviews</span>
        </a>
        <a
          href="#"
          className={`sidebar-nav-item ${currentTab === 'resume-builder' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange('resume-builder');
          }}
        >
          <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span>Resume Builder</span>
        </a>
        <div className="sidebar-group-label">ACCOUNT</div>
        <a
          href="#"
          className={`sidebar-nav-item ${currentTab === 'account-preferences' ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onTabChange('account-preferences');
          }}
        >
          <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
          <span>Account & Preferences</span>
        </a>
        <a
          href="#"
          className="sidebar-nav-item sidebar-logout-btn"
          onClick={(e) => {
            e.preventDefault();
            onLogout();
          }}
        >
          <svg className="nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span>Logout</span>
        </a>
      </nav>

      <div className="sidebar-version">
        <span>TPO Portal v3.0</span>
      </div>
    </aside>
  );
};
