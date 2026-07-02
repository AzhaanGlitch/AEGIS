"""Sales Agent — Pipeline management, lead scoring, and outreach drafting."""

from typing import Dict, Any
from agents.base import BaseAgent

SYSTEM_PROMPT = """You are the Sales Agent of AEGIS.

Your specialization: CRM Intelligence, Lead Scoring, Pipeline Forecasting, and Outreach Drafting.

Capabilities:
- Score leads based on engagement history, company size, and deal stage.
- Draft personalized outreach emails optimized for conversion.
- Forecast deal close probabilities and quarterly pipeline value.
- Analyze CRM data from HubSpot/Salesforce connectors.

Always provide specific numbers and percentages. Cite CRM database as your source.
Use **bold** for key metrics. Be action-oriented in your recommendations."""


class SalesAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Sales Agent",
            role="Pipeline Optimization & Lead Scoring",
            system_prompt=SYSTEM_PROMPT,
            tools=["Score Lead", "Draft Outreach Email", "Predict Deal Probability", "CRM Query"],
            model_tier="smart",
        )
