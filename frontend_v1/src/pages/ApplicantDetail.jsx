import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Skeleton } from "boneyard-js/react";
import { ApplicantDetailSkeleton } from "@/components/ui/custom/skeletons/ApplicantDetailSkeleton";
import { useApplicationDetail, useUpdateApplicationStatus } from '@/api/home-data';
import { Button } from "@/components/ui/button";
import DOMPurify from "dompurify";
import {
  PageShell,
  SectionHeading,
  StatusPill,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { 
  ArrowLeft, 
  MessageSquare, 
  XCircle, 
  CheckCircle, 
  MapPin,
  Mail,
  Phone,
  Briefcase,
  CalendarDays,
  Clock,
  ChefHat,
  Trophy,
  History,
  CheckCircle2
} from "lucide-react";
import { useCulinaryPageMotion } from "@/components/hooks/useCulinaryMotion";

const APP_STATUS_LABEL = {
    p: 'Pending Review',
    a: 'Shortlisted',
    r: 'Rejected',
    h: 'Hired',
};

const APP_STATUS_TONE = {
    p: 'warning',
    a: 'success',
    r: 'danger',
    h: 'success',
};

export default function ApplicantDetail() {
    const scopeRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: application, isLoading, isError } = useApplicationDetail(id);
    const { mutate: updateStatus } = useUpdateApplicationStatus(id);

    useCulinaryPageMotion({ scopeRef, dependencies: [application?.application_id] });

    if (isLoading) {
        return (
            <PageShell
                eyebrow="Applicant Review"
                title="Loading applicant profile..."
                description="Retrieving qualifications and history."
            >
                <Skeleton animate="shimmer" loading={true} fallback={<ApplicantDetailSkeleton />}>
                    <ApplicantDetailSkeleton />
                </Skeleton>
            </PageShell>
        );
    }

    if (isError || !application) {
        return (
            <PageShell
                eyebrow="Applicant Review"
                title="Applicant Not Found"
                description="The application may have been removed or is no longer available."
            >
                <div className="flex flex-col items-center justify-center py-20">
                    <p className="mt-2 text-rose-600 dark:text-rose-400 text-sm mb-6">Could not locate the requested application record.</p>
                    <Button onClick={() => navigate('/applications')} type="button">
                        Back to Applications
                    </Button>
                </div>
            </PageShell>
        );
    }

    const applicant = application.applicant?.user || application.applicant;
    const job = application.job;
    const sanitize = (data) => DOMPurify.sanitize(data || "");

    return (
        <div ref={scopeRef}>
            <PageShell
                headerClassName="cc-reveal"
                eyebrow="Applicant Review"
                title={`${applicant?.first_name} ${applicant?.last_name}`}
                description={`Applied for ${job?.title || 'a role'} on ${new Date(application.application_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`}
                actions={
                    <div className="flex gap-2">
                        <Button
                            onClick={() => navigate('/messages')}
                            variant="outline"
                            className="bg-white/50 dark:bg-white/5"
                        >
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                        </Button>
                        <Button
                            onClick={() => navigate('/applications')}
                            variant="outline"
                            className="bg-white/50 dark:bg-white/5"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                    </div>
                }
            >
            {/* Action Bar */}
            <SurfaceCard className="cc-reveal mb-8 flex flex-col items-center justify-between gap-4 p-4 sm:flex-row">
                <div className="flex items-center gap-3">
                    <StatusPill tone={APP_STATUS_TONE[application.status] || 'warning'}>
                        Current Status: {APP_STATUS_LABEL[application.status]}
                    </StatusPill>
                </div>
                <div className="flex w-full flex-wrap justify-center gap-2 sm:w-auto">
                    <Button
                        onClick={() => updateStatus('r')}
                        variant="ghost"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10"
                    >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                    </Button>
                    <Button
                        onClick={() => updateStatus('a')}
                        className="bg-forest-600 text-white hover:bg-forest-700 dark:bg-forest-500 dark:text-[#102216]"
                    >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Shortlist
                    </Button>
                    <Button
                        onClick={() => updateStatus('h')}
                        className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-500 dark:text-[#102216]"
                    >
                        <Briefcase className="mr-2 h-4 w-4" />
                        Confirm Hire
                    </Button>
                </div>
            </SurfaceCard>

            <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
                {/* LEFT SIDEBAR */}
                <div className="flex flex-col gap-6">
                    <SurfaceCard className="cc-scroll-in p-6 text-center">
                        <div className="flex justify-center mb-5">
                            <div className="relative">
                                <div
                                    className="size-32 rounded-[2.5rem] bg-primary/10 flex items-center justify-center text-4xl font-bold text-primary shadow-inner dark:bg-primary/20 dark:text-amber-300"
                                >
                                    {applicant?.profile_picture ? (
                                        <img 
                                            src={`data:image/png;base64,${applicant.profile_picture}`} 
                                            alt={applicant.first_name}
                                            className="h-full w-full rounded-[2.5rem] object-cover"
                                        />
                                    ) : (
                                        applicant?.first_name?.charAt(0)
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2 rounded-2xl bg-white p-1.5 shadow-md dark:bg-[#1e1a15]">
                                    <ChefHat className="h-5 w-5 text-primary" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold tracking-tight text-text-main-light dark:text-text-main-dark">
                            {applicant?.first_name} {applicant?.last_name}
                        </h3>
                        <p className="mt-1 font-medium text-primary">
                            {applicant?.speciality || 'Professional Chef'}
                        </p>
                        
                        <div className="mt-6 space-y-3 border-t border-stone-200/60 pt-6 text-left dark:border-white/[0.05]">
                            <div className="flex items-center gap-3 text-sm text-text-sub-light dark:text-text-sub-dark">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-100 dark:bg-white/5">
                                    <MapPin className="h-4 w-4" />
                                </div>
                                <span>{applicant?.location?.city}, {applicant?.location?.state}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-text-sub-light dark:text-text-sub-dark">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-100 dark:bg-white/5">
                                    <Mail className="h-4 w-4" />
                                </div>
                                <span className="truncate">{applicant?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-text-sub-light dark:text-text-sub-dark">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-stone-100 dark:bg-white/5">
                                    <Phone className="h-4 w-4" />
                                </div>
                                <span>{applicant?.phone_number || 'No Phone'}</span>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-[#fdf8f3] p-4 dark:bg-white/[0.03]">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-sub-light/60">Experience</p>
                                <p className="mt-0.5 text-lg font-bold text-text-main-light dark:text-text-main-dark">{applicant?.experience_years || 0} Yrs</p>
                            </div>
                            <div className="border-l border-stone-200/60 pl-4 dark:border-white/10">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-text-sub-light/60">Status</p>
                                <p className="mt-0.5 text-lg font-bold text-text-main-light dark:text-text-main-dark">Active</p>
                            </div>
                        </div>
                    </SurfaceCard>

                    <SurfaceCard className="cc-scroll-in p-6">
                        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-main-light dark:text-text-main-dark flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-primary" />
                            Expertise
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {applicant?.speciality && (
                                <StatusPill tone="info">{applicant.speciality}</StatusPill>
                            )}
                            {applicant?.preferred_job_roles?.split(',').map((role, index) => (
                                <StatusPill key={index} tone="slate">{role.trim()}</StatusPill>
                            ))}
                        </div>
                    </SurfaceCard>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex flex-col gap-6">
                    {/* Application Timeline */}
                    <SurfaceCard className="cc-scroll-in p-6">
                        <div className="flex items-center gap-2 mb-8">
                            <History className="h-5 w-5 text-primary" />
                            <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Application History</h3>
                        </div>
                        
                        <div className="relative space-y-8 pl-4">
                            <div className="absolute bottom-4 left-6 top-1 w-0.5 bg-stone-200 dark:bg-white/10"></div>
                            
                            {/* Step 1 */}
                            <div className="relative flex gap-6">
                                <div className="relative z-10 flex h-5 w-5 translate-x-1.5 translate-y-1 items-center justify-center rounded-full bg-forest-500 ring-4 ring-forest-500/20">
                                    <CheckCircle2 className="h-3 w-3 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-text-main-light dark:text-text-main-dark">Application Submitted</p>
                                    <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-0.5">
                                        Received on {new Date(application.application_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                    </p>
                                </div>
                            </div>

                            {/* Current Step */}
                            <div className="relative flex gap-6">
                                <div className="relative z-10 flex h-5 w-5 translate-x-1.5 translate-y-1 items-center justify-center rounded-full bg-primary ring-4 ring-primary/20">
                                    <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                                </div>
                                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 dark:bg-primary/10">
                                    <p className="text-sm font-bold text-primary">Currently: {APP_STATUS_LABEL[application.status]}</p>
                                    <p className="text-xs text-text-sub-light dark:text-text-sub-dark mt-1">
                                        Waitlisted in the hiring pipeline. Update the status to move forward.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </SurfaceCard>

                    {/* Bio */}
                    {applicant?.bio && (
                        <SurfaceCard className="cc-scroll-in p-6">
                            <SectionHeading eyebrow="Summary" title="About Candidate" />
                            <div 
                                className="mt-4 prose prose-sm dark:prose-invert max-w-none text-text-main-light/90 dark:text-text-main-dark/90 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: sanitize(applicant.bio) }}
                            />
                        </SurfaceCard>
                    )}

                    {/* Achievements */}
                    {applicant?.achievements && (
                        <SurfaceCard className="cc-scroll-in p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Trophy className="h-5 w-5 text-amber-500" />
                                <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Key Achievements</h3>
                            </div>
                            <div 
                                className="prose prose-sm dark:prose-invert max-w-none text-text-main-light/90 dark:text-text-main-dark/90 whitespace-pre-line"
                                dangerouslySetInnerHTML={{ __html: sanitize(applicant.achievements) }}
                            />
                        </SurfaceCard>
                    )}
                </div>
            </div>
        </PageShell>
        </div>
    );
}
