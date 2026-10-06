import os
import shutil
from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from PIL import Image
import pytesseract

# Configure tesseract_cmd if on Windows or if not automatically found in PATH
possible_tesseract_paths = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
]

if not shutil.which("tesseract"):
    for path in possible_tesseract_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            break

@api_view(['POST'])
def extract_text(request):

    if 'image' not in request.FILES:
        return Response(
            {
                'success': False,
                'error': 'Image is required'
            },
            status=status.HTTP_400_BAD_REQUEST
        )

    image = request.FILES['image']

    try:
        img = Image.open(image)
        text = pytesseract.image_to_string(img)

        return Response(
            {
                'success': True,
                'text': text
            },
            status=status.HTTP_200_OK
        )

    except pytesseract.TesseractNotFoundError:
        error_msg = (
            "Tesseract OCR executable was not found on your system. "
            "Please install Tesseract-OCR (e.g. C:\\Program Files\\Tesseract-OCR\\tesseract.exe)."
        )
        return Response(
            {
                'success': False,
                'error': error_msg
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    except Exception as e:
        return Response(
            {
                'success': False,
                'error': str(e)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
