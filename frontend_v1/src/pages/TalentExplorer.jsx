import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  MapPin, 
  ChefHat, 
  CalendarDays, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  Compass,
  CornerDownRight
} from "lucide-react";
import axios from "axios";
import { baseUrl } from "@/constants/constants";
import { getFreshIdToken } from "@/firebase/authUtils";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  EmptyPanel,
  PageShell,
  StatusPill,
  SurfaceCard,
} from "@/components/ui/custom/enterprise-shell";

export function TalentExplorer() {
  const navigate = useNavigate();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search parameters
  const [searchTerm, setSearchTerm] = useState("");
  const [specialityFilter, setSpecialityFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  
  // Track expanded cards for achievements
  const [expandedChefId, setExpandedChefId] = useState(null);

  const fetchChefs = async () => {
    setLoading(true);
    try {
      const token = await getFreshIdToken();
      let url = `${baseUrl}/profile/?`;
      if (searchTerm) url += `q=${encodeURIComponent(searchTerm)}&`;
      if (specialityFilter) url += `speciality=${encodeURIComponent(specialityFilter)}&`;
      if (cityFilter) url += `city=${encodeURIComponent(cityFilter)}&`;
      
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // The API returns a list of profiles, make sure it is an array
      setCandidates(Array.isArray(response.data) ? response.data : []);
      setError(null);
    } catch (err) {
      console.error("Failed to load talent data:", err);
      setError("Failed to fetch culinary profiles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChefs();
  }, [specialityFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchChefs();
  };

  const toggleExpand = (chefId) => {
    if (expandedChefId === chefId) {
      setExpandedChefId(null);
    } else {
      setExpandedChefId(chefId);
    }
  };

  const getSearchStatusTone = (status) => {
    if (status === "available") return "success";
    if (status === "looking") return "warning";
    return "charcoal";
  };

  const getSearchStatusLabel = (status) => {
    if (status === "available") return "Available Now";
    if (status === "looking") return "Looking";
    return "Not Looking";
  };

  return (
    <PageShell
      description="Browse, filter, and connect directly with verified culinary professionals."
      eyebrow="Recruiter studio"
      title="Culinary Talent Explorer"
    >
      {/* Search and Filters Section */}
      <SurfaceCard className="p-5 mb-6">
        <form onSubmit={handleSearchSubmit} className="grid gap-4 md:grid-cols-12 items-end">
          <div className="md:col-span-5">
            <label className="block text-xs font-tags uppercase tracking-[0.16em] text-text-sub-light dark:text-text-sub-dark mb-2">
              Keywords or Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-sub-light dark:text-text-sub-dark">
                <Search className="h-4 w-4" />
              </span>
              <input
                type="text"
                className="soft-input pl-9"
                placeholder="Search specialty, roles, chefs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-tags uppercase tracking-[0.16em] text-text-sub-light dark:text-text-sub-dark mb-2">
              Speciality
            </label>
            <select
              className="soft-input w-full h-[46px] cursor-pointer"
              value={specialityFilter}
              onChange={(e) => setSpecialityFilter(e.target.value)}
            >
              <option value="">All Specialties</option>
              <option value="Executive Chef">Executive Chef</option>
              <option value="Head Chef">Head Chef</option>
              <option value="Sous Chef">Sous Chef</option>
              <option value="Pastry Chef">Pastry Chef</option>
              <option value="Line Cook">Line Cook</option>
              <option value="Sushi Chef">Sushi Chef</option>
              <option value="Commis">Commis Chef</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-tags uppercase tracking-[0.16em] text-text-sub-light dark:text-text-sub-dark mb-2">
              City Location
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-sub-light dark:text-text-sub-dark">
                <MapPin className="h-4 w-4" />
              </span>
              <input
                type="text"
                className="soft-input pl-9"
                placeholder="e.g. Mumbai"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              />
            </div>
          </div>

          <div className="md:col-span-1">
            <Button type="submit" className="w-full h-[46px]">
              Go
            </Button>
          </div>
        </form>
      </SurfaceCard>

      {/* Candidates Feed */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-shimmer h-48 rounded-[1.5rem]" />
          ))}
        </div>
      ) : error ? (
        <EmptyPanel title="Failed to load directory" description={error} />
      ) : candidates.length === 0 ? (
        <EmptyPanel
          title="No candidates found"
          description="Try broadening your keyword queries, removing filters, or searching different cities."
          action={
            <Button
              onClick={() => {
                setSearchTerm("");
                setSpecialityFilter("");
                setCityFilter("");
                setTimeout(fetchChefs, 50);
              }}
            >
              Reset Filters
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {candidates.map((chef) => {
            const isExpanded = expandedChefId === chef.user_id;
            
            return (
              <SurfaceCard 
                key={chef.user_id} 
                className="flex flex-col justify-between p-5 hover:border-primary/20 hover:shadow-sm transition-all duration-300"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 items-center">
                      <Avatar
                        className="h-14 w-14 rounded-[1.25rem] border border-border-light/80 dark:border-border-dark"
                        name={`${chef.first_name || ""} ${chef.last_name || ""}`}
                        src={chef.profile_picture}
                      />
                      <div>
                        <h3 className="font-display text-xl font-semibold tracking-[-0.03em] text-text-main-light dark:text-text-main-dark leading-snug">
                          {chef.first_name || "Chef"} {chef.last_name || ""}
                        </h3>
                        <p className="text-xs font-tags uppercase tracking-[0.16em] text-primary/80 mt-0.5">
                          {chef.speciality || "General Culinary"}
                        </p>
                      </div>
                    </div>
                    
                    <StatusPill tone={getSearchStatusTone(chef.job_search_status)}>
                      {getSearchStatusLabel(chef.job_search_status)}
                    </StatusPill>
                  </div>

                  {/* Highlights Bar */}
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium text-text-sub-light dark:text-text-sub-dark">
                    <div className="flex items-center gap-1 bg-stone-100 dark:bg-white/5 px-2.5 py-1.5 rounded-xl">
                      <ChefHat className="h-3.5 w-3.5 text-primary" />
                      <span>{chef.experience_years ? `${chef.experience_years} Years Exp` : "Entry Level"}</span>
                    </div>
                    {chef.location && (
                      <div className="flex items-center gap-1 bg-stone-100 dark:bg-white/5 px-2.5 py-1.5 rounded-xl">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>{chef.location.city}, {chef.location.state}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 bg-stone-100 dark:bg-white/5 px-2.5 py-1.5 rounded-xl">
                      <CalendarDays className="h-3.5 w-3.5 text-primary" />
                      <span>{chef.job_type_preference || "Flexible Shift"}</span>
                    </div>
                  </div>

                  {/* Bio */}
                  {chef.bio && (
                    <p className="mt-4 text-sm text-text-sub-light/95 dark:text-text-sub-dark/95 leading-relaxed italic">
                      "{chef.bio.slice(0, 140)}{chef.bio.length > 140 ? "..." : ""}"
                    </p>
                  )}

                  {/* Expandable details (Achievements, relocate, etc.) */}
                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-border-light/60 dark:border-border-dark flex flex-col gap-3">
                      {chef.preferred_job_roles && (
                        <div>
                          <p className="text-[11px] font-tags uppercase tracking-[0.16em] text-text-sub-light dark:text-text-sub-dark mb-1">
                            Preferred Roles
                          </p>
                          <p className="text-sm text-text-main-light dark:text-text-main-dark font-medium">
                            {chef.preferred_job_roles}
                          </p>
                        </div>
                      )}
                      
                      {chef.achievements && (
                        <div>
                          <p className="text-[11px] font-tags uppercase tracking-[0.16em] text-text-sub-light dark:text-text-sub-dark mb-1">
                            Achievements & Specialties
                          </p>
                          <p className="text-sm text-text-main-light dark:text-text-main-dark">
                            {chef.achievements}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center gap-1 text-xs">
                        <CornerDownRight className="h-3.5 w-3.5 text-primary" />
                        <span className="text-text-sub-light dark:text-text-sub-dark">
                          Willing to relocate:{" "}
                          <span className="font-bold text-text-main-light dark:text-text-main-dark">
                            {chef.relocate_confirmation ? "Yes" : "No / Local only"}
                          </span>
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-4 border-t border-border-light/60 dark:border-border-dark flex justify-between items-center gap-3">
                  <button
                    onClick={() => toggleExpand(chef.user_id)}
                    className="flex items-center gap-1 text-xs font-semibold text-text-sub-light hover:text-text-main-light dark:text-text-sub-dark dark:hover:text-text-main-dark transition-colors"
                  >
                    {isExpanded ? (
                      <>
                        <span>Hide credentials</span>
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>View achievements</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <Button
                    onClick={() => navigate(`/messages?uid=${chef.uid}`)}
                    className="h-9 px-4 rounded-xl flex items-center gap-2"
                  >
                    <MessageSquare className="h-3.5 w-3.5" />
                    <span>Message Chef</span>
                  </Button>
                </div>
              </SurfaceCard>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
