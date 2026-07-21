"""
Base Agent Module for AEGIS 27-Agent Suite.
Strictly routes requests across Groq, NVIDIA NIM, and Hugging Face.
"""

import json
import logging
from typing import Dict, Any, Optional, List
from llm_provider import query_llm, query_llm_json

logger = logging.getLogger("AEGIS_BASE_AGENT")

class BaseAgent:
    """Base class for all 27 specialized agents in AEGIS."""

    agent_id: str = "base_agent"
    name: str = "Base Agent"
    role: str = "General Assistant"
    category: str = "general"
    description: str = "Standard agent template"
    default_provider: str = "groq"
    preferred_model_tier: str = "fast" # 'fast' or 'smart'

    def __init__(
        self,
        name: Optional[str] = None,
        role: Optional[str] = None,
        system_prompt: Optional[str] = None,
        tools: Optional[List[str]] = None,
        model_tier: Optional[str] = None,
    ):
        if name:
            self.name = name
        if role:
            self.role = role
        if model_tier:
            self.preferred_model_tier = model_tier
        self.system_prompt = system_prompt or self.get_default_system_prompt()
        self.tools = tools or []

    def get_default_system_prompt(self) -> str:
        return f"You are {self.name}, acting as {self.role}. Provide structured, helpful responses."

    async def run(self, user_input: str, context: Optional[Dict[str, Any]] = None, require_json: bool = False) -> Dict[str, Any]:
        """Execute the agent prompt using multi-provider routing (NVIDIA / Groq / HuggingFace)."""
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "user", "content": f"Context: {json.dumps(context or {})}\n\nTask: {user_input}"}
        ]

        try:
            if require_json:
                res = await query_llm_json(messages=messages, tier=self.preferred_model_tier)
                return {
                    "agent_id": self.agent_id,
                    "agent_name": self.name,
                    "status": "success",
                    "data": res
                }
            else:
                res_text = await query_llm(messages=messages, tier=self.preferred_model_tier)
                return {
                    "agent_id": self.agent_id,
                    "agent_name": self.name,
                    "status": "success",
                    "content": res_text
                }
        except Exception as e:
            logger.error(f"Agent {self.agent_id} failed execution: {str(e)}")
            return {
                "agent_id": self.agent_id,
                "agent_name": self.name,
                "status": "error",
                "content": f"Error executing agent {self.name}: {str(e)}"
            }
