"""
API Router for 27-Agent Multi-Role Suite.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from agents.orchestrator import OrchestratorAgent

router = APIRouter(prefix="/agents", tags=["Agents Multi-Role Suite"])
orchestrator = OrchestratorAgent()

class OrchestrateRequest(BaseModel):
    user_input: str
    target_agent_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

@router.get("/")
async def list_registered_agents():
    """List metadata for all 27 registered agents."""
    return {
        "total_agents": len(orchestrator.registry),
        "agents": orchestrator.list_agents()
    }

@router.post("/orchestrate")
async def orchestrate_task(req: OrchestrateRequest):
    """Auto-route input prompt to ideal agent or invoke specified target agent."""
    if not req.user_input.strip():
        raise HTTPException(status_code=400, detail="User input cannot be empty.")
    
    res = await orchestrator.orchestrate(
        user_input=req.user_input,
        target_agent_id=req.target_agent_id,
        context=req.context
    )
    return res

@router.post("/{agent_id}/run")
async def run_single_agent(agent_id: str, req: OrchestrateRequest):
    """Directly execute a target agent by ID."""
    if agent_id not in orchestrator.registry:
        raise HTTPException(status_code=404, detail=f"Agent '{agent_id}' not found.")
    
    agent = orchestrator.registry[agent_id]
    res = await agent.run(user_input=req.user_input, context=req.context)
    return {
        "agent": {
            "agent_id": agent.agent_id,
            "name": agent.name,
            "category": agent.category
        },
        "response": res
    }
