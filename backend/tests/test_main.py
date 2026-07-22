import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_app_initialization():
# Verify that the app has routes configured
assert len(app.routes) > 0

def test_global_exception_handler():
# Verify that unhandled server exceptions or unknown routes return standard JSON
response = client.get("/invalid-route-triggering-404")
assert response.status_code == 404
assert "detail" in response.json()
