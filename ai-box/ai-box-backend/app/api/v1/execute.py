import time
from typing import List

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.models.agent import Agent, AgentExecution
from app.schemas.agent_config import ExecuteRequestSchema
from agents.agent_factory import ConfigurableAgent

router = APIRouter()


@router.post("/{agent_id}/execute")
async def execute_agent(agent_id: str, payload: ExecuteRequestSchema, db: Session = Depends(get_db)):
    agent = db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    configurable_agent = ConfigurableAgent(agent.config, llm_base_url=settings.ollama_base_url)
    start = time.time()
    result = await configurable_agent.execute(user_input=payload.input, context=payload.context)
    duration_ms = int((time.time() - start) * 1000)

    execution = AgentExecution(
        agent_id=agent.id,
        input_text=payload.input,
        output_text=result.get("output"),
        status=result.get("status", "completed"),
        execution_time=duration_ms,
        error_message=None,
        logs=result.get("logs", []),
    )
    db.add(execution)
    agent.execution_count = (agent.execution_count or 0) + 1
    db.add(agent)
    db.commit()
    db.refresh(execution)

    return {
        "execution_id": str(execution.id),
        "agent_id": str(agent.id),
        "output": result.get("output"),
        "status": result.get("status"),
        "logs": result.get("logs"),
        "tool_results": result.get("tool_results"),
        "execution_time": duration_ms,
        "iterations": result.get("iterations"),
    }


@router.get("/{agent_id}/executions")
def list_executions(
    agent_id: str,
    limit: int = Query(10, gt=0, le=50),
    db: Session = Depends(get_db),
):
    executions: List[AgentExecution] = (
        db.query(AgentExecution)
        .filter(AgentExecution.agent_id == agent_id)
        .order_by(AgentExecution.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": str(ex.id),
            "input_text": ex.input_text,
            "output_text": ex.output_text,
            "status": ex.status,
            "execution_time": ex.execution_time,
            "created_at": ex.created_at,
        }
        for ex in executions
    ]


@router.get("/{agent_id}/stats")
def execution_stats(agent_id: str, db: Session = Depends(get_db)):
    executions: List[AgentExecution] = (
        db.query(AgentExecution)
        .filter(AgentExecution.agent_id == agent_id)
        .order_by(AgentExecution.created_at.desc())
        .all()
    )
    total = len(executions)
    completed = len([e for e in executions if e.status == "completed"])
    failed = len([e for e in executions if e.status == "failed"])
    avg_time = int(sum(e.execution_time or 0 for e in executions) / total) if total else 0
    success_rate = round((completed / total) * 100, 2) if total else 0.0

    return {
        "agent_id": agent_id,
        "total": total,
        "completed": completed,
        "failed": failed,
        "avg_time_ms": avg_time,
        "success_rate": success_rate,
    }

