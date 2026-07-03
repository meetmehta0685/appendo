import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from './client';
import { StudentProfile } from '../types';
import { useProfileStore } from '../store/useProfileStore';

// Keys for Query Caching
export const QUERY_KEYS = {
  profile: (email: string) => ['profile', email] as const,
  drives: () => ['drives'] as const,
};

/**
 * Hook to retrieve student profile.
 * Fetches from the backend API if online, falls back to local Zustand store.
 */
export const useStudentProfileQuery = (email: string) => {
  const loadProfileLocal = useProfileStore((state) => state.loadProfile);
  const profileLocal = useProfileStore((state) => state.profile);

  return useQuery({
    queryKey: QUERY_KEYS.profile(email),
    queryFn: async () => {
      try {
        const response = await apiClient.get<StudentProfile>(`/profile?email=${email}`);
        return response.data;
      } catch (err) {
        // Fallback: load and return from local mock store if backend is not available yet
        loadProfileLocal(email);
        const current = useProfileStore.getState().profile;
        if (!current) throw new Error('Profile not loaded');
        return current;
      }
    },
    enabled: !!email,
    initialData: profileLocal && profileLocal.personalEmail === email ? profileLocal : undefined,
  });
};

/**
 * Mutation to update student profile details on the backend.
 * Synchronizes with the local Zustand store on completion.
 */
export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  const saveProfileLocal = useProfileStore((state) => state.saveProfile);

  return useMutation({
    mutationFn: async (updatedProfile: StudentProfile) => {
      try {
        const response = await apiClient.put<StudentProfile>('/profile', updatedProfile);
        return response.data;
      } catch (err) {
        // Fallback: save to local Zustand store directly
        saveProfileLocal(updatedProfile);
        return updatedProfile;
      }
    },
    onSuccess: (data) => {
      if (data.personalEmail) {
        queryClient.setQueryData(QUERY_KEYS.profile(data.personalEmail), data);
      }
    },
  });
};

/**
 * Hook to retrieve all active placement drives.
 */
export const usePlacementDrivesQuery = () => {
  return useQuery({
    queryKey: QUERY_KEYS.drives(),
    queryFn: async () => {
      try {
        const response = await apiClient.get<Record<string, any>>('/drives');
        return response.data;
      } catch (err) {
        // Fallback to static mockData
        const { calendarEvents } = await import('../data/mockData');
        return calendarEvents;
      }
    }
  });
};

/**
 * Mutation to register a student for a recruitment drive.
 */
export const useRegisterDriveMutation = () => {
  const queryClient = useQueryClient();
  const registerDriveLocal = useProfileStore((state) => state.registerDrive);

  return useMutation({
    mutationFn: async ({ companyId, day, email }: { companyId: string; day: number; email: string }) => {
      try {
        const response = await apiClient.post(`/drives/register`, { companyId, day, email });
        return response.data;
      } catch (err) {
        // Fallback to local store handler
        registerDriveLocal(companyId, day);
        return { success: true, companyId, day };
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile(variables.email) });
    },
  });
};

/**
 * Mutation to request TPO GPA waiver for a recruitment drive.
 */
export const useRequestWaiverMutation = () => {
  const queryClient = useQueryClient();
  const requestWaiverLocal = useProfileStore((state) => state.requestWaiver);

  return useMutation({
    mutationFn: async ({ companyId, day, email }: { companyId: string; day: number; email: string }) => {
      try {
        const response = await apiClient.post(`/drives/waiver`, { companyId, day, email });
        return response.data;
      } catch (err) {
        // Fallback to local store handler
        requestWaiverLocal(companyId, day);
        return { success: true, companyId, day };
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile(variables.email) });
    },
  });
};

/**
 * Hook to retrieve dashboard summary metrics.
 * Fetches from the backend API, with local high-fidelity fallbacks.
 */
export const useDashboardQuery = (email: string) => {
  return useQuery({
    queryKey: ['dashboard', email],
    queryFn: async () => {
      try {
        const response = await apiClient.get<any>(`/dashboard?email=${email}`);
        return response.data;
      } catch (err) {
        return {
          readiness: 82,
          upcomingDrives: [
            {
              company: "TCS Digital",
              role: "Systems Engineer",
              package: "7.2 LPA",
              status: "Registered",
              date: "July 8, 2026",
              prepStatus: "Ready (Score: 88%)",
              logoText: "T"
            },
            {
              company: "Google India",
              role: "Software Engineer",
              package: "32 LPA",
              status: "Applied",
              date: "OA: July 15, 2026",
              badge: "Closes in 3 days",
              badgeClass: "badge-red"
            },
            {
              company: "Microsoft IDC",
              role: "Intern Engineer",
              package: "18 LPA",
              status: "Applied",
              date: "OA: July 20, 2026",
              badge: "OA: July 15",
              badgeClass: "badge-blue"
            }
          ],
          continuePractice: {
            aptitude: {
              topic: "Probability & Combinatorics",
              progress: 80
            },
            coding: {
              topic: "Dynamic Programming",
              solved: 125,
              total: 300,
              progress: 60
            },
            technical: {
              topic: "Virtual Memory & Paging",
              course: "Operating Systems",
              progress: 72
            }
          },
          standing: {
            rank: 24,
            total: 180,
            percentile: 15,
            weeklyChange: "↑ 5 Positions",
            score: 78
          },
          recommendations: [
            {
              type: "coding",
              title: "Solve 'Longest Common Subsequence'",
              difficulty: "Medium",
              time: "30 mins"
            }
          ]
        };
      }
    },
    enabled: !!email,
  });
};

