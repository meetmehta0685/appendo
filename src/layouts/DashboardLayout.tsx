import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Topbar } from '../components/Topbar';
import { StudentProfile } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useProfileStore } from '../store/useProfileStore';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentTab: 'dashboard' | 'calendar' | 'insights' | 'aptitude' | 'coding' | 'technical' | 'mock-interview' | 'resume-builder' | 'account-preferences';
  onTabChange: (tab: any) => void;
  studentProfile: StudentProfile;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  currentTab,
  onTabChange,
  studentProfile,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const logout = useAuthStore((state) => state.logout);
  const cycleBranch = useProfileStore((state) => state.cycleBranch);
  const saveProfile = useProfileStore((state) => state.saveProfile);

  const handleLogout = () => {
    if (confirm('Logging out and clearing session data...')) {
      logout();
      window.location.reload();
    }
  };

  const handleToggleTheme = () => {
    const appearance = studentProfile.appearance || 'system';
    const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
    const nextMode = modes[(modes.indexOf(appearance) + 1) % modes.length];
    saveProfile({ ...studentProfile, appearance: nextMode });
  };

  return (
    <div className={`tyroo-wrapper ${isSidebarOpen ? 'mobile-sidebar-active' : ''}`}>
      {/* Sidebar overlay for mobile mobile drawer */}
      <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          onTabChange(tab);
          setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="tyroo-content-area">
        <Topbar
          studentProfile={studentProfile}
          onCycleBranch={cycleBranch}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleTheme={handleToggleTheme}
          onNavigateToProfile={() => onTabChange('account-preferences')}
        />
        
        <main className="tyroo-main">
          {children}
        </main>
      </div>
    </div>
  );
};
