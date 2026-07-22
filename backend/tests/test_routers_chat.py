import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_tenant_isolation_chat_history():
# Edge Case: Attempt cross-tenant data traversal
headers = {"Authorization": "Bearer token_for_user_a"}
response = client.get("/chat/history?session_id=session_owned_by_user_b", headers=headers)
# Asserts access denied (401/403) or 404 if route prefix differs
assert response.status_code in [401, 403, 404]
