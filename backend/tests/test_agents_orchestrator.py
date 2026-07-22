import pytest
from backend.agents.orchestrator import OrchestratorAgent

def test_orchestrator_initialization():
    orchestrator = OrchestratorAgent()
    assert orchestrator.agent_id == "orchestrator"
    assert len(orchestrator.registry) > 0

def test_orchestrator_list_agents():
    orchestrator = OrchestratorAgent()
    agents_list = orchestrator.list_agents()
    assert isinstance(agents_list, list)
    assert "agent_id" in agents_list[0]

@pytest.mark.asyncio
async def test_orchestrator_fallback_routing(monkeypatch):
    orchestrator = OrchestratorAgent()

    async def mock_query_fail(*args, **kwargs):
        raise Exception("LLM routing failure")

    monkeypatch.setattr("backend.agents.orchestrator.query_llm_json", mock_query_fail)
    result = await orchestrator.classify_and_route("Build a website")
    assert result["selected_agents"][0]["agent_id"] == "coder"
