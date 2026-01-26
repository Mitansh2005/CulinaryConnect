from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import Company, CompanyMembership, CustomUser, JobSeekerProfile,Location,Job,Application,Notification,Message, RecruiterProfile
# Register your models here.
    
class UserAdmin(BaseUserAdmin):
    model = CustomUser
    list_display=["user_id","uid","username","first_name","last_name","email","phone_number","user_type","location","short_bio","consent_box","is_staff","created_at","updated_at"]
    fieldsets = (
    ('Personal info', {'fields': ('username',"first_name","last_name","email",'phone_number', 'user_type',"location","bio")}),
    ('Permissions', {'fields': ('is_staff', 'is_active', 'is_superuser', 'groups', 'user_permissions')}),
    ('Important dates', {'fields': ('last_login',)}),
    )
    
    add_fieldsets = (
    (None, {
        'classes': ('wide',),
        'fields': ('uid','user_type','is_staff', 'is_active')}
    ),
    )
    readonly_fields=('created_at','updated_at','uid')
    search_fields = ('uid','email','user_type')
    ordering = ('email', 'created_at')
    

  # Method to return the shortened bio
    def short_bio(self, obj):
        # Limit the bio to the first 50 characters, adding '...' if it's longer
        if(obj.bio is None):
          return ""
        
        return obj.bio[:50] + '...' if len(obj.bio) > 50 else obj.bio
    short_bio.admin_order_field = 'bio'  # Allow sorting by the original bio field
    short_bio.short_description = 'Bio'  # Label for the column
class CompanyMemberShipAdmin(admin.ModelAdmin):
  list_display=["user","company","role","created_at"]
class LocationAdmin(admin.ModelAdmin):
  list_display=["country","state","city","postal_code"]

class CompanyAdmin(admin.ModelAdmin):
  list_display=["id","name","size","description","fssai_license_no","logo","slug","created_at","updated_at"]
  def short_description(self, obj):
        length = 100  # Adjust this value to your desired length
        return (obj.description[:length] + '...') if len(obj.description) > length else obj.description
  readonly_fields=("created_at","updated_at","slug","fssai_license_no")
class RecruiterProfileAdmin(admin.ModelAdmin):
  list_display=["recruiter_id","user","company","designation"]
class JobSeekerProfileAdmin(admin.ModelAdmin):
  list_display=["jobseeker_id","user","experience_years","achievements","job_type_preference","preferred_job_roles","display_liked_jobs","relocate_confirmation","job_search_status"]
  
  def display_liked_jobs(self, obj):
        return ", ".join([job.title for job in obj.liked_jobs.all()])
    
  display_liked_jobs.short_description = "Liked Jobs"
class JobAdmin(admin.ModelAdmin):
  list_display=["assignee","job_id","company","title","description","location","salary","employment_type","posted_date","application_deadline","short_requirements","created_at","updated_at"]
  def short_requirements(self, obj):
        length = 100  # Adjust this value to your desired length
        return (obj.requirements[:length] + '...') if len(obj.requirements) > length else obj.requirements
  short_requirements.short_requirements = 'requirements'
  readonly_fields=("created_at","updated_at")

class ApplicationAdmin(admin.ModelAdmin):
  list_display=["application_id","job","applicant","application_date","status","updated_at"]
  readonly_fields=("updated_at",)
class MessageAdmin(admin.ModelAdmin):
  list_display=["sender","receiver","content","timestamp","read"]
  
class NotificationAdmin(admin.ModelAdmin):
  list_display=["notification_id","user","notification_type","message","sent_date","read_status"]
  
 
admin.site.register(CustomUser,UserAdmin)
admin.site.register(CompanyMembership,CompanyMemberShipAdmin)
admin.site.register(Location,LocationAdmin)
admin.site.register(JobSeekerProfile,JobSeekerProfileAdmin)
admin.site.register(RecruiterProfile,RecruiterProfileAdmin)
admin.site.register(Company,CompanyAdmin)
admin.site.register(Job,JobAdmin)
admin.site.register(Application,ApplicationAdmin)
admin.site.register(Message,MessageAdmin)
admin.site.register(Notification,NotificationAdmin)

