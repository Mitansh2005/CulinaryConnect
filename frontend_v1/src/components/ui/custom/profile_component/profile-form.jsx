import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getNames } from "country-list";
import { InputComponent } from "./../input-component";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "@/UserContext";
import { ImCross } from "react-icons/im";
import { Button } from "../../button";
import { NormalButtons } from "../../ui_buttons";
import { getFreshIdToken, getUid } from "@/firebase/authUtils";
import { getAuth } from "firebase/auth";
import axios from "axios";
import { baseUrl } from "@/constants/constants";
export function ProfileForm() {
  const { userData, setUserData } = useUser();
  const uid = getUid();
  const [selectedCountry, setSelectedCountry] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const navigate = useNavigate();
	const [status, setStatus] = useState(""); // "success" or "fail"
  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    consent_box: false,
    location: {
      country: "",
      state: "",
      city: "",
      postal_code: "",
    },
    user_type: "chef", // Default to chef
    // restaurant fields
    company: "",
    designation: "",
    // chef fields
    speciality: "",
    experience_years: 0,
    job_type_preference: null,
    preferred_job_roles: null,
    job_search_status: null,

    // street_address: "",
    relocate_confirmation: false,
  });

  // Fetch profile data on component load
  useEffect(() => {
    const fetch = async () => {
      try {
        const token = await getFreshIdToken(true);
        const res = await axios.get(`${baseUrl}/profile-detail/${uid}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = res.data;
        console.log("Fetched user data:", userData);
        if (userData.location == null) {
          userData.location = "";
        }
        const countryName = userData.location.country;
        setSelectedCountry(countryName);
        setFormData({
          username: userData.username || "",
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          phone_number: userData.phone_number || "",
          location: {
            country: userData.location?.country || "",
            state: userData.location?.state || "",
            city: userData.location?.city || "",
            postal_code: userData.location?.postal_code || "",
          },
          bio: userData.bio || "",
          consent_box: userData.consent_box || false,
          user_type: userData.user_type || "chef", // 👈 add this
          // restaurant fields
          company: userData.company || "",
          designation: userData.designation || "",
          // chef fields
          speciality: userData.speciality || "",
          experience_years: userData.experience_years || 0,
          job_type_preference: userData.job_type_preference || null,
          preferred_job_roles: userData.preferred_job_roles || null,
          job_search_status: userData.job_search_status || null,
          relocate_confirmation: userData.relocate_confirmation || false,
        });
      } catch (err) {
        console.error("Something went wrong when getting form data. ", err);
      }
    };
    if (uid) {
      fetch();
    }
  }, [uid]);

  // Saves user data and store it in localStorage
  const saveUserData = (data) => {
    setUserData(data); // Update context
    localStorage.setItem("userData", JSON.stringify(data)); // Save to localStorage
  };

  // Closes the popup on the screen
  const closePopup = () => {
    setShowPopup(false);
    setStatus("");
    navigate("/profile");
  };

  // handles the change in country field of the profile form
  const handleCountryChange = (e) => {
    const countryName = e.target.value;
    setSelectedCountry(countryName);

    setFormData({
      ...formData,
      location: {
        ...formData.location,
        country: countryName, // Use code if available, else fallback to name
      },
    });
  };

  // handles change in other fields than country in profile form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    //Check if the field in nested field i.e, location
    if (name.indexOf("location.") === 0) {
      const locationField = name.split(".")[1]; //e.g, country
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          [locationField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value, // For checkbox use "checked", for others use "value"
      });
    }
  };
  // checks if the profile already exists or not if exists updates the profile otherwise creates the profile
  const checkAndSubmitForm = (e) => {
    e.preventDefault();
    console.log("Form Submit:", formData);
    const fetch = async () => {
      const token = await getFreshIdToken(true);
      const res = axios
        .get(`${baseUrl}/profile-detail/${uid}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          validateStatus: () => true, // Allow handling all response statuses manually
        })
        .then((response) => {
          if (response.status === 200) {
            // Profile exists, update it
            return updateProfile(formData);
          } else if (response.status === 404) {
            // Profile does not exist, create it
            return createProfile(formData);
          } else {
            console.error("Error checking profile:", response.status);
            setShowPopup(true);
            setStatus("failed");
          }
        })
        .catch((error) => {
          console.error("Unexpected error during profile check:", error);
          setShowPopup(true);
          setStatus("failed");
        });
    };
    fetch();
  };

  // makes POST request and creates user profile
  const createProfile = async (data) => {
    try {
      const token = await getFreshIdToken(true);
      const auth = getAuth();
      const email = auth.currentUser?.email;

      const payload = {
        ...data,
        uid: uid,
        email: email
      };

      console.log("Sending profile payload:", payload);
      const response = await axios.post(`${baseUrl}/profile/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        validateStatus: () => true, // so we can manually handle all responses
      });

      if (response.status === 200 || response.status === 201) {
        console.log("Profile created:", response.data);
        saveUserData(response.data);
        setShowPopup(true);
        setStatus("success");
      } else {
        console.error("Profile creation failed with status:", response.status);
        setShowPopup(true);
        setStatus("failed");
      }
    } catch (error) {
      console.error("Error creating profile:", error);
      setShowPopup(true);
      setStatus("failed");
    }
  };

  // makes a PATCH request and updates the existing profile with the uid provided
  const updateProfile = async (data) => {
    try {
      const token = await getFreshIdToken(true);
      const response = await axios.patch(
        `${baseUrl}/profile-detail/${uid}/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          validateStatus: () => true, // handle status manually
        },
      );

      if (response.status >= 200 && response.status < 300) {
        console.log("Profile updated:", response.data);
        saveUserData(response.data);
        setShowPopup(true);
        setStatus("success");
      } else {
        console.error("Failed to update profile:", response.status);
        setShowPopup(true);
        setStatus("failed");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setShowPopup(true);
      setStatus("failed");
    }
  };

  return (
    <>
      <div className="flex justify-center">
		<Card className="w-full max-w-4xl mt-8">
          <CardHeader>
            <Link to="/profile">
              <FaArrowLeft className="mb-3 text-lg hover:cursor-pointer hover:text-red-600 " />
            </Link>
            <CardTitle>Contact Information</CardTitle>
			<CardDescription>
				Complete your profile to improve matching quality and recruiter trust.
			</CardDescription>
          </CardHeader>
          <CardContent>
            {showPopup && (
					<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
						<div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-lg text-center border border-border-light dark:border-border-dark">
                  <div className="flex justify-end mt-{-4px}">
                    <ImCross
                      className="hover:text-red-600 hover:cursor-pointer"
                      onClick={closePopup}
                    ></ImCross>
                  </div>
                  <h2
                    className={`text-xl font-semibold mb-4 ${status === "success" ? "text-green-600" : "text-red-600"
                      }`}
                  >
                    {status === "success" ? "Success!" : "Failed"}
                  </h2>
                  <p>
                    {" "}
                    {status === "success"
                      ? "The process completed successfully."
                      : "The process failed. Please try again."}
                  </p>
							<Button
								onClick={closePopup}
								className="mt-4 px-4 py-2"
							>
								Close
							</Button>
                </div>
              </div>
            )}
            <form className="flex flex-col" onSubmit={checkAndSubmitForm}>
              <InputComponent
                label="Username"
                type="text"
                placeholder="Enter your username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              ></InputComponent>
              <InputComponent
                label="First name"
                type="text"
                placeholder="Enter your first name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              ></InputComponent>
              <InputComponent
                label="Last name"
                type="text"
                placeholder="Enter your last name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              ></InputComponent>
              <InputComponent
                label="Phone"
                type="text"
                placeholder="Enter your phone number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              ></InputComponent>
              {formData.user_type === "restaurant" && (
                <>
                  <InputComponent
                    label="Company"
                    type="text"
                    placeholder="Enter your company name"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                  />
                  <InputComponent
                    label="Designation"
                    type="text"
                    placeholder="Enter your designation"
                    name="designation"
                    value={formData.designation}
                    onChange={handleChange}
                  />
                </>
              )}

              {formData.user_type === "chef" && (
                <>
                  <InputComponent
                    label="Speciality"
                    type="text"
                    placeholder="Enter your speciality"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleChange}
                  />
                  <InputComponent
                    label="Experience Years"
                    type="number"
                    placeholder="Enter years of experience"
                    name="experience_years"
                    value={formData.experience_years}
                    onChange={handleChange}
                  />
                  <InputComponent
                    label="Preferred Job Roles"
                    type="text"
                    placeholder="Enter preferred roles"
                    name="preferred_job_roles"
                    value={formData.preferred_job_roles}
                    onChange={handleChange}
                  />
                  <label className="m-2">Job Search Status</label>
					<select
						name="job_search_status"
						value={formData.job_search_status}
						onChange={handleChange}
						className="border border-border-light dark:border-border-dark bg-surface-highest dark:bg-surface-dark p-2.5 rounded-xl m-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ease-linear duration-150 w-full text-text-main-light dark:text-text-main-dark"
					>
                    <option value="" disabled>
                      Select status
                    </option>
                    <option value="available">Available to Start</option>
                    <option value="looking">Just Looking</option>
                    <option value="not_looking">Not Looking</option>
                  </select>
                  <label className="m-2">Job Type Preference</label>
					<select
						name="job_type_preference"
						value={formData.job_type_preference}
						onChange={handleChange}
						className="border border-border-light dark:border-border-dark bg-surface-highest dark:bg-surface-dark p-2.5 rounded-xl m-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ease-linear duration-150 w-full text-text-main-light dark:text-text-main-dark"
					>
                    <option value="">Select type</option>
                    <option value="Full Time">Full-Time</option>
                    <option value="Part Time">Part-Time</option>
                  </select>
                </>
              )}

              <div className="flex flex-row items-center mt-4">
                <label>
                  <input
                    type="checkbox"
                    name="consent_box"
                    value={formData.consent_box}
                    checked={formData.consent_box}
                    onChange={handleChange}
                    required
                  ></input>{" "}
                  By checking you allow number to be visible in the web
                </label>
              </div>

              <h1 className="text-xl font-bold mt-6">Location</h1>
              <p className="text-sm text-gray-500">
                {formData.user_type == "restaurant"
                  ? "Please share your location"
                  : "This helps match you with nearby jobs."}
              </p>
              <label htmlFor="country">Country</label>
				<select
					id="country"
					name="location.country"
					value={selectedCountry}
					onChange={handleCountryChange}
					className="border border-border-light dark:border-border-dark bg-surface-highest dark:bg-surface-dark p-2.5 rounded-xl m-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary ease-linear duration-150 w-full text-text-main-light dark:text-text-main-dark"
				>
                <option value="" disabled>
                  Select a country
                </option>
                {getNames().map((country, index) => (
                  <option key={index} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              <InputComponent
                label="State"
                type="text"
                placeholder="Enter the  state here"
                name="location.state"
                value={formData.location.state}
                onChange={handleChange}
              ></InputComponent>
              <InputComponent
                label="City"
                type="text"
                placeholder="Enter the city  here"
                name="location.city"
                value={formData.location.city}
                onChange={handleChange}
              ></InputComponent>
              <InputComponent
                label="Pincode"
                type="text"
                placeholder="Enter the pincode here"
                name="location.postal_code"
                value={formData.location.postal_code}
                onChange={handleChange}
              ></InputComponent>
              {formData.user_type === "chef" && (
                <>
                  <label>Relocation</label>
                  <div className="m-2">
                    <input
                      type="checkbox"
                      name="relocate_confirmation"
                      value={formData.relocate_confirmation}
                      checked={formData.relocate_confirmation}
                      onChange={handleChange}
                    ></input>
                    <label className="ml-2">Yes I am willing to relocate</label>
                  </div>
                </>
              )}
              <div className="flex justify-center items-center">
                <NormalButtons></NormalButtons>
              </div>
            </form>
          </CardContent>

          <CardFooter>
            <p className="text-red-600 font-semibold">
              Please Fill this form correctly for better experience
            </p>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
