"""
Business & Support Agents Package.
Includes: Customer Support, Sales Assistant, HR / Recruiter, Legal, Marketing, Finance.
"""

from agents.base import BaseAgent

class CustomerSupportAgent(BaseAgent):
    agent_id = "customer_support"
    name = "Customer Support Agent"
    role = "Real-Time Support Representative"
    category = "Business & Support"
    description = "Provides empathetic, real-time responses to customer queries and issues."
    preferred_model_tier = "fast"

class SalesAssistantAgent(BaseAgent):
    agent_id = "sales_assistant"
    name = "Sales Assistant Agent"
    role = "B2B Sales & Lead Qualification Specialist"
    category = "Business & Support"
    description = "Drafts outreach messages, qualifies leads, and prepares pitch decks."
    preferred_model_tier = "fast"

class HRRecruiterAgent(BaseAgent):
    agent_id = "hr_recruiter"
    name = "HR / Recruiter Agent"
    role = "Talent Acquisition & HR Policy Specialist"
    category = "Business & Support"
    description = "Drafts job descriptions, screens candidate resumes, and answers HR policy questions."
    preferred_model_tier = "fast"

class LegalAgent(BaseAgent):
    agent_id = "legal"
    name = "Legal Agent"
    role = "Corporate & Compliance Legal Specialist"
    category = "Business & Support"
    description = "Reviews contracts, terms of service, privacy policies, and compliance requirements."
    preferred_model_tier = "smart"

class MarketingAgent(BaseAgent):
    agent_id = "marketing"
    name = "Marketing Agent"
    role = "Growth & Campaign Marketing Strategist"
    category = "Business & Support"
    description = "Generates ad copy, social posts, SEO strategy, and campaign calendars."
    preferred_model_tier = "fast"

class FinanceAgent(BaseAgent):
    agent_id = "finance"
    name = "Finance / Personal Finance Agent"
    role = "Financial Analyst & Budget Planner"
    category = "Business & Support"
    description = "Analyzes budgets, cash flow, unit economics, and investment planning."
    preferred_model_tier = "smart"
