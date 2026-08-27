/**
 * apply-for-job.jsx — Mutation hook to submit a job application.
 */
import { useMutation } from "@tanstack/react-query";
import apiClient from "./apiClient";

export const useApplyForJob = () =>
  useMutation({
    mutationFn: async (data) => {
      const res = await apiClient.post("/application/create/", data);
      return res.data;
    },
  });

// Keep the plain function for components that call it imperatively (JobDetailPage, JobDetailNewDesign)
export const applyForJob = async (data) => {
  try {
    const res = await apiClient.post("/application/create/", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Unexpected error occurred" };
  }
};
