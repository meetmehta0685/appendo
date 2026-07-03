import { create } from 'zustand';
import { StudentProfile } from '../types';
import { defaultProfiles } from '../data/mockData';

interface ProfileState {
  profile: StudentProfile | null;
  loadProfile: (email: string) => void;
  saveProfile: (newProfile: StudentProfile) => void;
  cycleBranch: () => void;
  registerDrive: (companyId: string, day: number) => void;
  requestWaiver: (companyId: string, day: number) => void;
  completeGrading: (newReadiness: number, newApt: number) => void;
  scanResume: (fileName: string) => void;
  launchSandbox: () => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => {
  return {
    profile: null,

    loadProfile: (email: string) => {
      const saved = localStorage.getItem(`studentProfile_${email}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.subScores && parsed.drives && parsed.branch) {
            if (parsed.branch.includes('•')) {
              parsed.branch = parsed.branch.replace(/•/g, '·');
            }
            set({ profile: parsed });
            return;
          }
        } catch (e) {
          console.warn('Resetting invalid student profile in localStorage:', e);
        }
      }
      const defaultProfile = JSON.parse(JSON.stringify(defaultProfiles[email] || defaultProfiles['dhrumit@dtu.ac.in']));
      localStorage.setItem(`studentProfile_${email}`, JSON.stringify(defaultProfile));
      set({ profile: defaultProfile });
    },

    saveProfile: (newProfile: StudentProfile) => {
      const email = localStorage.getItem('tyroo_email') || 'dhrumit@dtu.ac.in';
      set({ profile: newProfile });
      localStorage.setItem(`studentProfile_${email}`, JSON.stringify(newProfile));
    },

    cycleBranch: () => {
      const { profile, saveProfile } = get();
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
    },

    registerDrive: (companyId: string, day: number) => {
      const { profile, saveProfile } = get();
      if (!profile) return;
      
      const updated = { ...profile };
      updated.drives[companyId] = 'registered';
      updated.readiness = Math.min(100, updated.readiness + 2);
      saveProfile(updated);
      
      // Trigger celebration emoji effect
      triggerConfetti();
      alert(`Registration successful! You have applied for the drive on July ${day}.`);
    },

    requestWaiver: (companyId: string, day: number) => {
      const { profile, saveProfile } = get();
      if (!profile) return;
      
      const updated = { ...profile };
      updated.drives[companyId] = 'waiver_pending';
      saveProfile(updated);
      alert(`GPA waiver petition submitted. TPO coordinators have been alerted for the drive on July ${day}.`);
    },

    completeGrading: (newReadiness: number, newApt: number) => {
      const { profile, saveProfile } = get();
      if (!profile) return;
      
      const updated = { ...profile };
      updated.readiness = newReadiness;
      updated.subScores.apt = newApt;
      saveProfile(updated);
      triggerConfetti();
    },

    scanResume: (fileName: string) => {
      const { profile, saveProfile } = get();
      if (!profile) return;
      
      const updated = { ...profile };
      updated.subScores.resume = Math.min(100, updated.subScores.resume + 5);
      updated.readiness = Math.min(100, updated.readiness + 2);
      
      // Add resume to item list if list exists
      if (updated.resumes) {
        const id = `res-${Date.now()}`;
        updated.resumes = [
          { id, name: fileName, uploadedAt: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }), size: '250 KB' },
          ...updated.resumes
        ];
        updated.defaultResumeId = id;
      }
      
      saveProfile(updated);
      triggerConfetti();
      alert(`Successfully uploaded "${fileName}" to TPO database. Processing ATS scan...`);
    },

    launchSandbox: () => {
      const { profile, saveProfile } = get();
      if (!profile) return;
      
      const updated = { ...profile };
      updated.subScores.code = Math.min(100, updated.subScores.code + 4);
      updated.readiness = Math.min(100, updated.readiness + 1);
      saveProfile(updated);
      triggerConfetti();
      alert('Launching DSA sandbox environment...');
    },

    clearProfile: () => {
      set({ profile: null });
    }
  };
});

// Helper for confetti animation
function triggerConfetti() {
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
}
