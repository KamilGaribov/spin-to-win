from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from .models import Customer


class CustomerSerializer(serializers.ModelSerializer):
    mobile = serializers.CharField(
        validators=[UniqueValidator(
            queryset=Customer.objects.all(),
            message="Bu mobil nömrə artıq qeydiyyatdan keçmişdir."
        )]
    )
    class Meta:
        model = Customer
        fields = ["id", "fullname", "email", "mobile"]
        read_only_fields = ["id"]
