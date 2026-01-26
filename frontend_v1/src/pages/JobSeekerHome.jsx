import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '@/api/jobs-data';
import { useApplications, useProfile, useLikedJobs, calculateProfileCompletion } from '@/api/home-data';
import { getUid } from '@/firebase/authUtils';
import Spinner from '@/components/ui/custom/spinner';

export default function JobSeekerHome() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('feed');
    const [searchQuery, setSearchQuery] = useState('');

    // API hooks
    const { jobs, loading: jobsLoading, error: jobsError } = useJobs();
    const { applications, loading: appsLoading } = useApplications();
    const { likedJobs, loading: likedLoading } = useLikedJobs();
    const { profile, loading: profileLoading } = useProfile(getUid());

    const { percentage: profileCompletion, missingItems } = calculateProfileCompletion(profile);

    // Filter jobs based on search
    const filteredJobs = jobs?.filter(job =>
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    if (jobsLoading) {
        return (
            <div className="flex items-center justify-center h-screen -mt-20">
                <Spinner />
            </div>
        );
    }

    if (jobsError) {
        return (
            <div className="flex items-center justify-center h-screen -mt-20">
                <div className="text-center p-8 bg-red-50 rounded-xl">
                    <p className="text-red-600 font-medium">{jobsError}</p>
                </div>
            </div>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'p': return 'bg-yellow-400';
            case 'a': return 'bg-primary';
            case 'r': return 'bg-red-400';
            default: return 'bg-gray-400';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'p': return 'Pending';
            case 'a': return 'Accepted';
            case 'r': return 'Rejected';
            default: return 'Unknown';
        }
    };

    return (
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:px-6 lg:px-8 lg:py-8">
            {/* Header Section */}
            <section className="flex flex-col gap-6">
                {/* Title */}
                <div className="flex flex-col gap-2">
                    <h2 className="text-3xl font-black leading-tight tracking-tight sm:text-4xl text-text-main-light dark:text-text-main-dark">Find your next kitchen</h2>
                    <p className="text-text-sub-light dark:text-text-sub-dark">Discover top culinary opportunities matched to your skills.</p>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex flex-col gap-4 rounded-xl bg-surface-light p-4 shadow-sm dark:bg-surface-dark lg:flex-row lg:items-center">
                    {/* Search Input */}
                    <div className="relative flex-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-sub-light">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="block w-full rounded-lg border-none bg-background-light py-3 pl-10 pr-4 text-sm text-text-main-light placeholder-text-sub-light focus:ring-2 focus:ring-primary dark:bg-background-dark dark:text-text-main-dark dark:placeholder-text-sub-dark"
                            placeholder="Search by job title, restaurant, or keyword..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    {/* Filters */}
                    <div className="flex flex-wrap gap-2">
                        <button className="group flex items-center gap-2 rounded-lg bg-background-light px-4 py-2.5 text-sm font-medium text-text-main-light transition hover:bg-gray-200 dark:bg-background-dark dark:text-text-main-dark dark:hover:bg-gray-800">
                            <span>Location</span>
                            <span className="material-symbols-outlined text-lg text-text-sub-light group-hover:text-text-main-light dark:text-text-sub-dark">expand_more</span>
                        </button>
                        <button className="group flex items-center gap-2 rounded-lg bg-background-light px-4 py-2.5 text-sm font-medium text-text-main-light transition hover:bg-gray-200 dark:bg-background-dark dark:text-text-main-dark dark:hover:bg-gray-800">
                            <span>Cuisine Type</span>
                            <span className="material-symbols-outlined text-lg text-text-sub-light group-hover:text-text-main-light dark:text-text-sub-dark">expand_more</span>
                        </button>
                        <button className="group flex items-center gap-2 rounded-lg bg-background-light px-4 py-2.5 text-sm font-medium text-text-main-light transition hover:bg-gray-200 dark:bg-background-dark dark:text-text-main-dark dark:hover:bg-gray-800">
                            <span>Experience</span>
                            <span className="material-symbols-outlined text-lg text-text-sub-light group-hover:text-text-main-light dark:text-text-sub-dark">expand_more</span>
                        </button>
                        <button className="flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-background-dark transition hover:bg-opacity-90">
                            Find Jobs
                        </button>
                    </div>
                </div>
            </section>

            {/* Tabs Navigation */}
            <div className="border-b border-border-light dark:border-border-dark">
                <nav aria-label="Tabs" className="-mb-px flex gap-8">
                    <button
                        onClick={() => setActiveTab('feed')}
                        className={`border-b-2 py-4 text-sm font-bold transition-colors ${activeTab === 'feed'
                                ? 'border-primary text-text-main-light dark:text-white'
                                : 'border-transparent text-text-sub-light hover:border-gray-300 hover:text-text-main-light dark:text-text-sub-dark dark:hover:border-gray-600'
                            }`}
                    >
                        Job Feed
                    </button>
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`border-b-2 py-4 text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === 'applications'
                                ? 'border-primary text-text-main-light dark:text-white font-bold'
                                : 'border-transparent text-text-sub-light hover:border-gray-300 hover:text-text-main-light dark:text-text-sub-dark dark:hover:border-gray-600'
                            }`}
                    >
                        My Applications
                        {applications?.length > 0 && (
                            <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                                {applications.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('saved')}
                        className={`border-b-2 py-4 text-sm font-medium transition-colors ${activeTab === 'saved'
                                ? 'border-primary text-text-main-light dark:text-white font-bold'
                                : 'border-transparent text-text-sub-light hover:border-gray-300 hover:text-text-main-light dark:text-text-sub-dark dark:hover:border-gray-600'
                            }`}
                    >
                        Saved
                    </button>
                </nav>
            </div>

            {/* Dashboard Layout Grid */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {/* Left Column: Content based on active tab */}
                <div className="flex flex-col gap-4 lg:col-span-2 xl:col-span-3">
                    {activeTab === 'feed' && (
                        <>
                            {filteredJobs.length === 0 ? (
                                <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl">
                                    <p className="text-text-sub-light dark:text-text-sub-dark">No jobs found matching your search.</p>
                                </div>
                            ) : (
                                filteredJobs.map((job) => (
                                    <article
                                        key={job.id}
                                        className="group relative flex flex-col gap-4 rounded-xl border border-border-light bg-surface-light p-5 shadow-sm transition-all hover:border-primary hover:shadow-md dark:border-border-dark dark:bg-surface-dark"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div
                                                    className="h-14 w-14 flex-none overflow-hidden rounded-lg bg-gray-100 bg-cover bg-center shadow-inner"
                                                    style={{ backgroundImage: job.company?.logo ? `url('data:image/png;base64,${job.company.logo}')` : 'none' }}
                                                >
                                                    {!job.company?.logo && (
                                                        <div className="h-full w-full flex items-center justify-center bg-primary/20">
                                                            <span className="material-symbols-outlined text-primary">restaurant</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">{job.title}</h3>
                                                    <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
                                                        {job.company?.name || 'Unknown Restaurant'} • {job.employment_type || 'Full-time'}
                                                    </p>
                                                </div>
                                            </div>
                                            {new Date(job.posted_date) > new Date(Date.now() - 24 * 60 * 60 * 1000) && (
                                                <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-bold text-green-800 dark:bg-green-900/40 dark:text-green-400">New</span>
                                            )}
                                        </div>

                                        <div className="flex flex-wrap gap-3">
                                            {job.location && (
                                                <div className="flex items-center gap-1.5 rounded-md bg-background-light px-2.5 py-1.5 text-xs font-medium text-text-main-light dark:bg-background-dark dark:text-text-main-dark">
                                                    <span className="material-symbols-outlined text-[16px] text-text-sub-light dark:text-text-sub-dark">location_on</span>
                                                    {job.location.city}, {job.location.state}
                                                </div>
                                            )}
                                            {job.salary && (
                                                <div className="flex items-center gap-1.5 rounded-md bg-background-light px-2.5 py-1.5 text-xs font-medium text-text-main-light dark:bg-background-dark dark:text-text-main-dark">
                                                    <span className="material-symbols-outlined text-[16px] text-text-sub-light dark:text-text-sub-dark">payments</span>
                                                    ₹{job.salary.toLocaleString()}
                                                </div>
                                            )}
                                            {job.employment_type && (
                                                <div className="flex items-center gap-1.5 rounded-md bg-background-light px-2.5 py-1.5 text-xs font-medium text-text-main-light dark:bg-background-dark dark:text-text-main-dark">
                                                    <span className="material-symbols-outlined text-[16px] text-text-sub-light dark:text-text-sub-dark">schedule</span>
                                                    {job.employment_type}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-2 flex items-center justify-between border-t border-border-light pt-4 dark:border-border-dark">
                                            <span className="text-xs text-text-sub-light dark:text-text-sub-dark">
                                                Posted {new Date(job.posted_date).toLocaleDateString()}
                                            </span>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => navigate(`/job/${job.id}`)}
                                                    className="flex items-center justify-center rounded-lg border border-border-light bg-transparent px-3 py-2 text-sm font-bold text-text-main-light transition hover:bg-background-light dark:border-border-dark dark:text-text-main-dark dark:hover:bg-background-dark"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={() => navigate(`/job/${job.id}`)}
                                                    className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark shadow-sm transition hover:bg-opacity-90"
                                                >
                                                    Quick Apply
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))
                            )}
                        </>
                    )}

                    {activeTab === 'applications' && (
                        <div className="flex flex-col gap-4">
                            {appsLoading ? (
                                <div className="flex justify-center py-12">
                                    <Spinner />
                                </div>
                            ) : applications?.length === 0 ? (
                                <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl">
                                    <p className="text-text-sub-light dark:text-text-sub-dark">You haven't applied to any jobs yet.</p>
                                    <button
                                        onClick={() => setActiveTab('feed')}
                                        className="mt-4 px-4 py-2 bg-primary text-background-dark rounded-lg font-bold text-sm"
                                    >
                                        Browse Jobs
                                    </button>
                                </div>
                            ) : (
                                applications.map((app) => (
                                    <article
                                        key={app.id}
                                        className="flex items-center justify-between rounded-xl border border-border-light bg-surface-light p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-primary">work</span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-text-main-light dark:text-text-main-dark">{app.job?.title}</h3>
                                                <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
                                                    {app.job?.company?.name} • Applied {new Date(app.application_date).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`h-2 w-2 rounded-full ${getStatusColor(app.status)}`}></span>
                                            <span className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
                                                {getStatusText(app.status)}
                                            </span>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="flex flex-col gap-4">
                            {likedLoading ? (
                                <div className="flex justify-center py-12">
                                    <Spinner />
                                </div>
                            ) : likedJobs?.length === 0 ? (
                                <div className="text-center py-12 bg-surface-light dark:bg-surface-dark rounded-xl">
                                    <p className="text-text-sub-light dark:text-text-sub-dark">You haven't saved any jobs yet.</p>
                                    <button
                                        onClick={() => setActiveTab('feed')}
                                        className="mt-4 px-4 py-2 bg-primary text-background-dark rounded-lg font-bold text-sm"
                                    >
                                        Browse Jobs
                                    </button>
                                </div>
                            ) : (
                                likedJobs.map((job) => (
                                    <article
                                        key={job.id}
                                        className="group relative flex flex-col gap-4 rounded-xl border border-border-light bg-surface-light p-5 shadow-sm transition-all hover:border-primary hover:shadow-md dark:border-border-dark dark:bg-surface-dark"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex gap-4">
                                                <div className="h-14 w-14 flex-none overflow-hidden rounded-lg bg-primary/20 flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-primary">favorite</span>
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">{job.title}</h3>
                                                    <p className="text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
                                                        {job.company?.name || 'Restaurant'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate(`/job/${job.id}`)}
                                                className="flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-bold text-background-dark shadow-sm transition hover:bg-opacity-90"
                                            >
                                                View Job
                                            </button>
                                        </div>
                                    </article>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Right Column: Sidebar */}
                <aside className="flex flex-col gap-6 lg:col-span-1">
                    {/* Profile Completion Widget */}
                    <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface-light p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                        <div className="flex items-center justify-between">
                            <h4 className="text-base font-bold text-text-main-light dark:text-text-main-dark">Profile Completion</h4>
                            <span className="text-sm font-bold text-primary">{profileCompletion}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-2 w-full overflow-hidden rounded-full bg-background-light dark:bg-background-dark">
                            <div
                                className="h-full rounded-full bg-primary transition-all duration-500"
                                style={{ width: `${profileCompletion}%` }}
                            ></div>
                        </div>
                        {missingItems.length > 0 && (
                            <div className="flex flex-col gap-3">
                                <p className="text-xs text-text-sub-light dark:text-text-sub-dark">Complete these steps to improve your matches:</p>
                                {missingItems.map((item, index) => (
                                    <div key={index} className="flex items-center gap-3">
                                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-background-light dark:bg-background-dark">
                                            <span className="material-symbols-outlined text-sm text-text-sub-light dark:text-text-sub-dark">add</span>
                                        </div>
                                        <span className="text-sm font-medium text-text-main-light dark:text-text-main-dark">{item}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/profile')}
                            className="w-full rounded-lg py-2 text-xs font-bold text-primary hover:bg-background-light dark:hover:bg-background-dark"
                        >
                            Complete Profile
                        </button>
                    </div>

                    {/* Recent Activity / Applications Widget */}
                    <div className="flex flex-col rounded-xl border border-border-light bg-surface-light shadow-sm dark:border-border-dark dark:bg-surface-dark">
                        <div className="border-b border-border-light p-4 dark:border-border-dark">
                            <h4 className="text-base font-bold text-text-main-light dark:text-text-main-dark">Active Applications</h4>
                        </div>
                        <div className="flex flex-col">
                            {appsLoading ? (
                                <div className="p-4 flex justify-center">
                                    <Spinner />
                                </div>
                            ) : applications?.slice(0, 3).map((app, index) => (
                                <div
                                    key={app.id}
                                    className={`flex items-center justify-between gap-3 p-4 transition hover:bg-background-light dark:hover:bg-background-dark ${index > 0 ? 'border-t border-border-light dark:border-border-dark' : ''
                                        }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-text-main-light dark:text-text-main-dark">{app.job?.title}</span>
                                        <span className="text-xs text-text-sub-light dark:text-text-sub-dark">
                                            {app.job?.company?.name} • {getStatusText(app.status)}
                                        </span>
                                    </div>
                                    <span className={`h-2 w-2 rounded-full ${getStatusColor(app.status)}`}></span>
                                </div>
                            ))}
                            {(!applications || applications.length === 0) && !appsLoading && (
                                <div className="p-4 text-center text-sm text-text-sub-light dark:text-text-sub-dark">
                                    No applications yet
                                </div>
                            )}
                        </div>
                        {applications?.length > 0 && (
                            <div className="border-t border-border-light p-3 dark:border-border-dark">
                                <button
                                    onClick={() => setActiveTab('applications')}
                                    className="w-full rounded-lg py-2 text-xs font-bold text-primary hover:bg-background-light dark:hover:bg-background-dark"
                                >
                                    View All Applications
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </main>
    );
}
