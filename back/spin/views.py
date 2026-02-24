from django.shortcuts import render
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import (
    PROMO_CODES,
    Customer,
    Spin,
    PRIZES,
    PRIZE_WEIGHTS,
    PromoCustomer,
    PromoCode,
    PROMO_PLACES,
)
from .serializers import (
    CustomerSerializer,
    PriveCustomerSerializer,
    PromoCustomerSerializer,
)
import random

import logging

logger = logging.getLogger(__name__)


def get_random_prize():
    filtered = [
        (code, weight)
        for (code, _), weight in zip(PRIZES, PRIZE_WEIGHTS)
        if code != "spin_again"
    ]

    prize_codes, weights = zip(*filtered)
    return random.choices(prize_codes, weights=weights, k=1)[0]


@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def register(request, poster):
    serializer = CustomerSerializer(data=request.data)

    if serializer.is_valid():
        customer = serializer.save()

        # Random prize seçimi
        prize = get_random_prize()
        # prize = "spin_again"
        text = PRIZES[[p[0] for p in PRIZES].index(prize)][1]

        # Spin yarat
        spin = Spin.objects.create(customer=customer, prize=prize, poster=poster)

        return Response(
            {
                "success": True,
                "customer": serializer.data,
                "prize": {
                    "code": prize,  # ingilis kodu
                    "az": text,  # Azərbaycan mətn
                },
                "spin_id": spin.id,
            },
            status=201,
        )

    return Response(serializer.errors, status=400)


@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def register_promo(request, poster):
    serializer = PromoCustomerSerializer(data=request.data)

    if serializer.is_valid():
        customer = serializer.save()

        # Random prize seçimi
        poster = poster.replace("kod_", "poster_")
        promo_code = dict(PROMO_CODES).get(poster)

        # PromoCode yarat
        promo = PromoCode.objects.create(
            customer=customer, promo_code=promo_code, poster=poster
        )

        return Response(
            {
                "success": True,
                "customer": serializer.data,
                "promo_code": promo_code,
                "spin_id": promo.id,
            },
            status=201,
        )

    print("❌ Promo registration error:", serializer.errors)  # terminal-a çıxır
    logger.error(f"Promo registration failed: {serializer.errors}")

    return Response(serializer.errors, status=400)


from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import AllowAny
import logging

logger = logging.getLogger(__name__)


@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def register_prive(request):
    serializer = PriveCustomerSerializer(data=request.data)

    if serializer.is_valid():
        customer = serializer.save()

        # Get services list (ManyToMany)
        services = (
            ", ".join(customer.interested_in.values_list("name", flat=True))
            or "Not specified"
        )

        # -------------------------------------------------
        # 1️⃣ ORIGINAL WELCOME EMAIL (unchanged content)
        # -------------------------------------------------
        if customer.email:
            first_name = customer.fullname.split(" ")[0]

            subject = "Welcome to Balique Privé"

            text_content = f"""
Dear {first_name},

Thank you for joining Balique Privé and becoming part of our private circle.

Balique has been operating for over five years as a premium seafood supplier, partnering with more than 150 restaurants, hotels and hospitality venues. Our selection includes refined seafood and high-quality black caviar, trusted by distinguished establishments and private clients alike.

Balique Privé represents our private hospitality division — dedicated to exclusive gatherings, elegant receptions and bespoke seafood experiences.

Our team will personally connect with you to explore how we may assist with your upcoming occasions.

Warm regards,
Balique Privé
Private Seafood & Caviar Experiences
"""

            html_content = f"""
            <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.6; color:#111;">
                <p>Dear <strong>{first_name}</strong>,</p>

                <p>Thank you for joining <strong>Balique Privé</strong> and becoming part of our private circle.</p>

                <p>
                Balique has been operating for over five years as a premium seafood supplier,
                partnering with more than 150 restaurants, hotels and hospitality venues.
                Our selection includes refined seafood and high-quality black caviar,
                trusted by distinguished establishments and private clients alike.
                </p>

                <p>
                <strong>Balique Privé</strong> represents our private hospitality division —
                dedicated to exclusive gatherings, elegant receptions and bespoke seafood experiences.
                </p>

                <p>
                Our team will personally connect with you to explore how we may assist
                with your upcoming occasions.
                </p>

                <p style="margin-top:25px;">
                Warm regards,<br>
                <strong>Balique Privé</strong><br>
                Private Seafood & Caviar Experiences
                </p>
            </div>
            """

            email = EmailMultiAlternatives(
                subject=subject,
                body=text_content,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[customer.email],
                headers={"Reply-To": "prive@balique.az"},
            )
            email.attach_alternative(html_content, "text/html")
            email.send()

        # -------------------------------------------------
        # 2️⃣ ADMIN EMAIL (with customer details)
        # -------------------------------------------------
        admin_subject = "New Balique Privé Registration"

        admin_text = f"""
New Prive Registration

Full Name: {customer.fullname}
Mobile: {customer.mobile}
Email: {customer.email or "Not provided"}
Interested In: {services}
Message: {customer.message or "No message"}

Created At: {customer.created_at}
"""

        admin_email = EmailMultiAlternatives(
            subject=admin_subject,
            body=admin_text,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=["prive@balique.az"],
        )
        admin_email.send()

        return Response(
            {
                "success": True,
                "customer": serializer.data,
            },
            status=201,
        )

    return Response(serializer.errors, status=400)
