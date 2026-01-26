import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompanyJobs, useDeleteJob, useUpdateJobStatus } from '@/api/job-management-data';
import { format } from 'date-fns';

export default function JobManagement() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const { data: jobs = [], isLoading, error } = useCompanyJobs();
    const deleteJobMutation = useDeleteJob();
    const updateStatusMutation = useUpdateJobStatus();

    // Filter and search jobs
    const filteredJobs = useMemo(() => {
        let filtered = jobs;

        // Apply status filter
        if (filterStatus !== 'all') {
            filtered = filtered.filter(job => {
                if (filterStatus === 'active') return job.status === 'active';
                if (filterStatus === 'closed') return job.status === 'closed';
                if (filterStatus === 'draft') return job.status === 'draft';
                return true;
            });
        }

        // Apply search
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(query) ||
                job.location?.city?.toLowerCase().includes(query) ||
                job.company_name?.toLowerCase().includes(query)
            );
        }

        return filtered;
    }, [jobs, filterStatus, searchQuery]);

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this draft?')) {
            try {
                await deleteJobMutation.mutateAsync(jobId);
            } catch (error) {
                console.error('Failed to delete job:', error);
                alert('Failed to delete job. Please try again.');
            }
        }
    };

    const handleToggleStatus = async (jobId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'closed' : 'active';
        try {
            await updateStatusMutation.mutateAsync({ jobId, status: newStatus });
        } catch (error) {
            console.error('Failed to update job status:', error);
            alert('Failed to update job status. Please try again.');
        }
    };

    const getStatusBadge = (status) => {
        if (status === 'active') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Active
                </span>
            );
        }
        if (status === 'closed') {
            return (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                    Closed
                </span>
            );
        }
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Draft
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-4">Failed to load jobs</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary-dark"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-6xl mx-auto flex flex-col gap-6">
                {/* Page Header */}
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            My Job Postings
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400">
                            Manage your open positions and track applicant interest.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/jobs/post')}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-black font-bold h-10 px-5 rounded-lg transition-colors shadow-sm shadow-primary/20"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Post New Job</span>
                    </button>
                </div>

                {/* Filters & Search */}
                <div className="bg-surface-light dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-4 justify-between">
                    {/* Search */}
                    <div className="relative w-full md:max-w-md">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">
                            search
                        </span>
                        <input
                            className="w-full pl-10 pr-4 h-10 rounded-lg border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                            placeholder="Search by job title or location..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Chips */}
                    <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        <button
                            onClick={() => setFilterStatus('all')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'all'
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            All Jobs
                        </button>
                        <button
                            onClick={() => setFilterStatus('active')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'active'
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            Active
                        </button>
                        <button
                            onClick={() => setFilterStatus('closed')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'closed'
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            Closed
                        </button>
                        <button
                            onClick={() => setFilterStatus('draft')}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${filterStatus === 'draft'
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                }`}
                        >
                            Drafts
                        </button>
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 w-1/3">
                                        Job Details
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Applicants
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Status
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                                        Posted Date
                                    </th>
                                    <th className="py-4 px-6 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-right">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {filteredJobs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-12 text-center text-slate-500">
                                            {searchQuery || filterStatus !== 'all'
                                                ? 'No jobs match your filters'
                                                : 'No jobs posted yet. Click "Post New Job" to get started.'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredJobs.map((job) => (
                                        <tr
                                            key={job.job_id}
                                            className={`group hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors ${job.status === 'closed' ? 'bg-slate-50/50 dark:bg-slate-800/10' : ''
                                                }`}
                                        >
                                            {/* Job Details */}
                                            <td className="py-4 px-6">
                                                <div className={`flex flex-col ${job.status === 'closed' ? 'opacity-75' : ''}`}>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-slate-900 dark:text-white text-base">
                                                            {job.title}
                                                        </span>
                                                        {job.status === 'draft' && (
                                                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-800 border border-yellow-200 uppercase tracking-wide">
                                                                Draft
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1 mt-1 text-slate-500 dark:text-slate-400 text-sm">
                                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                                        <span>
                                                            {job.location?.city || 'Location not specified'}, {job.company_name}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Applicants */}
                                            <td className="py-4 px-6">
                                                {job.applicant_count > 0 ? (
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                            {job.applicant_count} total
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm font-medium text-slate-400 italic">
                                                        No applicants yet
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="py-4 px-6">{getStatusBadge(job.status)}</td>

                                            {/* Posted Date */}
                                            <td className="py-4 px-6">
                                                <span className={`text-sm text-slate-600 dark:text-slate-400 ${job.status === 'closed' ? 'opacity-75' : ''}`}>
                                                    {job.posted_date ? format(new Date(job.posted_date), 'MMM dd, yyyy') : '--'}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td className="py-4 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => navigate(`/jobs/${job.job_id}`)}
                                                        className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                                                        title="View Details"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/jobs/edit/${job.job_id}`)}
                                                        className="p-2 rounded-lg text-slate-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                                        title="Edit Job"
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">edit</span>
                                                    </button>
                                                    {job.status === 'draft' ? (
                                                        <button
                                                            onClick={() => handleDeleteJob(job.job_id)}
                                                            className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                            title="Delete Draft"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleToggleStatus(job.job_id, job.status)}
                                                            className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                            title={job.status === 'active' ? 'Close Job' : 'Reopen Job'}
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">
                                                                {job.status === 'active' ? 'block' : 'refresh'}
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredJobs.length > 0 && (
                        <div className="px-6 py-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/30">
                            <span className="text-sm text-slate-500 dark:text-slate-400">
                                Showing{' '}
                                <span className="font-medium text-slate-900 dark:text-white">
                                    1-{filteredJobs.length}
                                </span>{' '}
                                of{' '}
                                <span className="font-medium text-slate-900 dark:text-white">
                                    {filteredJobs.length}
                                </span>{' '}
                                jobs
                            </span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
