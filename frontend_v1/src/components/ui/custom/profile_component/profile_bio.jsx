import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { getUid } from "@/firebase/authUtils";
import apiClient from "@/api/apiClient";
import {
  PageShell,
  SectionHeading,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";
import ReactQuill from "react-quill";
import { CheckCircle, ArrowLeft } from "lucide-react";

export function ProfileBio() {
  const [bio, setBio] = useState("");
  const { userData, setUserData } = useUser();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null); // null | "saving" | "success" | "error"
  const navigate = useNavigate();
  const uid = getUid();

  useEffect(() => {
    const fetchBio = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get(`/profile-detail/${uid}/`);
        setBio(res.data.bio || "");
      } catch (err) {
        console.error("Error fetching bio:", err);
      } finally {
        setLoading(false);
      }
    };
    if (uid) fetchBio();
  }, [uid]);

  const saveUserData = (data) => {
    setUserData(data);
    localStorage.setItem("userData", JSON.stringify(data));
  };

  const saveBio = async () => {
    try {
      setStatus("saving");
      const res = await apiClient.put(`/profile-detail/${uid}/`, { bio });
      setBio(res.data.bio || bio);
      saveUserData(res.data);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <PageShell eyebrow="Profile" title="Bio updated">
        <SurfaceCard className="flex flex-col items-center gap-5 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-50 text-forest-600 dark:bg-forest-500/12 dark:text-forest-200">
            <CheckCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-text-main-light dark:text-text-main-dark">
              Bio saved successfully
            </h2>
            <p className="mt-2 text-sm text-text-sub-light dark:text-text-sub-dark">
              Your updated bio is now visible on your public profile.
            </p>
          </div>
          <Button onClick={() => navigate("/profile")} type="button">
            Back to profile
          </Button>
        </SurfaceCard>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow="Profile"
      title="Professional bio"
      description="Write a compelling bio that gives recruiters a clear picture of your culinary identity."
      actions={
        <Button onClick={() => navigate("/profile")} type="button" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      }
    >
      {status === "error" && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 dark:border-rose-500/20 dark:bg-rose-500/10">
          <p className="text-sm font-medium text-rose-700 dark:text-rose-300">
            Failed to save bio. Please try again.
          </p>
        </div>
      )}

      <SurfaceCard className="p-6 sm:p-7">
        <SectionHeading
          eyebrow="Bio"
          title="Tell your culinary story"
          description="This appears at the top of your profile and in recruiter search results."
        />
        <div className="mt-5">
          {loading ? (
            <div className="skeleton-shimmer h-40 rounded-xl" />
          ) : (
            <ReactQuill
              value={bio}
              onChange={setBio}
              placeholder="Share your culinary journey, signature dishes, cooking philosophy, and career highlights..."
              className="rounded-xl border border-border-light/60 dark:border-border-dark/60"
            />
          )}
        </div>
        <div className="mt-5 flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/profile")}
            disabled={status === "saving"}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={saveBio}
            disabled={loading || status === "saving"}
          >
            {status === "saving" ? "Saving..." : "Save bio"}
          </Button>
        </div>
      </SurfaceCard>
    </PageShell>
  );
}
