import random
from datetime import date, timedelta
from django.core.management.base import BaseCommand
from faker import Faker
from myapp.models import Company, Job, RecruiterProfile  # Replace 'yourapp' with your actual app name
from myapp.models import Location
# Initialize Faker
fake = Faker()

# Define possible employment types
employment_types = ["Full Time", "Part Time"]

# Function to generate fake job data
def generate_fake_job_data(num_jobs):
    jobs = []
    start_date = date(2025,6,20)
    # Fetch only users who are employers
    locations_choices=Location.objects.all()
    company_choices = Company.objects.all()
    if not company_choices.exists():
        raise ValueError("No companies found. Cannot create jobs")

    for _ in range(num_jobs):
        company=random.choice(company_choices)
        recruiter_users = RecruiterProfile.objects.filter(company=company)
        if recruiter_users.exists():
            assignee = random.choice(recruiter_users)
        else:   
            print(f"No employers found for company: {company.name}")
            assignee = None
        title = fake.job()
        description = fake.paragraph(nb_sentences=5)
        location = random.choice(locations_choices)
        salary = random.randint(30000, 4000000)
        employment_type = random.choice(employment_types)
        posted_date = fake.date_between(start_date=start_date, end_date='today')
        application_deadline = posted_date + timedelta(days=random.randint(15, 90))
        requirements = fake.paragraph(nb_sentences=15)

        job = Job(
            assignee=assignee,
            company=company,
            title=title,
            description=description,
            location=location,
            salary=salary,
            employment_type=employment_type,
            posted_date=posted_date,
            application_deadline=application_deadline,
            requirements=requirements
        )
        jobs.append(job)
    return jobs

class Command(BaseCommand):
    help = 'Populate Jobs table with fake data'

    def handle(self, *args, **kwargs):
        num_jobs = 100  # You can adjust this value
        fake_jobs = generate_fake_job_data(num_jobs)

        # Bulk create fake jobs in the database
        Job.objects.bulk_create(fake_jobs)

        self.stdout.write(self.style.SUCCESS(f'Successfully populated {num_jobs} fake jobs into the database!'))
