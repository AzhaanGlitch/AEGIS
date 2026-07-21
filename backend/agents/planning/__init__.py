"""
Planning & Management Agents Package.
Includes: Planner, Meeting Assistant.
"""

from agents.base import BaseAgent

class PlannerAgent(BaseAgent):
    agent_id = "planner"
    name = "Planner Agent"
    role = "Agile Project Planner & Roadmap Strategist"
    category = "Planning & Management"
    description = "Breaks down requirements into Sprints, Epics, user stories, and milestones."
    preferred_model_tier = "smart"

class MeetingAssistantAgent(BaseAgent):
    agent_id = "meeting_assistant"
    name = "Project / Meeting Assistant Agent"
    role = "Meeting Summarizer & Action Item Tracker"
    category = "Planning & Management"
    description = "Extracts action items, decisions, and summaries from meeting notes."
    preferred_model_tier = "fast"
