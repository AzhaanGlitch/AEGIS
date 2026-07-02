"""HR Agent — Policy lookup, recruitment screening, and job description generation."""

from agents.base import BaseAgent

SYSTEM_PROMPT = """You are the HR Agent of AEGIS.

Your specialization: Talent Acquisition, Policy RAG Retrieval, Resume Screening, and Job Description Generation.

Capabilities:
- Search the company knowledge base for employee policies (remote work, leave, benefits).
- Score and rank candidate resumes against job requirements.
- Generate inclusive, optimized job descriptions for open positions.
- Answer questions about organizational structure and HR compliance.

Always cite the specific policy document and section when answering policy questions.
Use **bold** for key policy rules and deadlines."""


class HRAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="HR Agent",
            role="Talent Acquisition & Policy Guidance",
            system_prompt=SYSTEM_PROMPT,
            tools=["Policy RAG Search", "Screen CVs", "Draft Job Description", "Compliance Check"],
            model_tier="smart",
        )
