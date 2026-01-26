import random
from django.core.management.base import BaseCommand
from faker import Faker
from myapp.models import Location  
import pycountry
class Command(BaseCommand):
    help = 'Populate Location table with fake data'

    def handle(self, *args, **kwargs):
        fake = Faker()
        
        # Get a dictionary of ISO country codes mapped to their full names
        country_choices = [country.name for country in pycountry.countries]

        for _ in range(100):  # You can modify this number to generate more/less records
            country = random.choice(country_choices)  # Randomly choose a country code
            state = fake.state()
            city = fake.city()
            postal_code = fake.postcode()

            # Create and save the fake entry
            Location.objects.create(
                country=country,
                state=state,
                city=city,
                postal_code=postal_code
            )

        self.stdout.write(self.style.SUCCESS('Successfully populated the Location model with fake data!'))
