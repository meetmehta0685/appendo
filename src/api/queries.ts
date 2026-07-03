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
