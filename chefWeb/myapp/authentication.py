from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed
from firebase_admin import auth
from .models import CustomUser

class FirebaseAuthentication(BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if not auth_header.startswith("Bearer "):
            return None

        id_token = auth_header.split(" ")[1]

        try:
            decoded_token = auth.verify_id_token(id_token)
            uid = decoded_token.get("uid")
            email = decoded_token.get("email")
            name = decoded_token.get("name", email.split("@")[0])

            if not uid or not email:
                raise AuthenticationFailed("Invalid Firebase token.")

            user, created = CustomUser.objects.get_or_create(
                uid=uid,
                defaults={
                    "email": email,
                    "username": name,
                },
            )
            print("Authentication.py is running. User:", user, "Created:", created)
            return (user, None)

        except Exception as e:
            raise AuthenticationFailed(f"Firebase auth failed: {str(e)}")
