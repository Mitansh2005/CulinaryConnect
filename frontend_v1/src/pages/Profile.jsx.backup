import { useEffect, useState } from "react";
import { ProfileOptions } from "@/components/ui/custom/profile_component/profile-options";
import { ProfileInfo } from "@/components/ui/custom/profile_component/profile_info";
import { FaArrowLeft } from "react-icons/fa";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { NormalButtons } from "@/components/ui/ui_buttons";
import { getFreshIdToken, getUid } from "@/firebase/authUtils";
import ProfilePictureUploader from "@/components/ui/custom/profile_component/profile_picture_uploader";
import defaultPic from "../assets/icons/profile.png";
import { baseUrl } from "@/constants/constants";
import DOMpurify from "dompurify";
import ReactQuill from "react-quill";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ImCross } from "react-icons/im";
import { getSafeUserData } from "@/utils/localStorage";
export function ProfileTemplate() {
  const savedUserdata = getSafeUserData();

  const bio = savedUserdata?.bio;
  const bioLength = savedUserdata?.bio?.length || 0;
  const username = savedUserdata?.username;
  const userType = savedUserdata?.user_type;
  const uid = getUid();
  const [status, setStatus] = useState("");
  const [showprocessPopup, setProcessShowPopup] = useState(false);
  const navigate = useNavigate();
  const sanitizedHtml = (html) => {
    return DOMpurify.sanitize(html, {
      ALLOWED_TAGS: ["b", "i", "em", "strong", "p", "br"],
    });
  };
  const maxLength = 100;
  const [showPopup, setShowPopup] = useState(false);
  const [content, setContent] = useState("profile");
  const [qualifications, setQualifications] = useState("");
  const closeProcessPopup = () => {
    setProcessShowPopup(false);
    setStatus("");
    setShowPopup(false);
    setContent("profile");
  };
  const fetchAchivements = async (e) => {
    try {
      const token = await getFreshIdToken(true);
      const res = await axios.get(`${baseUrl}/profile-detail/${uid}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      setQualifications(data.achievements);
    } catch (error) {
      console.error(
        "Something went wrong when fetching achievements/qualifications: ",
        error,
      );
    }
  };
  useEffect(() => {
    if (uid) {
      fetchAchivements();
    }
  }, []);
  const saveQualifications = async () => {
    try {
      setProcessShowPopup(true);
      setStatus("success");
      const token = await getFreshIdToken(true);
      const data = {
        achievements: qualifications,
      };
      const response = await axios.patch(
        `${baseUrl}/profile-detail/${uid}/`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
    } catch (error) {
      console.error("Error saving qualifications:", error);
    }
  };
  const renderContent = () => {
    if (content === "qualifications") {
      return (
        <>
          {showprocessPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="flex justify-end mt-{-4px}">
                  <ImCross
                    className="hover:text-red-600 hover:cursor-pointer"
                    onClick={closeProcessPopup}
                  ></ImCross>
                </div>
                <h2
                  className={`text-xl font-semibold mb-4 ${
                    status === "success" ? "text-green-600" : "text-red-600"
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
                  onClick={closeProcessPopup}
                  className="mt-4 px-4 py-1 hover:bg-red-600 hover:text-black rounded-md"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
          <div className="flex flex-col justify-end items-center bg-white w-1/2 rounded-2xl mt-8 mb-8 p-4">
            <div className="relative w-full">
              <FaArrowLeft
                className="mb-5 text-lg hover:cursor-pointer hover:text-red-600 left-0 "
                onClick={() => {
                  setContent("profile");
                  setShowPopup(false);
                }}
              />
            </div>
            <label className="mb-3 text-left">
              Talk about your qualifications and achivements in this section in
              brief
            </label>
            <ReactQuill
              placeholder="Enter your achievements"
              value={qualifications}
              onChange={(content) => setQualifications(content)}
              className="w-full h-auto resize-none outline-none overflow-auto p-2 duration-75 ease-linear rounded-md focus:border-b-4 border-brandPrimary transition-all text-xl"
            />
            <NormalButtons onClick={saveQualifications}>Save</NormalButtons>
          </div>
        </>
      );
    } else {
      return <p>Invalid !</p>;
    }
  };
  return (
    <>
      {/* entire screen  */}
      <section className="flex flex-col items-center overflow-hidden ">
        {!showPopup ? (
          <div className="flex flex-col items-center justify-center bg-white w-8/12 rounded-2xl mt-8 mb-8  pb-10">
            <ProfilePictureUploader
              id={uid}
              username={username}
              defaultImage={defaultPic}
              getProfileUrl={`${baseUrl}/profile-detail`}
              uploadUrl={`${baseUrl}/upload/`}
            />
            <ProfileInfo />

            <div className="w-7/12 mt-6 ml-14 ">
              <h1 className="text-xl font-bold mb-4">Bio</h1>
              <div className="flex justify-between items-end m-3">
                <p
                  dangerouslySetInnerHTML={{
                    __html:
                      bioLength > maxLength
                        ? sanitizedHtml(bio.slice(0, maxLength) + "...")
                        : sanitizedHtml(bio) || "Tell us about yourself here",
                  }}
                ></p>
                <Link to="/bio">
                  <div className="flex items-center justify-between w-12  hover:cursor-pointer mt-3">
                    <MdOutlineArrowForwardIos className="hover:text-custom_color1" />
                  </div>
                </Link>
              </div>
            </div>
            {userType === "chef" && (
              <div className="flex flex-col w-7/12 mt-4 ">
                <ProfileOptions
                  heading="Qualifications"
                  subheading="Highlight your skills and experience"
                  onClickEvent={() => {
                    setShowPopup(true);
                    setContent("qualifications");
                  }}
                />
                <ProfileOptions
                  heading="Liked Jobs"
                  subheading="View jobs you have liked"
                  onClickEvent={() => {
                    navigate("/liked-jobs");
                  }}
                />
              </div>
            )}
          </div>
        ) : (
          renderContent()
        )}
      </section>
    </>
  );
}
