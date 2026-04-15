import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getNames } from "country-list";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
import { getFreshIdToken } from "@/firebase/authUtils";
import apiClient from "@/api/apiClient";
import { Button } from "@/components/ui/button";
import {
  PageShell,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { ArrowLeft, CheckCircle } from "lucide-react";

const companySizeChoices = {
  small: "1–50 employees",
  medium: "51–250 employees",
  large: "251–1,000 employees",
  enterprise: "1,000+ employees",
};

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

function SoftSelect({ id, name, value, onChange, children }) {
  return (
    <select id={id} name={name} value={value} onChange={onChange} className="soft-input mt-1.5">
      {children}
    </select>
  );
}

export const CompanyProfileForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const companyId = location.state?.companyData?.id || "";

  const [status, setStatus] = useState(null); // null | "saving" | "success" | "failed"
  const [selectedCountry, setSelectedCountry] = useState("");
  const [form, setForm] = useState({
    name: "",
    location: { country: "", state: "", city: "", postal_code: "" },
    size: "",
    description: "",
  });

  useEffect(() => {
    if (location.state?.companyData) {
      const cd = location.state.companyData;
      setForm({
        name: cd.name || "",
        location: {
          country: cd.location?.country || "",
          state: cd.location?.state || "",
          city: cd.location?.city || "",
          postal_code: cd.location?.postal_code || "",
        },
        size: cd.size || "",
        description: cd.description || "",
      });
      setSelectedCountry(cd.location?.country || "");
    }
  }, [location.state]);

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    setForm((prev) => ({ ...prev, location: { ...prev.location, country: countryName } }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("location.")) {
      const field = name.split(".")[1];
      setForm((prev) => ({ ...prev, location: { ...prev.location, [field]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("saving");
    try {
      await apiClient.patch(`/company/${companyId}/`, form);
      setStatus("success");
    } catch (err) {
      console.error("Error updating company profile:", err);
      setStatus("failed");
    }
  };

  if (status === "success") {
    return (
      <PageShell eyebrow="Restaurant" title="Profile updated">
        <SurfaceCard className="flex flex-col items-center gap-5 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-50 text-forest-600 dark:bg-forest-500/12 dark:text-forest-200">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-text-main-light dark:text-text-main-dark">
              Company profile saved
            </h2>
            <p className="mt-2 text-sm text-text-sub-light dark:text-text-sub-dark">
              Your updates are now visible to candidates browsing your listings.
            </p>
          </div>
          <Button onClick={() => navigate("/company-profile")} type="button">
            View company profile
          </Button>
        </SurfaceCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Restaurant"
      title="Edit company profile"
      description="Keep your company details accurate so candidates know exactly what to expect."
      actions={
        <Button
          onClick={() => navigate("/company-profile")}
          type="button"
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to profile
        </Button>
      }
    >
      {status === "failed" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
            Something went wrong. Please try again.
          </p>
        </div>
      )}

      <form id="company-profile-form" onSubmit={handleSubmit} className="grid gap-6">
        {/* Basic info */}
        <SurfaceCard className="p-6 sm:p-7">
          <SectionHeading
            eyebrow="Company details"
            title="Basic information"
            description="This information appears on your company page and every job listing."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="name">Company name</FieldLabel>
              <SoftInput
                id="name"
                name="name"
                placeholder="e.g. The Grand Kitchen"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="size">Company size</FieldLabel>
              <SoftSelect id="size" name="size" value={form.size} onChange={handleChange}>
                <option value="" disabled>Select company size</option>
                {Object.entries(companySizeChoices).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </SoftSelect>
            </div>
          </div>
        </SurfaceCard>

        {/* Description */}
        <SurfaceCard className="p-6 sm:p-7">
          <SectionHeading
            eyebrow="Brand"
            title="Company description"
            description="Tell candidates about your kitchen culture, values, and what makes your team unique."
          />
          <div className="mt-5">
            <ReactQuill
              value={form.description}
              onChange={(value) => setForm((prev) => ({ ...prev, description: value }))}
              placeholder="Write a brief, honest description of your restaurant and working environment..."
              className="rounded-xl border border-border-light/60 dark:border-border-dark/60"
              required
            />
          </div>
        </SurfaceCard>

        {/* Location */}
        <SurfaceCard className="p-6 sm:p-7">
          <SectionHeading
            eyebrow="Location"
            title="Where is your restaurant based?"
            description="Accurate location data improves matching with nearby candidates."
          />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <SoftSelect
                id="country"
                name="location.country"
                value={selectedCountry}
                onChange={handleCountryChange}
              >
                <option value="" disabled>Select a country</option>
                {getNames().map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </SoftSelect>
            </div>
            <div>
              <FieldLabel htmlFor="location.state">State / Province</FieldLabel>
              <SoftInput
                id="location.state"
                name="location.state"
                value={form.location.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <FieldLabel htmlFor="location.city">City</FieldLabel>
              <SoftInput
                id="location.city"
                name="location.city"
                value={form.location.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <FieldLabel htmlFor="location.postal_code">Postal code</FieldLabel>
              <SoftInput
                id="location.postal_code"
                name="location.postal_code"
                value={form.location.postal_code}
                onChange={handleChange}
              />
            </div>
          </div>
        </SurfaceCard>

        {/* Footer save bar */}
        <SurfaceCard className="flex items-center justify-between gap-4 p-4 sm:p-5">
          <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
            Changes are reflected on your company page immediately.
          </p>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/company-profile")}
              disabled={status === "saving"}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={status === "saving"}>
              {status === "saving" ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </SurfaceCard>
      </form>
    </PageShell>
  );
};
