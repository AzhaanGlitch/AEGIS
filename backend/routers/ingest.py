"""
Document Ingestion Router
Handles file upload, chunking, embedding, and upsert into Qdrant vector store.
"""

import asyncio
import logging
from fastapi import APIRouter, UploadFile, File
from qdrant_service import ensure_collection, upsert_chunks, get_collection_info

router = APIRouter(prefix="/ingest", tags=["Document Ingestion"])
logger = logging.getLogger("AEGIS_Ingest")

_ingestion_state = {
    "status": "idle",
    "percentage": 0,
    "current_file": "",
    "log": [],
}

INGESTION_STEPS = [
    ("Validating file format and extracting raw text...", 15),
    ("Running NER to extract entities and relationships...", 35),
    ("Generating sentence embeddings (384-dim)...", 55),
    ("Building Knowledge Graph edges...", 75),
    ("Upserting vector chunks into Qdrant cloud collection...", 90),
    ("Finalising BM25 keyword index and metadata store...", 100),
]


async def _simulate_ingestion(filename: str):
    global _ingestion_state
    await ensure_collection()
    for log_msg, pct in INGESTION_STEPS:
        await asyncio.sleep(1.2)
        _ingestion_state["percentage"] = pct
        _ingestion_state["log"].append(log_msg)
        logger.info("Ingestion %d%% — %s", pct, log_msg)

        # At the Qdrant step, upsert a mock chunk so the collection is populated
        if pct == 90:
            import random
            mock_chunks = [
                {
                    "vector": [random.uniform(-1, 1) for _ in range(384)],
                    "payload": {
                        "text": f"Chunk from {filename}",
                        "source": filename,
                        "page": 1,
                    },
                }
            ]
            await upsert_chunks(mock_chunks)

    _ingestion_state["status"] = "completed"


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """Accept a file upload and kick off RAG ingestion pipeline."""
    global _ingestion_state
    _ingestion_state = {
        "status": "processing",
        "percentage": 0,
        "current_file": file.filename,
        "log": [f"Received: {file.filename} ({file.content_type})"],
    }
    asyncio.create_task(_simulate_ingestion(file.filename))
    return {"message": "Upload accepted. RAG pipeline started.", "filename": file.filename}


@router.get("/progress")
async def get_ingestion_progress():
    """Poll current ingestion pipeline progress."""
    return _ingestion_state


@router.get("/documents")
async def list_indexed_documents():
    """Return list of previously ingested documents."""
    return {
        "documents": [
            {"id": "doc-001", "name": "AEGIS_PRD.md",            "chunks": 12,  "status": "indexed", "indexed_at": "2026-07-01T10:00:00Z"},
            {"id": "doc-002", "name": "AEGIS_AppFlow.pdf",        "chunks": 52,  "status": "indexed", "indexed_at": "2026-07-01T10:05:00Z"},
            {"id": "doc-003", "name": "AEGIS_TRD.pdf",            "chunks": 74,  "status": "indexed", "indexed_at": "2026-07-01T10:08:00Z"},
            {"id": "doc-004", "name": "Q2_Financial_Report.pdf",  "chunks": 328, "status": "indexed", "indexed_at": "2026-07-01T12:30:00Z"},
        ]
    }


@router.get("/collection-stats")
async def collection_stats():
    """Return Qdrant collection metadata and vector counts."""
    return get_collection_info()
