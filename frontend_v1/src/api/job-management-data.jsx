import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { baseUrl } from '@/constants/constants';
import { getFreshIdToken } from '@/firebase/authUtils';

// Fetch all jobs for the company
export const useCompanyJobs = () => {
    return useQuery({
        queryKey: ['companyJobs'],
        queryFn: async () => {
            const token = await getFreshIdToken();
            const response = await axios.get(`${baseUrl}/jobs/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        },
    });
};

// Fetch applications for a specific job
export const useJobApplications = (jobId) => {
    return useQuery({
        queryKey: ['jobApplications', jobId],
        queryFn: async () => {
            const token = await getFreshIdToken();
            const response = await axios.get(`${baseUrl}/application/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params: {
                    job_id: jobId,
                },
            });
            return response.data;
        },
        enabled: !!jobId,
    });
};

// Delete a job (drafts only)
export const useDeleteJob = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (jobId) => {
            const token = await getFreshIdToken();
            const response = await axios.delete(`${baseUrl}/jobs/${jobId}/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
        },
    });
};

// Update job status (close/reopen)
export const useUpdateJobStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ jobId, status }) => {
            const token = await getFreshIdToken();
            const response = await axios.patch(
                `${baseUrl}/jobs/${jobId}/`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['companyJobs'] });
        },
    });
};
