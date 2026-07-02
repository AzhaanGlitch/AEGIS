"""
CEO Agent — Strategic orchestrator that routes queries to specialist sub-agents.
"""

from typing import Dict, Any, List
from agents.base import BaseAgent

SYSTEM_PROMPT = """You are the CEO Agent of AEGIS — the Autonomous Enterprise Growth Intelligence System.

Your role is Strategic Oversight & Task Delegation. You are the primary orchestrator.

When a user asks a question:
1. Analyze the intent and determine which specialist agent should handle it.
2. If the query relates to finances/budgets, delegate to the Finance Agent.
3. If the query relates to sales/leads/pipeline, delegate to the Sales Agent.
4. If the query relates to campaigns/marketing, delegate to the Marketing Agent.
5. If the query relates to HR/policies/recruitment, delegate to the HR Agent.
6. If the query relates to contracts/compliance, delegate to the Legal Agent.
7. If the query relates to market research/competitors, delegate to the Research Agent.
8. If the query relates to data analysis/charts, delegate to the Analytics Agent.
9. Otherwise, answer the strategic question yourself with executive insight.

Always cite source documents when referencing data. Be concise and professional.
Format important figures in **bold**. Use markdown for structure."""


class CEOAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="CEO Agent",
            role="Strategic Router & Orchestrator",
            system_prompt=SYSTEM_PROMPT,
            tools=["Delegate Task", "Aggregate Reports", "Scenario Planning"],
            model_tier="smart",
        )

    def route_query(self, query: str) -> str:
        """Determine which sub-agent should handle this query."""
        q = query.lower()
        if any(kw in q for kw in ("revenue", "forecast", "budget", "finance", "cash", "expense", "anomaly")):
            return "Finance Agent"
        elif any(kw in q for kw in ("lead", "deal", "sales", "pipeline", "crm", "prospect")):
            return "Sales Agent"
        elif any(kw in q for kw in ("campaign", "marketing", "ad", "roi", "mql", "content")):
            return "Marketing Agent"
        elif any(kw in q for kw in ("policy", "employee", "hr", "remote", "recruit", "resume", "hiring")):
            return "HR Agent"
        elif any(kw in q for kw in ("contract", "legal", "compliance", "clause", "liability")):
            return "Legal Agent"
        elif any(kw in q for kw in ("competitor", "market research", "trend", "industry")):
            return "Research Agent"
        elif any(kw in q for kw in ("chart", "data", "sql", "analytics", "statistics", "visualization")):
            return "Analytics Agent"
        return "CEO Agent"

    async def run(self, query: str, context: Dict[str, Any] = None) -> Dict[str, Any]:
        target = self.route_query(query)
        logs = [
            self.log_thought("Parsing user strategy prompt..."),
            self.log_thought("Querying Knowledge Graph for entity context..."),
        ]

        if target != "CEO Agent":
            logs.append(self.log_thought(f"Delegating to {target}..."))

        result = await self.execute(query, context=context.get("rag_context", "") if context else "")
        result["routed_to"] = target
        result["logs"] = logs
        return result
