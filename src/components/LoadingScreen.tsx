import React from 'react';

export const LoadingScreen: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-page)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
    }}>
      <style>{`
        .loading-pulse-ring {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 3px solid var(--border-soft);
          border-top-color: var(--accent-blue);
          animation: spin-pulse 0.8s linear infinite;
        }

        @keyframes spin-pulse {
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <div className="loading-pulse-ring"></div>
        <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
          Syncing Placement Portal...
        </span>
      </div>
    </div>
  );
};
