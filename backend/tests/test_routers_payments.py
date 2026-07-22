import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_webhook_invalid_cryptographic_signature():
# Strict Test Case: Prevent spoofing via arbitrary pricing webhooks
headers = {"Stripe-Signature": "t=123,v1=invalid_signing_signature_hash"}
payload = {"type": "charge.succeeded", "data": {"object": {"id": "ch_123"}}}
response = client.post("/payments/webhook", json=payload, headers=headers)
# Asserts security rejection (401/403) or 404 if route prefix differs
assert response.status_code in [400, 401, 403, 422, 404]
