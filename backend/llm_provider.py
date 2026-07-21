"""
LLM Provider with Multi-Stage Fallback System.

Priority Order:
  1. NVIDIA NIM (GLM / Llama)
  2. Groq (Llama 3.3 / 3.1)
  3. Hugging Face Serverless (Mistral / Mixtral)

If a provider call fails or has no credentials, the system automatically falls
back to the next provider in the chain. If all fail, it falls back to mock responses.
"""

from config import settings
import json
import logging
import httpx
from typing import AsyncGenerator, List, Dict, Any

logger = logging.getLogger("AEGIS_LLM")

# ─── Provider Configuration ───────────────────────────────────────────────────

PROVIDERS_CONFIG = {
    "nvidia": {
        "base_url": "https://integrate.api.nvidia.com/v1",
        "env_key": "NVIDIA_API_KEY",
        "default_model": "meta/llama-3.1-8b-instruct",
        "models": {
            "fast": "meta/llama-3.1-8b-instruct",
            "smart": "meta/llama-3.1-70b-instruct",
        },
    },
    "groq": {
        "base_url": "https://api.groq.com/openai/v1",
        "env_key": "GROQ_API_KEY",
        "default_model": "llama-3.3-70b-versatile",
        "models": {
            "fast": "llama-3.1-8b-instant",
            "smart": "llama-3.3-70b-versatile",
        },
    },
    "huggingface": {
        "base_url": "https://api-inference.huggingface.co/models",
        "env_key": "HF_API_KEY",
        "default_model": "mistralai/Mistral-7B-Instruct-v0.3",
        "models": {
            "fast": "mistralai/Mistral-7B-Instruct-v0.3",
            "smart": "mistralai/Mixtral-8x7B-Instruct-v0.1",
        },
    },
}

# The prioritized order for fallbacks
PRIORITY_ORDER = ["nvidia", "groq", "huggingface"]


def get_available_providers() -> List[Dict[str, Any]]:
    """Return configured providers in priority order, reading keys from settings."""
    key_map = {
        "nvidia": settings.NVIDIA_API_KEY,
        "groq": settings.GROQ_API_KEY,
        "huggingface": settings.HF_API_KEY,
    }
    available = []
    for p_name in PRIORITY_ORDER:
        cfg = PROVIDERS_CONFIG[p_name]
        key = key_map.get(p_name, "")
        if key:
            available.append({
                "name": p_name,
                "api_key": key,
                "base_url": cfg["base_url"],
                "default_model": cfg["default_model"],
                "models": cfg["models"]
            })
    return available


def get_provider_info() -> dict:
    """Return health/connection status of the priority provider chain."""
    available = get_available_providers()
    if available:
        return {
            "active_provider": available[0]["name"],
            "model": available[0]["default_model"],
            "fallback_chain": [p["name"] for p in available[1:]],
            "status": "connected"
        }
    return {
        "active_provider": None,
        "model": None,
        "fallback_chain": [],
        "status": "offline_fallback_mode"
    }


# ─── Chat Completion (With Fallback) ──────────────────────────────────────────

async def chat_completion(
    messages: List[Dict[str, str]],
    model_tier: str = "smart",
    temperature: float = 0.7,
    max_tokens: int = 1024,
) -> str:
    """
    Send chat request attempting providers in priority order.
    Falls back to next provider if request fails.
    """
    providers = get_available_providers()
    
    if not providers:
        logger.warning("No API keys found. Defaulting to mock generation.")
        return _mock_response(messages)

    for p in providers:
        name = p["name"]
        model = p["models"].get(model_tier, p["default_model"])
        logger.info("Attempting LLM completion using %s (%s)", name, model)
        
        try:
            if name in ("nvidia", "groq"):
                return await _openai_compatible_completion(
                    base_url=p["base_url"],
                    api_key=p["api_key"],
                    model=model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
            elif name == "huggingface":
                return await _huggingface_completion(
                    api_key=p["api_key"],
                    model=model,
                    messages=messages,
                    temperature=temperature,
                    max_tokens=max_tokens,
                )
        except Exception as e:
            logger.warning("Provider %s failed with error: %s. Trying next fallback...", name, e)
            continue
            
    logger.error("All configured LLM providers failed. Defaulting to mock generation.")
    return _mock_response(messages)


async def query_llm(messages: List[Dict[str, str]], tier: str = "smart", temperature: float = 0.7) -> str:
    """Convenience alias for chat_completion."""
    return await chat_completion(messages=messages, model_tier=tier, temperature=temperature)


async def query_llm_json(messages: List[Dict[str, str]], tier: str = "smart") -> Dict[str, Any]:
    """Convenience alias to return parsed JSON response from LLM."""
    raw = await chat_completion(messages=messages, model_tier=tier, temperature=0.2)
    # Strip markdown codeblocks if present
    cleaned = raw.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    cleaned = cleaned.strip()
    try:
        return json.loads(cleaned)
    except Exception:
        return {"response": raw}


async def _openai_compatible_completion(
    base_url: str,
    api_key: str,
    model: str,
    messages: List[Dict[str, str]],
    temperature: float,
    max_tokens: int,
) -> str:
    url = f"{base_url}/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


async def _huggingface_completion(
    api_key: str,
    model: str,
    messages: List[Dict[str, str]],
    temperature: float,
    max_tokens: int,
) -> str:
    url = f"https://api-inference.huggingface.co/models/{model}/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "model": model,
        "messages": messages,
        "temperature": temperature,
        "max_tokens": max_tokens,
    }
    async with httpx.AsyncClient(timeout=15.0) as client:
        resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        return resp.json()["choices"][0]["message"]["content"]


# ─── Streaming Chat Completion (With Fallback) ────────────────────────────────

async def stream_chat_completion(
    messages: List[Dict[str, str]],
    model_tier: str = "smart",
    temperature: float = 0.7,
    max_tokens: int = 1024,
) -> AsyncGenerator[str, None]:
    """
    Stream tokens from priority provider, falling back to next provider
    if connection or stream setup fails.
    """
    providers = get_available_providers()
    
    if not providers:
        mock = _mock_response(messages)
        for word in mock.split(" "):
            yield word + " "
        return

    for p in providers:
        name = p["name"]
        model = p["models"].get(model_tier, p["default_model"])
        logger.info("Attempting LLM streaming using %s (%s)", name, model)

        if name in ("nvidia", "groq"):
            url = f"{p['base_url']}/chat/completions"
        else:
            url = f"https://api-inference.huggingface.co/models/{model}/v1/chat/completions"

        headers = {
            "Authorization": f"Bearer {p['api_key']}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "stream": True,
        }

        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                async with client.stream("POST", url, headers=headers, json=payload) as resp:
                    resp.raise_for_status()
                    async for line in resp.aiter_lines():
                        if line.startswith("data: "):
                            chunk = line[6:]
                            if chunk.strip() == "[DONE]":
                                return
                            try:
                                parsed = json.loads(chunk)
                                delta = parsed["choices"][0].get("delta", {}).get("content", "")
                                if delta:
                                    yield delta
                            except:
                                continue
            # If the stream completed successfully, terminate fallback loop
            return
        except Exception as e:
            logger.warning("Streaming with provider %s failed: %s. Checking fallback...", name, e)
            continue

    # Final fallback if all streams fail
    logger.error("All streaming providers failed. Running mock output.")
    mock = _mock_response(messages)
    for word in mock.split(" "):
        yield word + " "


# ─── Mock Fallback ────────────────────────────────────────────────────────────

def _mock_response(messages: list[dict]) -> str:
    user_msg = ""
    for m in reversed(messages):
        if m.get("role") == "user":
            user_msg = m.get("content", "").lower()
            break

    if "revenue" in user_msg or "forecast" in user_msg or "quarter" in user_msg:
        return (
            "Based on the financial reports, Q3 revenue is forecasted at **$1.42M** (+12% increase). "
            "The Finance Agent detected no critical budget variances, though the LinkedIn Ads anomaly ($12,500 vs $4,200 average) "
            "warrants investigation. Sources: Q2_Financial_Report.pdf."
        )
    elif "policy" in user_msg or "remote" in user_msg or "hr" in user_msg:
        return (
            "According to the Remote Work Policy handbook, team members are eligible for up to **3 remote days per week** "
            "with manager approval. Office core hours are 10:00 AM – 4:00 PM. Sources: Remote_Work_Policy_v2.pdf."
        )
    else:
        return (
            "Hello! I am the AEGIS AI assistant. I can assist with forecasts, CRM updates, campaign evaluations, "
            "policy guides, and visual workflows. What would you like to explore?"
        )


async def get_huggingface_embedding(text: str) -> list[float]:
    """Generate a 384-dimension embedding using Hugging Face inference API."""
    if not settings.HF_API_KEY:
        # Fallback: deterministic vector based on text hash
        import hashlib
        import random
        random.seed(int(hashlib.md5(text.encode("utf-8")).hexdigest(), 16))
        return [random.uniform(-1, 1) for _ in range(384)]

    url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    headers = {"Authorization": f"Bearer {settings.HF_API_KEY}"}
    payload = {"inputs": text, "options": {"wait_for_model": True}}

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                emb = resp.json()
                if isinstance(emb, list) and len(emb) > 0:
                    if isinstance(emb[0], list): # Sometimes returns a nested list
                        return emb[0]
                    return emb
            logger.warning("HF Embeddings API status %d, fallback to deterministic mock.", resp.status_code)
    except Exception as e:
        logger.error("Hugging Face embedding call failed: %s", e)

    # Fallback
    import hashlib
    import random
    random.seed(int(hashlib.md5(text.encode("utf-8")).hexdigest(), 16))
    return [random.uniform(-1, 1) for _ in range(384)]

