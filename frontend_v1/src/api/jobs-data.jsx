/**
 * jobs-data.jsx — React Query hooks for job listing and detail fetching.
 */
import { useQuery } from "@tanstack/react-query";
import apiClient from "./apiClient";

export const useJobs = () =>
  useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const res = await apiClient.get("/jobs/");
      return res.data;
    },
  });

export const useJobDetails = (jobId) =>
  useQuery({
    queryKey: ["jobDetail", jobId],
    queryFn: async () => {
      const res = await apiClient.get(`/jobs-detail/${jobId}/`);
      return res.data;
    },
    enabled: !!jobId,
  });
