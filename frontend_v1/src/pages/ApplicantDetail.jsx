import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Skeleton } from "boneyard-js/react";
import { ApplicantDetailSkeleton } from "@/components/ui/custom/skeletons/ApplicantDetailSkeleton";
import { useApplicationDetail, useUpdateApplicationStatus } from '@/api/home-data';
import { Button } from "@/components/ui/button";
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
  Briefcase
} from "lucide-react";
import { useCulinaryPageMotion } from "@/components/hooks/useCulinaryMotion";

const APP_STATUS_LABEL = {
    p: 'In Progress',
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

    const applicant = application.applicant;
    const job = application.job;

    return (
        <div ref={scopeRef}>
            <PageShell
                headerClassName="cc-reveal"
                eyebrow="Applicant Review"
                title={`${applicant?.first_name} ${applicant?.last_name}`}
                description={`Applied for ${job?.title || 'a role'} on ${new Date(application.application_date).toLocaleDateString()}`}
            actions={
                <>
                    <Button
                        onClick={() => navigate('/messages')}
                        variant="outline dark:default"
                        type="button"
                    >
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                    </Button>
                    <Button
                        onClick={() => navigate('/applications')}
                        variant="outline dark:default"
                        type="button"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                </>
            }
        >
            <div className="flex items-center justify-end mb-6 gap-3">
                <Button
                    onClick={() => updateStatus('r')}
                    variant="destructive"
                    type="button"
                >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                </Button>
                <Button
                    onClick={() => updateStatus('a')}
                    type="button"
                    className="bg-forest-600 hover:bg-forest-700 text-white"
                >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Shortlist
                </Button>
                <Button
                    onClick={() => updateStatus('h')}
                    type="button"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                    <Briefcase className="mr-2 h-4 w-4" />
                    Hire
                </Button>
            </div>

            <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
                {/* LEFT SIDEBAR */}
                <div className="flex flex-col gap-6">
                    <SurfaceCard className="cc-scroll-in p-5 sm:p-6 text-center flex flex-col items-center">
                        <div className="relative mb-4">
                            <div
                                className="size-32 rounded-full bg-stone-100 bg-cover bg-center bg-no-repeat shadow-sm dark:bg-white/10"
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
                        </div>
                        <h3 className="mb-1 text-xl font-bold text-text-main-light dark:text-text-main-dark">
                            {applicant?.first_name} {applicant?.last_name}
                        </h3>
                        <p className="mb-4 text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
                            {applicant?.speciality || 'Chef'}
                        </p>
                        <div className="mb-6 flex items-center justify-center gap-2 rounded-full bg-muted dark:bg-white/10 px-4 py-2 text-sm text-foreground">
                            <MapPin className="h-4 w-4 opacity-70" />
                            <span>{applicant?.location?.city}, {applicant?.location?.state}</span>
                        </div>
                        <div className="grid w-full grid-cols-2 gap-4 border-t border-border pt-4">
                            <div className="text-center">
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">Experience</p>
                                <p className="text-lg font-bold text-text-main-light dark:text-text-main-dark">{applicant?.experience_years || 0} Yrs</p>
                            </div>
                            <div className="border-l border-border text-center">
                                <p className="text-xs font-semibold uppercase tracking-wider text-text-sub-light dark:text-text-sub-dark">Status</p>
                                <p className="text-lg font-bold text-text-main-light dark:text-text-main-dark">{applicant?.job_search_status || 'Active'}</p>
                            </div>
                        </div>
                    </SurfaceCard>

                    <SurfaceCard className="cc-scroll-in p-5 sm:p-6 space-y-4">
                        <SectionHeading eyebrow="Reach out" title="Contact Info" />
                        <div className="mt-4 flex flex-col gap-4">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-text-sub-light dark:text-text-sub-dark">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark">Email Address</p>
                                    <p className="truncate text-sm font-medium text-text-main-light dark:text-text-main-dark">{applicant?.email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 text-text-sub-light dark:text-text-sub-dark">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-text-sub-light dark:text-text-sub-dark">Phone Number</p>
                                    <p className="text-sm font-medium text-text-main-light dark:text-text-main-dark">{applicant?.phone_number || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </SurfaceCard>

                    <SurfaceCard className="cc-scroll-in p-5 sm:p-6">
                        <SectionHeading eyebrow="Expertise" title="Specialties" />
                        <div className="mt-4 flex flex-wrap gap-2">
                            {applicant?.speciality && (
                                <StatusPill tone="info">{applicant.speciality}</StatusPill>
                            )}
                            {applicant?.preferred_job_roles?.split(',').map((role, index) => (
                                <StatusPill key={index}>{role.trim()}</StatusPill>
                            ))}
                        </div>
                    </SurfaceCard>
                </div>

                {/* RIGHT CONTENT */}
                <div className="flex flex-col gap-6">
                    <SurfaceCard className="cc-scroll-in p-5 sm:p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-text-main-light dark:text-text-main-dark">Application Status</h3>
                            <StatusPill tone={APP_STATUS_TONE[application.status] || 'warning'}>
                                {APP_STATUS_LABEL[application.status] || 'Pending'}
                            </StatusPill>
                        </div>
                        <div className="relative pl-4">
                            <div className="absolute bottom-6 left-[27px] top-2 w-0.5 bg-border"></div>
                            <div className="relative flex gap-6 pb-8 group">
                                <div className="relative z-10 flex size-6 flex-none items-center justify-center rounded-full border-2 border-primary bg-primary/10">
                                    <div className="size-2 rounded-full bg-primary"></div>
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
                                    <div className="flex flex-col gap-1 rounded-lg border border-primary/30 bg-primary/5 p-3 dark:bg-primary/20 sm:w-full sm:flex-row sm:justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-text-main-light dark:text-text-main-dark">
                                                {APP_STATUS_LABEL[application.status]}
                                            </p>
                                            <p className="text-sm text-text-sub-light dark:text-text-sub-dark">Current application status.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </SurfaceCard>

                    {applicant?.bio && (
                        <SurfaceCard className="cc-scroll-in p-5 sm:p-6">
                            <SectionHeading eyebrow="Background" title="About the Candidate" />
                            <p className="mt-4 text-sm leading-relaxed text-text-main-light dark:text-text-main-dark/90">{applicant.bio}</p>
                        </SurfaceCard>
                    )}

                    {applicant?.achievements && (
                        <SurfaceCard className="cc-scroll-in p-5 sm:p-6">
                            <SectionHeading eyebrow="Highlights" title="Key Achievements" />
                            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-text-main-light dark:text-text-main-dark/90">{applicant.achievements}</p>
                        </SurfaceCard>
                    )}
                </div>
            </div>
        </PageShell>
        </div>
    );
}
