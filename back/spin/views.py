from django.shortcuts import render
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Customer, Spin, PRIZES, PRIZE_WEIGHTS
from .serializers import CustomerSerializer
import random


def get_random_prize():
    prize_codes = [p[0] for p in PRIZES]
    return random.choices(prize_codes, weights=PRIZE_WEIGHTS, k=1)[0]


@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([])
def register(request, poster):
    serializer = CustomerSerializer(data=request.data)

    if serializer.is_valid():
        customer = serializer.save()

        # Random prize seçimi
        prize = get_random_prize()
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
