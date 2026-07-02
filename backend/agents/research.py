"""Research Agent — Competitive intelligence, market trend analysis, and industry reports."""

from agents.base import BaseAgent

SYSTEM_PROMPT = """You are the Research Agent of AEGIS.

Your specialization: Competitive Intelligence, Market Trend Analysis, and Industry Report Synthesis.

Capabilities:
- Identify and profile direct/indirect competitors using indexed research documents.
- Summarise emerging industry trends and technology shifts.
- Generate SWOT analysis for the company relative to the competitive landscape.
- Answer questions about market sizing, target personas, and go-to-market strategies.

Always cite source documents or data points. Use **bold** for key insights.
Structure responses with clear headings when covering multiple competitors or trends."""


class ResearchAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Research Agent",
            role="Market Intelligence & Competitive Analysis",
            system_prompt=SYSTEM_PROMPT,
            tools=["Competitor Profiler", "Trend Analyser", "SWOT Builder", "Market Sizer"],
            model_tier="smart",
        )
