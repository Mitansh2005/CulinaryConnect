from rest_framework.exceptions import ValidationError
from rest_framework import serializers
from .models import (
    Company,
    CompanyMembership,
    Location,
    CustomUser,
    JobSeekerProfile,
    Job,
    Application,
    Message,
    RecruiterProfile,
)
import pycountry


class LocationSerializer(serializers.ModelSerializer):
    country = serializers.CharField()

    class Meta:
        model = Location
        fields = ["country", "state", "city", "postal_code"]

    def validate_country(self, value):
        """Ensure the country is a real, valid country name."""
        try:
            pycountry.countries.lookup(value)  # Will raise error if not valid
        except LookupError:
            raise serializers.ValidationError(f'"{value}" is not a valid country name.')
        return value

    def create(self, validated_data):
        """Check if country already exists (case-insensitive); create only if new."""
        country_name = validated_data.get("country")

        # Check for duplicate country+state+city+postal_code combo
        existing = Location.objects.filter(
            country__iexact=country_name,
            state__iexact=validated_data.get("state"),
            city__iexact=validated_data.get("city"),
            postal_code=validated_data.get("postal_code"),
        ).first()

        if existing:
            return existing  # Reuse existing record

        return Location.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """Update the country instance safely after validation."""
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class CompanySerializer(serializers.ModelSerializer):
    location = LocationSerializer()

    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "size",
            "description",
            "fssai_license_no",
            "logo",
            "location",
            "created_at",
            "updated_at",
        ]

    def validate(self, data):
        # Validate that the user is a recruiter before proceeding
        user = self.context["request"].user
        print(user)
        if not hasattr(user, "recruiter"):
            raise ValidationError("Only recruiters can create companies.")
        return data

    def validate_fssai_license_no(self, value):
        if Company.objects.filter(fssai_license_no=value).exists():
            raise ValidationError("Company with this FSSAI License already exists.")
        return value

    def create(self, validated_data):
        user = self.context["request"].user

        # Create the company
        company = Company.objects.create(**validated_data)

        # Link the recruiter to the company
        recruiter = user.recruiterprofile
        recruiter.company = company
        recruiter.save()

        return company

    def update(self, instance, validated_data):
        # Update the company instance with validated data
        for attr, value in validated_data.items():
            if attr == "location":
                # Handle nested location update
                location_data = value
                location_obj, _ = Location.objects.get_or_create(
                    city=location_data.get("city"),
                    state=location_data.get("state"),
                    country=location_data.get("country"),
                    postal_code=location_data.get("postal_code"),
                )
                setattr(instance, "location", location_obj)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance


class CustomUserSerializer(serializers.ModelSerializer):
    JOB_TYPES = (("Full Time", "Full-Time"), ("Part Time", "Part-Time"))
    JOB_SEARCH_STATUS_CHOICES = [
        ("available", "Available to Start"),
        ("looking", "Just Looking"),
        ("not_looking", "Not Looking"),
    ]

    # Nested field
    location = LocationSerializer()
    # Recruiter-only fields
    company = serializers.CharField(required=False, allow_null=True)
    designation = serializers.CharField(required=False, allow_null=True)
    company = serializers.CharField(required=False, allow_null=True, allow_blank=True)
    designation = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )
    # Job seeker-only fields
    speciality = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )
    experience_years = serializers.IntegerField(required=False, allow_null=True)
    achievements = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )
    job_type_preference = serializers.ChoiceField(
        choices=JobSeekerProfile.JOB_TYPES, required=False, allow_null=True
    )
    preferred_job_roles = serializers.CharField(
        required=False, allow_null=True, allow_blank=True
    )
    consent_box = serializers.BooleanField(required=False, allow_null=True)
    relocate_confirmation = serializers.BooleanField(required=False, allow_null=True)
    job_search_status = serializers.ChoiceField(
        choices=JobSeekerProfile.JOB_SEARCH_STATUS_CHOICES, required=False, allow_null=True
    )

    class Meta:
        model = CustomUser
        fields = [
            "user_id",
            "uid",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone_number",
            "profile_picture",
            "user_type",
            "location",
            "bio",
            "consent_box",
            # Recruiter
            "company",
            "designation",
            # JobSeeker
            "speciality",
            "experience_years",
            "achievements",
            "job_type_preference",
            "preferred_job_roles",
            "relocate_confirmation",
            "job_search_status",
        ]

    def validate(self, attrs):
        user_type = attrs.get("user_type")

        if user_type == "restaurant":
            missing = []
            if not attrs.get("company"):
                missing.append("company")
            if not attrs.get("designation"):
                missing.append("designation")
            if missing:
                raise serializers.ValidationError(
                    {
                        field: "This field is required for restaurants."
                        for field in missing
                    }
                )

        return attrs

    def to_representation(self, instance):
        data = super().to_representation(instance)

        if instance.user_type == "restaurant":
            recruiter = getattr(instance, "recruiter", None)
            if recruiter:
                data["company"] = recruiter.company.name if recruiter.company else None
                data["designation"] = recruiter.designation

        elif instance.user_type == "chef":
            jobseeker = getattr(instance, "job_seeker", None)
            if jobseeker:
                data.update(
                    {
                        "speciality": jobseeker.speciality,
                        "experience_years": jobseeker.experience_years,
                        "achievements": jobseeker.achievements,
                        "job_type_preference": jobseeker.job_type_preference,
                        "preferred_job_roles": jobseeker.preferred_job_roles,
                        "relocate_confirmation": jobseeker.relocate_confirmation,
                        "job_search_status": jobseeker.job_search_status,
                    }
                )

        return data

    def create(self, validated_data):
        location_data = validated_data.pop("location", None)

        location = None
        if location_data:
            location_obj, _ = Location.objects.get_or_create(
                city=location_data.get("city"),
                state=location_data.get("state"),
                country=location_data.get("country"),
                postal_code=location_data.get("postal_code"),
            )
        validated_data["location"] = location_obj
        user_type = validated_data.get("user_type")

        # Split recruiter fields
        company_name = validated_data.pop("company", None)
        designation = validated_data.pop("designation", None)

        # Split job seeker fields
        job_seeker_fields = {
            "speciality": validated_data.pop("speciality", None),
            "experience_years": validated_data.pop("experience_years", None),
            "achievements": validated_data.pop("achievements", None),
            "job_type_preference": validated_data.pop("job_type_preference", None),
            "preferred_job_roles": validated_data.pop("preferred_job_roles", None),
            "relocate_confirmation": validated_data.pop("relocate_confirmation", False),
            "job_search_status": validated_data.pop("job_search_status", "looking"),
        }

        # Create user
        user = CustomUser.objects.create(location=location, **validated_data)

        if user_type == "restaurant":
            company_obj = Company.objects.get(name=company_name)
            RecruiterProfile.objects.create(
                user=user,
                company=company_obj,
                designation=designation,
            )
        elif user_type == "chef":
            JobSeekerProfile.objects.create(user=user, **job_seeker_fields)

        return user

    def update(self, instance, validated_data):
        # Handle nested location update
        location_data = validated_data.pop("location", None)
        if location_data:
            location_obj, _ = Location.objects.get_or_create(
                city=location_data.get("city"),
                state=location_data.get("state"),
                country=location_data.get("country"),
                postal_code=location_data.get("postal_code"),
            )
            instance.location = location_obj

        user_type = instance.user_type  # user_type is fixed once user is created

        # Recruiter-specific fields
        company_name = validated_data.pop("company", None)
        fssai_license_no = validated_data.pop("fssai_license_no", None)
        designation = validated_data.pop("designation", None)

        # JobSeeker-specific fields
        job_seeker_fields = {
            "speciality": validated_data.pop("speciality", None),
            "experience_years": validated_data.pop("experience_years", None),
            "achievements": validated_data.pop("achievements", None),
            "job_type_preference": validated_data.pop("job_type_preference", None),
            "preferred_job_roles": validated_data.pop("preferred_job_roles", None),
            "relocate_confirmation": validated_data.pop("relocate_confirmation", None),
            "job_search_status": validated_data.pop("job_search_status", None),
        }

        # Update basic CustomUser fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Update role-specific profiles
        if user_type == "restaurant":
            recruiter = getattr(instance, "recruiter", None)
            if recruiter:
                if company_name:
                    company = Company.objects.get(name=company_name)
                    recruiter.company = company
                if fssai_license_no is not None:
                    recruiter.fssai_license_no = fssai_license_no
                if designation is not None:
                    recruiter.designation = designation
                recruiter.save()

        elif user_type == "chef":
            jobseeker = getattr(instance, "job_seeker", None)
            if jobseeker:
                for key, value in job_seeker_fields.items():
                    if value is not None:
                        setattr(jobseeker, key, value)
                jobseeker.save()

        return instance


class CompanyMembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyMembership
        fields = "__all__"


class BasicRecruiterSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")

    class Meta:
        model = RecruiterProfile
        fields = ["recruiter_id", "username", "company"]


class RecruiterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecruiterProfile
        fields = "__all__"


class JobSeekerProfileSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)

    class Meta:
        model = JobSeekerProfile
        fields = [
            "user",
            "experience_years",
            "achievements",
            "job_type_preference",
            "preferred_job_roles",
            "relocate_confirmation",
            "job_search_status",
        ]


class ProfileSetupSerializer(serializers.Serializer):
    uid = serializers.CharField()
    username = serializers.CharField()
    user_type = serializers.ChoiceField(
        choices=[("restaurant", "Restaurant"), ("chef", "Chef")]
    )
    company_name = serializers.CharField(required=False, allow_null=True)
    fssai_license_no = serializers.CharField(required=False, allow_null=True)

    def validate(self, data):
        user_type = data.get("user_type")
        company_name = data.get("company_name")
        fssai_license_no = data.get("fssai_license_no")

        if user_type == "restaurant":
            if not company_name or not company_name.strip():
                raise serializers.ValidationError(
                    {"company_name": "This field is required for restaurants."}
                )
            if not fssai_license_no or not fssai_license_no.strip():
                raise serializers.ValidationError(
                    {"fssai_license_no": "This field is required for restaurants."}
                )

        return data

    def create(self, validated_data):
        uid = validated_data["uid"]
        username = validated_data["username"]
        user_type = validated_data["user_type"]

        user, created = CustomUser.objects.get_or_create(
            uid=uid,
            defaults={
                "username": username,
                "user_type": user_type,
                "email": self.context["email"],  # extracted from Firebase token
            },
        )
        if not created and not user.user_type:
            user.user_type = user_type
            user.save()
        elif not created and user.user_type and user.user_type != user_type:
            raise serializers.ValidationError("User type cannot be changed once set")

        if user_type == "restaurant" and not hasattr(user, "recruiter"):
            company_name = validated_data.get("company_name")
            fssai_license_no = validated_data.get("fssai_license_no")
            company = None
            if company_name:
                company, created = Company.objects.get_or_create(
                    fssai_license_no=fssai_license_no,
                    defaults={
                        "name": company_name,
                        "fssai_license_no": fssai_license_no,
                    },
                )

            RecruiterProfile.objects.create(
                user=user,
                company=company,
            )
            if created:
                role = CompanyMembership.COMPANY_ADMIN
            else:
                existing_admin = CompanyMembership.objects.filter(
                    company=company, role=CompanyMembership.COMPANY_ADMIN
                ).first()
                if existing_admin:
                    role = CompanyMembership.COMPANY_RECRUITER
                else:
                    role = CompanyMembership.COMPANY_ADMIN
            CompanyMembership.objects.create(user=user, company=company, role=role)

        elif user_type == "chef" and not hasattr(user, "job_seeker"):
            JobSeekerProfile.objects.create(user=user)

        return user


class JobsSerializer(serializers.ModelSerializer):
    location = LocationSerializer()
    assignee = serializers.PrimaryKeyRelatedField(
        queryset=RecruiterProfile.objects.all(), required=False
    )
    company_name = serializers.CharField(source="company.name", read_only=True)
    company_logo = serializers.CharField(source="company.logo", read_only=True)
    company_description = serializers.CharField(
        source="company.description", read_only=True
    )
    applicant_count = serializers.SerializerMethodField()
    read_only_fields = ["created_at", "updated_at"]

    class Meta:
        model = Job
        fields = [
            "assignee",
            "job_id",
            "company",
            "company_name",
            "company_logo",
            "company_description",
            "title",
            "description",
            "location",
            "salary",
            "employment_type",
            "status",
            "posted_date",
            "application_deadline",
            "requirements",
            "applicant_count",
            "created_at",
            "updated_at",
        ]

    def get_applicant_count(self, obj):
        return Application.objects.filter(job=obj).count()

    def create(self, validated_data):
        location_data = validated_data.pop("location")
        location_obj, _ = Location.objects.get_or_create(
            city=location_data.get("city"),
            state=location_data.get("state"),
            country=location_data.get("country"),
            postal_code=location_data.get("postal_code"),
        )

        validated_data["location"] = location_obj
        return super().create(validated_data)

    def update(self, instance, validated_data):
        location_name = validated_data.pop("location", None)
        if location_name:
            location_obj, _ = Location.objects.get_or_create(name=location_name)
            validated_data["location"] = location_obj
        return super().update(instance, validated_data)


class JobSummarySerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source="company.name", read_only=True)
    assignee_id = serializers.IntegerField(
        source="assignee.user.user_id", read_only=True
    )
    assignee_name = serializers.CharField(
        source="assignee.user.username", read_only=True
    )
    location = LocationSerializer(read_only=True)

    class Meta:
        model = Job
        fields = [
            "job_id",
            "assignee_id",
            "assignee_name",
            "company_name",
            "title",
            "location",
            "salary",
            "employment_type",
        ]


class ApplicationResponseSerializer(serializers.ModelSerializer):
    applicant_uid = serializers.CharField(write_only=True)
    applicant = JobSeekerProfileSerializer(read_only=True)
    job = JobSummarySerializer(read_only=True)

    class Meta:
        model = Application
        fields = [
            "application_id",
            "job",
            "applicant",
            "application_date",
            "status",
            "updated_at",
            "applicant_uid",
        ]
        read_only_fields = ["application_id", "status", "updated_at"]


class ApplicationSerializer(serializers.ModelSerializer):
    applicant_uid = serializers.CharField(write_only=True)
    applicant = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Application
        fields = "__all__"
        read_only_fields = ["application_id", "status", "updated_at"]

    def create(self, validated_data):
        uid = validated_data.pop("applicant_uid", None)

        if not uid:
            raise serializers.ValidationError(
                {"applicant_uid": "This field is required."}
            )

        try:
            user = CustomUser.objects.get(uid=uid)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError(
                {"applicant_uid": "User with this UID does not exist."}
            )

        if user.user_type != CustomUser.CHEF:
            raise serializers.ValidationError(
                {"user_type": "Only jobseekers can apply to jobs."}
            )

        if not hasattr(user, "job_seeker"):
            raise serializers.ValidationError(
                {"job_seeker": "Jobseeker profile is missing or not set up."}
            )

        validated_data["applicant"] = (
            user.job_seeker
        )  # ✅ Fix: assign JobSeekerProfile instance
        return super().create(validated_data)


class MessageSerializer(serializers.ModelSerializer):
    sender_uid = serializers.CharField(source="sender.uid", read_only=True)
    receiver_uid = serializers.CharField(source="receiver.uid", read_only=True)
    sender_username = serializers.CharField(source="sender.username", read_only=True)
    receiver_username = serializers.CharField(
        source="receiver.username", read_only=True
    )

    class Meta:
        model = Message
        fields = "__all__"
        read_only_fields = ["read_status"]


class ApplicationStatusSerializer(serializers.ModelSerializer):
    job_id = serializers.IntegerField(source="job.job_id")
    job_title = serializers.CharField(source="job.title")

    class Meta:
        model = Application
        fields = ["job_id", "job_title", "status"]


class GetProfileForMessageSerializer(serializers.ModelSerializer):
    applications = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ["uid", "username", "user_type", "profile_picture", "applications"]

    def get_applications(self, obj):
        try:
            jobseeker = obj.job_seeker
            apps = Application.objects.filter(applicant=jobseeker)
            return ApplicationStatusSerializer(apps, many=True).data
        except JobSeekerProfile.DoesNotExist:
            return []
