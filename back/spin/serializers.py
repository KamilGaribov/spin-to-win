from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Customer, PriveCustomer, PromoCustomer, Service


class CustomerSerializer(serializers.ModelSerializer):
    mobile = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=Customer.objects.all(),
                message="Bu mobil nömrə artıq qeydiyyatdan keçmişdir.",
            )
        ]
    )

    class Meta:
        model = Customer
        fields = ["id", "fullname", "email", "mobile"]
        read_only_fields = ["id"]


class PromoCustomerSerializer(serializers.ModelSerializer):
    mobile = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=PromoCustomer.objects.all(),
                message="Bu mobil nömrə artıq qeydiyyatdan keçmişdir.",
            )
        ]
    )
    email = serializers.EmailField(
        # Unikal yoxlama üçün
        validators=[
            UniqueValidator(
                queryset=PromoCustomer.objects.all(),
                message="Bu email artıq qeydiyyatdan keçmişdir.",
            )
        ],
        error_messages={"invalid": "Zəhmət olmasa doğru email daxil edin."},
    )

    class Meta:
        model = PromoCustomer
        fields = ["id", "fullname", "email", "mobile"]
        read_only_fields = ["id"]


class PriveCustomerSerializer(serializers.ModelSerializer):
    mobile = serializers.CharField(
        validators=[
            UniqueValidator(
                queryset=PriveCustomer.objects.all(),
                message="Bu mobil nömrə artıq qeydiyyatdan keçmişdir.",
            )
        ]
    )
    email = serializers.EmailField(
        # Unikal yoxlama üçün
        validators=[
            UniqueValidator(
                queryset=PriveCustomer.objects.all(),
                message="Bu email artıq qeydiyyatdan keçmişdir.",
            )
        ],
        error_messages={"invalid": "Zəhmət olmasa doğru email daxil edin."},
    )
    interested_in = serializers.SlugRelatedField(
        slug_field="name",
        many=True,
        queryset=Service.objects.all(),
        required=False,
    )

    class Meta:
        model = PriveCustomer
        fields = ["id", "fullname", "email", "mobile", "interested_in", "message"]
        read_only_fields = ["id"]
