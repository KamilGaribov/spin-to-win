# Base image
FROM python:3.12-slim

# Set work directory
WORKDIR /app

# Copy requirements and install
COPY requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Copy project files
COPY . .

# Expose port
EXPOSE 8000

# Run Django server (dev)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
