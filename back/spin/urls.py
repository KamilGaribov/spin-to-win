from django.urls import path
from .views import register

urlpatterns = [
    path("qr/<str:poster>", register),
]
