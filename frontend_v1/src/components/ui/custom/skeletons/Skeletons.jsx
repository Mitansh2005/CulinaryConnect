import React from "react";

// Generic pulsing skeleton block
export const SkeletonBlock = ({ className = "" }) => (
  <div className={`skeleton-shimmer ${className}`}></div>
);

// Skeleton for Job Cards (JobSeekerHome & LikedJobs)
export const JobCardSkeleton = () => (
  <article className="group relative flex flex-col gap-4 rounded-xl bg-white dark:bg-[#12241d] p-5 shadow-sm border border-border-light dark:border-border-dark">
    <div className="flex items-start justify-between">
      <div className="flex gap-4">
        <SkeletonBlock className="h-14 w-14 rounded-lg" />
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-4 w-28" />
        </div>
      </div>
      <SkeletonBlock className="h-5 w-10 rounded-full" />
    </div>

    <div className="flex flex-wrap gap-3">
      <SkeletonBlock className="h-6 w-24 rounded-md" />
      <SkeletonBlock className="h-6 w-24 rounded-md" />
      <SkeletonBlock className="h-6 w-24 rounded-md" />
    </div>

    <div className="mt-2 flex items-center justify-between pt-4 border-t border-border-light/50 dark:border-border-dark">
      <SkeletonBlock className="h-3 w-32" />
      <div className="flex gap-3">
        <SkeletonBlock className="h-9 w-24 rounded-lg" />
        <SkeletonBlock className="h-9 w-24 rounded-lg" />
      </div>
    </div>
  </article>
);

// Skeleton for Stat Cards (Recruiter Dashboard)
export const StatCardSkeleton = () => (
  <div className="flex flex-col justify-between rounded-xl bg-white dark:bg-[#12241d] p-6 border border-border-light dark:border-border-dark shadow-sm">
    <div className="flex items-start justify-between">
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-8 w-16" />
      </div>
      <SkeletonBlock className="h-12 w-12 rounded-lg" />
    </div>
    <div className="mt-4 flex items-center gap-2">
      <SkeletonBlock className="h-3 w-32" />
    </div>
  </div>
);

// Skeleton for Table Row/Application List (RecruiterDashboard & My Applications)
export const ApplicationRowSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-border-light dark:border-border-dark bg-white dark:bg-[#12241d] p-5 shadow-sm mb-4">
    <div className="flex items-center gap-4">
      <SkeletonBlock className="h-12 w-12 rounded-lg" />
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-5 w-32" />
        <SkeletonBlock className="h-4 w-20" />
      </div>
    </div>
    <div className="flex items-center gap-4 mt-4 sm:mt-0">
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-3 w-16" />
      </div>
      <SkeletonBlock className="h-10 w-24 rounded-lg" />
    </div>
  </div>
);

// Skeleton for Chat Messages
export const MessageSkeleton = ({ isSent = false }) => (
  <div className={`flex w-full ${isSent ? "justify-end" : "justify-start"} mb-4`}>
    <div className={`p-4 rounded-2xl w-64 ${isSent ? 'bg-primary/10 dark:bg-primary/20 rounded-br-none' : 'bg-white dark:bg-[#0f100f] rounded-bl-none'} border border-border-light/50`}>
      <SkeletonBlock className="h-3 w-full mb-2" />
      <SkeletonBlock className="h-3 w-3/4" />
    </div>
  </div>
);

// Full Chat Interface Skeleton
export const ChatInterfaceSkeleton = () => (
  <div className="flex flex-col h-full bg-background-light dark:bg-background-dark p-6 overflow-hidden">
    <MessageSkeleton isSent={false} />
    <MessageSkeleton isSent={true} />
    <MessageSkeleton isSent={false} />
    <MessageSkeleton isSent={true} />
  </div>
);

// Profile Layout Skeleton
export const ProfileLayoutSkeleton = () => (
  <div className="flex flex-col items-center justify-center bg-white dark:bg-[#12241d] w-8/12 mx-auto rounded-2xl mt-8 mb-8 pb-10 border border-border-light dark:border-border-dark shadow-sm p-8">
    <SkeletonBlock className="w-40 h-40 rounded-full mb-6" />
    <SkeletonBlock className="w-64 h-8 mb-2" />
    <SkeletonBlock className="w-48 h-4 mb-8" />
    
    <div className="w-full mb-6">
      <SkeletonBlock className="w-24 h-6 mb-4" />
      <SkeletonBlock className="w-full h-3 mb-2" />
      <SkeletonBlock className="w-full h-3 mb-2" />
      <SkeletonBlock className="w-3/4 h-3" />
    </div>

    <div className="w-full border-t border-border-light pt-6">
      <SkeletonBlock className="w-full h-16 rounded-xl mb-4" />
      <SkeletonBlock className="w-full h-16 rounded-xl" />
    </div>
  </div>
);
