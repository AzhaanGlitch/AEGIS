import pytest
from backend.qdrant_service import get_collection_info, semantic_search

def test_collection_info_offline(monkeypatch):
    monkeypatch.setattr("backend.qdrant_service.get_client", lambda: None)
    info = get_collection_info()
    assert info["status"] == "disconnected"

@pytest.mark.asyncio
async def test_semantic_search_offline(monkeypatch):
    monkeypatch.setattr("backend.qdrant_service.get_client", lambda: None)
    results = await semantic_search(query_vector=[0.1]*384)
    assert results == []
