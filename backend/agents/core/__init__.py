"""
Core Engineering Agents Package.
Includes: Architect, Code Reviewer, Coder, Debugger, DevOps, Test Engineer, Ops, LangChain Reviewer, Hello World.
"""

from agents.base import BaseAgent

class ArchitectAgent(BaseAgent):
    agent_id = "architect"
    name = "Architect Agent"
    role = "Software Architect"
    category = "Core Engineering"
    description = "Designs system architecture, microservices, data flow, and tech stack choices."
    preferred_model_tier = "smart"

class CodeReviewerAgent(BaseAgent):
    agent_id = "code_reviewer"
    name = "Code Reviewer Agent"
    role = "Lead Code Reviewer"
    category = "Core Engineering"
    description = "Audits code for bugs, anti-patterns, security, and performance optimizations."
    preferred_model_tier = "smart"

class CoderAgent(BaseAgent):
    agent_id = "coder"
    name = "Coder Agent"
    role = "Full-Stack Software Engineer"
    category = "Core Engineering"
    description = "Writes clean, idiomatic code, functions, APIs, and algorithms."
    preferred_model_tier = "smart"

class DebuggerAgent(BaseAgent):
    agent_id = "debugger"
    name = "Debugger Agent"
    role = "Root Cause Diagnostic Specialist"
    category = "Core Engineering"
    description = "Analyzes error logs, stack traces, and runtime exceptions."
    preferred_model_tier = "smart"

class DevOpsLeadAgent(BaseAgent):
    agent_id = "devops"
    name = "DevOps Lead Agent"
    role = "Infrastructure & CI/CD Specialist"
    category = "Core Engineering"
    description = "Manages Docker, Kubernetes, GitHub Actions, terraform, and cloud infrastructure."
    preferred_model_tier = "smart"

class TestEngineerAgent(BaseAgent):
    agent_id = "test_engineer"
    name = "Test Engineer Agent"
    role = "QA & Test Automation Specialist"
    category = "Core Engineering"
    description = "Generates unit tests, integration tests, end-to-end test suits, and mock data."
    preferred_model_tier = "fast"

class OpsAgent(BaseAgent):
    agent_id = "ops"
    name = "Ops Agent"
    role = "Site Reliability & Systems Ops Specialist"
    category = "Core Engineering"
    description = "Monitors metrics, server health, log analysis, and automated alerts."
    preferred_model_tier = "fast"

class LangChainReviewerAgent(BaseAgent):
    agent_id = "langchain_reviewer"
    name = "LangChain Code Reviewer Agent"
    role = "LLM & Agent Framework Reviewer"
    category = "Core Engineering"
    description = "Audits LangChain, LlamaIndex, and multi-agent pipelines for memory and prompt efficiency."
    preferred_model_tier = "smart"

class HelloWorldAgent(BaseAgent):
    agent_id = "hello_world"
    name = "Hello World Agent"
    role = "Instant Verification Agent"
    category = "Core Engineering"
    description = "Sub-second ultra-fast sanity check agent for system testing."
    preferred_model_tier = "fast"
