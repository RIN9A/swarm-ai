from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db import get_db
from app.models.agent import Agent
from app.schemas.agent_config import AgentConfigSchema

router = APIRouter()


@router.post("/create", status_code=status.HTTP_201_CREATED)
def create_agent(payload: AgentConfigSchema, db: Session = Depends(get_db)):
    agent = Agent(
        name=payload.name,
        role=payload.role,
        description=payload.description,
        config=payload.dict(),
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return {"id": str(agent.id), "name": agent.name, "role": agent.role}


@router.get("/", response_model=List[dict])
def list_agents(db: Session = Depends(get_db)):
    agents = db.query(Agent).all()
    return [
        {
            "id": str(agent.id),
            "name": agent.name,
            "role": agent.role,
            "description": agent.description,
            "tools": agent.config.get("tools", []),
        }
        for agent in agents
    ]


@router.get("/{agent_id}")
def get_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    return {
        "id": str(agent.id),
        "name": agent.name,
        "role": agent.role,
        "description": agent.description,
        "config": agent.config,
        "is_active": agent.is_active,
        "execution_count": agent.execution_count,
    }


@router.patch("/{agent_id}")
def update_agent(agent_id: str, payload: AgentConfigSchema, db: Session = Depends(get_db)):
    agent = db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    agent.name = payload.name
    agent.role = payload.role
    agent.description = payload.description
    agent.config = payload.dict()
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return {"message": "Agent updated", "id": str(agent.id)}


@router.delete("/{agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_agent(agent_id: str, db: Session = Depends(get_db)):
    agent = db.get(Agent, agent_id)
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")
    db.delete(agent)
    db.commit()
    return {"message": "Agent deleted"}

