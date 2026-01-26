import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFreshIdToken } from '@/firebase/authUtils';
import axios from 'axios';
import { baseUrl } from '@/constants/constants';
import Spinner from '@/components/ui/custom/spinner';

export default function ApplicantDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [noteInput, setNoteInput] = useState('');
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        fetchApplicationDetails();
    }, [id]);

    const fetchApplicationDetails = async () => {
        try {
            const token = await getFreshIdToken();
            const response = await axios.get(`${baseUrl}/application-detail/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setApplication(response.data);
        } catch (error) {
            console.error('Failed to fetch application details:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const token = await getFreshIdToken();
            await axios.patch(
                `${baseUrl}/application-detail/${id}/`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchApplicationDetails();
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const getStatusBadge = (status) => {
        const badges = {
            p: { label: 'In Progress', class: 'bg-yellow-100 text-yellow-800' },
            a: { label: 'Accepted', class: 'bg-green-100 text-green-800' },
            r: { label: 'Rejected', class: 'bg-red-100 text-red-800' },
            h: { label: 'Hired', class: 'bg-blue-100 text-blue-800' },
        };
        const badge = badges[status] || badges.p;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${badge.class}`}>
                {badge.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Spinner />
            </div>
        );
    }

    if (!application) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600">Application Not Found</h2>
                    <button
                        onClick={() => navigate('/applications')}
                        className="mt-4 px-4 py-2 bg-primary text-black rounded-lg font-bold"
                    >
                        Back to Applications
                    </button>
                </div>
            </div>
        );
    }

    const applicant = application.applicant;
    const job = application.job;

    return (
        <div className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-8 py-8">
            {/* Breadcrumbs & Header */}
            <div className="mb-6">
                <div className="flex flex-wrap gap-2 items-center text-sm mb-4">
                    <button
                        onClick={() => navigate('/applications')}
                        className="text-text-secondary hover:text-primary transition-colors"
                    >
                        Applications
                    </button>
                    <span className="text-text-secondary">/</span>
                    <span className="text-text-main dark:text-white font-medium">
                        {applicant?.first_name} {applicant?.last_name}
                    </span>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">
                            Applicant Details
                        </h1>
                        <p className="text-text-secondary text-sm mt-1">
                            Applied for <span className="font-medium text-text-main dark:text-white">{job?.title}</span>
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => navigate('/messages')}
                            className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg bg-white dark:bg-[#2a3c30] border border-border-color dark:border-[#35483b] text-text-main dark:text-white font-medium text-sm hover:bg-gray-50 dark:hover:bg-[#35483b] transition-colors shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                            <span>Open Chat</span>
                        </button>
                        <button
                            onClick={() => handleStatusUpdate('r')}
                            className="flex items-center justify-center gap-2 px-4 h-10 rounded-lg border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 font-medium text-sm transition-colors"
                        >
                            <span className="material-symbols-outlined text-[18px]">close</span>
                            <span>Reject</span>
                        </button>
                        <button
                            onClick={() => handleStatusUpdate('a')}
                            className="flex items-center justify-center gap-2 px-6 h-10 rounded-lg bg-primary hover:bg-primary-dark text-[#003310] font-bold text-sm shadow-md transition-all transform active:scale-95"
                        >
                            <span>Accept Applicant</span>
                            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
                {/* LEFT SIDEBAR: Candidate Profile */}
                <aside className="lg:col-span-4 xl:col-span-3 space-y-6">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-[#2a3c30] p-6 flex flex-col items-center text-center">
                        <div className="relative mb-4 group">
                            <div
                                className="bg-center bg-no-repeat bg-cover rounded-full size-32 shadow-md bg-gray-200 dark:bg-gray-700"
                                style={
                                    applicant?.profile_picture
                                        ? { backgroundImage: `url('data:image/png;base64,${applicant.profile_picture}')` }
                                        : {}
                                }
                            >
                                {!applicant?.profile_picture && (
                                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-4xl">
                                        {applicant?.first_name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div
                                className="absolute bottom-1 right-1 bg-white dark:bg-surface-dark p-1.5 rounded-full shadow-sm border border-gray-100 dark:border-gray-700"
                                title="Verified Applicant"
                            >
                                <span className="material-symbols-outlined text-blue-500 text-[20px] block">verified</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-text-main dark:text-white mb-1">
                            {applicant?.first_name} {applicant?.last_name}
                        </h3>
                        <p className="text-text-secondary font-medium text-sm mb-4">{applicant?.speciality || 'Chef'}</p>
                        <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-6 bg-background-light dark:bg-[#102216] py-2 px-4 rounded-full">
                            <span className="material-symbols-outlined text-[16px]">location_on</span>
                            <span>
                                {applicant?.location?.city}, {applicant?.location?.state}
                            </span>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-4 border-t border-border-color dark:border-[#2a3c30] pt-4 mb-4">
                            <div className="text-center">
                                <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Experience</p>
                                <p className="text-lg font-bold text-text-main dark:text-white">
                                    {applicant?.experience_years || 0} Yrs
                                </p>
                            </div>
                            <div className="text-center border-l border-border-color dark:border-[#2a3c30]">
                                <p className="text-xs text-text-secondary uppercase tracking-wider font-semibold">Status</p>
                                <p className="text-lg font-bold text-text-main dark:text-white">
                                    {applicant?.job_search_status || 'Active'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Info */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-[#2a3c30] overflow-hidden">
                        <div className="px-5 py-4 border-b border-border-color dark:border-[#2a3c30] bg-gray-50 dark:bg-[#1a2c20]">
                            <h4 className="font-semibold text-text-main dark:text-white">Contact Info</h4>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="flex items-start gap-3 group cursor-pointer">
                                <div className="mt-0.5 text-text-secondary">
                                    <span className="material-symbols-outlined text-[20px]">mail</span>
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-xs text-text-secondary font-medium">Email Address</p>
                                    <p className="text-sm font-medium text-text-main dark:text-white truncate group-hover:text-primary transition-colors">
                                        {applicant?.email}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 group cursor-pointer">
                                <div className="mt-0.5 text-text-secondary">
                                    <span className="material-symbols-outlined text-[20px]">call</span>
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-text-secondary font-medium">Phone Number</p>
                                    <p className="text-sm font-medium text-text-main dark:text-white group-hover:text-primary transition-colors">
                                        {applicant?.phone_number || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Specialties */}
                    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-[#2a3c30] p-5">
                        <h4 className="font-semibold text-text-main dark:text-white mb-3 text-sm uppercase tracking-wide">
                            Specialties
                        </h4>
                        <div className="flex flex-wrap gap-2">
                            {applicant?.speciality && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#f0f4f2] dark:bg-[#2a3c30] text-text-main dark:text-gray-200 border border-transparent hover:border-primary/50 transition-colors cursor-default">
                                    {applicant.speciality}
                                </span>
                            )}
                            {applicant?.preferred_job_roles?.split(',').map((role, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-[#f0f4f2] dark:bg-[#2a3c30] text-text-main dark:text-gray-200 border border-transparent hover:border-primary/50 transition-colors cursor-default"
                                >
                                    {role.trim()}
                                </span>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* RIGHT CONTENT AREA */}
                <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-6">
                    {/* Timeline Section */}
                    <section className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-[#2a3c30] p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-text-main dark:text-white">Application Timeline</h3>
                            {getStatusBadge(application.status)}
                        </div>
                        <div className="relative pl-4">
                            <div className="absolute left-[27px] top-2 bottom-6 w-0.5 bg-gray-200 dark:bg-[#2a3c30]"></div>

                            {/* Application Received */}
                            <div className="relative flex gap-6 pb-8 group">
                                <div className="relative z-10 flex-none size-6 rounded-full bg-green-100 border-2 border-green-500 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[14px] text-green-600 font-bold">check</span>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:w-full gap-1">
                                    <div>
                                        <p className="text-sm font-bold text-text-main dark:text-white">Application Received</p>
                                        <p className="text-sm text-text-secondary">Submitted via platform.</p>
                                    </div>
                                    <p className="text-xs text-text-secondary font-medium whitespace-nowrap">
                                        {new Date(application.application_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            {/* Current Status */}
                            {application.status !== 'p' && (
                                <div className="relative flex gap-6 group">
                                    <div className="relative z-10 flex-none size-6 rounded-full bg-primary ring-4 ring-primary/20 flex items-center justify-center">
                                        <div className="size-2 rounded-full bg-[#003310]"></div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:w-full gap-1 p-3 rounded-lg bg-[#f0f4f2] dark:bg-[#223628] border border-primary/30">
                                        <div>
                                            <p className="text-sm font-bold text-text-main dark:text-white">
                                                {application.status === 'a' && 'Accepted'}
                                                {application.status === 'r' && 'Rejected'}
                                                {application.status === 'h' && 'Hired'}
                                            </p>
                                            <p className="text-sm text-text-secondary">Current application status.</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Bio Section */}
                    {applicant?.bio && (
                        <section className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-[#2a3c30] p-6">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">About</h3>
                            <p className="text-sm text-text-main dark:text-gray-300 leading-relaxed">{applicant.bio}</p>
                        </section>
                    )}

                    {/* Achievements */}
                    {applicant?.achievements && (
                        <section className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-[#2a3c30] p-6">
                            <h3 className="text-lg font-bold text-text-main dark:text-white mb-4">Achievements</h3>
                            <p className="text-sm text-text-main dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                {applicant.achievements}
                            </p>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}
