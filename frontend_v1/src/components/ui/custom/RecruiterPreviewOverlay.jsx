/* eslint-disable react/prop-types */
import { useRef } from "react";
import DOMPurify from "dompurify";
import { useCulinaryPageMotion } from "@/components/hooks/useCulinaryMotion";

export function RecruiterPreviewOverlay({ profile, onClose }) {
  const scopeRef = useRef(null);

  useCulinaryPageMotion({
    scopeRef,
    dependencies: [Boolean(profile?.uid || profile?.user?.uid)],
  });

  if (!profile) return null;

  const sanitizeHtml = (html) => {
    if (!html) return "";
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br", "ul", "ol", "li"],
    });
  };

  const profilePicture = profile.profile_picture?.startsWith("http")
    ? profile.profile_picture
    : profile.profile_picture
      ? `data:image/jpeg;base64,${profile.profile_picture}`
      : null;

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Chef";
  const position = profile.job_seeker?.speciality || "Culinary Professional";
  const location = profile.location
    ? `${profile.location.city || ""}${profile.location.city && profile.location.state ? ", " : ""}${profile.location.state || ""}`
    : "Location not specified";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        ref={scopeRef}
        className="cc-reveal relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Recruiter Preview
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This is how recruiters see your profile
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="cc-scroll-in flex flex-col sm:flex-row gap-6 items-start">
            <div className="h-32 w-32 shrink-0 overflow-hidden rounded-xl border-4 border-gray-100 bg-gray-100 shadow-md dark:border-gray-700 dark:bg-gray-700">
              {profilePicture ? (
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{ backgroundImage: `url(${profilePicture})` }}
                ></div>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-500">
                    person
                  </span>
                </div>
              )}
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
                  {fullName}
                </h3>
                <p className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  {position}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {profile.job_seeker?.experience_years && (
                  <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 dark:bg-blue-900/20">
                    <span className="material-symbols-outlined text-[16px] text-blue-600 dark:text-blue-400">
                      history
                    </span>
                    <span className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                      {profile.job_seeker.experience_years} Years Experience
                    </span>
                  </div>
                )}
                <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-1.5 dark:bg-red-900/20">
                  <span className="material-symbols-outlined text-[16px] text-red-600 dark:text-red-400">
                    location_on
                  </span>
                  <span className="text-sm font-semibold text-red-900 dark:text-red-300">
                    {location}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                {profile.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-[18px]">
                      mail
                    </span>
                    <span>{profile.email}</span>
                  </div>
                )}
                {profile.phone_number && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="material-symbols-outlined text-[18px]">
                      call
                    </span>
                    <span>{profile.phone_number}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="cc-scroll-in rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
            <h4 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
              Professional Bio
            </h4>
            {profile.bio ? (
              <div
                className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400"
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(profile.bio) }}
              ></div>
            ) : (
              <p className="text-gray-500 dark:text-gray-500">
                No bio provided.
              </p>
            )}
          </div>

          {profile.job_seeker?.preferred_job_roles && (
            <div className="cc-scroll-in rounded-xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/50">
              <h4 className="mb-3 text-lg font-bold text-gray-900 dark:text-white">
                Preferred Roles
              </h4>
              <p className="text-gray-700 dark:text-gray-300">
                {profile.job_seeker.preferred_job_roles}
              </p>
            </div>
          )}

          <div className="cc-scroll-in rounded-xl border-2 border-dashed border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-900/20">
            <div className="flex items-start gap-3">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400">
                visibility
              </span>
              <div>
                <h5 className="font-semibold text-green-900 dark:text-green-300">
                  Preview Mode Active
                </h5>
                <p className="mt-1 text-sm text-green-700 dark:text-green-400">
                  This is a read-only view of your profile as seen by
                  recruiters. Contact information is visible to help recruiters
                  reach out to qualified candidates.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-gray-700">
            <button
              onClick={onClose}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-gray-900 shadow-sm transition hover:bg-opacity-90"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
