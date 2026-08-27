FROM python:3.10-slim

ENV PYTHONUNBUFFERED=1

# Set work directory inside container
WORKDIR /app

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy everything else (manage.py, chefWeb, myapp, etc.)
COPY . .
# Copy the service account file into the container
COPY service_account.json /app/service_account.json


# Optional: expose the port (default Django port)
EXPOSE 8000

# Run Django server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
