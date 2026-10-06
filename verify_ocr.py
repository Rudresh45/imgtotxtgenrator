import urllib.request
import json
import os

url = "http://127.0.0.1:8000/api/ocr/"
file_path = "test_sample.png"

if not os.path.exists(file_path):
    print("test_sample.png missing!")
    exit(1)

boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"

with open(file_path, "rb") as f:
    img_data = f.read()

body = bytearray()
body.extend(f"--{boundary}\r\n".encode('utf-8'))
body.extend(f'Content-Disposition: form-data; name="image"; filename="{file_path}"\r\n'.encode('utf-8'))
body.extend("Content-Type: image/png\r\n\r\n".encode('utf-8'))
body.extend(img_data)
body.extend(f"\r\n--{boundary}--\r\n".encode('utf-8'))

req = urllib.request.Request(
    url,
    data=body,
    headers={
        "Content-Type": f"multipart/form-data; boundary={boundary}"
    },
    method="POST"
)

try:
    with urllib.request.urlopen(req) as response:
        res_data = response.read().decode('utf-8')
        print("Status code:", response.status)
        print("Response JSON:", json.dumps(json.loads(res_data), indent=2))
except urllib.error.HTTPError as e:
    print("HTTPError:", e.code)
    print("Response:", e.read().decode('utf-8'))
except Exception as e:
    print("Error:", e)
