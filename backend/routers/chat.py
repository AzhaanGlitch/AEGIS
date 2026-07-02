"""
AI Streaming Chat Router
Coordinates query routing via the CEOAgent and streams specialist agent execution token-by-token.
"""

import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from agents import get_agent, AGENT_REGISTRY
from llm_provider import stream_chat_completion

router = APIRouter(prefix="/chat", tags=["AI Workspace Chat"])

@router.websocket("/stream")
async def websocket_chat_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            query = payload.get("query", "")
            agent_type = payload.get("agent_type", "CEO Agent")

            # 1. Parse using CEO Agent to see if we should route to another agent
            ceo_agent = AGENT_REGISTRY["CEO Agent"]
            routing_decision = await ceo_agent.run(query)
            routed_agent_name = routing_decision.get("routed_to", agent_type)
            
            # Send status update thoughts to the client
            for thought_log in routing_decision.get("logs", []):
                await websocket.send_json({"type": "status", "data": thought_log})
                await asyncio.sleep(0.4)

            # 2. Grab the final target agent
            target_agent = get_agent(routed_agent_name)
            await websocket.send_json({
                "type": "status",
                "data": {"state": "Orchestrating", "msg": f"[{target_agent.name}] Generating response using free LLM tier..."}
            })
            await asyncio.sleep(0.4)

            # 3. Compile messages from the agent prompt guides
            messages = target_agent._build_messages(query, context="")

            # Stream tokens
            async for token in stream_chat_completion(messages=messages, model_tier=target_agent.model_tier):
                await websocket.send_json({"type": "token", "token": token})

            # Send final completions with sources
            await websocket.send_json({
                "type": "done",
                "citations": [
                    {"name": "AEGIS PRD Specs", "link": "file:///Users/yashgoyal/Documents/AEGIS/AEGIS_PRD.md"},
                    {"name": "Knowledge Graph", "link": "file:///Users/yashgoyal/Documents/AEGIS/extracted_text.txt"}
                ]
            })

    except WebSocketDisconnect:
        pass
    except Exception as e:
        try:
            await websocket.send_json({"type": "error", "message": str(e)})
        except:
            pass
