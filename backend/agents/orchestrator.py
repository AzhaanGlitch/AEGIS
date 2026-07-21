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
        """Classify user query and select 1 or more relevant agents to execute concurrently."""
        agent_options = [
            f"- {id}: {a.name} ({a.category}) - {a.description}"
            for id, a in self.registry.items()
            if id != "orchestrator"
        ]
        options_text = "\n".join(agent_options)

        prompt = f"""Given the following user prompt, analyze what tasks need to be performed and select 1 to 3 relevant agents that should work on it (either sequentially or simultaneously).

Available Agents:
{options_text}

User Prompt: "{user_input}"

Respond ONLY with valid JSON in this exact structure:
{{
  "execution_plan": "Short strategy of how the selected agents will solve this",
  "selected_agents": [
    {{
      "agent_id": "<agent_id>",
      "subtask": "<specific task description for this agent>"
    }}
  ]
}}
"""
        messages = [
            {"role": "system", "content": "You are the Master Orchestrator system. Return strictly JSON."},
            {"role": "user", "content": prompt}
        ]

        try:
            res = await query_llm_json(messages=messages, tier="smart")
            selected_agents = res.get("selected_agents", [])
            valid_agents = []
            for item in selected_agents:
                aid = item.get("agent_id")
                if aid in self.registry and aid != "orchestrator":
                    valid_agents.append({
                        "agent_id": aid,
                        "subtask": item.get("subtask", user_input)
                    })
            if not valid_agents:
                valid_agents = [{"agent_id": "coder", "subtask": user_input}]
            return {
                "execution_plan": res.get("execution_plan", "Delegating task to specialized agents."),
                "selected_agents": valid_agents
            }
        except Exception as e:
            logger.warning(f"Multi-agent classification failed: {e}. Defaulting to 'coder'.")
            return {
                "execution_plan": "Fallback execution using Coder Agent.",
                "selected_agents": [{"agent_id": "coder", "subtask": user_input}]
            }

    async def orchestrate(self, user_input: str, target_agent_id: Optional[str] = None, context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """Route input, execute selected agents simultaneously using asyncio.gather, and return aggregated flow."""
        import asyncio
        active_providers = get_available_providers()

        if target_agent_id and target_agent_id in self.registry and target_agent_id != "orchestrator":
            plan_info = {
                "execution_plan": f"Direct execution override requested for agent '{target_agent_id}'.",
                "selected_agents": [{"agent_id": target_agent_id, "subtask": user_input}]
            }
        else:
            plan_info = await self.classify_and_route(user_input)

        selected_tasks = plan_info["selected_agents"]

        # Run selected agents simultaneously using asyncio.gather
        async def run_subagent(item: Dict[str, str]):
            aid = item["agent_id"]
            subtask = item["subtask"]
            agent_obj = self.registry[aid]
            res = await agent_obj.run(subtask, context=context)
            return {
                "agent_id": aid,
                "agent_name": agent_obj.name,
                "role": agent_obj.role,
                "category": agent_obj.category,
                "subtask": subtask,
                "result": res
            }

        agent_results = await asyncio.gather(*[run_subagent(item) for item in selected_tasks])

        return {
            "orchestrator_summary": {
                "user_input": user_input,
                "execution_plan": plan_info["execution_plan"],
                "total_agents_assigned": len(agent_results),
                "available_providers": [p["name"] for p in active_providers],
            },
            "agent_executions": list(agent_results)
        }
