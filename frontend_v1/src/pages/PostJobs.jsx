import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getNames } from "country-list";
import { RichTextEditor } from "@/components/ui/custom/RichTextEditor";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRecruiters, usePostJob } from "@/api/home-data";
import { Button } from "@/components/ui/button";
import { CustomSelect } from "@/components/ui/custom/CustomSelect";
import {
  PageShell,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { useCulinaryPageMotion } from "@/components/hooks/useCulinaryMotion";

function FieldLabel({ htmlFor, children, required }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-sm font-semibold text-text-main-light dark:text-text-main-dark"
    >
      {children}
      {required && <span className="ml-1 text-rose-500">*</span>}
    </label>
  );
}

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

export default function PostJobForm() {
  const scopeRef = useRef(null);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    assignee: "",
    title: "",
    description: "",
    location: { country: "", state: "", city: "", postal_code: "" },
    salary: "",
    employment_type: "Full Time",
    posted_date: new Date().toISOString().split("T")[0],
    application_deadline: "",
    requirements: "",
  });

  const { data: recruiters = [] } = useRecruiters();
  const { mutate: postJob, isPending } = usePostJob();
  const company = recruiters[0]?.company ?? "";

  useCulinaryPageMotion({ scopeRef, dependencies: [submitted] });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({ ...prev, location: { ...prev.location, [field]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    postJob(
      { ...formData, company },
      {
        onSuccess: () => setSubmitted(true),
      },
    );
  };

  if (submitted) {
    return (
      <div ref={scopeRef}>
        <PageShell
          headerClassName="cc-reveal"
          eyebrow="Role published"
          title="Job posted successfully"
          description="Your role is now live and visible to candidates on the platform."
        >
          <SurfaceCard className="cc-scroll-in flex flex-col items-center gap-5 py-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-50 text-forest-600 dark:bg-forest-500/12 dark:text-forest-200">
              <CheckCircle className="h-8 w-8" />
            </div>
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-text-main-light dark:text-text-main-dark">
                {formData.title || "Job"} is live
              </h2>
              <p className="mt-2 text-sm text-text-sub-light dark:text-text-sub-dark">
                Candidates can now discover and apply for this role.
              </p>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => navigate("/jobs/manage")}>
                Manage roles
              </Button>
              <Button type="button" onClick={() => navigate("/home")}>
                Back to dashboard
              </Button>
            </div>
          </SurfaceCard>
        </PageShell>
      </div>
    );
  }

  return (
    <div ref={scopeRef}>
      <PageShell
        headerClassName="cc-reveal"
        eyebrow="Recruiter studio"
        title="Post a new role"
        description="Create a clear, accurate brief to attract the right culinary talent."
        actions={
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/home")}>
              Cancel
            </Button>
            <Button
              type="submit"
              form="post-job-form"
              disabled={isPending}
            >
              {isPending ? "Posting…" : "Publish role"}
            </Button>
          </div>
        }
      >
        <form id="post-job-form" onSubmit={handleSubmit} className="grid gap-6">
        {/* Basic info */}
        <SurfaceCard className="cc-scroll-in p-6 sm:p-7">
          <SectionHeading
            eyebrow="Role details"
            title="Basic information"
            description="The essentials candidates see first in the job feed."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="title" required>Job title</FieldLabel>
              <SoftInput
                id="title"
                name="title"
                placeholder="e.g. Sous Chef, Pastry Lead"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor="salary" required>Monthly salary (₹)</FieldLabel>
              <SoftInput
                id="salary"
                name="salary"
                type="number"
                placeholder="e.g. 40000"
                value={formData.salary}
                onChange={handleChange}
                min={0}
                max={1000000}
                step={1000}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor="employment_type">Employment type</FieldLabel>
              <CustomSelect
                id="employment_type"
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                options={[
                  { value: "Full Time", label: "Full Time" },
                  { value: "Part Time", label: "Part Time" },
                  { value: "Contract", label: "Contract" },
                  { value: "Temporary", label: "Temporary" },
                ]}
              />
            </div>
            <div>
              <FieldLabel htmlFor="application_deadline" required>Application deadline</FieldLabel>
              <SoftInput
                id="application_deadline"
                name="application_deadline"
                type="date"
                value={formData.application_deadline}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <FieldLabel htmlFor="assignee">Assign recruiter</FieldLabel>
              <CustomSelect
                id="assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                placeholder="Select a recruiter"
                options={recruiters.map((r) => ({ value: r.recruiter_id, label: r.username }))}
              />
            </div>
          </div>
        </SurfaceCard>

        {/* Description */}
        <SurfaceCard className="cc-scroll-in p-6 sm:p-7">
          <SectionHeading
            eyebrow="Content"
            title="Job description"
            description="Describe the role, the team, and what a great day looks like in this kitchen."
          />
          <div className="mt-5">
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
              placeholder="Write a clear, honest description of the position..."
            />
          </div>
        </SurfaceCard>

        {/* Requirements */}
        <SurfaceCard className="cc-scroll-in p-6 sm:p-7">
          <SectionHeading
            eyebrow="Requirements"
            title="Candidate requirements"
            description="Be specific — better briefs attract candidates who are actually a fit."
          />
          <div className="mt-5">
            <RichTextEditor
              value={formData.requirements}
              onChange={(value) => setFormData((prev) => ({ ...prev, requirements: value }))}
              placeholder="e.g. 3+ years experience, Le Cordon Bleu diploma, FSSAI Food Handler certification..."
            />
          </div>
        </SurfaceCard>

        {/* Location */}
        <SurfaceCard className="cc-scroll-in p-6 sm:p-7">
          <SectionHeading
            eyebrow="Location"
            title="Where is this role based?"
            description="Accurate location data improves matching with nearby candidates."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="location.country">Country</FieldLabel>
              <CustomSelect
                id="location.country"
                name="location.country"
                value={formData.location.country}
                onChange={handleChange}
                placeholder="Select a country"
                options={getNames().map((c) => ({ value: c, label: c }))}
              />
            </div>
            <div>
              <FieldLabel htmlFor="location.state">State / Province</FieldLabel>
              <SoftInput id="location.state" name="location.state" value={formData.location.state} onChange={handleChange} />
            </div>
            <div>
              <FieldLabel htmlFor="location.city">City</FieldLabel>
              <SoftInput id="location.city" name="location.city" value={formData.location.city} onChange={handleChange} />
            </div>
            <div>
              <FieldLabel htmlFor="location.postal_code">Pincode</FieldLabel>
              <SoftInput id="location.postal_code" name="location.postal_code" value={formData.location.postal_code} onChange={handleChange} />
            </div>
          </div>
        </SurfaceCard>

        {/* Footer */}
        <SurfaceCard className="cc-scroll-in flex items-center justify-between gap-4 p-4 sm:p-5">
          <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
            The role will be live immediately after publishing.
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/home")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex items-center gap-2">
              {isPending ? <><Loader2 className="h-4 w-4 animate-spin" />Posting…</> : "Publish role"}
            </Button>
          </div>
        </SurfaceCard>
      </form>
    </PageShell>
    </div>
  );
}
