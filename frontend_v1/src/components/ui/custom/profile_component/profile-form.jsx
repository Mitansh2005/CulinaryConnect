import { getNames } from "country-list";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { getUid } from "@/firebase/authUtils";
import { getAuth } from "firebase/auth";
import apiClient from "@/api/apiClient";
import {
  PageShell,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import { CheckCircle, ArrowLeft } from "lucide-react";

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

export function ProfileForm() {
  const { userData, setUserData } = useUser();
  const uid = getUid();
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [status, setStatus] = useState(null); // null | "success" | "failed"
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    consent_box: false,
    location: { country: "", state: "", city: "", postal_code: "" },
    user_type: "chef",
    company: "",
    designation: "",
    speciality: "",
    experience_years: 0,
    job_type_preference: null,
    preferred_job_roles: null,
    job_search_status: null,
    relocate_confirmation: false,
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiClient.get(`/profile-detail/${uid}/`);
        const data = res.data;
        if (data.location == null) data.location = {};
        setSelectedCountry(data.location?.country || "");
        setFormData({
          username: data.username || "",
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          phone_number: data.phone_number || "",
          location: {
            country: data.location?.country || "",
            state: data.location?.state || "",
            city: data.location?.city || "",
            postal_code: data.location?.postal_code || "",
          },
          bio: data.bio || "",
          consent_box: data.consent_box || false,
          user_type: data.user_type || "chef",
          company: data.company || "",
          designation: data.designation || "",
          speciality: data.speciality || "",
          experience_years: data.experience_years || 0,
          job_type_preference: data.job_type_preference || null,
          preferred_job_roles: data.preferred_job_roles || null,
          job_search_status: data.job_search_status || null,
          relocate_confirmation: data.relocate_confirmation || false,
        });
      } catch (err) {
        console.error("Error fetching profile form data:", err);
      }
    };
    if (uid) fetch();
  }, [uid]);

  const saveUserData = (data) => {
    setUserData(data);
    localStorage.setItem("userData", JSON.stringify(data));
  };

  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);
    setFormData((prev) => ({ ...prev, location: { ...prev.location, country: countryName } }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.indexOf("location.") === 0) {
      const locationField = name.split(".")[1];
      setFormData((prev) => ({ ...prev, location: { ...prev.location, [locationField]: value } }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  const checkAndSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const res = await apiClient.get(`/profile-detail/${uid}/`, { validateStatus: () => true });
      if (res.status === 200) {
        await updateProfile(formData);
      } else if (res.status === 404) {
        await createProfile(formData);
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  };

  const createProfile = async (data) => {
    try {
      const auth = getAuth();
      const email = auth.currentUser?.email;
      const payload = { ...data, uid, email };
      const res = await apiClient.post(`/profile/`, payload, { validateStatus: () => true });
      if (res.status === 200 || res.status === 201) {
        saveUserData(res.data);
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  };

  const updateProfile = async (data) => {
    try {
      const res = await apiClient.patch(`/profile-detail/${uid}/`, data, { validateStatus: () => true });
      if (res.status >= 200 && res.status < 300) {
        saveUserData(res.data);
        setStatus("success");
      } else {
        setStatus("failed");
      }
    } catch {
      setStatus("failed");
    }
  };

  if (status === "success") {
    return (
      <PageShell eyebrow="Profile" title="Details updated">
        <SurfaceCard className="flex flex-col items-center gap-5 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-50 text-forest-600 dark:bg-forest-500/12 dark:text-forest-200">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-text-main-light dark:text-text-main-dark">
              Contact details saved
            </h2>
            <p className="mt-2 text-sm text-text-sub-light dark:text-text-sub-dark">
              Your profile information has been updated successfully.
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate("/profile")} type="button">
              View profile
            </Button>
          </div>
        </SurfaceCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Profile"
      title="Contact information"
      description="Complete your profile to improve matching quality and recruiter trust."
      actions={
        <Button onClick={() => navigate("/profile")} type="button" variant="outline">
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

      <form onSubmit={checkAndSubmitForm} className="grid gap-6">
        <SurfaceCard className="p-6 sm:p-7">
          <SectionHeading eyebrow="Personal" title="Basic details" />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <SoftInput id="username" name="username" placeholder="Enter your username" value={formData.username} onChange={handleChange} />
            </div>
            <div>
              <FieldLabel htmlFor="first_name">First name</FieldLabel>
              <SoftInput id="first_name" name="first_name" placeholder="First name" value={formData.first_name} onChange={handleChange} />
            </div>
            <div>
              <FieldLabel htmlFor="last_name">Last name</FieldLabel>
              <SoftInput id="last_name" name="last_name" placeholder="Last name" value={formData.last_name} onChange={handleChange} />
            </div>
            <div>
              <FieldLabel htmlFor="phone_number">Phone number</FieldLabel>
              <SoftInput id="phone_number" name="phone_number" placeholder="Phone number" value={formData.phone_number} onChange={handleChange} />
            </div>
            <div className="sm:col-span-2 flex items-center gap-3 pt-1">
              <input
                type="checkbox"
                id="consent_box"
                name="consent_box"
                checked={formData.consent_box}
                onChange={handleChange}
                className="h-4 w-4 rounded border-stone-300 accent-primary"
                required
              />
              <label htmlFor="consent_box" className="text-sm text-text-sub-light dark:text-text-sub-dark">
                Allow phone number to be visible on your public profile
              </label>
            </div>
          </div>
        </SurfaceCard>

        {formData.user_type === "restaurant" && (
          <SurfaceCard className="p-6 sm:p-7">
            <SectionHeading eyebrow="Company" title="Restaurant details" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="company">Company name</FieldLabel>
                <SoftInput id="company" name="company" placeholder="Restaurant name" value={formData.company} onChange={handleChange} />
              </div>
              <div>
                <FieldLabel htmlFor="designation">Designation</FieldLabel>
                <SoftInput id="designation" name="designation" placeholder="e.g. Head Chef, Manager" value={formData.designation} onChange={handleChange} />
              </div>
            </div>
          </SurfaceCard>
        )}

        {formData.user_type === "chef" && (
          <SurfaceCard className="p-6 sm:p-7">
            <SectionHeading eyebrow="Professional" title="Chef details" />
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <FieldLabel htmlFor="speciality">Culinary specialty</FieldLabel>
                <SoftInput id="speciality" name="speciality" placeholder="e.g. French Cuisine, Pastry" value={formData.speciality} onChange={handleChange} />
              </div>
              <div>
                <FieldLabel htmlFor="experience_years">Years of experience</FieldLabel>
                <SoftInput id="experience_years" name="experience_years" type="number" min={0} value={formData.experience_years} onChange={handleChange} />
              </div>
              <div>
                <FieldLabel htmlFor="preferred_job_roles">Preferred roles</FieldLabel>
                <SoftInput id="preferred_job_roles" name="preferred_job_roles" placeholder="e.g. Sous Chef, Line Cook" value={formData.preferred_job_roles || ""} onChange={handleChange} />
              </div>
              <div>
                <FieldLabel htmlFor="job_search_status">Job search status</FieldLabel>
                <SoftSelect id="job_search_status" name="job_search_status" value={formData.job_search_status || ""} onChange={handleChange}>
                  <option value="" disabled>Select status</option>
                  <option value="available">Available to start</option>
                  <option value="looking">Just looking</option>
                  <option value="not_looking">Not looking</option>
                </SoftSelect>
              </div>
              <div>
                <FieldLabel htmlFor="job_type_preference">Job type preference</FieldLabel>
                <SoftSelect id="job_type_preference" name="job_type_preference" value={formData.job_type_preference || ""} onChange={handleChange}>
                  <option value="">Select type</option>
                  <option value="Full Time">Full-Time</option>
                  <option value="Part Time">Part-Time</option>
                </SoftSelect>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <input
                  type="checkbox"
                  id="relocate_confirmation"
                  name="relocate_confirmation"
                  checked={formData.relocate_confirmation}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-stone-300 accent-primary"
                />
                <label htmlFor="relocate_confirmation" className="text-sm text-text-sub-light dark:text-text-sub-dark">
                  I am willing to relocate
                </label>
              </div>
            </div>
          </SurfaceCard>
        )}

        <SurfaceCard className="p-6 sm:p-7">
          <SectionHeading eyebrow="Location" title="Where are you based?" description="Helps match you with nearby opportunities." />
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel htmlFor="country">Country</FieldLabel>
              <SoftSelect id="country" name="location.country" value={selectedCountry} onChange={handleCountryChange}>
                <option value="" disabled>Select a country</option>
                {getNames().map((c) => <option key={c} value={c}>{c}</option>)}
              </SoftSelect>
            </div>
            <div>
              <FieldLabel htmlFor="location.state">State</FieldLabel>
              <SoftInput id="location.state" name="location.state" value={formData.location.state} onChange={handleChange} />
            </div>
            <div>
              <FieldLabel htmlFor="location.city">City</FieldLabel>
              <SoftInput id="location.city" name="location.city" value={formData.location.city} onChange={handleChange} />
            </div>
            <div>
              <FieldLabel htmlFor="location.postal_code">Postal code</FieldLabel>
              <SoftInput id="location.postal_code" name="location.postal_code" value={formData.location.postal_code} onChange={handleChange} />
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="flex items-center justify-between gap-4 p-4 sm:p-5">
          <p className="text-sm text-text-sub-light dark:text-text-sub-dark">
            Your changes are saved to your public profile immediately.
          </p>
          <div className="flex gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/profile")}>
              Cancel
            </Button>
            <Button type="submit">Save details</Button>
          </div>
        </SurfaceCard>
      </form>
    </PageShell>
  );
}
