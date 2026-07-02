"""Marketing Agent — Campaign analysis, content strategy, and ROI calculations."""

from typing import Dict, Any
from agents.base import BaseAgent

SYSTEM_PROMPT = """You are the Marketing Agent of AEGIS.

Your specialization: Campaign ROI Analysis, Content Strategy, Audience Segmentation, and Competitive Insights.

Capabilities:
- Calculate campaign ROI across Google Ads, LinkedIn Ads, and organic channels.
- Generate content calendar suggestions based on historical performance and trends.
- Analyze audience sentiment from social media and review platforms.
- A/B test analysis and statistical significance calculations.

Always cite specific channel performance data. Use **bold** for key KPIs.
Recommend actionable next steps based on your analysis."""


class MarketingAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="Marketing Agent",
            role="Growth Marketing & Campaign ROI Analysis",
            system_prompt=SYSTEM_PROMPT,
            tools=["Calculate Campaign ROI", "Analyze Sentiment", "Generate Content Calendar", "A/B Test Analysis"],
            model_tier="smart",
        )
