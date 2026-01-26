import React from 'react';
import JobSeekerHome from './JobSeekerHome';
import RecruiterHome from './RecruiterHome';

export default function Home() {
    // Get user type from localStorage (set during login/registration)
    const userType = localStorage.getItem('userType');

    // Render different home pages based on user role
    // 'restaurant' = recruiter/employer view
    // anything else = job seeker view
    if (userType === 'restaurant') {
        return (
            <div className="bg-background-light dark:bg-background-dark font-display text-text-main-light dark:text-text-main-dark min-h-screen flex flex-col overflow-x-hidden">
                <RecruiterHome />
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-text-main-light dark:text-text-main-dark min-h-screen flex flex-col overflow-x-hidden">
            <JobSeekerHome />
        </div>
    );
}