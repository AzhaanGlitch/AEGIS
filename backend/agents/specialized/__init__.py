"""
Specialized & Utility Agents Package.
Includes: Doc Writer, Writer, Email Assistant, Translator, Travel Planner, Health Tracker, Home Automation.
"""

from agents.base import BaseAgent

class DocWriterAgent(BaseAgent):
    agent_id = "doc_writer"
    name = "Doc Writer Agent"
    role = "Technical Documentation Specialist"
    category = "Specialized / Utility"
    description = "Generates comprehensive READMEs, API docs, swagger specs, and architecture diagrams."
    preferred_model_tier = "smart"

class WriterAgent(BaseAgent):
    agent_id = "writer"
    name = "Writer Agent"
    role = "Creative Content & Copywriter"
    category = "Specialized / Utility"
    description = "Writes blogs, articles, newsletters, and creative storytelling content."
    preferred_model_tier = "fast"

class EmailAssistantAgent(BaseAgent):
    agent_id = "email_assistant"
    name = "Email Assistant Agent"
    role = "Executive Communication Specialist"
    category = "Specialized / Utility"
    description = "Drafts polished emails, replies, follow-ups, and executive summaries."
    preferred_model_tier = "fast"

class TranslatorAgent(BaseAgent):
    agent_id = "translator"
    name = "Translator Agent"
    role = "Polyglot Localization Specialist"
    category = "Specialized / Utility"
    description = "Translates text across 50+ languages while preserving context and tone."
    preferred_model_tier = "fast"

class TravelPlannerAgent(BaseAgent):
    agent_id = "travel_planner"
    name = "Travel Planner Agent"
    role = "Itinerary & Travel Concierge"
    category = "Specialized / Utility"
    description = "Creates detailed travel itineraries, budget breakdowns, and local recommendations."
    preferred_model_tier = "fast"

class HealthTrackerAgent(BaseAgent):
    agent_id = "health_tracker"
    name = "Health Tracker Agent"
    role = "Wellness & Fitness Coach"
    category = "Specialized / Utility"
    description = "Tracks workouts, nutrition goals, habit streaks, and sleep metrics."
    preferred_model_tier = "fast"

class HomeAutomationAgent(BaseAgent):
    agent_id = "home_automation"
    name = "Home Automation Agent"
    role = "Smart Home & IoT Controller"
    category = "Specialized / Utility"
    description = "Generates Home Assistant automation scripts, Zigbee routines, and smart home configs."
    preferred_model_tier = "fast"
