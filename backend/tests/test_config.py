import pytest
from backend.config import settings

def test_settings_loaded():
# Verify that the Pydantic settings object initializes successfully
assert settings is not None
