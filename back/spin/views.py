from django.shortcuts import render
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import PROMO_CODES, Customer, Spin, PRIZES, PRIZE_WEIGHTS, PromoCustomer, PromoCode, PROMO_PLACES
from .serializers import CustomerSerializer, PromoCustomerSerializer
import random



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
        promo_code = dict(PROMO_CODES).get(poster)
        print("PROMO CODE:", promo_code)

        # PromoCode yarat
        promo = PromoCode.objects.create(customer=customer, promo_code=promo_code, poster=poster)

        return Response(
            {
                "success": True,
                "customer": serializer.data,
                "promo_code": promo_code,
                "spin_id": promo.id,
            },
            status=201,
        )

    return Response(serializer.errors, status=400)
