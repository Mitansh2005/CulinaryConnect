import JobSeekerHome from "./JobSeekerHome";
import RecruiterHome from "./RecruiterHome";
import { useUser } from "@/contexts/UserContext";

export default function Home() {
  const { userData } = useUser();
  const userType = userData?.user_type;

  if (userType === "restaurant") {
    return <RecruiterHome />;
  }

  return <JobSeekerHome />;
}
