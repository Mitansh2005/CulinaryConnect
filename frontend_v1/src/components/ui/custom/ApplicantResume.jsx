/* eslint-disable react/prop-types */
import DOMPurify from "dompurify";
import { 
  User, 
  Mail, 
  Briefcase, 
  ChefHat, 
  Clock, 
  MapPin, 
  Trophy, 
  CheckCircle2, 
  XCircle,
  FileText
} from "lucide-react";
import { SurfaceCard, StatusPill } from "@/components/ui/custom/enterprise-shell";

export const JobSeekerProfileCard = ({ profile }) => {
  const {
    user,
    experience_years,
    achievements,
    job_type_preference,
    preferred_job_roles,
    relocate_confirmation,
    job_search_status,
  } = profile;

  const getStatusTone = (status) => {
    if (status === "available") return "success";
    if (status === "looking") return "warning";
    return "danger";
  };

  const sanitize = (data) => DOMPurify.sanitize(data || "");

  const InfoItem = ({ icon: Icon, label, value }) => (
    <div className="flex items-start gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary dark:bg-primary/12 dark:text-amber-400">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-text-sub-light/60 dark:text-text-sub-dark/60">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-text-main-light dark:text-text-main-dark">
          {value || "—"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:gap-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary/10 text-2xl font-bold text-primary dark:bg-primary/20 dark:text-amber-300">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div className="mt-4 flex-1 sm:mt-0">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-text-main-light dark:text-text-main-dark">
              {user.username}
            </h2>
            <StatusPill tone={getStatusTone(job_search_status)}>
              {job_search_status?.replace("_", " ") || "No Status"}
            </StatusPill>
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 sm:justify-start">
            <div className="flex items-center gap-1.5 text-sm text-text-sub-light dark:text-text-sub-dark">
              <Mail className="h-4 w-4 text-primary/60" />
              {user.email}
            </div>
            {user.speciality && (
              <div className="flex items-center gap-1.5 text-sm text-text-sub-light dark:text-text-sub-dark">
                <ChefHat className="h-4 w-4 text-primary/60" />
                {user.speciality}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bio Section */}
      {user.bio && (
        <div className="rounded-2xl bg-stone-100/50 p-5 dark:bg-white/[0.03]">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-main-light dark:text-text-main-dark">
              Profile Summary
            </h3>
          </div>
          <div 
            className="prose prose-sm dark:prose-invert max-w-none text-text-sub-light dark:text-text-sub-dark"
            dangerouslySetInnerHTML={{ __html: sanitize(user.bio) }}
          />
        </div>
      )}

      {/* Grid details */}
      <div className="grid gap-6 sm:grid-cols-2">
        <SurfaceCard className="p-5 shadow-none border-stone-200/60 dark:border-white/5 bg-transparent">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-main-light dark:text-text-main-dark">
            Professional Overview
          </h3>
          <div className="space-y-4">
            <InfoItem 
              icon={Clock} 
              label="Experience" 
              value={`${experience_years || 0} years`} 
            />
            <InfoItem 
              icon={Briefcase} 
              label="Job Type" 
              value={job_type_preference} 
            />
            <InfoItem 
              icon={MapPin} 
              label="Preferred Roles" 
              value={preferred_job_roles} 
            />
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/8 text-primary dark:bg-primary/12">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-text-sub-light/60">
                  Willing to Relocate
                </p>
                <div className="mt-1 flex items-center gap-2">
                  {relocate_confirmation ? (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-forest-600 dark:text-forest-400">
                      <CheckCircle2 className="h-4 w-4" /> Yes
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-sm font-medium text-rose-600 dark:text-rose-400">
                      <XCircle className="h-4 w-4" /> No
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-5 shadow-none border-stone-200/60 dark:border-white/5 bg-transparent">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-text-main-light dark:text-text-main-dark">
            Achievements & Awards
          </h3>
          {achievements ? (
            <div 
              className="prose prose-sm dark:prose-invert max-w-none text-text-sub-light dark:text-text-sub-dark"
              dangerouslySetInnerHTML={{ __html: sanitize(achievements) }}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Trophy className="h-8 w-8 text-stone-300 dark:text-white/10 mb-2" />
              <p className="text-sm text-text-sub-light/60 dark:text-text-sub-dark/60">
                No achievements listed yet.
              </p>
            </div>
          )}
        </SurfaceCard>
      </div>
    </div>
  );
};
