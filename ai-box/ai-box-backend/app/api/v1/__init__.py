from fastapi import APIRouter

from app.api.v1 import agents, execute, templates

api_router = APIRouter()
api_router.include_router(templates.router, prefix="/templates", tags=["templates"])
api_router.include_router(agents.router, prefix="/agents", tags=["agents"])
api_router.include_router(execute.router, prefix="/agents", tags=["execution"])

