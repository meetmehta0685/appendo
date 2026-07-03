import React from 'react';
import { StudentProfile } from '../types';

interface TopbarProps {
  studentProfile: StudentProfile;
  onCycleBranch?: () => void;
  onMenuToggle?: () => void;
  onToggleTheme?: () => void;
  onNavigateToProfile?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  studentProfile,
  onCycleBranch,
  onMenuToggle,
  onToggleTheme,
  onNavigateToProfile,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="topbar-container">
      {/* Mobile Menu Toggle */}
      <button className="topbar-menu-toggle" onClick={onMenuToggle} aria-label="Open Sidebar menu">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* Search Input */}
      <div className="topbar-search-wrapper">
        <svg
          className="topbar-search-icon"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          className="topbar-search-input"
          placeholder="Search drives, companies, or prep topics…"
        />
      </div>

      {/* Right side controls */}
      <div className="topbar-right-wrapper">
        {/* Context Pill (Click to cycle branch) */}
        <div
          className="topbar-context-pill"
          style={{ cursor: onCycleBranch ? 'pointer' : 'default' }}
          onClick={onCycleBranch}
          title="Click to cycle engineering branch"
        >
          {studentProfile.branch} 🔄
        </div>

        {/* Theme Toggle Icon */}
        <button
          className="topbar-btn"
          aria-label="Toggle Theme"
          onClick={onToggleTheme || (() => alert('Theme toggle is controlled by appearance preferences.'))}
          title="Toggle light/dark appearance"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        </button>

        {/* Notification Bell */}
        <button
          className="topbar-btn"
          aria-label="Notifications"
          onClick={() => alert("Notification panel: You have 2 drives closing this week. Your TCS OA is due today.")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
          <span className="topbar-badge-count">2</span>
        </button>

        {/* User Profile Avatar with Chevron */}
        <div
          className="topbar-avatar-group"
          style={{ cursor: onNavigateToProfile ? 'pointer' : 'default' }}
          onClick={onNavigateToProfile || (() => alert(`Logged in as Dhrumit (${studentProfile.roll})`))}
          title="View Account & Preferences"
        >
          <div className="topbar-avatar-circle">
            {getInitials(studentProfile.name)}
          </div>
          <svg
            className="topbar-avatar-chevron"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>
    </div>
  );
};
