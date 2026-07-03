import React, { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';

export const LoginView: React.FC = () => {
  const [emailInput, setEmailInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const login = useAuthStore((state) => state.login);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) {
      setError('Please provide an email address');
      return;
    }
    if (!emailInput.includes('@')) {
      setError('Please enter a valid academic email address');
      return;
    }
    setError(null);
    // Simulate generation of mock JWT
    const mockToken = `mock-jwt-token-${Date.now()}`;
    login(emailInput.trim().toLowerCase(), mockToken);
  };

  const handleQuickSelect = (email: string) => {
    setEmailInput(email);
    const mockToken = `mock-jwt-token-${Date.now()}`;
    login(email, mockToken);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-page)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-body)',
    }}>
      <style>{`
        .login-card {
          max-width: 420px;
          width: 100%;
          background: var(--bg-page);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 40px;
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .login-brand {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 20px;
          letter-spacing: -0.03em;
          color: var(--accent-blue);
          text-align: center;
        }

        .login-title {
          font-size: 22px;
          font-weight: 800;
          text-align: center;
          margin-bottom: 6px;
        }

        .login-subtitle {
          font-size: 13.5px;
          color: var(--text-secondary);
          text-align: center;
          line-height: 1.5;
          margin: 0;
        }

        .quick-email-btn {
          width: 100%;
          padding: 12px;
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition-smooth);
          text-align: left;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .quick-email-btn:hover {
          background: var(--border-soft);
          border-color: var(--text-muted);
        }
      `}</style>

      <div className="login-card">
        <div>
          <div className="login-brand">TYROO</div>
          <h1 className="login-title" style={{ marginTop: '16px' }}>Placement OS</h1>
          <p className="login-subtitle">
            Enter your college academic credentials to access the placement drive Preparation and preparation tracking portal.
          </p>
        </div>

        {error && (
          <div style={{
            background: 'var(--accent-red-bg)',
            color: 'var(--accent-red)',
            padding: '10px 14px',
            borderRadius: '8px',
            fontSize: '12.5px',
            border: '1px solid var(--border)',
            fontWeight: 500
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label htmlFor="login-email" style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Academic Email Address
            </label>
            <input
              id="login-email"
              type="text"
              placeholder="e.g. name@college.edu"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          <button type="submit" className="btn-solve-primary" style={{ width: '100%', padding: '12px' }}>
            Access Portal
          </button>
        </form>

        <div style={{ borderTop: '1px solid var(--border-soft)', paddingTop: '20px' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            Quick Select Profiles
          </span>
          <button 
            type="button"
            className="quick-email-btn"
            onClick={() => handleQuickSelect('dhrumit@dtu.ac.in')}
          >
            <span>Dhrumit (DTU Delhi)</span>
            <span style={{ color: 'var(--accent-blue)', fontSize: '11px' }}>dhrumit@dtu.ac.in &rarr;</span>
          </button>
        </div>
      </div>
    </div>
  );
};
