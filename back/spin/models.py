from django.db import models
from django.utils import timezone
from datetime import timedelta


PRIZES = [
    ("free_delivery", "pulsuz çatdırılma"), # 10%
    ("discount_5", "5% endirim"), # 15%
    ("discount_10", "10% endirim"), # 5%
    ("spin_again", "yenidən fırlat"), # 15%
    ("no_prize", "uduş yoxdur"), # 20%
    ("loyalty_card", "loyallıq kartı"), # 10%
    ("discount_3_azn", "3 azn endirim kuponu"), # 15%
    ("discount_10_not_fish", "kassa arxası məhsullara 10% endirim"), # 10%
]

PRIZE_WEIGHTS = [10, 15, 5, 15, 20, 10, 15, 10]

QR_PLACES = [
    ("poster_1", "Poster 1"),
    ("poster_2", "Poster 2"),
    ("poster_3", "Poster 3"),
    ("poster_4", "Poster 4"),
    ("poster_5", "Poster 5"),
    ("poster_6", "Poster 6"),
    ("poster_7", "Poster 7"),
    ("poster_8", "Poster 8"),
    ("poster_9", "Poster 9"),
    ("poster_10", "Poster 10"),
    ("poster_11", "Poster 11")
]


class Customer(models.Model):
    fullname = models.CharField(max_length=120)
    email = models.EmailField()
    mobile = models.CharField(max_length=20, unique=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def can_spin(self):
        """Check if user has spun in the last 7 days."""
        last_spin = self.spins.order_by("-created_at").first()
        if not last_spin:
            return True

        return last_spin.created_at < timezone.now() - timedelta(days=7)

    def __str__(self):
        return f"{self.fullname} {self.mobile}"


class Prize(models.Model):
    name = models.CharField(max_length=255)
    probability = models.FloatField(default=1.0)  # example for weighting

    def __str__(self):
        return self.name


class Spin(models.Model):
    customer = models.ForeignKey(
        Customer, related_name="spins", on_delete=models.CASCADE, verbose_name="Müştəri"
    )
    prize = models.CharField(choices=PRIZES, max_length=31, verbose_name="Uduş")
    is_used = models.BooleanField(default=False, verbose_name="İstifadə olunub")
    poster = models.CharField(
        max_length=20,
        choices=QR_PLACES,
        verbose_name="Poster",
    )

    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Yaradılma tarixi")

    def __str__(self):
        return f"{self.customer.mobile} → {self.prize}"
