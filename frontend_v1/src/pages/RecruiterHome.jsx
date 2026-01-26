import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '@/api/jobs-data';
import { useApplications, useCompanyInfo } from '@/api/home-data';
import { getUid } from '@/firebase/authUtils';
import Spinner from '@/components/ui/custom/spinner';

export default function RecruiterHome() {
    const navigate = useNavigate();
    const uid = getUid();

    // API hooks
    const { jobs, loading: jobsLoading, error: jobsError } = useJobs();
    const { applications, loading: appsLoading } = useApplications();
    const { company, loading: companyLoading } = useCompanyInfo(uid);

    // Calculate stats from data
    const stats = {
        activeJobs: jobs?.length || 0,
        totalApplicants: applications?.length || 0,
        shortlisted: applications?.filter(app => app.status === 'a')?.length || 0,
        hired: applications?.filter(app => app.status === 'h')?.length || 0,
    };

    // Get time-based greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 17) return 'Good Afternoon';
        return 'Good Evening';
    };

    // Get recent applicants (last 5)
    const recentApplicants = applications?.slice(0, 5) || [];

    // Get top active jobs (first 3)
    const topJobs = jobs?.slice(0, 3) || [];

    const getStatusBadge = (status) => {
        switch (status) {
            case 'p':
                return <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400 dark:ring-blue-400/30">New</span>;
            case 'a':
                return <span className="inline-flex items-center rounded-full bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-900/30 dark:text-purple-400 dark:ring-purple-400/30">Shortlisted</span>;
            case 'r':
                return <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-700/10 dark:bg-red-900/30 dark:text-red-400 dark:ring-red-400/30">Rejected</span>;
            default:
                return <span className="inline-flex items-center rounded-full bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-900/30 dark:text-yellow-400 dark:ring-yellow-400/30">Reviewed</span>;
        }
    };

    const getJobIcon = (index) => {
        const icons = [
            { bg: 'bg-orange-100 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', icon: 'soup_kitchen' },
            { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-600 dark:text-blue-400', icon: 'skillet' },
            { bg: 'bg-purple-100 dark:bg-purple-900/20', text: 'text-purple-600 dark:text-purple-400', icon: 'local_bar' },
        ];
        return icons[index % icons.length];
    };

    if (jobsLoading && companyLoading) {
        return (
            <div className="flex items-center justify-center h-screen -mt-20">
                <Spinner />
            </div>
        );
    }

    return (
        <div className="flex flex-1 justify-center py-8 px-4 md:px-8 lg:px-12">
            <div className="flex w-full max-w-6xl flex-col gap-8">
                {/* Welcome Header & Primary CTA */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black leading-tight tracking-[-0.033em] text-text-main-light dark:text-white md:text-4xl">
                            {getGreeting()}, {company?.name || 'Restaurant'}
                        </h1>
                        <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                            Here's what's happening at your restaurant today.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/post-job')}
                        className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-black shadow-lg shadow-primary/20 transition-transform hover:scale-105 active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Post New Job</span>
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Active Jobs */}
                    <div className="flex flex-col justify-between rounded-xl bg-white dark:bg-[#1a3322] p-6 shadow-sm ring-1 ring-gray-100 dark:ring-[#1f3625] transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Jobs</span>
                                <span className="text-3xl font-bold text-text-main-light dark:text-white">{stats.activeJobs}</span>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                <span className="material-symbols-outlined">work</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500">
                            <span className="material-symbols-outlined text-[16px]">info</span>
                            <span>Click to manage jobs</span>
                        </div>
                    </div>

                    {/* Total Applicants */}
                    <div className="flex flex-col justify-between rounded-xl bg-white dark:bg-[#1a3322] p-6 shadow-sm ring-1 ring-gray-100 dark:ring-[#1f3625] transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Applicants</span>
                                <span className="text-3xl font-bold text-text-main-light dark:text-white">{stats.totalApplicants}</span>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-full bg-primary/20 text-green-700 dark:text-primary">
                                <span className="material-symbols-outlined">group</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-primary">
                            <span className="material-symbols-outlined text-[16px]">trending_up</span>
                            <span>View all applicants</span>
                        </div>
                    </div>

                    {/* Shortlisted */}
                    <div className="flex flex-col justify-between rounded-xl bg-white dark:bg-[#1a3322] p-6 shadow-sm ring-1 ring-gray-100 dark:ring-[#1f3625] transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Shortlisted</span>
                                <span className="text-3xl font-bold text-text-main-light dark:text-white">{stats.shortlisted}</span>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                <span className="material-symbols-outlined">star</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-gray-400 dark:text-gray-500">
                            <span className="material-symbols-outlined text-[16px]">remove</span>
                            <span>Accepted candidates</span>
                        </div>
                    </div>

                    {/* Hired */}
                    <div className="flex flex-col justify-between rounded-xl bg-white dark:bg-[#1a3322] p-6 shadow-sm ring-1 ring-gray-100 dark:ring-[#1f3625] transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Hired</span>
                                <span className="text-3xl font-bold text-text-main-light dark:text-white">{stats.hired}</span>
                            </div>
                            <div className="flex size-10 items-center justify-center rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400">
                                <span className="material-symbols-outlined">handshake</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-primary">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>Completed hires</span>
                        </div>
                    </div>
                </div>

                {/* Recent Applicants Section */}
                <div className="flex flex-col gap-4 rounded-xl border border-[#e5e7eb] dark:border-[#1f3625] bg-white dark:bg-[#1a3322] p-0 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between border-b border-[#e5e7eb] dark:border-[#1f3625] px-6 py-4">
                        <h2 className="text-lg font-bold leading-tight text-text-main-light dark:text-white">Recent Applicants</h2>
                        <button
                            onClick={() => navigate('/applications')}
                            className="text-sm font-semibold text-primary hover:underline"
                        >
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        {appsLoading ? (
                            <div className="flex justify-center py-8">
                                <Spinner />
                            </div>
                        ) : recentApplicants.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No applications received yet.
                            </div>
                        ) : (
                            <table className="w-full min-w-[600px] text-left text-sm">
                                <thead className="bg-gray-50 dark:bg-[#102216]">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Name</th>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Role Applied For</th>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Applied Date</th>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400">Status</th>
                                        <th className="px-6 py-3 font-medium text-gray-500 dark:text-gray-400 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-[#1f3625]">
                                    {recentApplicants.map((app) => (
                                        <tr key={app.id} className="group hover:bg-gray-50 dark:hover:bg-[#1f3625]/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="size-9 rounded-full bg-gray-200 bg-cover bg-center"
                                                        style={{
                                                            backgroundImage: app.applicant?.profile_picture
                                                                ? `url('data:image/png;base64,${app.applicant.profile_picture}')`
                                                                : 'none'
                                                        }}
                                                    >
                                                        {!app.applicant?.profile_picture && (
                                                            <div className="size-9 rounded-full bg-primary/20 flex items-center justify-center">
                                                                <span className="material-symbols-outlined text-primary text-sm">person</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className="font-medium text-text-main-light dark:text-white">
                                                        {app.applicant?.first_name || 'Unknown'} {app.applicant?.last_name || 'Applicant'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{app.job?.title}</td>
                                            <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                                                {new Date(app.application_date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {getStatusBadge(app.status)}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => navigate('/applications')}
                                                    className="text-gray-400 hover:text-text-main-light dark:hover:text-white"
                                                >
                                                    <span className="material-symbols-outlined">more_vert</span>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Active Jobs Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="col-span-1 lg:col-span-2">
                        <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-bold text-text-main-light dark:text-white">Your Top Active Jobs</h2>
                            {jobsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Spinner />
                                </div>
                            ) : topJobs.length === 0 ? (
                                <div className="text-center py-8 bg-white dark:bg-[#1a3322] rounded-xl border border-gray-100 dark:border-[#1f3625]">
                                    <p className="text-gray-500 dark:text-gray-400 mb-4">No active jobs posted yet.</p>
                                    <button
                                        onClick={() => navigate('/post-job')}
                                        className="px-4 py-2 bg-primary text-black rounded-lg font-bold text-sm"
                                    >
                                        Post Your First Job
                                    </button>
                                </div>
                            ) : (
                                topJobs.map((job, index) => {
                                    const iconStyle = getJobIcon(index);
                                    const applicantCount = applications?.filter(app => app.job?.id === job.id)?.length || 0;

                                    return (
                                        <div
                                            key={job.id}
                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-gray-100 dark:border-[#1f3625] bg-white dark:bg-[#1a3322] p-5 shadow-sm hover:border-primary/50 transition-colors cursor-pointer"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`flex size-12 items-center justify-center rounded-lg ${iconStyle.bg} ${iconStyle.text}`}>
                                                    <span className="material-symbols-outlined">{iconStyle.icon}</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-text-main-light dark:text-white">{job.title}</h3>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {job.employment_type} • {applicantCount} Applicants
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="mt-4 sm:mt-0 flex items-center gap-2">
                                                <button
                                                    onClick={() => navigate(`/job/${job.id}`)}
                                                    className="rounded-lg px-3 py-2 text-xs font-bold text-text-main-light dark:text-white hover:bg-gray-100 dark:hover:bg-[#1f3625]"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => navigate('/applications')}
                                                    className="rounded-lg bg-gray-900 px-3 py-2 text-xs font-bold text-white dark:bg-white dark:text-black hover:opacity-90"
                                                >
                                                    View Applicants
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Quick Tips / Promo */}
                    <div className="col-span-1">
                        <div className="relative h-full overflow-hidden rounded-xl bg-gradient-to-br from-[#111813] to-[#1a3322] p-6 text-white shadow-md min-h-[280px]">
                            <div className="absolute -right-10 -top-10 size-40 rounded-full bg-primary/20 blur-3xl"></div>
                            <div className="relative z-10 flex h-full flex-col justify-between gap-6">
                                <div>
                                    <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-white/10 p-2 backdrop-blur-sm">
                                        <span className="material-symbols-outlined text-primary">lightbulb</span>
                                    </div>
                                    <h3 className="text-xl font-bold">Boost your visibility</h3>
                                    <p className="mt-2 text-sm text-gray-300">
                                        Restaurants with complete profiles get 2x more applicants. Add photos of your kitchen now.
                                    </p>
                                </div>
                                <button
                                    onClick={() => navigate('/company-profile')}
                                    className="w-full rounded-lg bg-white py-3 text-sm font-bold text-black hover:bg-gray-100 transition-colors"
                                >
                                    Complete Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
