import pytest
from backend.llm_provider import get_provider_info, _mock_response

def test_provider_info_structure():
    info = get_provider_info()
    assert "status" in info
    assert "fallback_chain" in info

def test_mock_response_revenue():
    messages = [{"role": "user", "content": "What is the revenue forecast?"}]
    response = _mock_response(messages)
    assert "$1.42M" in response

def test_mock_response_hr():
    messages = [{"role": "user", "content": "What is the remote work policy?"}]
    response = _mock_response(messages)
    assert "3 remote days" in response
