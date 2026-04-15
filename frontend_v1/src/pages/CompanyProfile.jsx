import { getUid } from "@/firebase/authUtils";
import { baseUrl } from "@/constants/constants";
import { Link, useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import { useCompanyInfo } from "@/api/home-data";
import {
  PageShell,
  SectionHeading,
  SurfaceCard,
  StatusPill,
  Avatar,
} from "@/components/ui/custom/enterprise-shell";
import { Button } from "@/components/ui/button";
import { JobCardSkeleton } from "@/components/ui/custom/skeletons/Skeletons";
import ProfilePictureUploader from "@/components/ui/custom/profile_component/profile_picture_uploader";
import CompanyIcon from "../assets/icons/company-icon.png";
import { Building2, MapPin, Shield, CalendarDays, Users } from "lucide-react";

const sizeMap = {
  small: "1–50 employees",
  medium: "51–250 employees",
  large: "251–1,000 employees",
  enterprise: "1,000+ employees",
};

function DetailTile({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/16">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-text-sub-light dark:text-text-sub-dark">
          {label}
        </p>
        <p className="mt-0.5 text-sm font-medium text-text-main-light dark:text-text-main-dark">
          {value}
        </p>
      </div>
    </div>
  );
}

export const CompanyProfileTemplate = () => {
  const uid = getUid();
  const navigate = useNavigate();

  const { data: company, isLoading } = useCompanyInfo(uid);

  const sanitizedDesc = company?.description
    ? DOMPurify.sanitize(company.description)
    : null;

  const locationStr = [
    company?.location?.city,
    company?.location?.state,
    company?.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  if (isLoading) {
    return (
      <PageShell eyebrow="Restaurant" title="Loading company profile...">
        <JobCardSkeleton />
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Restaurant"
      title={company?.name || "Company profile"}
      description="Your public-facing company identity shown to all candidates browsing your listings."
      actions={
        <Link to="/edit-company-profile" state={{ companyData: company }}>
          <Button type="button">Edit company profile</Button>
        </Link>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* LEFT: Logo + uploader */}
        <div className="grid gap-4 self-start">
          <SurfaceCard className="flex flex-col items-center gap-5 p-6 text-center">
            <ProfilePictureUploader
              id={company?.id}
              username={company?.name}
              defaultImage={company?.logo || CompanyIcon}
              getProfileUrl={`${baseUrl}/company`}
              uploadUrl={`${baseUrl}/company/upload-logo/${company?.id}/`}
            />
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-text-main-light dark:text-text-main-dark">
                {company?.name || "Restaurant"}
              </h2>
              {company?.size && (
                <p className="mt-1 text-sm text-text-sub-light dark:text-text-sub-dark">
                  {sizeMap[company.size] || company.size}
                </p>
              )}
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <StatusPill tone="success">Verified kitchen</StatusPill>
              </div>
            </div>
          </SurfaceCard>

          <SurfaceCard className="p-5">
            <p className="section-kicker mb-3">Company details</p>
            <div className="grid gap-3">
              <DetailTile icon={MapPin} label="Location" value={locationStr || "Not specified"} />
              <DetailTile icon={Users} label="Company size" value={sizeMap[company?.size] || company?.size || "Not specified"} />
              <DetailTile icon={Shield} label="FSSAI License" value={company?.fssai_license_no || "Not provided"} />
              <DetailTile
                icon={CalendarDays}
                label="Founded"
                value={
                  company?.created_at
                    ? new Date(company.created_at).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                      })
                    : "Not specified"
                }
              />
            </div>
          </SurfaceCard>
        </div>

        {/* RIGHT: About + actions */}
        <div className="grid gap-6 self-start">
          <SurfaceCard className="p-6">
            <SectionHeading
              eyebrow="About"
              title="Company overview"
              description="This description appears on every job listing and your public company page."
              action={
                <Link to="/edit-company-profile" state={{ companyData: company }}>
                  <Button type="button" variant="ghost" className="text-sm">
                    Edit
                  </Button>
                </Link>
              }
            />
            <div className="mt-5 rounded-xl border border-border-light/60 bg-white/50 p-5 dark:border-border-dark/60 dark:bg-white/5">
              {sanitizedDesc ? (
                <div
                  className="text-sm leading-7 text-text-main-light dark:text-text-main-dark/90"
                  dangerouslySetInnerHTML={{ __html: sanitizedDesc }}
                />
              ) : (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary dark:bg-primary/16">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
                    Add a company description to build candidate trust and improve listing quality.
                  </p>
                  <Link to="/edit-company-profile" state={{ companyData: company }}>
                    <Button type="button" variant="outline" className="mt-2">
                      Add description
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </SurfaceCard>

          <SurfaceCard className="bg-gradient-to-br from-primary via-ember-500 to-secondary p-6 text-primary-foreground dark:border-white/10">
            <p className="section-kicker text-primary-foreground/70">Hiring signal</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.05em]">
              A strong profile attracts stronger candidates.
            </h2>
            <p className="mt-4 text-sm leading-7 text-primary-foreground/80">
              Kitchens with complete profiles, verified licenses, and clear job briefs see up to 3× more qualified applicants.
            </p>
            <Button
              className="mt-6 w-full border-white/20 bg-white/15 text-white hover:bg-white/20"
              onClick={() => navigate("/post-job")}
              type="button"
              variant="outline"
            >
              Post a new role
            </Button>
          </SurfaceCard>
        </div>
      </div>
    </PageShell>
  );
};
