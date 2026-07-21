"""
Central Orchestrator Agent for AEGIS 27-Agent Suite.
Routes requests across 27 specialized agents using intent classification and LLM routing layer (Groq, NVIDIA, HuggingFace).
"""

import json
import logging
from typing import Dict, Any, Optional, List

from agents.base import BaseAgent
from agents.core import (
    ArchitectAgent, CodeReviewerAgent, CoderAgent, DebuggerAgent,
    DevOpsLeadAgent, TestEngineerAgent, OpsAgent, LangChainReviewerAgent, HelloWorldAgent
)
from agents.planning import PlannerAgent, MeetingAssistantAgent
from agents.business import (
    CustomerSupportAgent, SalesAssistantAgent, HRRecruiterAgent, LegalAgent,
    MarketingAgent, FinanceAgent
)
from agents.specialized import (
    DocWriterAgent, WriterAgent, EmailAssistantAgent, TranslatorAgent,
    TravelPlannerAgent, HealthTrackerAgent, HomeAutomationAgent
)
from agents.skill_creator import AnalyzerAgent, ComparatorAgent, GraderAgent

from llm_provider import query_llm_json, get_available_providers

logger = logging.getLogger("AEGIS_ORCHESTRATOR")

class OrchestratorAgent(BaseAgent):
    agent_id = "orchestrator"
    name = "Orchestrator Agent"
    role = "Central Task Classifier & Agent Dispatcher"
    category = "Planning & Management"
    description = "Inspects user prompt, routes to the ideal target agent among 27 options, and selects model tier."
    preferred_model_tier = "smart"

    def __init__(self):
        super().__init__()
        # Instantiate registry of all 27 agents
        self.registry: Dict[str, BaseAgent] = {
            # Core Engineering (9)
            "architect": ArchitectAgent(),
            "code_reviewer": CodeReviewerAgent(),
            "coder": CoderAgent(),
            "debugger": DebuggerAgent(),
            "devops": DevOpsLeadAgent(),
            "test_engineer": TestEngineerAgent(),
            "ops": OpsAgent(),
            "langchain_reviewer": LangChainReviewerAgent(),
            "hello_world": HelloWorldAgent(),
            # Planning & Management (3 - including self)
            "orchestrator": self,
            "planner": PlannerAgent(),
            "meeting_assistant": MeetingAssistantAgent(),
            # Business & Support (6)
            "customer_support": CustomerSupportAgent(),
            "sales_assistant": SalesAssistantAgent(),
            "hr_recruiter": HRRecruiterAgent(),
            "legal": LegalAgent(),
            "marketing": MarketingAgent(),
            "finance": FinanceAgent(),
            # Specialized / Utility (7)
            "doc_writer": DocWriterAgent(),
            "writer": WriterAgent(),
            "email_assistant": EmailAssistantAgent(),
            "translator": TranslatorAgent(),
            "travel_planner": TravelPlannerAgent(),
            "health_tracker": HealthTrackerAgent(),
            "home_automation": HomeAutomationAgent(),
            # Skill-Creator Suite (3)
            "analyzer": AnalyzerAgent(),
            "comparator": ComparatorAgent(),
            "grader": GraderAgent(),
        }

    def list_agents(self) -> List[Dict[str, Any]]:
        """Return list of metadata for all 27 registered agents."""
        return [
            {
                "agent_id": agent.agent_id,
                "name": agent.name,
                "role": agent.role,
                "category": agent.category,
                "description": agent.description,
                "preferred_model_tier": agent.preferred_model_tier,
            }
            for agent in self.registry.values()
        ]

    async def classify_and_route(self, user_input: str) -> Dict[str, Any]:
        """Classify user query and select the target agent ID."""
        agent_options = [
            f"- {id}: {a.name} ({a.category}) - {a.description}"
            for id, a in self.registry.items()
        ]
        options_text = "\n".join(agent_options)

        prompt = f"""Given the following user task, select the SINGLE best agent to handle it.

Available Agents:
{options_text}

Task: "{user_input}"

Respond ONLY with valid JSON in this exact structure:
{{
  "selected_agent_id": "<agent_id>",
  "reasoning": "<short explanation of why this agent was chosen>",
  "confidence": 0.95
}}
"""
        messages = [
            {"role": "system", "content": "You are a master router system. Return strictly JSON."},
            {"role": "user", "content": prompt}
        ]

        try:
            res = await query_llm_json(messages=messages, tier="fast")
            target_id = res.get("selected_agent_id", "coder")
            if target_id not in self.registry:
                target_id = "coder"
            return {
                "target_agent_id": target_id,
                "reasoning": res.get("reasoning", "Routed based on task semantics."),
                "confidence": res.get("confidence", 0.9)
            }
        except Exception as e:
            logger.warning(f"Classification failed: {e}. Defaulting to 'coder'.")
            return {
                "target_agent_id": "coder",
                "reasoning": "Fallback routing due to classification error.",
                "confidence": 0.5
            }

    async def orchestrate(self, user_input: str, target_agent_id: Optional[str] = None, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Route input to specified or auto-classified agent and return result."""
        active_providers = get_available_providers()

        if not target_agent_id or target_agent_id not in self.registry:
            routing_info = await self.classify_and_route(user_input)
            target_agent_id = routing_info["target_agent_id"]
            reasoning = routing_info["reasoning"]
        else:
            reasoning = f"Directly invoked target agent '{target_agent_id}'."

        agent = self.registry[target_agent_id]
        
        # Don't recurse if orchestrator targets orchestrator
        if target_agent_id == "orchestrator":
            agent_result = {
                "agent_id": "orchestrator",
                "agent_name": self.name,
                "status": "success",
                "content": f"Orchestrator ready. System has 27 active agents across Core Engineering, Planning, Business, Specialized, and Skill-Creator categories.\n\nConfigured LLM providers (excluding Gemini): {[p['name'] for p in active_providers]}."
            }
        else:
            agent_result = await agent.run(user_input, context=context)

        return {
            "orchestrator_summary": {
                "user_input": user_input,
                "selected_agent": {
                    "agent_id": agent.agent_id,
                    "name": agent.name,
                    "role": agent.role,
                    "category": agent.category
                },
                "routing_reasoning": reasoning,
                "available_providers": [p["name"] for p in active_providers],
            },
            "agent_response": agent_result
        }
