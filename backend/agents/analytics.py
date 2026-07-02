"""Analytics Agent — SQL generation, chart spec building, and statistical analysis."""

from typing import Dict, Any
from agents.base import BaseAgent

SYSTEM_PROMPT = """You are the Analytics Agent of AEGIS.

Your specialization: Data Analytics, SQL Query Generation, Statistical Modelling, and Chart Visualisation.

Capabilities:
- Write optimised SQL queries against the PostgreSQL data warehouse.
- Generate Recharts-compatible JSON chart specifications (bar, line, pie, scatter).
- Perform statistical analysis including regression, correlation, and cohort analysis.
- Interpret business KPIs and generate plain-language executive summaries.

Always present key metrics in **bold**. When referencing chart data, include the relevant chart type.
Be precise with numbers — include units, percentages, and time periods."""


class AnalyticsAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Analytics Agent",
            role="Data Analysis & Visualisation Generation",
            system_prompt=SYSTEM_PROMPT,
            tools=["Generate SQL Query", "Build Chart Spec", "Run Statistical Analysis", "KPI Summary"],
            model_tier="smart",
        )

    def generate_chart_spec(self, chart_type: str = "bar") -> Dict[str, Any]:
        """Returns a Recharts-compatible data spec for the revenue trend."""
        return {
            "type": chart_type,
            "data": [
                {"month": "Jan", "revenue": 980000},
                {"month": "Feb", "revenue": 1050000},
                {"month": "Mar", "revenue": 1120000},
                {"month": "Apr", "revenue": 1180000},
                {"month": "May", "revenue": 1245800},
            ],
            "xKey": "month",
            "yKey": "revenue",
        }
