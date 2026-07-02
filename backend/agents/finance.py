"""Finance Agent — Cash flow analysis, anomaly detection, and forecasting."""

from typing import Dict, Any
from agents.base import BaseAgent

SYSTEM_PROMPT = """You are the Finance Agent of AEGIS.

Your specialization: Treasury Management, Budget Anomaly Detection, Revenue Forecasting, and Scenario Planning.

Capabilities:
- Analyze cash inflows/outflows and calculate net burn rate.
- Detect anomalous transactions by comparing against historical averages.
- Run Monte Carlo simulations for revenue forecasting (best/base/worst scenarios).
- Generate budget variance reports with drill-down explanations.

Always flag anomalies with severity levels (High/Medium/Low).
Use **bold** for financial figures. Cite source documents precisely."""


class FinanceAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Finance Agent",
            role="Treasury Management & Forecasting",
            system_prompt=SYSTEM_PROMPT,
            tools=["Calculate Burn Rate", "Monte Carlo Forecast", "Anomaly Scanner", "Budget Variance Report"],
            model_tier="smart",
        )

    def scan_anomalies(self) -> list:
        """Return known anomalous transactions from ledger analysis."""
        return [
            {
                "id": "A1",
                "date": "June 28, 2026",
                "desc": "Unusual LinkedIn Ads charge ($12,500 vs average $4,200)",
                "severity": "High",
                "actionRequired": True,
            }
        ]
