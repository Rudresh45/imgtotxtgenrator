# Image-to-Text OCR Generator (Django + React + Tesseract)

A full-stack Optical Character Recognition (OCR) web application that scans images and extracts editable text instantly using **Django REST Framework**, **Tesseract OCR**, and a modern **React (Vite)** frontend.

---

## 🚀 Running with Docker

### Option 1: Docker (Single Container)
Build and run the entire full-stack app (React frontend + Django API + Tesseract) in a single container:

```bash
# Build the Docker image
docker build -t img-to-text .

# Run the container
docker run -d -p 8000:8000 --name img_to_text_container img-to-text
```

Open **[http://localhost:8000](http://localhost:8000)** in your browser.

---

### Option 2: Docker Compose
Alternatively, launch using Docker Compose:

```bash
docker compose up --build -d
```

To stop:
```bash
docker compose down
```

---

## 🛠 Features & Architecture
- **Frontend**: React 19, Vite, responsive drag-and-drop file upload, instant copy-to-clipboard, word/char counts.
- **Backend API**: Django 5.x REST Framework (`/api/ocr/`), Pillow image preprocessing.
- **OCR Engine**: Tesseract OCR (v5.5.0) inside the Linux container.
- **Multi-Stage Build**: Node 20 compiles the React client, then Python 3.12-slim runs the OCR engine and serves both UI & API.

---

## 📡 API Endpoint

### `POST /api/ocr/`
Extracts text from an uploaded image.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `image`: `<binary image file>` (JPG, PNG, WEBP)

**Response:**
```json
{
  "success": true,
  "text": "Extracted text from image...\n"
}
```
