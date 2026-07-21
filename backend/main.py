"""
AEGIS FastAPI Backend Entry Point
Mounts all APIRouters, registers CORS policies, and exposes a configuration health check.
"""

import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import settings
from llm_provider import get_provider_info
from routers import auth, ingest, dashboard, chat, notifications, payments, agents

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AEGIS_Backend")

app = FastAPI(title=settings.PROJECT_NAME, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "llm": get_provider_info(),
        "qdrant_host": settings.QDRANT_HOST,
        "supabase_url": settings.SUPABASE_URL,
        "sendgrid": bool(settings.SENDGRID_API_KEY),
        "stripe": bool(settings.STRIPE_SECRET_KEY),
        "hubspot": bool(settings.HUBSPOT_DEVELOPER_API_KEY),
    }


app.include_router(auth.router,          prefix=settings.API_V1_STR)
app.include_router(ingest.router,        prefix=settings.API_V1_STR)
app.include_router(dashboard.router,     prefix=settings.API_V1_STR)
app.include_router(chat.router,          prefix=settings.API_V1_STR)
app.include_router(notifications.router, prefix=settings.API_V1_STR)
app.include_router(payments.router,      prefix=settings.API_V1_STR)
app.include_router(agents.router,        prefix=settings.API_V1_STR)
