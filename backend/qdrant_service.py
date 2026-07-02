"""
Qdrant Vector Database Service
Handles collection creation, document upsert, and semantic search against the cloud cluster.
"""

import logging
import uuid
from typing import List, Dict, Any, Optional
from config import settings

logger = logging.getLogger("AEGIS_Qdrant")

# Collection name used across the entire AEGIS knowledge base
COLLECTION_NAME = "aegis_knowledge"
VECTOR_SIZE = 384  # Using lightweight all-MiniLM-L6-v2 compatible dimensions

_client = None


def get_client():
    """Lazily initialise the Qdrant cloud client."""
    global _client
    if _client is None:
        try:
            from qdrant_client import QdrantClient

            if settings.QDRANT_API_KEY and settings.QDRANT_HOST != "localhost":
                _client = QdrantClient(
                    url=settings.QDRANT_HOST,
                    api_key=settings.QDRANT_API_KEY,
                    timeout=20,
                )
                logger.info("Qdrant cloud client connected: %s", settings.QDRANT_HOST)
            else:
                # Fallback: in-memory Qdrant for local dev without credentials
                _client = QdrantClient(":memory:")
                logger.info("Qdrant running in-memory (no cloud credentials detected).")
        except Exception as e:
            logger.error("Failed to initialise Qdrant client: %s", e)
            _client = None
    return _client


async def ensure_collection():
    """Create the AEGIS collection if it doesn't already exist."""
    client = get_client()
    if not client:
        return False
    try:
        from qdrant_client.models import Distance, VectorParams
        existing = [c.name for c in client.get_collections().collections]
        if COLLECTION_NAME not in existing:
            client.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(size=VECTOR_SIZE, distance=Distance.COSINE),
            )
            logger.info("Created Qdrant collection: %s", COLLECTION_NAME)
        return True
    except Exception as e:
        logger.error("ensure_collection failed: %s", e)
        return False


async def upsert_chunks(chunks: List[Dict[str, Any]]) -> bool:
    """
    Upsert document chunks into Qdrant.
    Each chunk must have: id (str), vector (List[float]), payload (dict with text/metadata).
    """
    client = get_client()
    if not client:
        return False
    try:
        from qdrant_client.models import PointStruct
        points = [
            PointStruct(
                id=str(uuid.uuid4()),
                vector=chunk["vector"],
                payload=chunk.get("payload", {}),
            )
            for chunk in chunks
        ]
        client.upsert(collection_name=COLLECTION_NAME, points=points)
        logger.info("Upserted %d chunks into Qdrant.", len(points))
        return True
    except Exception as e:
        logger.error("upsert_chunks failed: %s", e)
        return False


async def semantic_search(
    query_vector: List[float],
    top_k: int = 5,
    filters: Optional[Dict[str, Any]] = None,
) -> List[Dict[str, Any]]:
    """
    Run cosine similarity search against the knowledge base.
    Returns top_k results with payload and score.
    """
    client = get_client()
    if not client:
        return []
    try:
        results = client.search(
            collection_name=COLLECTION_NAME,
            query_vector=query_vector,
            limit=top_k,
        )
        return [
            {
                "score": hit.score,
                "text": hit.payload.get("text", ""),
                "source": hit.payload.get("source", ""),
                "page": hit.payload.get("page", 0),
            }
            for hit in results
        ]
    except Exception as e:
        logger.error("semantic_search failed: %s", e)
        return []


def get_collection_info() -> Dict[str, Any]:
    """Return collection stats for the monitoring dashboard."""
    client = get_client()
    if not client:
        return {"status": "disconnected"}
    try:
        info = client.get_collection(COLLECTION_NAME)
        return {
            "status": "connected",
            "vectors_count": info.vectors_count,
            "points_count": info.points_count,
            "collection": COLLECTION_NAME,
        }
    except Exception as e:
        return {"status": "error", "detail": str(e)}
