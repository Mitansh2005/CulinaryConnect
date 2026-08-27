from django.core.management.base import BaseCommand
from django.utils import timezone
from myapp.models import JobView
from datetime import timedelta
class Command(BaseCommand):
    help = "Delete job views older than 30 days"

    def handle(self, *args, **kwargs):
        cutoff_date = timezone.now() - timedelta(days=30)
        deleted, _ = JobView.objects.filter(view_date__lt=cutoff_date).delete()
        self.stdout.write(f"Deleted {deleted} old job views.")