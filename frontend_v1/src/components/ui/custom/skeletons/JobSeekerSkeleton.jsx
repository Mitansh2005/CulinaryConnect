import React from 'react';

const JobSeekerSkeleton = () => {
    return (
        <div className="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark">
            {/* Top Loading Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-primary/20 z-50 overflow-hidden">
                <div className="h-full bg-primary w-1/3 animate-loading-bar"></div>
            </div>

            <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 p-4 sm:px-6 lg:px-8 lg:py-8">
                {/* Header Skeleton */}
                <section className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="h-10 w-64 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse-slow"></div>
                        <div className="h-5 w-96 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse-slow"></div>
                    </div>

                    {/* Search & Filter Bar Skeleton */}
                    <div className="flex flex-col gap-4 rounded-xl bg-surface-light p-4 shadow-sm dark:bg-surface-dark lg:flex-row lg:items-center">
                        <div className="flex-1 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse-slow"></div>
                        <div className="flex flex-wrap gap-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse-slow"></div>
                            ))}
                            <div className="h-10 w-32 bg-primary/20 rounded-lg animate-pulse-slow"></div>
                        </div>
                    </div>
                </section>

                {/* Tabs Skeleton */}
                <div className="border-b border-border-light dark:border-border-dark flex gap-8">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="py-4">
                            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
                    {/* Job Cards Skeleton */}
                    <div className="flex flex-col gap-4 lg:col-span-2 xl:col-span-3">
                        {[1, 2, 3].map((i) => (
                            <article key={i} className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface-light p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                                <div className="flex items-start justify-between">
                                    <div className="flex gap-4 w-full">
                                        <div className="h-14 w-14 flex-none rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse-slow"></div>
                                        <div className="flex flex-col gap-2 w-full">
                                            <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
                                            <div className="h-4 w-1/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
                                        </div>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse-slow"></div>
                                </div>
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4].map((j) => (
                                        <div key={j} className="h-7 w-20 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse-slow"></div>
                                    ))}
                                </div>
                                <div className="mt-2 flex items-center justify-between border-t border-border-light pt-4 dark:border-border-dark">
                                    <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
                                    <div className="flex gap-3">
                                        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse-slow"></div>
                                        <div className="h-9 w-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse-slow"></div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Right Sidebar Skeleton */}
                    <aside className="flex flex-col gap-6 lg:col-span-1">
                        {/* Profile Completion Skeleton */}
                        <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-surface-light p-5 shadow-sm dark:border-border-dark dark:bg-surface-dark">
                            <div className="flex items-center justify-between">
                                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
                                <div className="h-5 w-8 bg-primary/20 rounded animate-pulse-slow"></div>
                            </div>
                            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse-slow"></div>
                            <div className="flex flex-col gap-3">
                                <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
                                <div className="flex items-center gap-3">
                                    <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse-slow"></div>
                                    <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
                                </div>
                            </div>
                            <div className="h-8 w-full bg-primary/20 rounded-lg animate-pulse-slow"></div>
                        </div>

                        {/* Recent Activity Skeleton */}
                        <div className="flex flex-col rounded-xl border border-border-light bg-surface-light shadow-sm dark:border-border-dark dark:bg-surface-dark">
                            <div className="border-b border-border-light p-4 dark:border-border-dark">
                                <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
                            </div>
                            <div className="flex flex-col">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center justify-between gap-3 p-4 border-b border-border-light dark:border-border-dark last:border-0">
                                        <div className="flex flex-col gap-2">
                                            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
                                            <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse-slow"></div>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse-slow"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default JobSeekerSkeleton;
