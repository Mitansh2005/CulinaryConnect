from datetime import timedelta
from django.db import IntegrityError
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from .serializers import (
    ApplicationResponseSerializer,
    CompanySerializer,
    GetProfileForMessageSerializer,
    JobSeekerProfileSerializer,
    LocationSerializer,
    CustomUserSerializer,
    JobsSerializer,
    ApplicationSerializer,
    MessageSerializer,
    ProfileSetupSerializer,
    CompanyMembershipSerializer,
    BasicRecruiterSerializer,
)
from .models import (
    Company,
    Job,
    JobSeekerProfile,
    Location,
    Message,
    Application,
    CustomUser,
    RecruiterProfile,
    CompanyMembership,
)
from django.db.models import Q
from django.utils import timezone
from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .permission import (
    IsCompanyAdminUser,
    IsJobSeeker,
    IsJobSeekerOrRecruiter,
    IsRecruiter,
)

# Create your views here.

# views.py


class LocationList(generics.ListAPIView):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer
    permission_classes = [IsAuthenticated]


class CompanyList(generics.ListAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsJobSeeker]


class CompanyCreate(generics.CreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsRecruiter]


class CompanyDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsCompanyAdminUser]


class CompanyProfileImageUpload(APIView):
    permission_classes = [IsAuthenticated, IsCompanyAdminUser]

    def post(self, request, *args, **kwargs):
        company_id = request.data.get("id")  # Get ID from request
        try:
            company = Company.objects.get(id=company_id)  # Find company by ID
            company.logo = request.data.get("image")
            company.save()
            print("profile updated")
            return Response(
                {"message": "Profile image updated successfully!"}, status=201
            )
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class CompanyByUserId(generics.RetrieveAPIView):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_object(self):
        uid = self.kwargs.get("uid")
        try:
            recruiter = RecruiterProfile.objects.get(user__uid=uid)
        except RecruiterProfile.DoesNotExist:
            raise ValidationError("Recruiter not found.")

        if not recruiter.company:
            raise ValidationError("Recruiter has no associated company.")

        return recruiter.company


# This view helps in Create and List operations on profile/user
class ProfileList(generics.ListCreateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == "restaurant":
            return CustomUser.objects.filter(user_type="chef")
        elif user.user_type == "chef":
            return CustomUser.objects.filter(user_type="restaurant")
        else:
            return CustomUser.objects.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Profile creation failed. Errors:")
            print(serializer.errors)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ProfileDetail(generics.RetrieveUpdateAPIView):
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]
    lookup_field = "uid"

    def get_queryset(self):
        uid = self.kwargs.get("uid")
        if uid:
            return CustomUser.objects.filter(uid=uid)
        return CustomUser.objects.all()

    def update(self, request, *args, **kwargs):
        kwargs["partial"] = True
        return super().update(request, *args, **kwargs)


class UpdateBioView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]

    def update(self, request, *args, **kwargs):
        uid = kwargs.get("uid")
        bio = request.data.get("bio")

        try:
            user = CustomUser.objects.get(uid=uid)
            user.bio = bio
            user.save()
            return Response(
                {"message": "Bio updated successfully."}, status=status.HTTP_200_OK
            )
        except CustomUser.DoesNotExist:
            return Response(
                {"error": "User not found."}, status=status.HTTP_404_NOT_FOUND
            )


class ProfileImageUploadView(APIView):
    permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]

    def post(self, request, *args, **kwargs):
        id = request.data.get("id")  # Get ID from request
        try:
            user = CustomUser.objects.get(uid=id)  # Find user by ID
            user.profile_picture = request.data.get("image")
            user.save()
            print("profile updated")
            return Response(
                {"message": "Profile image updated successfully!"}, status=201
            )
        except CustomUser.DoesNotExist:
            return Response({"error": "User not found"}, status=404)


class ProfileSetupView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        uid = request.data.get("uid")
        user_existed = CustomUser.objects.filter(uid=uid).exists()

        serializer = ProfileSetupSerializer(
            data=request.data, context={"email": request.user.email}
        )

        if serializer.is_valid():
            serializer.save()
            print("Profile setup successful for user:", uid)
            return Response(
                {"message": "User profile initialized"}, status=status.HTTP_201_CREATED
            )
        else:
            print("Profile setup failed.")
            print(serializer.errors)
            if not user_existed:
                try:
                    CustomUser.objects.get(uid=uid).delete()
                    print("Unregistered user deleted.")
                except CustomUser.DoesNotExist:
                    print("No user to delete.")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MeView(APIView):
    """Returns the server-verified profile of the currently authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = CustomUserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CompanyMembershipView(generics.ListCreateAPIView):
    serializer_class = CompanyMembershipSerializer()
    queryset = CompanyMembership.objects.all()
    permission_classes = [IsAuthenticated, IsRecruiter]

    def get_queryset(self):
        user = self.request.user
        if hasattr(user, "recruiter"):
            return CompanyMembership.objects.filter(user=user.id).get()
        return CompanyMembership.objects.none()

    def perform_create(self, serializer):
        user = self.request.user
        if not hasattr(user, "recruiter"):
            raise ValidationError("Only recruiters can create company memberships.")
        serializer.save(company=user.recruiter.company, user=user)


class RecruitersInCompanyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        if not hasattr(user, "recruiter"):
            raise PermissionError("Only recruiters can access this data.")

        company = user.recruiter.company

        recruiters = RecruiterProfile.objects.filter(company=company).select_related(
            "user"
        )

        serializer = BasicRecruiterSerializer(recruiters, many=True)
        return Response(serializer.data)


# This view does Create and List operations on the Job
class JobsList(generics.ListCreateAPIView):
    queryset = Job.objects.all()
    serializer_class = JobsSerializer
    permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.request.method == "POST":
            return [IsAuthenticated(), IsRecruiter()]
        return [IsAuthenticated(), IsJobSeekerOrRecruiter()]

    def get_queryset(self):
        user = self.request.user  # type hint lets Pylance know it's your model

        if user.user_type == "restaurant" and hasattr(user, "recruiter"):
            recruiter_company = user.recruiter.company
            return Job.objects.filter(company=recruiter_company)

        return Job.objects.all()

    def perform_create(self, serializer):
        user = self.request.user

        if not hasattr(user, "recruiter"):
            raise ValidationError("Only recruiters can create jobs.")

        current_recruiter = user.recruiter
        company = current_recruiter.company

        assignee = serializer.validated_data.get("assignee", current_recruiter)

        if assignee.company != company:
            raise ValidationError(
                "You can only assign recruiters from your own company."
            )

        serializer.save(company=company, assignee=assignee)


# This view does retrieving, updating, destroying the Job
class JobsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Job.objects.all()
    serializer_class = JobsSerializer

    def get_permissions(self):
        request_methods = ["PUT", "PATCH", "DELETE"]
        if self.request.method in request_methods:
            return [IsAuthenticated(), IsRecruiter()]
        return [IsAuthenticated(), IsJobSeekerOrRecruiter()]


# This view does the list and create operations on the ApplicationsTable
class ApplicationsCreate(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def perform_create(self, serializer):
        try:
            serializer.save()
        except IntegrityError:
            raise ValidationError("You have already applied to this job.")

class ApplicationsList(generics.ListAPIView):
    serializer_class = ApplicationResponseSerializer
    permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]

    def get_queryset(self):
        user = self.request.user
        print(f"User type: {user.user_id}")
        if(user and user.user_type == "chef"):
            return Application.objects.filter(applicant__user__user_id=user.user_id).select_related(
                "job", "applicant", "job__company"
            )
        elif user.user_type == "restaurant":
            company = user.recruiter.company
            job_title = self.request.query_params.get("title")

            queryset = Application.objects.filter(job__company=company)

            if job_title:
                queryset = queryset.filter(job__title__icontains=job_title)

            return queryset.select_related("job", "applicant", "job__company")


class ApplicationsDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Application.objects.select_related(
        "job", "job__company", "job__location",
        "applicant", "applicant__user", "applicant__user__location"
    ).all()
    serializer_class = ApplicationResponseSerializer

    def get_serializer_class(self):
        if self.request.method in ["PUT", "PATCH"]:
            return ApplicationSerializer
        return ApplicationResponseSerializer

    def get_permissions(self):
        if self.request.method in ["DELETE"]:
            # Deny everyone by raising PermissionDenied manually
            raise PermissionError("Delete is not allowed.")
        return [IsAuthenticated(), IsRecruiter()]


class JobSeekerProfileView(generics.RetrieveAPIView):
    serializer_class = JobSeekerProfileSerializer
    permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]
    lookup_field = "user__user_id"
    queryset = JobSeekerProfile.objects.select_related("user").all()


class UpdateJobSeekerApplicationStatus(generics.UpdateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated, IsRecruiter]

    def perform_update(self, serializer):
        status = self.request.data.get("status")
        application = self.get_object()

        if status not in dict(Application.STATUS).keys():
            raise ValidationError("Invalid status provided.")
        if application.status == status:
            raise ValidationError("Application is already in this status.")

        serializer.save(status=status)
class StoreLikedJobs(APIView):
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def post(self,request, *args, **kwargs):
        jobseeker = get_object_or_404(JobSeekerProfile, user=request.user)
        job_id = request.data.get("id")
        if not job_id:
            return Response({"error": "Job ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        job = get_object_or_404(Job, job_id=job_id)
        jobseeker.liked_jobs.add(job)
        return Response({"success": "Job liked successfully."}, status=status.HTTP_200_OK)

class LikedJobsView(generics.ListAPIView):
    serializer_class=JobsSerializer
    permission_classes=[IsAuthenticated,IsJobSeeker]
    
    def get_queryset(self):
        jobseeker = get_object_or_404(JobSeekerProfile,user=self.request.user)
        return jobseeker.liked_jobs.all()

class ManageLikedJobs(generics.GenericAPIView):
    serializer_class = JobsSerializer
    permission_classes = [IsAuthenticated, IsJobSeeker]
    def delete(self,request,*args,**kwargs):
        job_id = self.kwargs.get("pk")
        jobseeker = get_object_or_404(JobSeekerProfile, user=request.user)
        job = get_object_or_404(Job, job_id=job_id)
        
        if job  in jobseeker.liked_jobs.all():
            jobseeker.liked_jobs.remove(job)
            return Response({"detail":"Job Unliked."},status=status.HTTP_204_NO_CONTENT)
        return Response({"detail":"Job was not found."},status=status.HTTP_400_BAD_REQUEST)
        
        
        

# This view deals with retrieve messages, sending messages, getting messages
# class MessagesList(generics.ListAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]

#     def get_queryset(self):
#         user_id = self.kwargs["user_id"]
#         messages = Message.objects.filter(
#             id__in=Subquery(
#                 CustomUser.objects.filter(
#                     Q(sender__receiver=user_id) | Q(receiver__sender=user_id)
#                 )
#                 .distinct()
#                 .annotate(
#                     last_msg=Subquery(
#                         Message.objects.filter(
#                             Q(sender=OuterRef("pk"), receiver=user_id)
#                             | Q(receiver=OuterRef("pk"), sender=user_id)
#                         )
#                         .order_by("-user_id")[:1]
#                         .values_list("user_id", flat=True)
#                     )
#                 )
#                 .values_list("last_msg", flat=True)
#                 .order_by("-user_id")
#             )
#         ).order_by("-user_id")
#         return messages


class GetMessages(generics.ListAPIView):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]

    def get_sender_and_receiver(self):
        sender = self.kwargs["sender"]
        receiver = self.kwargs["receiver"]
        sender_object = get_object_or_404(CustomUser, uid=sender)
        receiver_object = get_object_or_404(CustomUser, uid=receiver)
        return sender_object, receiver_object

    def get_queryset(self):
        sender_object, receiver_object = self.get_sender_and_receiver()

        before_str = self.request.query_params.get("before")
        if before_str:
            try:
                before = timezone.datetime.fromisoformat(before_str)
            except ValueError:
                before = timezone.now()
        else:
            before = timezone.now()

        after = before - timedelta(days=3)

        return Message.objects.filter(
            sender__in=[sender_object.user_id, receiver_object.user_id],
            receiver__in=[sender_object.user_id, receiver_object.user_id],
            timestamp__lt=before,
            timestamp__gte=after,
        ).order_by("-timestamp")

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)

        sender_object, receiver_object = self.get_sender_and_receiver()

        # Check if older messages exist before this batch
        oldest_msg = queryset.last()
        has_more = False
        if oldest_msg:
            has_more = Message.objects.filter(
                sender__in=[sender_object.user_id, receiver_object.user_id],
                receiver__in=[sender_object.user_id, receiver_object.user_id],
                timestamp__lt=oldest_msg.timestamp,
            ).exists()

        return Response({"messages": serializer.data, "has_more": has_more})


# class SendMessage(generics.CreateAPIView):
#     serializer_class = MessageSerializer
#     permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]

#     def post(self, request, *args, **kwargs):
#         sender_email = request.data.get("sender")
#         receiver_email = request.data.get("receiver")
#         message_content = request.data.get("message_content")
#         print(sender_email, receiver_email, message_content)
#         # Validate required fields
#         if not sender_email or not receiver_email or not message_content:
#             return Response(
#                 {"error": "Sender, Receiver and Message is required."},
#                 status=status.HTTP_400_BAD_REQUEST,
#             )
#         # Get sender and receiver user objects
#         sender = get_object_or_404(CustomUser, uid=sender_email)
#         receiver = get_object_or_404(CustomUser, uid=receiver_email)

#         # Prepare data for MessageSerializer
#         message_data = {
#             "sender": sender.user_id,
#             "receiver": receiver.user_id,
#             "message_content": message_content,
#         }
#         serializer = self.serializer_class(data=message_data)
#         print(serializer)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(
#                 {"message": "The message is sent successfully"},
#                 status=status.HTTP_200_OK,
#             )
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class MarkMessageAsRead(generics.UpdateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]

    def get_queryset(self):
        # Ensure the logged-in user can only mark messages they received
        return self.queryset.filter(receiver=self.request.user)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.read_status = True  # Mark as read
        instance.save()
        return super().partial_update(request, *args, **kwargs)


class GetUserProfileForMessage(APIView):
    permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]

    def get(self, request, *args, **kwargs):
        user = request.user
        if user.user_type == "restaurant":
            job_seeker_ids = (
                Application.objects.filter(job__assignee__user=user)
                .values_list("applicant__user__user_id", flat=True)
                .distinct()
            )

            jobseekers = CustomUser.objects.filter(user_id__in=job_seeker_ids)
            serializer = GetProfileForMessageSerializer(jobseekers, many=True)
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        if user.user_type == "chef":
            # Recruiters who sent messages to this jobseeker
            received_from_ids = (
                Message.objects.filter(receiver=user, sender__user_type="restaurant")
                .values_list("sender__user_id", flat=True)
                .distinct()
            )
            # Recruiters this jobseeker sent messages to
            sent_to_ids = (
                Message.objects.filter(sender=user, receiver__user_type="restaurant")
                .values_list("receiver__user_id", flat=True)
                .distinct()
            )
            # Recruiters assigned to jobs this jobseeker applied to
            applied_recruiter_ids = set()
            try:
                job_seeker_profile = user.job_seeker
                applied_recruiter_ids = set(
                    Application.objects.filter(applicant=job_seeker_profile)
                    .values_list("job__assignee__user__user_id", flat=True)
                    .distinct()
                )
            except Exception:
                pass

            all_ids = set(received_from_ids) | set(sent_to_ids) | applied_recruiter_ids
            recruiters = CustomUser.objects.filter(user_id__in=all_ids)
            serialize = GetProfileForMessageSerializer(recruiters, many=True)
            return Response(serialize.data, status=status.HTTP_200_OK)
        return Response({"detail": "Invalid role."}, status=400)


class SearchUser(generics.ListAPIView):
    serializer_class = CustomUserSerializer
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated, IsJobSeekerOrRecruiter]

    def list(self, request, *args, **kwargs):
        username = self.kwargs["username"]
        logged_in_user = self.request.user

        users = CustomUser.objects.filter(
            Q(user_id__username__icontains=username)
            | Q(last_name__icontains=username)
            | Q(first_name__icontains=username)
            | Q(user_id__email__icontains=username) & ~Q(user_id=logged_in_user)
        )
        if not users.exists():
            return Response(
                {"detail": "No user was found with that username"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = self.get_serializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
