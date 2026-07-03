import { StudentProfile, RecruitmentDrive } from '../types';

export const defaultProfiles: Record<string, StudentProfile> = {
  'dhrumit@dtu.ac.in': {
    name: 'Dhrumit',
    college: 'DTU Delhi',
    branch: 'CSE · Semester 7',
    roll: 'DTU/2K23/CO/142',
    gpa: 8.42,
    backlogs: 0,
    readiness: 82,
    subScores: { apt: 80, code: 60, tech: 72, interview: 58, resume: 91 },
    drives: {
      google: 'eligible', // 'eligible', 'registered', 'waiver_pending', 'ineligible_gpa'
      tcs: 'eligible',
      ms: 'ineligible_gpa',
      amazon: 'eligible',
      cts: 'registered',
      adobe: 'eligible'
    },
    packageVisibility: 'private',
    mobile: '+91 98765 43210',
    personalEmail: 'dhrumit.personal@gmail.com',
    linkedin: 'https://linkedin.com/in/dhrumit-dtu',
    github: 'https://github.com/dhrumit-dev',
    portfolio: 'https://dhrumit.dev',
    profilePhoto: '',
    resumes: [
      { id: 'res-1', name: 'Dhrumit_Resume_SWE_2026.pdf', uploadedAt: 'July 1, 2026, 11:24 AM', size: '245 KB' },
      { id: 'res-2', name: 'Dhrumit_Resume_Fullstack.pdf', uploadedAt: 'June 28, 2026, 03:45 PM', size: '280 KB' }
    ],
    defaultResumeId: 'res-1',
    notifications: {
      placementDrives: true,
      registrationDeadlines: true,
      onlineAssessments: true,
      interviewSchedules: true,
      resumeReviewReminders: false,
      dailyPracticeReminders: true,
      mockInterviewReminders: true,
      placementAnnouncements: true
    },
    sessions: [
      { id: 'sess-1', device: 'MacBook Pro · macOS (Current Session)', ip: '192.168.1.45', location: 'Delhi, India', active: true, lastActive: 'Active now' },
      { id: 'sess-2', device: 'iPhone 15 · iOS App', ip: '103.45.201.12', location: 'Delhi, India', active: false, lastActive: '2 hours ago' },
      { id: 'sess-3', device: 'Chrome · Windows Desktop', ip: '192.168.1.102', location: 'Noida, India', active: false, lastActive: 'Yesterday, 6:30 PM' }
    ],
    loginHistory: [
      { date: 'July 2, 2026, 02:15 PM', status: 'Success', ip: '192.168.1.45', device: 'MacBook Pro · macOS' },
      { date: 'July 2, 2026, 12:10 PM', status: 'Success', ip: '103.45.201.12', device: 'iPhone 15 · iOS App' },
      { date: 'July 1, 2026, 09:30 AM', status: 'Success', ip: '192.168.1.45', device: 'MacBook Pro · macOS' },
      { date: 'June 30, 2026, 06:14 PM', status: 'Failed (Wrong Password)', ip: '192.168.1.80', device: 'Chrome · Linux Desktop' }
    ],
    twoFactorEnabled: false,
    appearance: 'system'
  }
};

export const calendarEvents: Record<number, RecruitmentDrive> = {
  5: {
    companyId: 'google',
    companyName: 'Google',
    avatar: 'G',
    role: 'Tech Intern',
    package: '15.0 Lakhs (Stipend)',
    minGpa: 9.0,
    eventType: 'Registration Closes',
    statusType: 'deadline',
    criteria: 'GPA ≥ 9.0 • No Active Backlogs • CSE/IT only',
    description: 'Summer internships at Google India offices.',
    funnel: [
      { name: 'Registration Deadline', date: 'July 5, 2026' },
      { name: 'Online Coding Test (OA)', date: 'July 12, 2026' },
      { name: 'Technical Interviews', date: 'July 20, 2026' }
    ]
  },
  8: {
    companyId: 'tcs',
    companyName: 'TCS Digital',
    avatar: 'T',
    role: 'Systems Engineer',
    package: '7.2 LPA',
    minGpa: 6.5,
    eventType: 'Online Assessment',
    statusType: 'exam',
    criteria: 'GPA ≥ 6.5 • Max 1 Active Backlog • All Branches',
    description: 'Digital mass-hiring drive for systems engineering roles.',
    funnel: [
      { name: 'Registration Deadline', date: 'Closed (July 1)' },
      { name: 'Online Assessment (OA)', date: 'Today: July 8, 2026' },
      { name: 'Technical Interview', date: 'July 18, 2026' }
    ]
  },
  15: {
    companyId: 'ms',
    companyName: 'Microsoft',
    avatar: 'M',
    role: 'Software Engineer-1',
    package: '51.0 LPA',
    minGpa: 8.5,
    eventType: 'Online Assessment',
    statusType: 'exam',
    criteria: 'GPA ≥ 8.5 • No Active Backlogs • CSE/IT/ECE',
    description: 'Full-time hiring for Software Engineering roles at Microsoft IDC.',
    funnel: [
      { name: 'Registration Deadline', date: 'July 10, 2026' },
      { name: 'Online Coding Test (OA)', date: 'July 15, 2026' },
      { name: 'Technical & System Interviews', date: 'July 25, 2026' }
    ]
  },
  18: {
    companyId: 'amazon',
    companyName: 'Amazon',
    avatar: 'A',
    role: 'SDE Intern',
    package: '80,000 / month',
    minGpa: 8.0,
    eventType: 'Registration Open',
    statusType: 'open',
    criteria: 'GPA ≥ 8.0 • No Backlogs • All Branches',
    description: 'Summer and winter SDE intern opportunities.',
    funnel: [
      { name: 'Registration Closes', date: 'July 15, 2026' },
      { name: 'Online assessment (OA)', date: 'July 20, 2026' },
      { name: 'Interview Loop', date: 'July 28, 2026' }
    ]
  },
  22: {
    companyId: 'cts',
    companyName: 'Cognizant GenC',
    avatar: 'C',
    role: 'Software Engineer',
    package: '4.0 LPA',
    minGpa: 6.0,
    eventType: 'Shortlist Released',
    statusType: 'shortlisted',
    criteria: 'GPA ≥ 6.0 • No Backlogs • All Branches',
    description: 'General entry-level developer hiring.',
    funnel: [
      { name: 'Registration', date: 'Closed' },
      { name: 'Shortlist Released', date: 'Today: July 22, 2026' },
      { name: 'HR Discussion', date: 'July 30, 2026' }
    ]
  },
  29: {
    companyId: 'adobe',
    companyName: 'Adobe',
    avatar: 'A',
    role: 'MTS-1',
    package: '22.0 LPA',
    minGpa: 8.2,
    eventType: 'Technical Interviews',
    statusType: 'exam',
    criteria: 'GPA ≥ 8.2 • No Backlogs • CSE/IT only',
    description: 'Member of Technical Staff engineering roles.',
    funnel: [
      { name: 'Registration Deadline', date: 'Closed (July 20)' },
      { name: 'Online assessment (OA)', date: 'Closed (July 25)' },
      { name: 'Technical Interviews', date: 'Today: July 29, 2026' }
    ]
  }
};
