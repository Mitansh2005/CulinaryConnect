from rest_framework import permissions

from myapp.models import CompanyMembership


class IsJobSeeker(permissions.BasePermission):
    """
    Allows access only to users with user_type 'chef'.
    """

    def has_permission(self, request, view):
        return request.user and request.user.user_type == "chef"


class IsRecruiter(permissions.BasePermission):
    """
    Allows access only to users with user_type 'restaurant'.
    """

    def has_permission(self, request, view):
        return request.user and request.user.user_type == "restaurant"


class IsJobSeekerOrRecruiter(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.user_type in ["chef", "restaurant"]

class IsCompanyAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if not user or user.user_type != "restaurant":
            return False
        company_id = view.kwargs.get('pk')
        
        if not company_id:
            return False
        return CompanyMembership.objects.filter(user=user,company_id=company_id,role=CompanyMembership.COMPANY_ADMIN).exists()
