/**
 * home-data.jsx — All React Query hooks for home dashboard data.
 * Uses the shared apiClient so no manual token or axios import needed.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";

// ─── Query Keys ────────────────────────────────────────────────────────────────
export const queryKeys = {
  applications: ["applications"],
  applicationDetail: (id) => ["applicationDetail", id],
  likedJobs: ["likedJobs"],
  recommendedJobs: ["recommendedJobs"],
  profile: (uid) => ["profile", uid],
  companyInfo: (uid) => ["companyInfo", uid],
  recruiters: ["recruiters"],
};

// ─── Applications ──────────────────────────────────────────────────────────────
export const useApplications = () =>
  useQuery({
    queryKey: queryKeys.applications,
    queryFn: async () => {
      const res = await apiClient.get("/application/");
      return res.data;
    },
  });

export const useApplicationDetail = (id) =>
  useQuery({
    queryKey: queryKeys.applicationDetail(id),
    queryFn: async () => {
      const res = await apiClient.get(`/application-detail/${id}/`);
      return res.data;
    },
    enabled: !!id,
  });

export const useUpdateApplicationStatus = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newStatus) => {
      const res = await apiClient.patch(`/application-detail/${id}/`, {
        status: newStatus,
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.applicationDetail(id),
      });
    },
  });
};

// ─── Liked / Saved Jobs ────────────────────────────────────────────────────────
export const useLikedJobs = () =>
  useQuery({
    queryKey: queryKeys.likedJobs,
    queryFn: async () => {
      const res = await apiClient.get("/jobseeker/liked-jobs/");
      return res.data;
    },
  });

/**
 * useToggleLikeJob — optimistically toggles the saved state of a job.
 * If the job is currently saved, it sends DELETE to remove it.
 * If it is not saved, it sends POST to save it.
 * The likedJobs cache is directly mutated optimistically so the icon
 * flips instantly without a full refetch round-trip.
 */
export const useToggleLikeJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, isSaved }) => {
      if (isSaved) {
        await apiClient.delete(`/jobseeker/liked-jobs/${jobId}/`);
      } else {
        await apiClient.post("/jobseeker/save-liked-jobs/", { id: jobId });
      }
    },
    onMutate: async ({ jobId, isSaved, jobData }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.likedJobs });
      const previous = queryClient.getQueryData(queryKeys.likedJobs);
      queryClient.setQueryData(queryKeys.likedJobs, (old = []) => {
        if (isSaved) {
          return old.filter((j) => j.job_id !== jobId);
        } else {
          return jobData ? [...old, jobData] : old;
        }
      });
      return { previous };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous !== undefined) {
        queryClient.setQueryData(queryKeys.likedJobs, ctx.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.likedJobs });
    },
  });
};

// ─── Recommended Jobs ──────────────────────────────────────────────────────────
// export const useRecommendedJobs = () =>
//   useQuery({
//     queryKey: queryKeys.recommendedJobs,
//     queryFn: async () => {
//       const res = await apiClient.get("/jobs/recommended/");
//       return res.data;
//     },
//   });

// ─── Profile ───────────────────────────────────────────────────────────────────
export const useProfile = (uid) =>
  useQuery({
    queryKey: queryKeys.profile(uid),
    queryFn: async () => {
      const res = await apiClient.get(`/profile-detail/${uid}/`);
      return res.data;
    },
    enabled: !!uid,
  });

export const useUpdateProfile = (uid) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.patch(`/profile-detail/${uid}/`, payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(uid) });
    },
  });
};

// ─── Company Info ──────────────────────────────────────────────────────────────
export const useCompanyInfo = (uid) =>
  useQuery({
    queryKey: queryKeys.companyInfo(uid),
    queryFn: async () => {
      const res = await apiClient.get(`/company/user/${uid}/`);
      return res.data;
    },
    enabled: !!uid,
  });

// ─── Recruiters (for PostJobs) ─────────────────────────────────────────────────
export const useRecruiters = () =>
  useQuery({
    queryKey: queryKeys.recruiters,
    queryFn: async () => {
      const res = await apiClient.get("/recruiters/company/");
      return res.data;
    },
  });

export const usePostJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData) => {
      const res = await apiClient.post("/jobs/", formData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
    },
  });
};

// ─── Profile completion helper (pure function, no fetch) ───────────────────────
export const calculateProfileCompletion = (profile) => {
  if (!profile) return { percentage: 0, missingItems: [] };

  const fields = [
    { key: "first_name", label: "Add your first name" },
    { key: "last_name", label: "Add your last name" },
    { key: "phone_number", label: "Add phone number" },
    { key: "bio", label: "Write your bio" },
    { key: "profile_picture", label: "Upload profile picture" },
    { key: "qualifications", label: "Add qualifications" },
  ];

  let completed = 0;
  const missingItems = [];

  fields.forEach((field) => {
    if (
      profile[field.key] &&
      profile[field.key] !== "" &&
      profile[field.key] !== null
    ) {
      completed++;
    } else {
      missingItems.push(field.label);
    }
  });

  const percentage = Math.round((completed / fields.length) * 100);
  return { percentage, missingItems: missingItems.slice(0, 3) };
};
