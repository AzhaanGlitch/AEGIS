"""
Base Agent — Shared interface for all AEGIS AI agents.

Each agent has:
  - A name, role description, system prompt, and list of tools.
  - A memory store for conversation context.
  - An `execute()` method that calls the LLM provider with the agent's
    system prompt and user query, returning structured output.
"""

from typing import List, Dict, Any
from llm_provider import chat_completion


class BaseAgent:
    def __init__(
        self,
        name: str,
        role: str,
        system_prompt: str,
        tools: List[str],
        model_tier: str = "smart",
    ):
        self.name = name
        self.role = role
        self.system_prompt = system_prompt
        self.tools = tools
        self.model_tier = model_tier
        self.memory: List[Dict[str, Any]] = []

    def log_thought(self, message: str) -> Dict[str, str]:
        """Create a status update for the frontend streaming UI."""
        return {"state": "Thinking", "msg": f"[{self.name}] {message}"}

    def _build_messages(self, query: str, context: str = "") -> list[dict]:
        """Assemble the messages list for the LLM call."""
        messages = [{"role": "system", "content": self.system_prompt}]

        # Inject retrieved RAG context if available
        if context:
            messages.append({
                "role": "system",
                "content": f"Retrieved context from the knowledge base:\n{context}",
            })

        # Include recent memory (last 6 turns)
        for mem in self.memory[-6:]:
            messages.append(mem)

        messages.append({"role": "user", "content": query})
        return messages

    async def execute(self, query: str, context: str = "") -> Dict[str, Any]:
        """
        Run the agent: build prompt → call LLM → return structured result.
        """
        messages = self._build_messages(query, context)

        response = await chat_completion(
            messages=messages,
            model_tier=self.model_tier,
            temperature=0.7,
            max_tokens=1024,
        )

        # Persist to memory
        self.memory.append({"role": "user", "content": query})
        self.memory.append({"role": "assistant", "content": response})

        return {
            "agent": self.name,
            "role": self.role,
            "response": response,
            "citations": [],
        }

    async def run(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        """Alias for execute — can be overridden in subclasses for custom logic."""
        return await self.execute(query, context=context.get("rag_context", "") if context else "")
