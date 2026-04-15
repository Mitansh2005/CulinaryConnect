import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile, useUpdateProfile } from "@/api/home-data";
import { getUid } from "@/firebase/authUtils";
import { getNames } from "country-list";
import { RichTextEditor } from "@/components/ui/custom/RichTextEditor";
import { ExperienceTimelineEditor } from "@/components/ui/custom/ExperienceTimelineEditor";
import { Button } from "@/components/ui/button";
import {
  PageShell,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { JobCardSkeleton } from "@/components/ui/custom/skeletons/Skeletons";

// Reusable field label
function FieldLabel({ htmlFor, children }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark"
    >
      {children}
    </label>
  );
}

// Reusable text input styled for the new design system
function SoftInput({ id, name, type = "text", value, onChange, placeholder, ...props }) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="soft-input mt-1.5"
      {...props}
    />
  );
}

// Reusable select styled for the new design system
function SoftSelect({ id, name, value, onChange, children, ...props }) {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="soft-input mt-1.5"
      {...props}
    >
      {children}
    </select>
  );
}

// Section wrapper (replaces old border-gray-200 p-6 dark:border-gray-700 dividers)
function FormSection({ title, description, children }) {
  return (
    <SurfaceCard className="p-6 sm:p-7">
      <SectionHeading title={title} description={description} />
      <div className="mt-6">{children}</div>
    </SurfaceCard>
  );
}

export function ProfileEdit() {
  const navigate = useNavigate();
  const uid = getUid();
  const { data: initialProfile, isLoading: profileLoading } = useProfile(uid);
  const { mutateAsync: updateProfile } = useUpdateProfile(uid);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    phone_privacy: false,
    bio: "",
    experiences: [],
    speciality: "",
    experience_years: "",
    preferred_job_roles: "",
    job_search_status: "looking",
    job_type_full_time: false,
    job_type_part_time: false,
    job_type_contract: false,
    job_type_temporary: false,
    location: { country: "", city: "", state: "", postal_code: "" },
    relocate_confirmation: false,
  });

  useEffect(() => {
    if (initialProfile) {
      const jobTypePreference = initialProfile.job_seeker?.job_type_preference || "";
      setFormData({
        username: initialProfile.username || "",
        first_name: initialProfile.first_name || "",
        last_name: initialProfile.last_name || "",
        phone_number: initialProfile.phone_number || "",
        phone_privacy: false,
        bio: initialProfile.bio || "",
        experiences: initialProfile.experiences || [],
        speciality: initialProfile.job_seeker?.speciality || "",
        experience_years: initialProfile.job_seeker?.experience_years || "",
        preferred_job_roles: initialProfile.job_seeker?.preferred_job_roles || "",
        job_search_status: initialProfile.job_seeker?.job_search_status || "looking",
        job_type_full_time: jobTypePreference.includes("Full Time"),
        job_type_part_time: jobTypePreference.includes("Part Time"),
        job_type_contract: false,
        job_type_temporary: false,
        location: {
          country: initialProfile.location?.country || "",
          city: initialProfile.location?.city || "",
          state: initialProfile.location?.state || "",
          postal_code: initialProfile.location?.postal_code || "",
        },
        relocate_confirmation: initialProfile.job_seeker?.relocate_confirmation || false,
      });
    }
  }, [initialProfile]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith("location.")) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        location: { ...prev.location, [locationField]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const jobTypes = [];
      if (formData.job_type_full_time) jobTypes.push("Full Time");
      if (formData.job_type_part_time) jobTypes.push("Part Time");
      if (formData.job_type_contract) jobTypes.push("Contract");
      if (formData.job_type_temporary) jobTypes.push("Temporary");

      await updateProfile({
        username: formData.username,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        bio: formData.bio,
        experiences: formData.experiences,
        location: formData.location,
        speciality: formData.speciality,
        experience_years: parseInt(formData.experience_years) || 0,
        preferred_job_roles: formData.preferred_job_roles,
        job_search_status: formData.job_search_status,
        job_type_preference: jobTypes.length > 0 ? jobTypes[0] : null,
        relocate_confirmation: formData.relocate_confirmation,
      });
      navigate("/profile");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <PageShell eyebrow="Profile" title="Loading your profile...">
        <div className="grid gap-4">
          <JobCardSkeleton />
          <JobCardSkeleton />
        </div>
      </PageShell>
    );
  }

  // Checkbox pill (job type + toggles)
  const CheckPill = ({ id, name, checked, label }) => (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition select-none ${
        checked
          ? "border-primary bg-primary/10 text-primary dark:border-primary dark:bg-primary/16 dark:text-primary"
          : "border-white/70 bg-white/70 text-text-sub-light dark:border-white/10 dark:bg-white/8 dark:text-text-sub-dark"
      }`}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={handleInputChange}
        className="sr-only"
      />
      {label}
    </label>
  );

  return (
    <PageShell
      eyebrow="Profile"
      title="Edit your profile"
      description="Update your personal information and professional details to get better job matches."
      actions={
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/profile")}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="profile-edit-form"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save changes"}
          </Button>
        </div>
      }
    >
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>
        </div>
      )}

      <form id="profile-edit-form" onSubmit={handleSubmit} className="grid gap-6">
        {/* Contact Information */}
        <FormSection
          title="Contact information"
          description="This information appears on your public profile."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <div className="relative mt-1.5 flex items-center rounded-2xl border border-stone-200 bg-stone-50/90 shadow-sm focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 dark:border-white/10 dark:bg-white/10">
                <span className="select-none pl-4 text-sm text-text-sub-light dark:text-text-sub-dark">
                  culinaryconnect.com/
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="chef_marc"
                  className="flex-1 bg-transparent py-3 pr-4 text-sm text-text-main-light outline-none dark:text-text-main-dark"
                />
              </div>
            </div>
            <div>
              <FieldLabel htmlFor="first_name">First name</FieldLabel>
              <SoftInput id="first_name" name="first_name" value={formData.first_name} onChange={handleInputChange} />
            </div>
            <div>
              <FieldLabel htmlFor="last_name">Last name</FieldLabel>
              <SoftInput id="last_name" name="last_name" value={formData.last_name} onChange={handleInputChange} />
            </div>
            <div>
              <FieldLabel htmlFor="phone_number">Phone number</FieldLabel>
              <SoftInput id="phone_number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleInputChange} />
            </div>
            <div className="flex items-end pb-1">
              <CheckPill
                id="phone_privacy"
                name="phone_privacy"
                checked={formData.phone_privacy}
                label="Hide number from public profile"
              />
            </div>
          </div>
        </FormSection>

        {/* Professional Details */}
        <FormSection
          title="Professional details"
          description="Showcase your expertise and what you're looking for."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel>Professional bio</FieldLabel>
              <p className="mb-2 mt-0.5 text-xs text-text-sub-light dark:text-text-sub-dark">
                Tell recruiters about your culinary journey, specialties, and what makes you unique.
              </p>
              <RichTextEditor
                value={formData.bio}
                onChange={(value) => setFormData((prev) => ({ ...prev, bio: value }))}
                placeholder="Share your culinary journey, signature dishes, cooking philosophy..."
              />
            </div>

            <div>
              <FieldLabel htmlFor="speciality">Culinary specialty</FieldLabel>
              <SoftInput
                id="speciality"
                name="speciality"
                value={formData.speciality}
                onChange={handleInputChange}
                placeholder="e.g. French Cuisine, Pastry, Sushi"
              />
            </div>
            <div>
              <FieldLabel htmlFor="experience_years">Years of experience</FieldLabel>
              <SoftInput
                id="experience_years"
                name="experience_years"
                type="number"
                min="0"
                value={formData.experience_years}
                onChange={handleInputChange}
              />
            </div>
            <div>
              <FieldLabel htmlFor="preferred_job_roles">Preferred job roles</FieldLabel>
              <SoftInput
                id="preferred_job_roles"
                name="preferred_job_roles"
                value={formData.preferred_job_roles}
                onChange={handleInputChange}
                placeholder="e.g. Head Chef, Sous Chef, Line Cook"
              />
              <p className="mt-1 text-xs text-text-sub-light dark:text-text-sub-dark">
                Separate multiple roles with commas.
              </p>
            </div>
            <div>
              <FieldLabel htmlFor="job_search_status">Job search status</FieldLabel>
              <SoftSelect
                id="job_search_status"
                name="job_search_status"
                value={formData.job_search_status}
                onChange={handleInputChange}
              >
                <option value="available">Actively looking</option>
                <option value="looking">Open to offers</option>
                <option value="not_looking">Not looking</option>
              </SoftSelect>
            </div>
            <div className="sm:col-span-2">
              <FieldLabel>Job type preference</FieldLabel>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <CheckPill id="job_type_full_time" name="job_type_full_time" checked={formData.job_type_full_time} label="Full-time" />
                <CheckPill id="job_type_part_time" name="job_type_part_time" checked={formData.job_type_part_time} label="Part-time" />
                <CheckPill id="job_type_contract" name="job_type_contract" checked={formData.job_type_contract} label="Contract" />
                <CheckPill id="job_type_temporary" name="job_type_temporary" checked={formData.job_type_temporary} label="Temporary" />
              </div>
            </div>
          </div>
        </FormSection>

        {/* Work Experience */}
        <FormSection
          title="Work experience"
          description="Add your culinary work history to showcase your career progression."
        >
          <ExperienceTimelineEditor
            experiences={formData.experiences}
            onChange={(experiences) =>
              setFormData((prev) => ({ ...prev, experiences }))
            }
          />
        </FormSection>

        {/* Location */}
        <FormSection
          title="Location"
          description="Where are you currently based?"
        >
          <div className="grid gap-5 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <FieldLabel htmlFor="location.country">Country</FieldLabel>
              <SoftSelect
                id="location.country"
                name="location.country"
                value={formData.location.country}
                onChange={handleInputChange}
              >
                <option value="">Select a country</option>
                {getNames().map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </SoftSelect>
            </div>
            <div className="flex items-end sm:col-span-3">
              <CheckPill
                id="relocate_confirmation"
                name="relocate_confirmation"
                checked={formData.relocate_confirmation}
                label="Willing to relocate"
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="location.city">City</FieldLabel>
              <SoftInput id="location.city" name="location.city" value={formData.location.city} onChange={handleInputChange} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="location.state">State / Province</FieldLabel>
              <SoftInput id="location.state" name="location.state" value={formData.location.state} onChange={handleInputChange} />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="location.postal_code">ZIP / Postal code</FieldLabel>
              <SoftInput id="location.postal_code" name="location.postal_code" value={formData.location.postal_code} onChange={handleInputChange} />
            </div>
          </div>
        </FormSection>

        {/* Sticky footer save bar */}
        <SurfaceCard className="flex items-center justify-between gap-4 p-4 sm:p-5">
          <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
            Changes are saved to your recruiter-facing profile immediately.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/profile")}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </SurfaceCard>
      </form>
    </PageShell>
  );
}
