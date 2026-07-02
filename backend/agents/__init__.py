"""
AEGIS Agent Registry — All specialized AI agents for the multi-agent orchestration system.
"""

from agents.base import BaseAgent
from agents.ceo import CEOAgent
from agents.sales import SalesAgent
from agents.marketing import MarketingAgent
from agents.finance import FinanceAgent
from agents.hr import HRAgent
from agents.legal import LegalAgent
from agents.research import ResearchAgent
from agents.analytics import AnalyticsAgent

# Registry maps agent names to their class instances
AGENT_REGISTRY: dict[str, BaseAgent] = {
    "CEO Agent": CEOAgent(),
    "Sales Agent": SalesAgent(),
    "Marketing Agent": MarketingAgent(),
    "Finance Agent": FinanceAgent(),
    "HR Agent": HRAgent(),
    "Legal Agent": LegalAgent(),
    "Research Agent": ResearchAgent(),
    "Analytics Agent": AnalyticsAgent(),
}

def get_agent(name: str) -> BaseAgent:
    """Retrieve agent instance by name. Falls back to CEO Agent."""
    return AGENT_REGISTRY.get(name, AGENT_REGISTRY["CEO Agent"])

__all__ = [
    "BaseAgent",
    "CEOAgent",
    "SalesAgent",
    "MarketingAgent",
    "FinanceAgent",
    "HRAgent",
    "LegalAgent",
    "ResearchAgent",
    "AnalyticsAgent",
    "AGENT_REGISTRY",
    "get_agent",
]
