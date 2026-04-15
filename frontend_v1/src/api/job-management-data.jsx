/**
 * job-management-data.jsx — React Query hooks for recruiter job management.
 * Migrated to use shared apiClient.
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "./apiClient";

// Fetch all jobs for the recruiter's company
export const useCompanyJobs = () =>
  useQuery({
    queryKey: ["companyJobs"],
    queryFn: async () => {
      const res = await apiClient.get("/jobs/");
      return res.data;
    },
  });

// Fetch applications for a specific job
export const useJobApplications = (jobId) =>
  useQuery({
    queryKey: ["jobApplications", jobId],
    queryFn: async () => {
      const res = await apiClient.get("/application/", {
        params: { job_id: jobId },
      });
      return res.data;
    },
    enabled: !!jobId,
  });

// Delete a job (drafts only)
export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId) => {
      const res = await apiClient.delete(`/jobs/${jobId}/`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
    },
  });
};

// Update job status (close / reopen)
export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ jobId, status }) => {
      const res = await apiClient.patch(`/jobs/${jobId}/`, { status });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyJobs"] });
    },
  });
};
