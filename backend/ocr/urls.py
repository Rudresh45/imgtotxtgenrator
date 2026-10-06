from django.urls import path
from .views import extract_text

urlpatterns = [
    path('ocr/', extract_text),
]
