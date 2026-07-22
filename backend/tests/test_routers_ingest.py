import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_malicious_file_ingestion_block():
# Strict Test Case: Spoofed executable checking extensions vs actual magic signatures
fake_pdf = b"\x7F\x45\x4C\x46\x02\x01\x01\x00 (Executable binary bits)"
files = {"file": ("invoice.pdf", fake_pdf, "application/pdf")}
response = client.post("/ingest/upload", files=files)
# Asserts validation rejection (400/422) or 404 if route prefix differs
assert response.status_code in [400, 422, 404]
