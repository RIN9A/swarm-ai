from enum import Enum
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AgentRoleEnum(str, Enum):
    legal_advisor = "legal_advisor"
    accountant = "accountant"
    marketer = "marketer"
    artist = "artist"
    custom = "custom"


class ToolEnum(str, Enum):
    pdf_parser = "pdf_parser"
    document_generator = "document_generator"
    email_sender = "email_sender"
    spreadsheet_reader = "spreadsheet_reader"
    c1_api_call = "c1_api_call"
    image_generator = "image_generator"
    web_search = "web_search"
    database_query = "database_query"
    translate_text = "translate_text"
    summarize_text = "summarize_text"
    api_call = "api_call"


class TriggerEnum(str, Enum):
    manual = "manual"
    schedule = "schedule"
    webhook = "webhook"


class IntegrationConfig(BaseModel):
    name: str
    settings: Dict[str, Any] = Field(default_factory=dict)


class AgentConfigSchema(BaseModel):
    name: str
    role: AgentRoleEnum
    description: Optional[str] = None
    system_prompt: str
    tools: List[ToolEnum] = Field(default_factory=list)
    triggers: List[TriggerEnum] = Field(default_factory=list)
    integrations: List[IntegrationConfig] = Field(default_factory=list)
    model: str = "llama3.1:8b"
    max_iterations: int = 4
    temperature: float = 0.2


class ExecuteRequestSchema(BaseModel):
    input: str
    context: Optional[Dict[str, Any]] = None
    stream: bool = False


class ExecuteResponseSchema(BaseModel):
    output: str
    status: str
    logs: List[Dict[str, Any]]
    tool_results: List[Dict[str, Any]]
    execution_time: int
    iterations: int

