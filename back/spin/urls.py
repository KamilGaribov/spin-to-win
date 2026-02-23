from django.urls import path
from .views import register, register_promo, register_prive

urlpatterns = [
    path("qr/<str:poster>", register),
    path("promo/<str:poster>", register_promo),
    path("prive-register/", register_prive),
]
