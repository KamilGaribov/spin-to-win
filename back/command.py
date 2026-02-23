# command.py
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "spin_backend.settings")
django.setup()

from django.core.mail import send_mail

send_mail(
    "Test Email",
    "This is a test.",
    "prive@balique.az",
    ["kamilgarib@gmail.com"],
)