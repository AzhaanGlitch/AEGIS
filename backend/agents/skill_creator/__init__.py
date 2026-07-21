"""
Skill-Creator Suite Agents Package.
Includes: Analyzer, Comparator, Grader.
"""

from agents.base import BaseAgent

class AnalyzerAgent(BaseAgent):
    agent_id = "analyzer"
    name = "Analyzer Agent"
    role = "Deep Pattern & Skill Data Analyzer"
    category = "Skill-Creator Suite"
    description = "Deconstructs dataset inputs, codebases, or prompts to extract core skill components."
    preferred_model_tier = "smart"

class ComparatorAgent(BaseAgent):
    agent_id = "comparator"
    name = "Comparator Agent"
    role = "Side-by-Side Evaluation Specialist"
    category = "Skill-Creator Suite"
    description = "Compares multi-model outputs, prompts, or code implementations to identify diffs and improvements."
    preferred_model_tier = "smart"

class GraderAgent(BaseAgent):
    agent_id = "grader"
    name = "Grader Agent"
    role = "Automated Quality Assessment & Scoring Specialist"
    category = "Skill-Creator Suite"
    description = "Evaluates agent outputs against strict criteria and assigns numerical quality scores."
    preferred_model_tier = "smart"
