import random
import string
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from faker import Faker

from myapp.models import Company, Location

fake = Faker()
company_size_choices = [
    "small","medium","large","enterprise"
    ]
def generate_fake_fssai_license():
    # FSSAI license numbers are typically 14 digits
    return ''.join([str(random.randint(0, 9)) for _ in range(14)])

def generate_fake_companies(num_companies):
    companies = []
    location_choices = Location.objects.all()
    for _ in range(num_companies):
        company_name=fake.company()
        slug_base = slugify(company_name)
        random_suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=6))
        unique_slug = f"{slug_base}-{random_suffix}"
        fssai_license_no = generate_fake_fssai_license()
        company_size=random.choice(company_size_choices)
        company_description=fake.paragraph(nb_sentences=5)
        location=random.choice(location_choices)
        
        company = Company(
            name=company_name,
            size=company_size,
            description=company_description,
            location=location,
            fssai_license_no = fssai_license_no,
            slug=unique_slug
        )
        companies.append(company)
    return companies
    
class Command(BaseCommand):
    help='Populate Companies table with fake data'
    def handle(self, *args, **kwargs):
        num_companies = 50
        fake_companies = generate_fake_companies(num_companies)
        
        Company.objects.bulk_create(fake_companies)
        self.stdout.write(self.style.SUCCESS(f'Successfully populated {num_companies} fake companies into the database!'))