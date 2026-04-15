import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUid } from "@/firebase/authUtils";
import { baseUrl } from "@/constants/constants";
import DOMpurify from "dompurify";
import ReactQuill from "react-quill";
import { Button } from "@/components/ui/button";
import { getSafeUserData } from "@/utils/localStorage";
import { useProfile, useUpdateProfile } from "@/api/home-data";
import {
  PageShell,
  SectionHeading,
  StatusPill,
  SurfaceCard,
  Avatar,
  getInitials,
} from "@/components/ui/custom/enterprise-shell";
import ProfilePictureUploader from "@/components/ui/custom/profile_component/profile_picture_uploader";
import defaultPic from "../assets/icons/profile.png";
import {
  Bookmark,
  Pencil,
  ChevronRight,
  User,
  MapPin,
  Phone,
  Trophy,
} from "lucide-react";

const sanitizedHtml = (html) =>
  DOMpurify.sanitize(html, { ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"] });

export function ProfileTemplate() {
  const savedUserdata = getSafeUserData();
  const bio = savedUserdata?.bio;
  const username = savedUserdata?.username;
  const userType = savedUserdata?.user_type;
  const uid = getUid();
  const navigate = useNavigate();

  const { data: profileData } = useProfile(uid);
  const { mutate: updateProfile } = useUpdateProfile(uid);

  const [qualifications, setQualifications] = useState("");
  const [showQualEditor, setShowQualEditor] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null | "saving" | "done"

  useEffect(() => {
    if (profileData?.achievements) {
      setQualifications(profileData.achievements);
    }
  }, [profileData]);

  const handleSaveQualifications = () => {
    setSaveStatus("saving");
    updateProfile(
      { achievements: qualifications },
      {
        onSuccess: () => {
          setSaveStatus("done");
          setTimeout(() => {
            setSaveStatus(null);
            setShowQualEditor(false);
          }, 1200);
        },
        onError: () => setSaveStatus(null),
      },
    );
  };

  const profile = profileData || savedUserdata || {};
  const fullName = [profile.first_name, profile.last_name].filter(Boolean).join(" ") || username;
  const location = profile.location;
  const locationStr = [location?.city, location?.state, location?.country].filter(Boolean).join(", ");
  const experienceYears = profile.job_seeker?.experience_years ?? profile.experience_years;
  const speciality = profile.job_seeker?.speciality ?? profile.speciality;

  return (
    <PageShell
      eyebrow="Chef workspace"
      title="Your profile"
      description="Review your public identity and update your details to improve recruiter trust."
      actions={
        <Button onClick={() => navigate("/edit-profile")} type="button">
          <Pencil className="mr-2 h-4 w-4" />
          Edit profile
        </Button>
      }
    >
      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        {/* LEFT: Identity panel */}
        <div className="grid gap-4 self-start">
          <SurfaceCard className="flex flex-col items-center gap-4 p-6 text-center">
            <ProfilePictureUploader
              id={uid}
              username={username}
              defaultImage={defaultPic}
              getProfileUrl={`${baseUrl}/profile-detail`}
              uploadUrl={`${baseUrl}/upload/`}
            />
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-text-main-light dark:text-text-main-dark">
                {fullName || "Chef"}
              </h2>
              {speciality && (
                <p className="mt-1 text-sm font-medium text-text-sub-light dark:text-text-sub-dark">
                  {speciality}
                </p>
              )}
              {experienceYears ? (
                <StatusPill tone="info" className="mt-3">
                  {experienceYears} yrs experience
                </StatusPill>
              ) : null}
            </div>

            <div className="w-full border-t border-border-light/60 pt-4 dark:border-border-dark/60 space-y-2.5 text-left">
              {locationStr && (
                <div className="flex items-center gap-2 text-sm text-text-sub-light dark:text-text-sub-dark">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" />
                  <span>{locationStr}</span>
                </div>
              )}
              {profile.phone_number && (
                <div className="flex items-center gap-2 text-sm text-text-sub-light dark:text-text-sub-dark">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  <span>{profile.phone_number}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-2 text-sm text-text-sub-light dark:text-text-sub-dark">
                  <User className="h-4 w-4 shrink-0 text-primary" />
                  <span className="truncate">{profile.email}</span>
                </div>
              )}
            </div>
          </SurfaceCard>

          {/* Quick actions */}
          <SurfaceCard className="p-4">
            <p className="section-kicker mb-3">Quick links</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => navigate("/contact_form")}
                className="flex items-center justify-between rounded-xl border border-white/70 bg-white/60 px-4 py-3 text-sm font-medium text-text-main-light transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-text-main-dark"
              >
                <span>Contact details</span>
                <ChevronRight className="h-4 w-4 text-text-sub-light" />
              </button>
              {userType === "chef" && (
                <>
                  <button
                    onClick={() => setShowQualEditor(true)}
                    className="flex items-center justify-between rounded-xl border border-white/70 bg-white/60 px-4 py-3 text-sm font-medium text-text-main-light transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-text-main-dark"
                  >
                    <span>Qualifications</span>
                    <ChevronRight className="h-4 w-4 text-text-sub-light" />
                  </button>
                  <button
                    onClick={() => navigate("/liked-jobs")}
                    className="flex items-center justify-between rounded-xl border border-white/70 bg-white/60 px-4 py-3 text-sm font-medium text-text-main-light transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-text-main-dark"
                  >
                    <span>Saved jobs</span>
                    <Bookmark className="h-4 w-4 text-text-sub-light" />
                  </button>
                </>
              )}
            </div>
          </SurfaceCard>
        </div>

        {/* RIGHT: Content */}
        <div className="grid gap-6 self-start">
          {/* Bio */}
          <SurfaceCard className="p-6">
            <SectionHeading
              eyebrow="About"
              title="Professional bio"
              description="This appears prominently on your profile and in recruiter search."
              action={
                <Button
                  onClick={() => navigate("/bio")}
                  type="button"
                  variant="ghost"
                  className="text-sm"
                >
                  Edit bio
                </Button>
              }
            />
            <div className="mt-5 rounded-xl border border-border-light/60 bg-white/50 p-4 dark:border-border-dark/60 dark:bg-white/5">
              {bio ? (
                <p
                  className="text-sm leading-7 text-text-main-light dark:text-text-main-dark/90"
                  dangerouslySetInnerHTML={{ __html: sanitizedHtml(bio) }}
                />
              ) : (
                <p className="text-sm italic text-text-sub-light dark:text-text-sub-dark">
                  No bio yet — tell recruiters about your culinary journey.
                </p>
              )}
            </div>
          </SurfaceCard>

          {/* Qualifications (chef only) */}
          {userType === "chef" && (
            <SurfaceCard className="p-6">
              <SectionHeading
                eyebrow="Credentials"
                title="Qualifications & achievements"
                description="Highlights of your culinary training, certifications, and standout accomplishments."
                action={
                  !showQualEditor && (
                    <Button
                      onClick={() => setShowQualEditor(true)}
                      type="button"
                      variant="ghost"
                      className="text-sm"
                    >
                      Edit
                    </Button>
                  )
                }
              />

              {showQualEditor ? (
                <div className="mt-5">
                  <ReactQuill
                    value={qualifications}
                    onChange={setQualifications}
                    placeholder="Describe your certifications, awards, and training..."
                    className="rounded-xl border border-border-light/60 dark:border-border-dark/60"
                  />
                  <div className="mt-4 flex gap-3 justify-end">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowQualEditor(false)}
                      disabled={saveStatus === "saving"}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveQualifications}
                      disabled={saveStatus === "saving"}
                    >
                      {saveStatus === "saving"
                        ? "Saving..."
                        : saveStatus === "done"
                          ? "Saved ✓"
                          : "Save qualifications"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-xl border border-border-light/60 bg-white/50 p-4 dark:border-border-dark/60 dark:bg-white/5">
                  {qualifications ? (
                    <div
                      className="text-sm leading-7 text-text-main-light dark:text-text-main-dark/90"
                      dangerouslySetInnerHTML={{ __html: sanitizedHtml(qualifications) }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-3 py-8 text-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary dark:bg-primary/16">
                        <Trophy className="h-5 w-5" />
                      </div>
                      <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
                        Add your qualifications to build recruiter trust.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </SurfaceCard>
          )}
        </div>
      </div>
    </PageShell>
  );
}
