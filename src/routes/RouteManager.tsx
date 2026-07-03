import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useStudentProfileQuery } from '../api/queries';
import { LoginView } from '../components/LoginView';
import { LoadingScreen } from '../components/LoadingScreen';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { DashboardLayout } from '../layouts/DashboardLayout';

// Sub Views
import { DashboardView } from '../components/DashboardView';
import { CalendarView } from '../components/CalendarView';
import { InsightsView } from '../components/InsightsView';
import { AptitudeView } from '../components/AptitudeView';
import { CodingView } from '../components/CodingView';
import { TechnicalCoreView } from '../components/TechnicalCoreView';
import { MockInterviewView } from '../components/MockInterviewView';
import { ResumeBuilderView } from '../components/ResumeBuilderView';
import { AccountPreferencesView } from '../components/AccountPreferencesView';

// Modals
import { DiagnosticModal } from '../components/DiagnosticModal';
import { VideoPlayerModal } from '../components/VideoPlayerModal';

import { WalkthroughFeatureId } from '../types';
import { useProfileStore } from '../store/useProfileStore';

export const RouteManager: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const email = useAuthStore((state) => state.email);

  // Tab State
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'calendar' | 'insights' | 'aptitude' | 'coding' | 'technical' | 'mock-interview' | 'resume-builder' | 'account-preferences'>('dashboard');
  const [selectedDay, setSelectedDay] = useState<number>(2); // Default to July 2nd to highlight Google preparation pusher
  
  // Modals & walkthrough states
  const [isDiagnosticOpen, setIsDiagnosticOpen] = useState(false);
  const [activeVideoFeature, setActiveVideoFeature] = useState<WalkthroughFeatureId | null>(null);

  // Zustand Profile Store loader mapping
  const loadProfile = useProfileStore((state) => state.loadProfile);
  const cycleBranch = useProfileStore((state) => state.cycleBranch);
  const registerDriveLocal = useProfileStore((state) => state.registerDrive);
  const requestWaiverLocal = useProfileStore((state) => state.requestWaiver);
  const completeGradingLocal = useProfileStore((state) => state.completeGrading);
  const scanResumeLocal = useProfileStore((state) => state.scanResume);
  const launchSandboxLocal = useProfileStore((state) => state.launchSandbox);
  const saveProfileLocal = useProfileStore((state) => state.saveProfile);

  // Ensure state matches the email on auth login
  useEffect(() => {
    if (isAuthenticated && email) {
      loadProfile(email);
    }
  }, [isAuthenticated, email, loadProfile]);

  // Hook to pull profile using React Query
  const { data: profile, isLoading, error } = useStudentProfileQuery(email || '');

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
      applyTheme(mediaQuery.media ? mediaQuery.matches : false);

      const listener = (e: MediaQueryListEvent) => {
        applyTheme(e.matches);
      };
      mediaQuery.addEventListener('change', listener);
      return () => {
        mediaQuery.removeEventListener('change', listener);
      };
    }
  }, [profile?.appearance]);

  // 1. Auth Guard: Guest Mode (Render Login if not authenticated)
  if (!isAuthenticated) {
    return <LoginView />;
  }

  // 2. Loading Boundary: Render Spinner while fetching profile
  if (isLoading || !profile) {
    return <LoadingScreen />;
  }

  // 3. Error Boundary Handling
  if (error) {
    throw error; // propagate to error boundary wrapper
  }

  // Handler functions mapped to store
  const handleRegisterDrive = (companyId: string, day: number) => {
    registerDriveLocal(companyId, day);
  };

  const handleRequestWaiver = (companyId: string, day: number) => {
    requestWaiverLocal(companyId, day);
  };

  const handleGradingComplete = (newReadiness: number, newApt: number) => {
    completeGradingLocal(newReadiness, newApt);
  };

  const handleScanResume = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.docx,.txt';
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        scanResumeLocal(input.files[0].name);
      }
    };
    input.click();
  };

  return (
    <ErrorBoundary>
      <DashboardLayout
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        studentProfile={profile}
      >
        {currentTab === 'dashboard' ? (
          <DashboardView
            studentProfile={profile}
            onCycleBranch={cycleBranch}
            onRegisterDrive={handleRegisterDrive}
            onRequestWaiver={handleRequestWaiver}
            onWatchDemo={setActiveVideoFeature}
            onOpenDiagnostic={() => setIsDiagnosticOpen(true)}
            onLaunchSandbox={launchSandboxLocal}
            onScanResume={handleScanResume}
            onNavigateToCalendar={() => setCurrentTab('calendar')}
            onNavigateToResumeBuilder={() => setCurrentTab('resume-builder')}
            onNavigateToMockInterview={() => setCurrentTab('mock-interview')}
            onNavigateToAptitude={() => setCurrentTab('aptitude')}
            onNavigateToCoding={() => setCurrentTab('coding')}
            onNavigateToTechnical={() => setCurrentTab('technical')}
          />
        ) : currentTab === 'calendar' ? (
          <CalendarView
            studentProfile={profile}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onRegisterDrive={handleRegisterDrive}
            onRequestWaiver={handleRequestWaiver}
            onNavigateToDashboard={() => setCurrentTab('dashboard')}
          />
        ) : currentTab === 'insights' ? (
          <InsightsView studentProfile={profile} />
        ) : currentTab === 'aptitude' ? (
          <AptitudeView studentProfile={profile} />
        ) : currentTab === 'coding' ? (
          <CodingView studentProfile={profile} />
        ) : currentTab === 'technical' ? (
          <TechnicalCoreView studentProfile={profile} onUpdateProfile={saveProfileLocal} />
        ) : currentTab === 'account-preferences' ? (
          <AccountPreferencesView studentProfile={profile} onUpdateProfile={saveProfileLocal} />
        ) : currentTab === 'resume-builder' ? (
          <ResumeBuilderView studentProfile={profile} />
        ) : (
          <MockInterviewView studentProfile={profile} onUpdateProfile={saveProfileLocal} />
        )}
      </DashboardLayout>

      {/* Shared Global Modals */}
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
    </ErrorBoundary>
  );
};
