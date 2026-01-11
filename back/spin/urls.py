from django.urls import path
from .views import register, register_promo

urlpatterns = [
    path("qr/<str:poster>", register),
    path("promo/<str:poster>", register_promo),
]
