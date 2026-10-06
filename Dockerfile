# ==========================================
# Stage 1: Build the React Frontend
# ==========================================
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend/ ./
RUN npm run build

# ==========================================
# Stage 2: Django Backend + Tesseract OCR
# ==========================================
FROM python:3.12-slim

# Install system dependencies & Tesseract OCR engine with English trained data
RUN apt-get update && apt-get install -y --no-install-recommends \
    tesseract-ocr \
    tesseract-ocr-eng \
    libtesseract-dev \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python packages
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django backend application
COPY backend/ ./

# Copy built frontend from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend_dist

# Apply database migrations
RUN python manage.py migrate

# Expose Django port
EXPOSE 8000

ENV PYTHONUNBUFFERED=1

# Start the application server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
