import JobSeekerHome from "./JobSeekerHome";
import RecruiterHome from "./RecruiterHome";

export default function Home() {
  const userType = localStorage.getItem("userType");

  if (userType === "restaurant") {
    return <RecruiterHome />;
  }

  return <JobSeekerHome />;
}
