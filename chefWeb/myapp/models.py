from django.utils.text import slugify
from django.db import models
from django.contrib.auth.models import AbstractUser


class Location(models.Model):
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=150)
    city = models.CharField(max_length=150)
    postal_code = models.CharField(max_length=10)

    class Meta:
        indexes = [
            models.Index(fields=["country", "state", "city"]),
        ]

    def __str__(self):
        return f"{self.country}\t{self.state}\t{self.city}\t{self.postal_code}"


class Company(models.Model):
    COMPANY_SIZE_CHOICES = [
        ("small", "1-50 employees"),
        ("medium", "51-250 employees"),
        ("large", "251-1000 employees"),
        ("enterprise", "1000+ employees"),
    ]
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=500)
    size = models.CharField(max_length=20, choices=COMPANY_SIZE_CHOICES)
    description = models.TextField(max_length=10000)
    fssai_license_no = models.CharField(max_length=250,unique=True)
    logo = models.CharField(max_length=8000000, null=True, blank=True)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True)
    slug = models.SlugField(unique=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class CustomUser(AbstractUser):
    RESTAURANT = "restaurant"
    CHEF = "chef"
    USER_TYPE_CHOICES = [
        (RESTAURANT, "Restaurant"),
        (CHEF, "Chef"),
    ]

    user_id = models.AutoField(primary_key=True)
    uid = models.CharField(max_length=128, unique=True)  # Store Firebase UID
    username = models.CharField(
        max_length=250, unique=True, blank=True, null=True
    )  # From Firebase
    first_name = models.CharField(max_length=150, blank=True, null=True)
    last_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(max_length=254, unique=True)  # From Firebase
    phone_number = models.CharField(
        max_length=15, blank=True, null=True
    )  # Optionally from Firebase
    profile_picture = models.CharField(max_length=8000000, null=True, blank=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPE_CHOICES)
    location = models.ForeignKey(Location, on_delete=models.SET_NULL, null=True)
    bio = models.TextField(max_length=1000, null=True,blank=True)
    consent_box = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    REQUIRED_FIELDS = []

    def __str__(self):
        return str(self.email) if self.email else "No Email"
    
class CompanyMembership(models.Model):
    COMPANY_ADMIN = 'admin'
    COMPANY_RECRUITER = 'recruiter'

    ROLE_CHOICES = [
        (COMPANY_ADMIN, 'Company Admin'),
        (COMPANY_RECRUITER, 'Recruiter'),
    ]

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'company')


class RecruiterProfile(models.Model):
    recruiter_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        CustomUser, on_delete=models.CASCADE, related_name="recruiter"
    )
    company = models.ForeignKey(
        Company, on_delete=models.CASCADE, related_name="recruiters",null=True,blank=True
    )
    designation = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}"


class JobSeekerProfile(models.Model):
    JOB_TYPES = (("Full Time", "Full-Time"), ("Part Time", "Part-Time"))
    JOB_SEARCH_STATUS_CHOICES = [
        ("available", "Available to Start"),
        ("looking", "Just Looking"),
        ("not_looking", "Not Looking"),
    ]
    jobseeker_id = models.AutoField(primary_key=True)
    user = models.OneToOneField(
        CustomUser, related_name="job_seeker", on_delete=models.CASCADE
    )
    experience_years = models.IntegerField(null=True)
    speciality = models.CharField(max_length=100, null=True, blank=True)
    achievements = models.CharField(max_length=1000, null=True, blank=True)
    job_type_preference = models.CharField(max_length=20, choices=JOB_TYPES,null=True,blank=True)
    preferred_job_roles = models.CharField(max_length=500, null=True)
    relocate_confirmation = models.BooleanField(default=False)
    job_search_status = models.CharField(
        max_length=20, choices=JOB_SEARCH_STATUS_CHOICES, default="looking",null=True
    )
    liked_jobs = models.ManyToManyField(
        "Job", related_name="liked_by", blank=True
    )
    def __str__(self):
        return f"{self.user.username}"


class Job(models.Model):
    EMP_TYPES = (("Full Time", "Full-Time"), ("Part Time", "Part-Time"))
    assignee = models.ForeignKey(
        RecruiterProfile, on_delete=models.SET_NULL, null=True, blank=True
    )
    job_id = models.AutoField(primary_key=True)
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name="jobs")
    title = models.CharField(max_length=200)
    description = models.TextField(max_length=8000)
    location = models.ForeignKey(
        Location, on_delete=models.SET_NULL, null=True, blank=True
    )
    salary = models.BigIntegerField()
    employment_type = models.CharField(max_length=20, choices=EMP_TYPES)
    posted_date = models.DateField()
    application_deadline = models.DateField()
    requirements = models.TextField(max_length=65535)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["title", "employment_type"]),
        ]

    def __str__(self) -> str:
        return f"{self.title}"

#This model tracks job viewed by the users
class JobView(models.Model):
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="views")
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="job_views")
    view_date = models.DateTimeField(auto_now_add=True)
    
class Application(models.Model):
    STATUS = (("p", "pending"), ("a", "accepted"), ("r", "rejected"))
    application_id = models.AutoField(primary_key=True)
    job = models.ForeignKey(Job, on_delete=models.CASCADE)
    applicant = models.ForeignKey(JobSeekerProfile, models.CASCADE)
    application_date = models.DateField()
    status = models.CharField(max_length=1, choices=STATUS, default="p")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["job_id", "applicant_id"], name="unique_job_application"
            )
        ]


class Message(models.Model):
    sender = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True, related_name="sent_messages"
    )
    receiver = models.ForeignKey(
        CustomUser,
        on_delete=models.SET_NULL,
        null=True,
        related_name="received_messages",
    )
    content = models.TextField(max_length=65535)
    timestamp = models.DateTimeField(auto_now_add=True)  # Combines date + time
    read = models.BooleanField(default=False)

    class Meta:
        ordering = ["timestamp"]

    def __str__(self):
        return f"{self.sender} → {self.receiver} @ {self.timestamp}"


class Notification(models.Model):
    NOTIFICATION_TYPE = (
        ("new_job", "new job"),
        ("application_status", "application status"),
    )
    notification_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    notification_type = models.CharField(max_length=50, choices=NOTIFICATION_TYPE)
    message = models.TextField(max_length=1500)
    sent_date = models.DateTimeField(auto_now_add=True)
    read_status = models.BooleanField(default=False)
