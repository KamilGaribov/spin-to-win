from django.contrib import admin
from .models import Customer, Prize, Spin


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("id", "fullname", "email", "mobile")
    search_fields = ("mobile",)
    ordering = ("-created_at",)
    list_display_links = ("fullname",)
    readonly_fields = ("id", "fullname", "email", "mobile")


@admin.register(Spin)
class SpinAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "prize", "poster", "is_used", "created_at")
    list_filter = ("is_used",)
    search_fields = ("customer__mobile",)
    readonly_fields = (
        "customer",
        "prize",
        "poster",
        "created_at",
    )
    ordering = ("-created_at",)
    list_display_links = ("customer",)
