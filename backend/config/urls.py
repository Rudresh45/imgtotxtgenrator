"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from pathlib import Path
import mimetypes
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import HttpResponse, FileResponse

mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIST = BASE_DIR / 'frontend_dist'

def serve_react(request, path=""):
    file_path = FRONTEND_DIST / path
    if path and file_path.is_file():
        return FileResponse(open(file_path, 'rb'))
    index_file = FRONTEND_DIST / 'index.html'
    if index_file.exists():
        return FileResponse(open(index_file, 'rb'))
    return HttpResponse(
        "<h2>OCR Backend API is running</h2><p>Visit <code>/api/ocr/</code> for the OCR API endpoint.</p>",
        content_type="text/html"
    )

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('ocr.urls')),
    re_path(r'^(?P<path>.*)$', serve_react),
]

