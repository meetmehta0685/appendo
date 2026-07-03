import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { DashboardView } from './components/DashboardView';
import { CalendarView } from './components/CalendarView';
import { DiagnosticModal } from './components/DiagnosticModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { InsightsView } from './components/InsightsView';
import { AptitudeView } from './components/AptitudeView';
import { CodingView } from './components/CodingView';
import { TechnicalCoreView } from './components/TechnicalCoreView';
import { MockInterviewView } from './components/MockInterviewView';
import { AccountPreferencesView } from './components/AccountPreferencesView';
import { ResumeBuilderView } from './components/ResumeBuilderView';
import { StudentProfile, WalkthroughFeatureId } from './types';
import { defaultProfiles } from './data/mockData';

const activeEmail = 'dhrumit@dtu.ac.in';

export const App: React.FC = () => {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'calendar' | 'insights' | 'aptitude' | 'coding' | 'technical' | 'mock-interview' | 'resume-builder' | 'account-preferences'>('dashboard');
  const [selectedDay, setSelectedDay] = useState<number>(2); // Default to July 2nd to highlight Google preparation pusher
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [activeVideoFeature, setActiveVideoFeature] = useState<WalkthroughFeatureId | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Global theme synchronization
  useEffect(() => {
    if (!profile) return;
    const currentAppearance = profile.appearance || 'system';

    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        document.body.classList.add('dark');
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        document.body.classList.remove('dark');
        document.documentElement.removeAttribute('data-theme');
      }
    };

    if (currentAppearance === 'dark') {
      applyTheme(true);
    } else if (currentAppearance === 'light') {
      applyTheme(false);
    } else {
      // System Theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mediaQuery.matches);

      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };
      mediaQuery.addEventListener('change', listener);
      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }
  }, [profile?.appearance]);

  // Load profile from localStorage or fallback to default
  useEffect(() => {
    const saved = localStorage.getItem(`studentProfile_${activeEmail}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.subScores && parsed.drives && parsed.branch) {
          if (parsed.branch.includes('•')) {
            parsed.branch = parsed.branch.replace(/•/g, '·');
          }
          setProfile(parsed);
          return;
        }
      } catch (e) {
        console.warn('Resetting invalid student profile in localStorage:', e);
      }
    }
    const defaultProfile = JSON.parse(JSON.stringify(defaultProfiles[activeEmail]));
    localStorage.setItem(`studentProfile_${activeEmail}`, JSON.stringify(defaultProfile));
    setProfile(defaultProfile);
  }, []);

  const saveProfile = (newProfile: StudentProfile) => {
    setProfile(newProfile);
    localStorage.setItem(`studentProfile_${activeEmail}`, JSON.stringify(newProfile));
  };

  const triggerConfettiCelebration = () => {
    const emojis = ['🎉', '✨', '🏆', '🎓', '💼', '👏', '🎯'];
    for (let i = 0; i < 15; i++) {
      const conf = document.createElement('div');
      conf.innerText = emojis[Math.floor(Math.random() * emojis.length)];
      conf.style.position = 'fixed';
      conf.style.left = `${15 + Math.random() * 70}vw`;
      conf.style.bottom = '10vh';
      conf.style.fontSize = '2.2rem';
      conf.style.zIndex = '99999';
      conf.style.pointerEvents = 'none';
      conf.style.transition = 'all 1.6s cubic-bezier(0.25, 1, 0.5, 1)';
      document.body.appendChild(conf);

      setTimeout(() => {
        conf.style.transform = `translateY(-78vh) rotate(${Math.random() * 360 - 180}deg)`;
        conf.style.opacity = '0';
      }, 50);

      setTimeout(() => {
        conf.remove();
      }, 1700);
    }
  };

  const handleCycleBranch = () => {
    if (!profile) return;
    const updated = { ...profile };
    if (profile.branch.includes('CSE')) {
      updated.branch = 'Mechanical Engineering · Semester 7';
      updated.roll = 'DTU/2K23/ME/085';
    } else if (profile.branch.includes('Mechanical')) {
      updated.branch = 'Electrical Engineering · Semester 7';
      updated.roll = 'DTU/2K23/EE/099';
    } else {
      updated.branch = 'CSE · Semester 7';
      updated.roll = 'DTU/2K23/CO/142';
    }
    saveProfile(updated);
  };

  const handleRegisterDrive = (companyId: string, day: number) => {
    if (!profile) return;
    const updated = { ...profile };
    updated.drives[companyId] = 'registered';
    updated.readiness = Math.min(100, updated.readiness + 2);
    saveProfile(updated);
    triggerConfettiCelebration();
    alert(`Registration successful! You have applied for the drive on July ${day}.`);
  };

  const handleRequestWaiver = (companyId: string, day: number) => {
    if (!profile) return;
    const updated = { ...profile };
    updated.drives[companyId] = 'waiver_pending';
    saveProfile(updated);
    alert(`GPA waiver petition submitted. TPO coordinators have been alerted for the drive on July ${day}.`);
  };

  const handleGradingComplete = (newReadiness: number, newApt: number) => {
    if (!profile) return;
    const updated = { ...profile };
    updated.readiness = newReadiness;
    updated.subScores.apt = newApt;
    saveProfile(updated);
    triggerConfettiCelebration();
  };

  const handleScanResume = () => {
    if (!profile) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx,.txt';
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];
        alert(`Successfully uploaded "${file.name}" to TPO database. Processing ATS scan...`);
        const updated = { ...profile };
        updated.subScores.resume = Math.min(100, updated.subScores.resume + 5);
        updated.readiness = Math.min(100, updated.readiness + 2);
        saveProfile(updated);
        triggerConfettiCelebration();
      }
    };
    input.click();
  };

  const handleLaunchSandbox = () => {
    if (!profile) return;
    const updated = { ...profile };
    updated.subScores.code = Math.min(100, updated.subScores.code + 4);
    updated.readiness = Math.min(100, updated.readiness + 1);
    saveProfile(updated);
    triggerConfettiCelebration();
    alert('Launching DSA sandbox environment...');
  };

  const handleLogout = () => {
    alert('Logging out and clearing session data...');
    localStorage.removeItem(`studentProfile_${activeEmail}`);
    const defaultProfile = JSON.parse(JSON.stringify(defaultProfiles[activeEmail]));
    localStorage.setItem(`studentProfile_${activeEmail}`, JSON.stringify(defaultProfile));
    setProfile(defaultProfile);
    setCurrentTab('dashboard');
  };

  if (!profile) return null;

  const handleTabChange = (tab: 'dashboard' | 'calendar' | 'insights' | 'aptitude' | 'coding' | 'technical' | 'mock-interview' | 'resume-builder' | 'account-preferences') => {
    setCurrentTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className={`tyroo-wrapper ${isSidebarOpen ? 'mobile-sidebar-active' : ''}`}>
      <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      <Sidebar
        currentTab={currentTab}
        onTabChange={handleTabChange}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="tyroo-content-area">
        <Topbar
          studentProfile={profile}
          onCycleBranch={handleCycleBranch}
          onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
          onToggleTheme={() => {
            if (!profile) return;
            const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
            const nextMode = modes[(modes.indexOf(profile.appearance || 'system') + 1) % modes.length];
            saveProfile({ ...profile, appearance: nextMode });
          }}
          onNavigateToProfile={() => handleTabChange('account-preferences')}
        />
        
        <main className="tyroo-main">
          {currentTab === 'dashboard' ? (
            <DashboardView
              studentProfile={profile}
              onCycleBranch={handleCycleBranch}
              onRegisterDrive={handleRegisterDrive}
              onRequestWaiver={handleRequestWaiver}
              onWatchDemo={setActiveVideoFeature}
              onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
              onLaunchSandbox={handleLaunchSandbox}
              onScanResume={handleScanResume}
              onNavigateToCalendar={() => handleTabChange('calendar')}
              onNavigateToResumeBuilder={() => handleTabChange('resume-builder')}
              onNavigateToMockInterview={() => handleTabChange('mock-interview')}
              onNavigateToAptitude={() => handleTabChange('aptitude')}
              onNavigateToCoding={() => handleTabChange('coding')}
              onNavigateToTechnical={() => handleTabChange('technical')}
            />
          ) : currentTab === 'calendar' ? (
            <CalendarView
              studentProfile={profile}
              selectedDay={selectedDay}
              onSelectDay={setSelectedDay}
              onRegisterDrive={handleRegisterDrive}
              onRequestWaiver={handleRequestWaiver}
              onNavigateToDashboard={() => handleTabChange('dashboard')}
            />
          ) : currentTab === 'insights' ? (
            <InsightsView studentProfile={profile} />
          ) : currentTab === 'aptitude' ? (
            <AptitudeView studentProfile={profile} />
          ) : currentTab === 'coding' ? (
            <CodingView studentProfile={profile} />
          ) : currentTab === 'technical' ? (
            <TechnicalCoreView studentProfile={profile} onUpdateProfile={saveProfile} />
          ) : currentTab === 'account-preferences' ? (
            <AccountPreferencesView studentProfile={profile} onUpdateProfile={saveProfile} />
          ) : currentTab === 'resume-builder' ? (
            <ResumeBuilderView studentProfile={profile} />
          ) : (
            <MockInterviewView studentProfile={profile} onUpdateProfile={saveProfile} />
          )}
        </main>
      </div>

      <DiagnosticModal
        isOpen={isDiagnosticOpen}
        onClose={() => setIsDiagnosticOpen(false)}
        studentProfile={profile}
        onGradingComplete={handleGradingComplete}
      />

      <VideoPlayerModal
        isOpen={activeVideoFeature !== null}
        featureId={activeVideoFeature}
        onClose={() => setActiveVideoFeature(null)}
      />
    </div>
  );
};
