import pytest
from backend.agents.base import BaseAgent

def test_base_agent_initialization():
    agent = BaseAgent()
    assert agent is not None
