from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path("auth/setup-profile/", views.ProfileSetupView.as_view(), name="setup-profile"),
    path("auth/me/", views.MeView.as_view(), name="me"),
    path(
        "recruiters/company/",
        views.RecruitersInCompanyView.as_view(),
        name="get_recruits_in_same_company",
    ),
    path(
        "company-create/<int:id>/", views.CompanyCreate.as_view(), name="company_create"
    ),
    path(
        "company/", views.CompanyList.as_view(), name="company_list"
    ),  # get all companies
    path(
        "company/<int:pk>/", views.CompanyDetail.as_view(), name="company_detail"
    ),  # get company by id
    path(
        "company/user/<str:uid>/",
        views.CompanyByUserId.as_view(),
        name="company_by_user_id",
    ),  # get company user by uid
    path("company/upload-logo/<int:pk>/", views.CompanyProfileImageUpload.as_view(), name="company_logo_upload"),
    path("locations/", views.LocationList.as_view(), name="get_locations"),
    path(
        "jobs/", views.JobsList.as_view(), name="jobs_list_or_create"
    ),  # get all jobs or create new job
    path("jobs-detail/<int:pk>/", views.JobsDetail.as_view(), name="job_details_update"),
    path("application/", views.ApplicationsList.as_view(), name="all_applications"),
    path("application/create/", views.ApplicationsCreate.as_view(), name="create_application"),
    path(
        "application-detail/<int:pk>/",
        views.ApplicationsDetail.as_view(),
        name="application_details_update",
    ),
    path("application/hire/<int:pk>/", views.UpdateJobSeekerApplicationStatus.as_view(), name="hire_job_seeker"),
    path(
        "get-messages/<sender>/<receiver>/",
        views.GetMessages.as_view(),
        name="get_messages_user",
    ),
    path(
        "mark-message-read/<int:pk>/",
        views.MarkMessageAsRead.as_view(),
        name="mark-message-read",
    ),
    path("message/profile/",views.GetUserProfileForMessage.as_view(), name="get_user_profile_for_message"),
    path("profile/", views.ProfileList.as_view(), name="all_profile"),
    path("profile/<str:uid>/", views.ProfileList.as_view(), name="profile_search_uid"),
    path(
        "profile-detail/<str:uid>/",
        views.ProfileDetail.as_view(),
        name="profile_detail",
    ),
    path("jobseeker/<int:user__user_id>/", views.JobSeekerProfileView.as_view(), name="jobseeker-profile"),
    path("jobseeker/liked-jobs/", views.LikedJobsView.as_view(), name="liked_jobs_list"),
    path("jobseeker/liked-jobs/<int:pk>/", views.ManageLikedJobs.as_view(), name="liked_jobs"),
    path("jobseeker/save-liked-jobs/", views.StoreLikedJobs.as_view(), name="save_liked_jobs"),
    path("search/<username>/", views.SearchUser.as_view(), name="search_user"),
    path("update-bio/<str:uid>/", views.UpdateBioView.as_view(), name="update_bio"),
    path("upload/", views.ProfileImageUploadView.as_view(), name="profile-image"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
