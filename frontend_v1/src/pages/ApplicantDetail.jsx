import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '@/components/ui/custom/spinner';
import { useApplicationDetail, useUpdateApplicationStatus } from '@/api/home-data';

const statusStyles = {
    p: 'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/12 dark:text-amber-200',
    a: 'border-forest-200 bg-forest-50 text-forest-700 dark:border-forest-500/20 dark:bg-forest-500/12 dark:text-forest-200',
    r: 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/12 dark:text-rose-200',
    h: 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/12 dark:text-emerald-200',
};

export default function ApplicantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: application, isLoading, isError } = useApplicationDetail(id);
    const { mutate: updateStatus } = useUpdateApplicationStatus(id);

    const getStatusBadge = (status) => {
        const badges = {
            p: { label: 'In Progress', class: statusStyles.p },
            a: { label: 'Accepted', class: statusStyles.a },
            r: { label: 'Rejected', class: statusStyles.r },
            h: { label: 'Hired', class: statusStyles.h },
        };
        const badge = badges[status] || badges.p;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${badge.class}`}>
                {badge.label}
            </span>
        );
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (isError || !application) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="max-w-lg rounded-xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-500/20 dark:bg-rose-500/12">
                    <h2 className="text-2xl font-bold text-red-700">Application Not Found</h2>
                    <p className="mt-2 text-red-600 text-sm">The application may have been removed or is no longer available.</p>
                    <button
                        onClick={() => navigate('/applications')}
                        className="mt-4 px-4 py-2 rounded-lg bg-gradient-to-br from-primary to-primary/85 text-white font-semibold hover:brightness-105"
                    >
                        Back to Applications
                    </button>
                </div>
            </div>
        );
    }

    const applicant = application.applicant;
    const job = application.job;

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 md:px-8">
            {/* Breadcrumbs & Header */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2 items-center text-sm mb-4">
                    <button
                        onClick={() => navigate('/applications')}
                        className="text-text-sub-light transition-colors hover:text-primary dark:text-text-sub-dark"
                    >
                        Applications
                    </button>
                    <span className="text-text-sub-light dark:text-text-sub-dark">/</span>
                    <span className="font-medium text-text-main-light dark:text-text-main-dark">
                        {applicant?.first_name} {applicant?.last_name}
                    </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-text-main-light dark:text-text-main-dark">
                            Applicant Details
                        </h1>
                        <p className="mt-1 text-sm text-text-sub-light dark:text-text-sub-dark">
                            Applied for <span className="font-medium text-text-main-light dark:text-text-main-dark">{job?.title}</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/messages')}
                            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border-light/80 bg-white/92 px-4 text-sm font-medium text-text-main-light shadow-sm transition-colors hover:bg-stone-50 dark:border-border-dark dark:bg-white/10 dark:text-text-main-dark dark:hover:bg-white/14"
                        >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                            <span>Open Chat</span>
                        </button>
                        <button
                            onClick={() => updateStatus('r')}
                            className="flex h-10 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-600 transition-colors hover:bg-rose-100 dark:border-rose-500/20 dark:bg-rose-500/12 dark:text-rose-200 dark:hover:bg-rose-500/18"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                            <span>Reject</span>
                        </button>
                        <button
                            onClick={() => updateStatus('a')}
                            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-primary via-ember-500 to-ember-600 px-6 text-sm font-bold text-primary-foreground shadow-md transition-all active:scale-95 hover:brightness-105"
                        >
                            <span>Accept Applicant</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* LEFT SIDEBAR */}
                <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
                    <div className="flex flex-col items-center rounded-xl border border-border-light/80 bg-white/92 p-6 text-center shadow-sm dark:border-border-dark dark:bg-[#241f1b]">
                        <div className="relative mb-4 group">
                            <div
                                className="size-32 rounded-full bg-stone-100 bg-cover bg-center bg-no-repeat shadow-md dark:bg-[#332b25]"
                                style={
                                    applicant?.profile_picture
                                        ? { backgroundImage: `url('data:image/png;base64,${applicant.profile_picture}')` }
                                        : {}
                                }
                            >
                                {!applicant?.profile_picture && (
                                    <div className="flex h-full w-full items-center justify-center text-4xl font-bold text-text-sub-light dark:text-text-sub-dark">
                                        {applicant?.first_name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="absolute bottom-1 right-1 rounded-full border border-forest-200 bg-forest-50 p-1.5 shadow-sm dark:border-forest-500/20 dark:bg-forest-500/12" title="Verified Applicant">
                                <span className="material-symbols-outlined block text-[20px] text-forest-600 dark:text-forest-200">verified</span>
                            </div>
                        </div>
                        <h3 className="mb-1 text-xl font-bold text-text-main-light dark:text-text-main-dark">
                            {applicant?.first_name} {applicant?.last_name}
                        </h3>
                        <p className="mb-4 text-sm font-medium text-text-sub-light dark:text-text-sub-dark">{applicant?.speciality || 'Chef'}</p>
                        <div className="mb-6 flex items-center justify-center gap-2 rounded-full bg-forest-50 px-4 py-2 text-sm text-forest-700 dark:bg-forest-500/12 dark:text-forest-200">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            <span>{applicant?.location?.city}, {applicant?.location?.state}</span>
                        </div>
                        <div className="mb-4 grid w-full grid-cols-2 gap-4 border-t border-border-light/80 pt-4 dark:border-border-dark">
                            <div className="text-center">
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">Experience</p>
                                <p className="text-lg font-bold text-text-main-light dark:text-text-main-dark">{applicant?.experience_years || 0} Yrs</p>
                            </div>
                            <div className="border-l border-border-light/80 text-center dark:border-border-dark">
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">Status</p>
                                <p className="text-lg font-bold text-text-main-light dark:text-text-main-dark">{applicant?.job_search_status || 'Active'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-border-light/80 bg-white/92 shadow-sm dark:border-border-dark dark:bg-[#241f1b]">
                        <div className="border-b border-border-light/80 bg-stone-50/90 px-5 py-4 dark:border-border-dark dark:bg-white/6">
                            <h4 className="font-semibold text-text-main-light dark:text-text-main-dark">Contact Info</h4>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-start gap-3 group cursor-pointer">
                                <div className="mt-0.5 text-text-sub-light dark:text-text-sub-dark">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark">Email Address</p>
                                    <p className="truncate text-sm font-medium text-text-main-light transition-colors group-hover:text-primary dark:text-text-main-dark">{applicant?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 group cursor-pointer">
                                <div className="mt-0.5 text-text-sub-light dark:text-text-sub-dark">
                                    <span className="material-symbols-outlined text-[20px]">call</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark">Phone Number</p>
                                    <p className="text-sm font-medium text-text-main-light transition-colors group-hover:text-primary dark:text-text-main-dark">{applicant?.phone_number || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-border-light/80 bg-white/92 p-5 shadow-sm dark:border-border-dark dark:bg-[#241f1b]">
                        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-text-main-light dark:text-text-main-dark">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                            {applicant?.speciality && (
                                <span className="inline-flex cursor-default items-center rounded-md border border-forest-200 bg-forest-50 px-2.5 py-1 text-xs font-medium text-forest-700 dark:border-forest-500/20 dark:bg-forest-500/12 dark:text-forest-200">
                                    {applicant.speciality}
                                </span>
                            )}
                            {applicant?.preferred_job_roles?.split(',').map((role, index) => (
                                <span key={index} className="inline-flex cursor-default items-center rounded-md border border-forest-200 bg-forest-50 px-2.5 py-1 text-xs font-medium text-forest-700 dark:border-forest-500/20 dark:bg-forest-500/12 dark:text-forest-200">
                                    {role.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* RIGHT CONTENT */}
                <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
                    <section className="rounded-xl border border-border-light/80 bg-white/92 p-6 shadow-sm dark:border-border-dark dark:bg-[#241f1b]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Application Timeline</h3>
                            {getStatusBadge(application.status)}
                        </div>
                        <div className="relative pl-4">
                            <div className="absolute bottom-6 left-[27px] top-2 w-0.5 bg-border-light dark:bg-border-dark"></div>
                            <div className="relative flex gap-6 pb-8 group">
                                <div className="relative z-10 flex size-6 flex-none items-center justify-center rounded-full border-2 border-forest-500 bg-forest-50 dark:border-forest-300 dark:bg-forest-500/14">
                                    <span className="material-symbols-outlined text-[14px] font-bold text-forest-600 dark:text-forest-200">check</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:w-full gap-1">
                                    <div>
                                        <p className="text-sm font-bold text-text-main-light dark:text-text-main-dark">Application Received</p>
                                        <p className="text-sm text-text-sub-light dark:text-text-sub-dark">Submitted via platform.</p>
                                    </div>
                                    <p className="whitespace-nowrap text-xs font-medium text-text-sub-light dark:text-text-sub-dark">
                                        {new Date(application.application_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            {application.status !== 'p' && (
                                <div className="relative flex gap-6 group">
                                    <div className="relative z-10 flex size-6 flex-none items-center justify-center rounded-full bg-primary ring-4 ring-primary/20">
                                        <div className="size-2 rounded-full bg-primary-foreground"></div>
                                    </div>
                                    <div className="flex flex-col gap-1 rounded-lg border border-primary/30 bg-primary/8 p-3 dark:bg-primary/14 sm:w-full sm:flex-row sm:justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-text-main-light dark:text-text-main-dark">
                                                {application.status === 'a' && 'Accepted'}
                                                {application.status === 'r' && 'Rejected'}
                                                {application.status === 'h' && 'Hired'}
                                            </p>
                                            <p className="text-sm text-text-sub-light dark:text-text-sub-dark">Current application status.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {applicant?.bio && (
                        <section className="rounded-xl border border-border-light/80 bg-white/92 p-6 shadow-sm dark:border-border-dark dark:bg-[#241f1b]">
                            <h3 className="mb-4 text-lg font-bold text-text-main-light dark:text-text-main-dark">About</h3>
                            <p className="text-sm leading-relaxed text-text-main-light dark:text-text-main-dark/90">{applicant.bio}</p>
                        </section>
                    )}

                    {applicant?.achievements && (
                        <section className="rounded-xl border border-border-light/80 bg-white/92 p-6 shadow-sm dark:border-border-dark dark:bg-[#241f1b]">
                            <h3 className="mb-4 text-lg font-bold text-text-main-light dark:text-text-main-dark">Achievements</h3>
                            <p className="whitespace-pre-line text-sm leading-relaxed text-text-main-light dark:text-text-main-dark/90">{applicant.achievements}</p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
