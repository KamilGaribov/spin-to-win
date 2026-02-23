from django.db import models
from django.utils import timezone
from datetime import timedelta


PRIZES = [
    ("free_delivery", "pulsuz çatdırılma"),  # 10%
    ("discount_5", "5% endirim"),  # 15%
    ("discount_10", "10% endirim"),  # 5%
    ("spin_again", "yenidən fırlat"),  # 15%
    ("no_prize", "uduş yoxdur"),  # 20%
    ("loyalty_card", "loyallıq kartı"),  # 10%
    ("discount_3_azn", "3 azn endirim kuponu"),  # 15%
    ("discount_10_not_fish", "kassa arxası məhsullara 10% endirim"),  # 10%
]

PRIZE_WEIGHTS = [10, 15, 5, 15, 20, 10, 15, 10]

QR_PLACES = [
    ("poster_1", "Pilot Residence icherisheher"),
    ("poster_2", "Renessance palace ag sheher"),
    ("poster_3", "Inkishaf residence ag sheher"),
    ("poster_4", "CasaMia Nesimi bazari"),
    ("poster_5", "Teze Bazar binasi"),
    ("poster_6", "White Tower Khatai"),
    ("poster_7", "Red MTK Khatai Icra (Hakimiyyeti arxasi)"),
    ("poster_8", "Lexus Binasi Khatai"),
    ("poster_9", "Abu Arena"),
    ("poster_10", "Rahat Marketin ustu"),
    ("poster_11", "Social media"),
]

PROMO_PLACES = [
    ("poster_1", "Pilot Residence Icherisheher"),
    ("poster_2", "Renessance Yashayish Sheher"),
    ("poster_3", "Inkishaf Residence Ag Sheher"),
    ("poster_4", "CasaMia Nesimi Bazari"),
    ("poster_5", "Crown MTK"),
    ("poster_6", "White Tower Khatai"),
    ("poster_7", "Red MTK Khatai Icra Arxasi"),
    ("poster_8", "Lexus Binasi Khatai"),
    ("poster_9", "Abu Arena"),
    ("poster_10", "Halal MTK"),
    ("poster_11", "Gozel Baki Yashayish Kompleksi"),
]

PROMO_CODES = [
    ("poster_1", "PILOT10"),
    ("poster_2", "RENESS10"),
    ("poster_3", "INKISAF10"),
    ("poster_4", "CASAMIA10"),
    ("poster_5", "CROWN10"),
    ("poster_6", "WHITET10"),
    ("poster_7", "REDMTK10"),
    ("poster_8", "LEXUS10"),
    ("poster_9", "ABUARE10"),
    ("poster_10", "HALAL10"),
    ("poster_11", "GOZELBK10"),
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

    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Yaradılma tarixi"
    )

    def __str__(self):
        return f"{self.customer.mobile} → {self.prize}"


class PromoCustomer(models.Model):
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


class PromoCode(models.Model):
    customer = models.ForeignKey(
        PromoCustomer,
        related_name="promo_code",
        on_delete=models.CASCADE,
        verbose_name="Müştəri",
    )
    promo_code = models.CharField(max_length=31, verbose_name="Promo kod")
    is_used = models.BooleanField(default=False, verbose_name="İstifadə olunub")
    poster = models.CharField(
        max_length=20,
        choices=PROMO_PLACES,
        verbose_name="Poster",
    )

    created_at = models.DateTimeField(
        auto_now_add=True, verbose_name="Yaradılma tarixi"
    )

    def __str__(self):
        return f"{self.customer.mobile} → {self.promo_code}"


class Service(models.Model):
    name = models.CharField(max_length=120, unique=True, verbose_name="Xidmət adı")

    def __str__(self):
        return self.name


class PriveCustomer(models.Model):
    fullname = models.CharField(max_length=120)
    mobile = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True, null=True)
    interested_in = models.ManyToManyField(Service, blank=True, verbose_name="Maraqlandığı xidmətlər")
    message = models.TextField(blank=True, null=True, verbose_name="Əlavə məlumat")

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.fullname} {self.mobile}"
