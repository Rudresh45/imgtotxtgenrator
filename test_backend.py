import os
import shutil
from PIL import Image, ImageDraw, ImageFont
import pytesseract

# Create a sample text image
img = Image.new('RGB', (400, 100), color=(255, 255, 255))
d = ImageDraw.Draw(img)
# Render text
d.text((20, 30), "Hello World OCR", fill=(0, 0, 0))

test_img_path = "test_sample.png"
img.save(test_img_path)
print(f"Created sample image: {test_img_path}")

# Detect Tesseract
possible_tesseract_paths = [
    r"C:\Program Files\Tesseract-OCR\tesseract.exe",
    r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
    os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
]

if not shutil.which("tesseract"):
    for path in possible_tesseract_paths:
        if os.path.exists(path):
            pytesseract.pytesseract.tesseract_cmd = path
            print(f"Using Tesseract executable: {path}")
            break

try:
    extracted = pytesseract.image_to_string(img)
    print("Direct Pytesseract test extracted text:")
    print(repr(extracted))
except Exception as e:
    print(f"Pytesseract direct test error: {e}")
