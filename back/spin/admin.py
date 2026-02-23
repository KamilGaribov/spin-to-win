from django.contrib import admin
from .models import Customer, PriveCustomer, PromoCode, Service, Spin, PromoCustomer
from django.contrib.admin import DateFieldListFilter
from django.http import HttpResponse
import openpyxl
from django.utils.timezone import localtime
from django.db import models


def export_as_excel(modeladmin, request, queryset):
    response = HttpResponse(
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = "attachment; filename=export.xlsx"

    workbook = openpyxl.Workbook()
    sheet = workbook.active

    model = modeladmin.model
    fields = model._meta.fields

    # Header row
    headers = [field.verbose_name.title() for field in fields]
    sheet.append(headers)

    for obj in queryset.select_related().iterator():
        row = []

        for field in fields:
            value = getattr(obj, field.name)

            # Handle ForeignKey
            if isinstance(field, models.ForeignKey):
                value = str(value) if value else ""

            # Handle choices (like prize, poster)
            elif field.choices:
                value = getattr(obj, f"get_{field.name}_display")()

            # Handle datetime
            elif hasattr(value, "tzinfo"):
                value = localtime(value).strftime("%Y-%m-%d %H:%M:%S")

            # Handle None
            elif value is None:
                value = ""

            row.append(value)

        sheet.append(row)

    workbook.save(response)
    return response


export_as_excel.short_description = "Download selected as Excel"


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("id", "fullname", "email", "mobile")
    search_fields = ("mobile",)
    ordering = ("-created_at",)
    list_display_links = ("fullname",)
    readonly_fields = ("id", "fullname", "email", "mobile")
    actions = [export_as_excel]


@admin.register(Spin)
class SpinAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "prize", "poster", "is_used", "created_at")
    list_filter = (
        "is_used",
        ("created_at", DateFieldListFilter),
    )
    search_fields = ("customer__mobile",)
    readonly_fields = (
        "customer",
        "prize",
        "poster",
        "created_at",
    )
    ordering = ("-created_at",)
    list_display_links = ("customer",)
    actions = [export_as_excel]


@admin.register(PromoCustomer)
class PromoCustomerAdmin(admin.ModelAdmin):
    list_display = ("id", "fullname", "email", "mobile")
    search_fields = ("mobile",)
    ordering = ("-created_at",)
    list_display_links = ("fullname",)
    readonly_fields = ("id", "fullname", "email", "mobile")
    actions = [export_as_excel]


@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ("id", "customer", "promo_code", "poster", "is_used", "created_at")
    list_filter = (
        "is_used",
        ("created_at", DateFieldListFilter),
    )
    search_fields = ("customer__mobile",)
    readonly_fields = (
        "customer",
        "promo_code",
        "poster",
        "created_at",
    )
    ordering = ("-created_at",)
    list_display_links = ("customer",)
    actions = [export_as_excel]


@admin.register(PriveCustomer)
class PriveCustomerAdmin(admin.ModelAdmin):
    list_display = ("id", "fullname", "email", "mobile")
    search_fields = ("mobile",)
    ordering = ("-created_at",)
    list_display_links = ("fullname",)
    readonly_fields = ("id", "fullname", "email", "mobile", "interested_in", "message")
    actions = [export_as_excel]


@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)
