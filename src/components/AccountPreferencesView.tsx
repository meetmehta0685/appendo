import React, { useState, useRef } from 'react';
import { StudentProfile, ResumeItem, ActiveSession } from '../types';

interface AccountPreferencesViewProps {
  studentProfile: StudentProfile;
  onUpdateProfile: (newProfile: StudentProfile) => void;
}

type SettingsSection = 
  | 'personal'
  | 'academic'
  | 'resume'
  | 'notifications'
  | 'security'
  | 'appearance'
  | 'help'
  | 'about';

export const AccountPreferencesView: React.FC<AccountPreferencesViewProps> = ({
  studentProfile,
  onUpdateProfile,
}) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('personal');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // --- 1. Personal Profile State ---
  const [mobile, setMobile] = useState(studentProfile.mobile || '');
  const [personalEmail, setPersonalEmail] = useState(studentProfile.personalEmail || '');
  const [linkedin, setLinkedin] = useState(studentProfile.linkedin || '');
  const [github, setGithub] = useState(studentProfile.github || '');
  const [portfolio, setPortfolio] = useState(studentProfile.portfolio || '');
  const [profilePhoto, setProfilePhoto] = useState(studentProfile.profilePhoto || '');
  const [personalErrors, setPersonalErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Toast Helper
  const showToast = (message: string) => {
    setSuccessToast(message);
    setTimeout(() => {
      setSuccessToast(null);
    }, 3000);
  };

  const handleSavePersonal = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    // Mobile Validation (must be 10 digits or start with +)
    const mobileRegex = /^(\+?\d{1,3}[- ]?)?\d{10}$/;
    if (mobile && !mobileRegex.test(mobile.replace(/\s+/g, ''))) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (personalEmail && !emailRegex.test(personalEmail)) {
      errors.personalEmail = 'Please enter a valid email address';
    }

    // URL Validations
    const urlRegex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/\S*)?$/;
    if (linkedin && !urlRegex.test(linkedin)) {
      errors.linkedin = 'Please enter a valid URL (e.g., https://linkedin.com/in/username)';
    }
    if (github && !urlRegex.test(github)) {
      errors.github = 'Please enter a valid URL (e.g., https://github.com/username)';
    }
    if (portfolio && !urlRegex.test(portfolio)) {
      errors.portfolio = 'Please enter a valid URL';
    }

    if (Object.keys(errors).length > 0) {
      setPersonalErrors(errors);
      return;
    }

    setPersonalErrors({});
    const updated = {
      ...studentProfile,
      mobile,
      personalEmail,
      linkedin,
      github,
      portfolio,
      profilePhoto,
    };
    onUpdateProfile(updated);
    showToast('Personal profile saved successfully!');
  };

  const handleResetPersonal = () => {
    setMobile(studentProfile.mobile || '');
    setPersonalEmail(studentProfile.personalEmail || '');
    setLinkedin(studentProfile.linkedin || '');
    setGithub(studentProfile.github || '');
    setPortfolio(studentProfile.portfolio || '');
    setProfilePhoto(studentProfile.profilePhoto || '');
    setPersonalErrors({});
  };

  const handlePhotoUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert('Profile image size must be under 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setProfilePhoto(reader.result);
          const updated = { ...studentProfile, profilePhoto: reader.result };
          onUpdateProfile(updated);
          showToast('Profile photo updated!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto('');
    const updated = { ...studentProfile, profilePhoto: '' };
    onUpdateProfile(updated);
    showToast('Profile photo removed.');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  // --- 3. Resume State ---
  const [resumes, setResumes] = useState<ResumeItem[]>(studentProfile.resumes || []);
  const [defaultResumeId, setDefaultResumeId] = useState(studentProfile.defaultResumeId || '');
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds the 5MB limit.');
        return;
      }

      setUploadingResume(true);
      setUploadProgress(0);

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const newResume: ResumeItem = {
                id: `res-${Date.now()}`,
                name: file.name,
                uploadedAt: new Date().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }) + `, ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`,
                size: `${(file.size / 1024).toFixed(0)} KB`,
              };
              const updatedResumes = [newResume, ...resumes];
              setResumes(updatedResumes);
              // Auto-set as default if it's the first resume
              const newDefaultId = defaultResumeId || newResume.id;
              if (!defaultResumeId) {
                setDefaultResumeId(newResume.id);
              }

              const updatedProfile = {
                ...studentProfile,
                resumes: updatedResumes,
                defaultResumeId: newDefaultId,
                // Boost resume subscore slightly
                subScores: {
                  ...studentProfile.subScores,
                  resume: Math.min(100, studentProfile.subScores.resume + 3),
                },
                readiness: Math.min(100, studentProfile.readiness + 1),
              };
              onUpdateProfile(updatedProfile);
              setUploadingResume(false);
              showToast(`"${file.name}" uploaded successfully.`);
            }, 300);
            return 100;
          }
          return prev + 20;
        });
      }, 100);
    }
  };

  const handleSetDefaultResume = (id: string) => {
    setDefaultResumeId(id);
    const updatedProfile = { ...studentProfile, defaultResumeId: id };
    onUpdateProfile(updatedProfile);
    showToast('Default resume updated.');
  };

  const handleDeleteResume = (id: string) => {
    const resumeToDelete = resumes.find((r) => r.id === id);
    if (!resumeToDelete) return;
    if (confirm(`Are you sure you want to delete "${resumeToDelete.name}"?`)) {
      const updatedResumes = resumes.filter((r) => r.id !== id);
      let newDefault = defaultResumeId;
      if (defaultResumeId === id) {
        newDefault = updatedResumes.length > 0 ? updatedResumes[0].id : '';
      }
      setResumes(updatedResumes);
      setDefaultResumeId(newDefault);

      const updatedProfile = {
        ...studentProfile,
        resumes: updatedResumes,
        defaultResumeId: newDefault,
      };
      onUpdateProfile(updatedProfile);
      showToast('Resume deleted.');
    }
  };

  const handleDownloadResume = (name: string) => {
    alert(`Downloading "${name}" from Tyroo secure TPO storage...`);
    // Create an anchor link to trigger fake download
    const link = document.createElement('a');
    link.href = '#';
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 4. Notification Preferences ---
  const [notifications, setNotifications] = useState<Record<string, boolean>>(
    studentProfile.notifications || {
      placementDrives: true,
      registrationDeadlines: true,
      onlineAssessments: true,
      interviewSchedules: true,
      resumeReviewReminders: false,
      dailyPracticeReminders: true,
      mockInterviewReminders: true,
      placementAnnouncements: true,
    }
  );

  const handleToggleNotification = (key: string) => {
    const updatedNotifications = {
      ...notifications,
      [key]: !notifications[key],
    };
    setNotifications(updatedNotifications);
    const updatedProfile = {
      ...studentProfile,
      notifications: updatedNotifications,
    };
    onUpdateProfile(updatedProfile);
    showToast('Notification preference saved.');
  };

  // --- 5. Security & Sessions ---
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(studentProfile.twoFactorEnabled || false);
  const [sessions, setSessions] = useState<ActiveSession[]>(
    studentProfile.sessions || [
      { id: 'sess-1', device: 'MacBook Pro · macOS (Current Session)', ip: '192.168.1.45', location: 'Delhi, India', active: true, lastActive: 'Active now' },
      { id: 'sess-2', device: 'iPhone 15 · iOS App', ip: '103.45.201.12', location: 'Delhi, India', active: false, lastActive: '2 hours ago' },
      { id: 'sess-3', device: 'Chrome · Windows Desktop', ip: '192.168.1.102', location: 'Noida, India', active: false, lastActive: 'Yesterday, 6:30 PM' },
    ]
  );

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword) {
      setPasswordError('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    setPasswordError(null);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('Security verification successful. Your password has been updated across your active college devices.');
    showToast('Password updated successfully!');
  };

  const handleToggle2FA = () => {
    const newState = !twoFactorEnabled;
    setTwoFactorEnabled(newState);
    const updatedProfile = {
      ...studentProfile,
      twoFactorEnabled: newState,
    };
    onUpdateProfile(updatedProfile);
    showToast(newState ? '2FA enabled successfully!' : '2FA disabled.');
  };

  const handleRevokeSession = (id: string) => {
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    const updatedProfile = {
      ...studentProfile,
      sessions: updated,
    };
    onUpdateProfile(updatedProfile);
    showToast('Session revoked.');
  };

  const handleLogoutAllOthers = () => {
    if (confirm('Are you sure you want to revoke all other active sessions? You will remain logged in on this device.')) {
      const activeOnly = sessions.filter((s) => s.active);
      setSessions(activeOnly);
      const updatedProfile = {
        ...studentProfile,
        sessions: activeOnly,
      };
      onUpdateProfile(updatedProfile);
      showToast('All other sessions revoked.');
    }
  };

  // --- 6. Appearance / Themes ---
  const [appearance, setAppearance] = useState<'light' | 'dark' | 'system'>(
    studentProfile.appearance || 'system'
  );

  const handleAppearanceChange = (mode: 'light' | 'dark' | 'system') => {
    setAppearance(mode);
    const updatedProfile = {
      ...studentProfile,
      appearance: mode,
    };
    onUpdateProfile(updatedProfile);
    showToast(`Theme preference updated to ${mode}.`);
  };

  // --- 7. Help & Support ---
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMessage, setSupportMessage] = useState('');
  const [feedbackRating, setFeedbackRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const faqs = [
    {
      q: 'How can I update my academic information?',
      a: 'Academic credentials (branch, roll number, passes, CGPA, backlogs) are synchronized directly from the University Academic Portal. For corrections regarding your academic status, please submit an official transcript copy to the Placement Office (TPO Cell) block.',
    },
    {
      q: 'Can I upload multiple resumes?',
      a: 'Yes, you can upload up to 5 resumes in PDF or Word formats. However, you must select one default resume that will be automatically submitted when registering for new placement drives.',
    },
    {
      q: 'What is "Student Readiness Score"?',
      a: 'Your readiness score is a composite index computed by the Tyroo engine based on your coding practice, aptitude completion, mock interview participation, and resume quality. A score above 80% is recommended for Google and Tier-1 drives.',
    },
    {
      q: 'How does GPA waiver petition work?',
      a: 'If your GPA falls slightly below a drive eligibility criteria, you can click "Petition Waiver". The TPO office will review your technical backlog progress and coding metrics to petition the hiring coordinator.',
    },
  ];

  const handleToggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const handleSendTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportSubject || !supportMessage) {
      alert('Please fill out all fields of the support ticket.');
      return;
    }
    setSupportSubject('');
    setSupportMessage('');
    alert(`Support request received. A ticket (ID: TY-${Math.floor(100000 + Math.random() * 900000)}) has been opened. Our support team will reply within 4 hours to ${studentProfile.personalEmail || 'your email'}.`);
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackRating) {
      alert('Please select a star rating.');
      return;
    }
    setFeedbackRating(null);
    setFeedbackText('');
    alert('Thank you for your feedback! We analyze your input to improve the Tyroo Placement OS.');
  };

  // --- 8. About & Legal Modals ---
  const [activeModal, setActiveModal] = useState<'terms' | 'privacy' | 'license' | null>(null);

  const renderModalContent = () => {
    switch (activeModal) {
      case 'terms':
        return (
          <>
            <h3>Terms & Conditions</h3>
            <div className="modal-scroll-area">
              <p><strong>Last Updated: July 2, 2026</strong></p>
              <p>Welcome to Tyroo Placement OS. By accessing or using our platform, you agree to comply with and be bound by these terms. These terms govern the placement recruitment process, academic verification sync, and coding sandbox usage.</p>
              <p>1. <strong>Accuracy of Profiles:</strong> Students are strictly responsible for maintaining authentic records. While academic data is locked via official collegiate databases, personal profile details (LinkedIn, GitHub) must remain professional and true. Misrepresentation in placement portfolios is subject to academic review.</p>
              <p>2. <strong>Recruitment Code of Conduct:</strong> Once registered for a campus drive, attendance in scheduled interviews is mandatory. Unexcused absence will trigger placement de-registration procedures.</p>
            </div>
          </>
        );
      case 'privacy':
        return (
          <>
            <h3>Privacy Policy</h3>
            <div className="modal-scroll-area">
              <p><strong>Last Updated: July 2, 2026</strong></p>
              <p>Your privacy is of vital importance. This policy outlines how Tyroo Placement OS collects, handles, and protects your educational records, resume documents, and practice scores.</p>
              <p>1. <strong>Data Sharing:</strong> Your resume and academic records are visible only to verified TPO cell members and corporate recruitment teams representing drives you have actively applied for. We do not sell or lease student data to third-party marketing services.</p>
              <p>2. <strong>Tracking Logs:</strong> We log login history, IP addresses, and active browser sessions to safeguard your account against impersonation and unauthorized placement exam entries.</p>
            </div>
          </>
        );
      case 'license':
        return (
          <>
            <h3>Open Source Licenses</h3>
            <div className="modal-scroll-area">
              <p>Tyroo Placement OS is powered by open source software. We express our gratitude to the contributors of the following packages:</p>
              <ul>
                <li><strong>React (MIT):</strong> UI component structures.</li>
                <li><strong>Vite (MIT):</strong> Frontend application bundling and hot-module reloading.</li>
                <li><strong>Chart.js (MIT):</strong> Premium placement analytics rendering.</li>
                <li><strong>Plus Jakarta Sans (OFL):</strong> Dynamic display typography.</li>
                <li><strong>Inter Font Family (OFL):</strong> Crisp body typography.</li>
              </ul>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="pref-page-container">
      {/* SUCCESS TOAST */}
      {successToast && (
        <div className="pref-success-toast" role="alert">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="toast-icon">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{successToast}</span>
        </div>
      )}

      {/* TOP HEADER */}
      <div className="pref-header">
        <h1 className="pref-title">Account & Preferences</h1>
        <p className="pref-subtitle">Configure your personal profile details, resume storage, credentials, and notification schedules.</p>
      </div>

      <div className="pref-main-grid">
        {/* LEFT COLUMN: NAVIGATION BAR */}
        <aside className="pref-sidebar" aria-label="Settings Sections">
          <nav className="pref-nav">
            <button
              className={`pref-nav-btn ${activeSection === 'personal' ? 'active' : ''}`}
              onClick={() => setActiveSection('personal')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span>Personal Profile</span>
            </button>

            <button
              className={`pref-nav-btn ${activeSection === 'academic' ? 'active' : ''}`}
              onClick={() => setActiveSection('academic')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
              </svg>
              <span>Academic Information</span>
            </button>

            <button
              className={`pref-nav-btn ${activeSection === 'resume' ? 'active' : ''}`}
              onClick={() => setActiveSection('resume')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Resume Preferences</span>
            </button>

            <button
              className={`pref-nav-btn ${activeSection === 'notifications' ? 'active' : ''}`}
              onClick={() => setActiveSection('notifications')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span>Notification Preferences</span>
            </button>

            <button
              className={`pref-nav-btn ${activeSection === 'security' ? 'active' : ''}`}
              onClick={() => setActiveSection('security')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>Account Security</span>
            </button>

            <button
              className={`pref-nav-btn ${activeSection === 'appearance' ? 'active' : ''}`}
              onClick={() => setActiveSection('appearance')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
              <span>Appearance</span>
            </button>

            <button
              className={`pref-nav-btn ${activeSection === 'help' ? 'active' : ''}`}
              onClick={() => setActiveSection('help')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span>Help & Support</span>
            </button>

            <button
              className={`pref-nav-btn ${activeSection === 'about' ? 'active' : ''}`}
              onClick={() => setActiveSection('about')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>About Tyroo</span>
            </button>
          </nav>
        </aside>

        {/* RIGHT COLUMN: INTERACTIVE SECTION VIEWS */}
        <main className="pref-content-panel">
          {/* ================= SECTION 1: PERSONAL PROFILE ================= */}
          {activeSection === 'personal' && (
            <section className="pref-section-card animate-fade-in" aria-labelledby="sec-personal-title">
              <div className="pref-section-header">
                <h2 id="sec-personal-title">Personal Profile</h2>
                <p>Manage your contact details and social URLs. Official recruiter communications rely on this data.</p>
              </div>

              {/* PROFILE PHOTO ROW */}
              <div className="photo-upload-row">
                <div className="profile-photo-wrapper">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile Avatar" className="profile-photo-img" />
                  ) : (
                    <div className="profile-photo-placeholder">
                      {getInitials(studentProfile.name)}
                    </div>
                  )}
                </div>
                <div className="photo-actions">
                  <button type="button" className="btn-secondary btn-sm" onClick={handlePhotoUploadClick}>
                    Change Photo
                  </button>
                  {profilePhoto && (
                    <button type="button" className="btn-text-danger btn-sm" onClick={handleRemovePhoto}>
                      Remove Photo
                    </button>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <span className="photo-limits">Recommended: JPG/PNG, Max 2MB. Fits a square grid.</span>
                </div>
              </div>

              <form onSubmit={handleSavePersonal} className="pref-form">
                <div className="form-group-grid">
                  {/* Read-Only: Full Name */}
                  <div className="form-field disabled-field">
                    <label htmlFor="pf-fullname">Full Name <span className="field-badge">Read Only</span></label>
                    <div className="input-with-icon-lock">
                      <input
                        type="text"
                        id="pf-fullname"
                        value={studentProfile.name}
                        disabled
                      />
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-lock-icon">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <span className="field-hint">Institutional name imported from college administration records.</span>
                  </div>

                  {/* Read-Only: Email */}
                  <div className="form-field disabled-field">
                    <label htmlFor="pf-email">College Email <span className="field-badge">Read Only</span></label>
                    <div className="input-with-icon-lock">
                      <input
                        type="email"
                        id="pf-email"
                        value="dhrumit@dtu.ac.in"
                        disabled
                      />
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="input-lock-icon">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                    <span className="field-hint">Primary verification channel. SSO auth uses this email domain.</span>
                  </div>

                  {/* Editable: Mobile */}
                  <div className="form-field">
                    <label htmlFor="pf-mobile">Mobile Number <span className="required-star">*</span></label>
                    <input
                      type="text"
                      id="pf-mobile"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 XXXXX XXXXX"
                    />
                    {personalErrors.mobile && <span className="field-error-msg">{personalErrors.mobile}</span>}
                  </div>

                  {/* Editable: Personal Email */}
                  <div className="form-field">
                    <label htmlFor="pf-personal-email">Personal Email <span className="optional-tag">(Optional)</span></label>
                    <input
                      type="email"
                      id="pf-personal-email"
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                      placeholder="alternative.email@gmail.com"
                    />
                    {personalErrors.personalEmail && <span className="field-error-msg">{personalErrors.personalEmail}</span>}
                    <span className="field-hint">Backup contact for post-recruitment updates.</span>
                  </div>

                  {/* Editable: LinkedIn URL */}
                  <div className="form-field">
                    <label htmlFor="pf-linkedin">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      id="pf-linkedin"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="https://linkedin.com/in/username"
                    />
                    {personalErrors.linkedin && <span className="field-error-msg">{personalErrors.linkedin}</span>}
                  </div>

                  {/* Editable: GitHub URL */}
                  <div className="form-field">
                    <label htmlFor="pf-github">GitHub Profile URL <span className="highlight-tag">Software Branches</span></label>
                    <input
                      type="text"
                      id="pf-github"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="https://github.com/username"
                    />
                    {personalErrors.github && <span className="field-error-msg">{personalErrors.github}</span>}
                  </div>

                  {/* Editable: Portfolio */}
                  <div className="form-field full-width">
                    <label htmlFor="pf-portfolio">Portfolio Website <span className="optional-tag">(Optional)</span></label>
                    <input
                      type="text"
                      id="pf-portfolio"
                      value={portfolio}
                      onChange={(e) => setPortfolio(e.target.value)}
                      placeholder="https://username.dev"
                    />
                    {personalErrors.portfolio && <span className="field-error-msg">{personalErrors.portfolio}</span>}
                  </div>
                </div>

                <div className="form-actions-row">
                  <button type="submit" className="btn-primary">
                    Save Changes
                  </button>
                  <button type="button" className="btn-secondary" onClick={handleResetPersonal}>
                    Reset Fields
                  </button>
                </div>
              </form>
            </section>
          )}

          {/* ================= SECTION 2: ACADEMIC INFORMATION ================= */}
          {activeSection === 'academic' && (
            <section className="pref-section-card animate-fade-in" aria-labelledby="sec-academic-title">
              <div className="pref-section-header">
                <h2 id="sec-academic-title">Academic Information</h2>
                <p>Verifiable transcripts and enrollment history imported from your college administration system.</p>
              </div>

              {/* READ-ONLY BANNER */}
              <div className="pref-academic-lock-banner">
                <div className="banner-icon-wrapper">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <div className="banner-content">
                  <p className="banner-text"><strong>Academic information is managed by your college.</strong></p>
                  <p className="banner-subtext">Contact your college Placement Cell or TPO coordinator if there is an error in CGPA or enrollment logs.</p>
                </div>
              </div>

              {/* INFO GRID */}
              <div className="academic-info-grid">
                <div className="academic-card">
                  <span className="ac-label">College Name</span>
                  <span className="ac-value">{studentProfile.college}</span>
                </div>
                <div className="academic-card">
                  <span className="ac-label">Branch</span>
                  <span className="ac-value">{studentProfile.branch.split(' · ')[0]}</span>
                </div>
                <div className="academic-card">
                  <span className="ac-label">Department</span>
                  <span className="ac-value">Computer Engineering</span>
                </div>
                <div className="academic-card">
                  <span className="ac-label">Current Semester</span>
                  <span className="ac-value">{studentProfile.branch.split(' · ')[1] || 'Semester 7'}</span>
                </div>
                <div className="academic-card">
                  <span className="ac-label">Passing Year</span>
                  <span className="ac-value">2027</span>
                </div>
                <div className="academic-card">
                  <span className="ac-label">Enrollment Number</span>
                  <span className="ac-value">{studentProfile.roll}</span>
                </div>
                <div className="academic-card highlight-metric">
                  <span className="ac-label">Current CGPA</span>
                  <span className="ac-value text-blue">{studentProfile.gpa.toFixed(2)}</span>
                </div>
                <div className="academic-card highlight-metric">
                  <span className="ac-label">Backlog Status</span>
                  <span className={`ac-value ${studentProfile.backlogs === 0 ? 'text-green' : 'text-red'}`}>
                    {studentProfile.backlogs === 0 ? 'No Active Backlogs' : `${studentProfile.backlogs} Active Backlog(s)`}
                  </span>
                </div>
              </div>
            </section>
          )}

          {/* ================= SECTION 3: RESUME PREFERENCES ================= */}
          {activeSection === 'resume' && (
            <section className="pref-section-card animate-fade-in" aria-labelledby="sec-resume-title">
              <div className="pref-section-header">
                <h2 id="sec-resume-title">Resume Preferences</h2>
                <p>Upload and choose your default resume file. Drives will automatically fetch your default document.</p>
              </div>

              {/* UPLOAD FILE CONTAINER */}
              <div className="resume-upload-zone">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="upload-zone-icon">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                </svg>
                <div className="upload-zone-text">
                  <label htmlFor="pref-resume-file" className="upload-link-label">
                    <span>Click to upload new resume</span>
                    <input
                      type="file"
                      id="pref-resume-file"
                      onChange={handleResumeUpload}
                      accept=".pdf,.docx,.txt"
                      style={{ display: 'none' }}
                      disabled={uploadingResume}
                    />
                  </label>
                  <p className="upload-hint">Supports PDF, DOCX or TXT files. Max size 5MB.</p>
                </div>
              </div>

              {/* UPLOAD PROGRESS */}
              {uploadingResume && (
                <div className="resume-upload-progress-container">
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                  <span className="progress-text">Uploading resume... {uploadProgress}%</span>
                </div>
              )}

              {/* RESUME HISTORY / LIST */}
              <div className="resume-history-section">
                <h3>Resume History</h3>
                {resumes.length === 0 ? (
                  <p className="empty-state-text">No resumes uploaded yet. Upload a default resume to begin campus drive applications.</p>
                ) : (
                  <div className="resume-list">
                    {resumes.map((res) => {
                      const isDefault = defaultResumeId === res.id;
                      return (
                        <div key={res.id} className={`resume-item-card ${isDefault ? 'default-active' : ''}`}>
                          <div className="resume-radio-selector">
                            <input
                              type="radio"
                              id={`radio-${res.id}`}
                              name="default-resume"
                              checked={isDefault}
                              onChange={() => handleSetDefaultResume(res.id)}
                            />
                          </div>
                          
                          <div className="resume-item-info">
                            <label htmlFor={`radio-${res.id}`} className="resume-name-label">
                              {res.name}
                            </label>
                            <span className="resume-meta-text">
                              Uploaded on {res.uploadedAt} · {res.size}
                            </span>
                          </div>

                          <div className="resume-item-badges">
                            {isDefault && <span className="default-badge">DEFAULT</span>}
                          </div>

                          <div className="resume-item-actions">
                            <button
                              type="button"
                              className="btn-icon"
                              title="Download Resume"
                              onClick={() => handleDownloadResume(res.name)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="btn-icon btn-icon-danger"
                              title="Delete Resume"
                              onClick={() => handleDeleteResume(res.id)}
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ================= SECTION 4: NOTIFICATION PREFERENCES ================= */}
          {activeSection === 'notifications' && (
            <section className="pref-section-card animate-fade-in" aria-labelledby="sec-notify-title">
              <div className="pref-section-header">
                <h2 id="sec-notify-title">Notification Preferences</h2>
                <p>Configure which alerts you receive via platform popups, email alerts, or mobile push.</p>
              </div>

              <div className="notifications-toggle-list">
                <div className="notify-row">
                  <div className="notify-text">
                    <span className="notify-label">New Placement Drives</span>
                    <span className="notify-desc">Get notified immediately when companies register drive profiles matching your branch.</span>
                  </div>
                  <div className="toggle-switch-wrapper">
                    <button
                      type="button"
                      className={`toggle-switch-btn ${notifications.placementDrives ? 'active' : ''}`}
                      onClick={() => handleToggleNotification('placementDrives')}
                      aria-label="Toggle New Placement Drives"
                    />
                  </div>
                </div>

                <div className="notify-row">
                  <div className="notify-text">
                    <span className="notify-label">Registration Deadlines</span>
                    <span className="notify-desc">Reminders about upcoming application closing times (e.g. 24h & 2h warnings).</span>
                  </div>
                  <div className="toggle-switch-wrapper">
                    <button
                      type="button"
                      className={`toggle-switch-btn ${notifications.registrationDeadlines ? 'active' : ''}`}
                      onClick={() => handleToggleNotification('registrationDeadlines')}
                      aria-label="Toggle Registration Deadlines"
                    />
                  </div>
                </div>

                <div className="notify-row">
                  <div className="notify-text">
                    <span className="notify-label">Online Assessments</span>
                    <span className="notify-desc">Alerts containing exam tokens, schedule links, and prep sandboxes for company tests.</span>
                  </div>
                  <div className="toggle-switch-wrapper">
                    <button
                      type="button"
                      className={`toggle-switch-btn ${notifications.onlineAssessments ? 'active' : ''}`}
                      onClick={() => handleToggleNotification('onlineAssessments')}
                      aria-label="Toggle Online Assessments"
                    />
                  </div>
                </div>

                <div className="notify-row">
                  <div className="notify-text">
                    <span className="notify-label">Interview Schedules</span>
                    <span className="notify-desc">Realtime updates when recruiters book or reschedule panel technical rounds.</span>
                  </div>
                  <div className="toggle-switch-wrapper">
                    <button
                      type="button"
                      className={`toggle-switch-btn ${notifications.interviewSchedules ? 'active' : ''}`}
                      onClick={() => handleToggleNotification('interviewSchedules')}
                      aria-label="Toggle Interview Schedules"
                    />
                  </div>
                </div>

                <div className="notify-row">
                  <div className="notify-text">
                    <span className="notify-label">Resume Review Reminders</span>
                    <span className="notify-desc">Feedback push notes from placement coordinators or mock interview assessors.</span>
                  </div>
                  <div className="toggle-switch-wrapper">
                    <button
                      type="button"
                      className={`toggle-switch-btn ${notifications.resumeReviewReminders ? 'active' : ''}`}
                      onClick={() => handleToggleNotification('resumeReviewReminders')}
                      aria-label="Toggle Resume Review Reminders"
                    />
                  </div>
                </div>

                <div className="notify-row">
                  <div className="notify-text">
                    <span className="notify-label">Daily Practice Reminders</span>
                    <span className="notify-desc">Friendly nudges to maintain your coding practice streak or aptitude prep progress.</span>
                  </div>
                  <div className="toggle-switch-wrapper">
                    <button
                      type="button"
                      className={`toggle-switch-btn ${notifications.dailyPracticeReminders ? 'active' : ''}`}
                      onClick={() => handleToggleNotification('dailyPracticeReminders')}
                      aria-label="Toggle Daily Practice Reminders"
                    />
                  </div>
                </div>

                <div className="notify-row">
                  <div className="notify-text">
                    <span className="notify-label">Mock Interview Reminders</span>
                    <span className="notify-desc">Reminders about mock placement loops scheduled with peers or alumni panels.</span>
                  </div>
                  <div className="toggle-switch-wrapper">
                    <button
                      type="button"
                      className={`toggle-switch-btn ${notifications.mockInterviewReminders ? 'active' : ''}`}
                      onClick={() => handleToggleNotification('mockInterviewReminders')}
                      aria-label="Toggle Mock Interview Reminders"
                    />
                  </div>
                </div>

                <div className="notify-row">
                  <div className="notify-text">
                    <span className="notify-label">Placement Announcements</span>
                    <span className="notify-desc">General placement guidelines, board circulars, and recruiter instructions from the TPO Office.</span>
                  </div>
                  <div className="toggle-switch-wrapper">
                    <button
                      type="button"
                      className={`toggle-switch-btn ${notifications.placementAnnouncements ? 'active' : ''}`}
                      onClick={() => handleToggleNotification('placementAnnouncements')}
                      aria-label="Toggle Placement Announcements"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= SECTION 5: ACCOUNT SECURITY ================= */}
          {activeSection === 'security' && (
            <section className="pref-section-card animate-fade-in" aria-labelledby="sec-security-title">
              <div className="pref-section-header">
                <h2 id="sec-security-title">Account Security</h2>
                <p>Modify credentials, enable two-factor authorization, and monitor login attempts across devices.</p>
              </div>

              {/* CHANGE PASSWORD */}
              <div className="security-block">
                <h3>Change Password</h3>
                <form onSubmit={handleUpdatePassword} className="pref-form-compact">
                  {passwordError && <div className="form-error-alert">{passwordError}</div>}
                  <div className="form-row-grid-3">
                    <div className="form-field">
                      <label htmlFor="sec-old-pass">Current Password</label>
                      <input
                        type="password"
                        id="sec-old-pass"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="••••••••"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="sec-new-pass">New Password</label>
                      <input
                        type="password"
                        id="sec-new-pass"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Min 8 characters"
                      />
                    </div>
                    <div className="form-field">
                      <label htmlFor="sec-confirm-pass">Confirm Password</label>
                      <input
                        type="password"
                        id="sec-confirm-pass"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                      />
                    </div>
                  </div>
                  <div className="form-actions-compact">
                    <button type="submit" className="btn-secondary btn-sm">Update Password</button>
                  </div>
                </form>
              </div>

              <hr className="divider-soft" />

              {/* TWO FACTOR AUTHENTICATION */}
              <div className="security-block">
                <div className="notify-row row-no-padding">
                  <div className="notify-text">
                    <span className="notify-label flex-align-center">
                      Two-Factor Authentication
                      <span className="security-badge">RECOMMENDED</span>
                    </span>
                    <span className="notify-desc">Require a secure code from your authenticator app (like Google Authenticator) during login checks.</span>
                  </div>
                  <div className="toggle-switch-wrapper">
                    <button
                      type="button"
                      className={`toggle-switch-btn ${twoFactorEnabled ? 'active' : ''}`}
                      onClick={handleToggle2FA}
                    />
                  </div>
                </div>
              </div>

              <hr className="divider-soft" />

              {/* ACTIVE SESSIONS */}
              <div className="security-block">
                <div className="session-block-header">
                  <h3>Active Sessions</h3>
                  <button type="button" className="btn-text-danger btn-sm" onClick={handleLogoutAllOthers}>
                    Log out of other devices
                  </button>
                </div>
                <div className="sessions-table-list">
                  {sessions.map((sess) => (
                    <div key={sess.id} className="session-item-row">
                      <div className="session-icon-circle">
                        {sess.device.includes('iPhone') ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                            <line x1="12" y1="18" x2="12.01" y2="18" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                            <line x1="8" y1="21" x2="16" y2="21" />
                            <line x1="12" y1="17" x2="12" y2="21" />
                          </svg>
                        )}
                      </div>
                      
                      <div className="session-details">
                        <span className="session-device-name">
                          {sess.device}
                        </span>
                        <span className="session-meta">
                          {sess.ip} · {sess.location} · <span className={sess.active ? 'session-text-active' : ''}>{sess.lastActive}</span>
                        </span>
                      </div>

                      <div className="session-action">
                        {sess.active ? (
                          <span className="badge-active-session">CURRENT</span>
                        ) : (
                          <button
                            type="button"
                            className="btn-revoke-session"
                            onClick={() => handleRevokeSession(sess.id)}
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr className="divider-soft" />

              {/* LOGIN HISTORY */}
              <div className="security-block">
                <h3>Login History</h3>
                <div className="login-history-container">
                  <table className="login-history-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Status</th>
                        <th>IP Address</th>
                        <th>Device</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentProfile.loginHistory?.map((hist, i) => (
                        <tr key={i}>
                          <td>{hist.date}</td>
                          <td>
                            <span className={`status-badge ${hist.status.includes('Success') ? 'status-success' : 'status-failed'}`}>
                              {hist.status}
                            </span>
                          </td>
                          <td className="font-code">{hist.ip}</td>
                          <td>{hist.device}</td>
                        </tr>
                      )) || (
                        <tr>
                          <td colSpan={4} className="text-center-placeholder">No login records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* ================= SECTION 6: APPEARANCE ================= */}
          {activeSection === 'appearance' && (
            <section className="pref-section-card animate-fade-in" aria-labelledby="sec-appearance-title">
              <div className="pref-section-header">
                <h2 id="sec-appearance-title">Appearance</h2>
                <p>Customize the color mode of the placement dashboard workspace.</p>
              </div>

              <div className="theme-selection-grid">
                {/* Light Mode Card */}
                <div
                  className={`theme-card ${appearance === 'light' ? 'selected' : ''}`}
                  onClick={() => handleAppearanceChange('light')}
                >
                  <div className="theme-preview light-preview">
                    <div className="preview-header"></div>
                    <div className="preview-row-flex">
                      <div className="preview-sidebar"></div>
                      <div className="preview-body">
                        <div className="preview-line-title"></div>
                        <div className="preview-block-card"></div>
                      </div>
                    </div>
                  </div>
                  <div className="theme-card-info">
                    <span className="theme-title">Light Mode</span>
                    <span className="theme-desc">Pristine white canvas. Clear text contrast in sunny conditions.</span>
                  </div>
                </div>

                {/* Dark Mode Card */}
                <div
                  className={`theme-card ${appearance === 'dark' ? 'selected' : ''}`}
                  onClick={() => handleAppearanceChange('dark')}
                >
                  <div className="theme-preview dark-preview">
                    <div className="preview-header"></div>
                    <div className="preview-row-flex">
                      <div className="preview-sidebar"></div>
                      <div className="preview-body">
                        <div className="preview-line-title"></div>
                        <div className="preview-block-card"></div>
                      </div>
                    </div>
                  </div>
                  <div className="theme-card-info">
                    <span className="theme-title">Dark Mode</span>
                    <span className="theme-desc">Premium dark grey backgrounds. Prevents eye strain at night.</span>
                  </div>
                </div>

                {/* System Theme Card */}
                <div
                  className={`theme-card ${appearance === 'system' ? 'selected' : ''}`}
                  onClick={() => handleAppearanceChange('system')}
                >
                  <div className="theme-preview system-preview">
                    <div className="preview-header"></div>
                    <div className="preview-row-flex">
                      <div className="preview-sidebar-half"></div>
                      <div className="preview-body-half">
                        <div className="preview-line-title-split"></div>
                        <div className="preview-block-card-split"></div>
                      </div>
                    </div>
                  </div>
                  <div className="theme-card-info">
                    <span className="theme-title">System Theme</span>
                    <span className="theme-desc">Syncs with your laptop's light/dark settings automatically.</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ================= SECTION 7: HELP & SUPPORT ================= */}
          {activeSection === 'help' && (
            <section className="pref-section-card animate-fade-in" aria-labelledby="sec-help-title">
              <div className="pref-section-header">
                <h2 id="sec-help-title">Help & Support</h2>
                <p>Find answers to placement FAQs, submit a technical issue, or contact support desks.</p>
              </div>

              {/* FAQ ACCORDION */}
              <div className="help-block">
                <h3>Frequently Asked Questions</h3>
                <div className="faq-accordion-list">
                  {faqs.map((faq, idx) => {
                    const isOpen = activeFaq === idx;
                    return (
                      <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`}>
                        <button
                          type="button"
                          className="faq-question-btn"
                          onClick={() => handleToggleFaq(idx)}
                          aria-expanded={isOpen}
                        >
                          <span>{faq.q}</span>
                          <span className="faq-chevron-icon">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="chevron-icon">
                              <polyline points="6 9 12 15 18 9" />
                            </svg>
                          </span>
                        </button>
                        {isOpen && (
                          <div className="faq-answer-panel">
                            <p>{faq.a}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr className="divider-soft" />

              {/* CONTACT DETAILS CARDS */}
              <div className="help-block">
                <h3>Key Contacts</h3>
                <div className="support-cards-grid">
                  <div className="contact-card">
                    <h4>Placement Office Cell</h4>
                    <p className="contact-office">Main Academic Block, Hall A</p>
                    <p className="contact-person">Prof. A. K. Sharma (TPO Chairman)</p>
                    <p className="contact-info">📞 +91 11 2789 6524</p>
                    <p className="contact-info">✉️ <a href="mailto:tpo@dtu.ac.in">tpo@dtu.ac.in</a></p>
                    <button
                      type="button"
                      className="btn-secondary btn-sm full-width margin-top-sm"
                      onClick={() => alert('Placement cell notification active. A message prompt will be forwarded to your branch representative.')}
                    >
                      Alert Placement Cell
                    </button>
                  </div>

                  <div className="contact-card">
                    <h4>Tyroo Support Portal</h4>
                    <p className="contact-office">Platform Developers Desk</p>
                    <p className="contact-person">Tyroo SLA Support Squad</p>
                    <p className="contact-info">📞 Toll-Free: 1800 572 9002</p>
                    <p className="contact-info">✉️ <a href="mailto:support@tyroo.edu.in">support@tyroo.edu.in</a></p>
                    <button
                      type="button"
                      className="btn-secondary btn-sm full-width margin-top-sm"
                      onClick={() => alert('Redirecting to secure Slack workspace for Tyroo SLA queries.')}
                    >
                      Open Live Chat
                    </button>
                  </div>
                </div>
              </div>

              <hr className="divider-soft" />

              {/* SUBMIT SUPPORT TICKET */}
              <div className="help-block">
                <h3>Submit Technical Issue</h3>
                <form onSubmit={handleSendTicket} className="support-form">
                  <div className="form-field">
                    <label htmlFor="sp-subject">Issue Subject</label>
                    <input
                      type="text"
                      id="sp-subject"
                      value={supportSubject}
                      onChange={(e) => setSupportSubject(e.target.value)}
                      placeholder="e.g., Code compiler fails on JS task"
                    />
                  </div>
                  <div className="form-field">
                    <label htmlFor="sp-message">Describe details of the issue</label>
                    <textarea
                      id="sp-message"
                      rows={3}
                      value={supportMessage}
                      onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Please include error codes or drive date if relevant."
                    />
                  </div>
                  <button type="submit" className="btn-secondary">Send Support Ticket</button>
                </form>
              </div>

              <hr className="divider-soft" />

              {/* SUBMIT FEEDBACK */}
              <div className="help-block">
                <h3>Submit Platform Feedback</h3>
                <form onSubmit={handleSubmitFeedback} className="feedback-form">
                  <div className="form-field">
                    <label>How would you rate your placement experience on Tyroo?</label>
                    <div className="star-rating-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className={`star-btn ${feedbackRating && feedbackRating >= star ? 'active' : ''}`}
                          onClick={() => setFeedbackRating(star)}
                          aria-label={`Rate ${star} Stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-field">
                    <label htmlFor="sp-feedback">Write your suggestions for improvement</label>
                    <textarea
                      id="sp-feedback"
                      rows={2}
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                      placeholder="What modules or design tweaks would improve your practice loop?"
                    />
                  </div>
                  <button type="submit" className="btn-secondary">Submit Feedback</button>
                </form>
              </div>
            </section>
          )}

          {/* ================= SECTION 8: ABOUT ================= */}
          {activeSection === 'about' && (
            <section className="pref-section-card animate-fade-in" aria-labelledby="sec-about-title">
              <div className="pref-section-header">
                <h2 id="sec-about-title">About Tyroo</h2>
                <p>Information about the Tyroo Placement Operating System build records.</p>
              </div>

              <div className="about-brand-card">
                <div className="brand-logo-circle">T</div>
                <div className="brand-text-block">
                  <span className="about-brand-name">Tyroo Placement OS</span>
                  <span className="about-version-tag">Version 3.0.0 (Production Build)</span>
                </div>
              </div>

              <div className="about-details-list">
                <div className="about-detail-row">
                  <span className="ad-label">Core Engine</span>
                  <span className="ad-val">React 18 TypeScript / Vite bundler</span>
                </div>
                <div className="about-detail-row">
                  <span className="ad-label">Deployment Cluster</span>
                  <span className="ad-val">Active TPO Node Delhi-West</span>
                </div>
                <div className="about-detail-row">
                  <span className="ad-label">Last Database Sync</span>
                  <span className="ad-val">Today, 02:45 PM (UTC +05:30)</span>
                </div>
              </div>

              <div className="legal-links-row">
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setActiveModal('terms')}
                >
                  Terms & Conditions
                </button>
                <span className="legal-dot">·</span>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setActiveModal('privacy')}
                >
                  Privacy Policy
                </button>
                <span className="legal-dot">·</span>
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => setActiveModal('license')}
                >
                  Open Source Licenses
                </button>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* LEGAL DOCUMENT MODAL OVERLAY */}
      {activeModal && (
        <div className="legal-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="legal-modal-content animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setActiveModal(null)}
              aria-label="Close modal"
            >
              &times;
            </button>
            {renderModalContent()}
            <div className="modal-footer">
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={() => setActiveModal(null)}
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
