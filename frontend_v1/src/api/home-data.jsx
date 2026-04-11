import { useState, useEffect } from "react";
import axios from "axios";
import { getFreshIdToken, getUid } from "@/firebase/authUtils";
import { baseUrl } from "@/constants/constants";

/**
 * Hook to fetch user's applications
 */
export const useApplications = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = await getFreshIdToken(true);
                const res = await axios.get(`${baseUrl}/application/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setApplications(res.data);
            } catch (e) {
                setError("Failed to load applications: " + e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    return { applications, loading, error };
};

/**
 * Hook to fetch user's liked/saved jobs
 */
export const useLikedJobs = () => {
    const [likedJobs, setLikedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchLikedJobs = async () => {
            try {
                const token = await getFreshIdToken(true);
                const res = await axios.get(`${baseUrl}/jobseeker/liked-jobs/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLikedJobs(res.data);
            } catch (e) {
                setError("Failed to load liked jobs: " + e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchLikedJobs();
    }, []);

    return { likedJobs, loading, error };
};

export const useRecommendedJobs = () => {
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendedJobs = async () => {
            try {
                const token = await getFreshIdToken(true);
                const res = await axios.get(`${baseUrl}/jobs/recommended/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecommendedJobs(res.data);
            } catch (e) {
                setError("Failed to load recommended jobs: " + e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendedJobs();
    }, []);

    return { recommendedJobs, loading, error };
};

/**
 * Hook to fetch user profile for completion calculation
 */
export const useProfile = (uid) => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!uid) return;
        const fetchProfile = async () => {
            try {
                const token = await getFreshIdToken(true);
                const res = await axios.get(`${baseUrl}/profile-detail/${uid}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProfile(res.data);
            } catch (e) {
                setError("Failed to load profile: " + e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [uid]);

    return { profile, loading, error };
};

/**
 * Hook to fetch company info for recruiter dashboard
 */
export const useCompanyInfo = (uid) => {
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!uid) return;
        const fetchCompany = async () => {
            try {
                const token = await getFreshIdToken(true);
                const res = await axios.get(`${baseUrl}/company/user/${uid}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setCompany(res.data);
            } catch (e) {
                setError("Failed to load company info: " + e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCompany();
    }, [uid]);

    return { company, loading, error };
};

/**
 * Calculate profile completion percentage
 */
export const calculateProfileCompletion = (profile) => {
    if (!profile) return { percentage: 0, missingItems: [] };

    const fields = [
        { key: 'first_name', label: 'Add your first name' },
        { key: 'last_name', label: 'Add your last name' },
        { key: 'phone_number', label: 'Add phone number' },
        { key: 'bio', label: 'Write your bio' },
        { key: 'profile_picture', label: 'Upload profile picture' },
        { key: 'qualifications', label: 'Add qualifications' },
    ];

    let completed = 0;
    const missingItems = [];

    fields.forEach(field => {
        if (profile[field.key] && profile[field.key] !== '' && profile[field.key] !== null) {
            completed++;
        } else {
            missingItems.push(field.label);
        }
    });

    const percentage = Math.round((completed / fields.length) * 100);
    return { percentage, missingItems: missingItems.slice(0, 3) };
};
