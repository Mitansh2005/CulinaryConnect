import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/api/home-data";
import { getUid, getFreshIdToken } from "@/firebase/authUtils";
import Spinner from "@/components/ui/custom/spinner";
import axios from "axios";
import { baseUrl } from "@/constants/constants";
import { getNames } from "country-list";
import { RichTextEditor } from "@/components/ui/custom/RichTextEditor";
import { ExperienceTimelineEditor } from "@/components/ui/custom/ExperienceTimelineEditor";

export function ProfileEdit() {
  const navigate = useNavigate();
  const uid = getUid();
  const { profile: initialProfile, loading: profileLoading } = useProfile(uid);
  
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
    location: {
      country: "",
      city: "",
      state: "",
      postal_code: "",
    },
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
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [locationField]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const token = await getFreshIdToken(true);
      
      const jobTypes = [];
      if (formData.job_type_full_time) jobTypes.push("Full Time");
      if (formData.job_type_part_time) jobTypes.push("Part Time");
      if (formData.job_type_contract) jobTypes.push("Contract");
      if (formData.job_type_temporary) jobTypes.push("Temporary");
      
      const payload = {
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
      };

      const response = await axios.patch(
        `${baseUrl}/profile-detail/${uid}/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status >= 200 && response.status < 300) {
        navigate("/profile");
      } else {
        setError("Failed to update profile. Please try again.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <main className="flex min-w-0 flex-1 flex-col gap-8 p-4 sm:px-6 lg:px-8 lg:py-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            Edit Profile
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Update your personal information and professional details to get better job matches.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="profile-edit-form"
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-gray-900 shadow-sm transition hover:bg-opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-900/20">
          <p className="text-sm text-red-800 dark:text-red-300">{error}</p>
        </div>
      )}

      <form
        id="profile-edit-form"
        onSubmit={handleSubmit}
        className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800"
      >
        <div className="border-b border-gray-200 p-6 dark:border-gray-700 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Contact Information</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            This information will be displayed on your public profile.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="username">
                Username
              </label>
              <div className="mt-2 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary dark:ring-gray-700">
                <span className="flex select-none items-center pl-3 text-gray-600 dark:text-gray-400 sm:text-sm">
                  culinaryconnect.com/
                </span>
                <input
                  type="text"
                  name="username"
                  id="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-500 focus:ring-0 dark:text-white dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                  placeholder="chef_marc"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="first_name">
                First name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="first_name"
                  id="first_name"
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="last_name">
                Last name
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="last_name"
                  id="last_name"
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="phone_number">
                Phone number
              </label>
              <div className="mt-2">
                <input
                  type="tel"
                  name="phone_number"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="flex items-center sm:col-span-3 sm:mt-8">
              <div className="relative mr-2 inline-block w-10 select-none align-middle transition duration-200 ease-in">
                <input
                  type="checkbox"
                  name="phone_privacy"
                  id="phone_privacy"
                  checked={formData.phone_privacy}
                  onChange={handleInputChange}
                  className="toggle-checkbox absolute block h-6 w-6 cursor-pointer appearance-none rounded-full border-4 border-gray-300 bg-white"
                />
                <label
                  htmlFor="phone_privacy"
                  className="toggle-label block h-6 cursor-pointer overflow-hidden rounded-full bg-gray-300 transition-colors duration-200"
                ></label>
              </div>
              <label className="text-sm text-gray-600 dark:text-gray-400" htmlFor="phone_privacy">
                Hide number from public profile
              </label>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 p-6 dark:border-gray-700 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Professional Details</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Showcase your expertise and what you're looking for.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white mb-2">
                Professional Bio
              </label>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                Tell recruiters about your culinary journey, specialties, and what makes you unique. This will be prominently displayed on your profile.
              </p>
              <RichTextEditor
                value={formData.bio}
                onChange={(value) => setFormData(prev => ({ ...prev, bio: value }))}
                placeholder="Share your culinary journey, signature dishes, cooking philosophy, and career highlights..."
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="speciality">
                Culinary Specialty
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="speciality"
                  id="speciality"
                  value={formData.speciality}
                  onChange={handleInputChange}
                  placeholder="e.g. French Cuisine, Pastry, Sushi"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="experience_years">
                Years of Experience
              </label>
              <div className="mt-2">
                <input
                  type="number"
                  name="experience_years"
                  id="experience_years"
                  min="0"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="preferred_job_roles">
                Preferred Job Roles
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="preferred_job_roles"
                  id="preferred_job_roles"
                  value={formData.preferred_job_roles}
                  onChange={handleInputChange}
                  placeholder="e.g. Head Chef, Sous Chef, Line Cook"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                />
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Separate multiple roles with commas.
                </p>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="job_search_status">
                Job Search Status
              </label>
              <div className="mt-2">
                <select
                  name="job_search_status"
                  id="job_search_status"
                  value={formData.job_search_status}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
                >
                  <option value="available">Actively Looking</option>
                  <option value="looking">Open to Offers</option>
                  <option value="not_looking">Not Looking</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="mb-2 block text-sm font-semibold leading-6 text-gray-900 dark:text-white">
                Job Type Preference
              </label>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center">
                  <input
                    id="job_type_full_time"
                    name="job_type_full_time"
                    type="checkbox"
                    checked={formData.job_type_full_time}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="job_type_full_time" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Full-time
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="job_type_part_time"
                    name="job_type_part_time"
                    type="checkbox"
                    checked={formData.job_type_part_time}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="job_type_part_time" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Part-time
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="job_type_contract"
                    name="job_type_contract"
                    type="checkbox"
                    checked={formData.job_type_contract}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="job_type_contract" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Contract
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    id="job_type_temporary"
                    name="job_type_temporary"
                    type="checkbox"
                    checked={formData.job_type_temporary}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="job_type_temporary" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    Temporary
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 p-6 dark:border-gray-700 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Work Experience</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Add your culinary work history to showcase your career progression.
          </p>
          <div className="mt-6">
            <ExperienceTimelineEditor
              experiences={formData.experiences}
              onChange={(experiences) => setFormData(prev => ({ ...prev, experiences }))}
            />
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Location</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Where are you currently based?
          </p>
          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="location.country">
                Country
              </label>
              <div className="mt-2">
                <select
                  name="location.country"
                  id="location.country"
                  value={formData.location.country}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 sm:text-sm sm:leading-6"
                >
                  <option value="">Select a country</option>
                  {getNames().map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="sm:col-span-3">
              <div className="flex h-full items-end pb-2">
                <div className="flex items-center">
                  <input
                    id="relocate_confirmation"
                    name="relocate_confirmation"
                    type="checkbox"
                    checked={formData.relocate_confirmation}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
                  />
                  <label htmlFor="relocate_confirmation" className="ml-2 text-sm font-medium text-gray-900 dark:text-white">
                    I am willing to relocate
                  </label>
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="location.city">
                City
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="location.city"
                  id="location.city"
                  value={formData.location.city}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="location.state">
                State / Province
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="location.state"
                  id="location.state"
                  value={formData.location.state}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold leading-6 text-gray-900 dark:text-white" htmlFor="location.postal_code">
                ZIP / Postal code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="location.postal_code"
                  id="location.postal_code"
                  value={formData.location.postal_code}
                  onChange={handleInputChange}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary dark:bg-gray-800 dark:text-white dark:ring-gray-700 dark:placeholder:text-gray-500 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 rounded-b-xl border-t border-gray-200 bg-gray-50/50 px-4 py-4 dark:border-gray-700 dark:bg-gray-800/50 sm:px-8">
          <button
            type="button"
            onClick={handleCancel}
            disabled={saving}
            className="text-sm font-semibold leading-6 text-gray-900 hover:underline dark:text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-gray-900 shadow-sm hover:bg-opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </main>
  );
}
