from pydantic import AnyUrl, Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: AnyUrl = Field(
        default="postgresql://aibox_user:aibox_pass@localhost:5432/aibox_db",
        alias="DATABASE_URL",
    )
    redis_url: AnyUrl = Field(default="redis://localhost:6379", alias="REDIS_URL")
    llm_model: str = Field(default="llama3.1:8b", alias="LLM_MODEL")
    ollama_base_url: AnyUrl = Field(
        default="http://localhost:11434", alias="OLLAMA_BASE_URL"
    )
    api_host: str = Field(default="0.0.0.0", alias="API_HOST")
    api_port: int = Field(default=8000, alias="API_PORT")
    debug: bool = Field(default=True, alias="DEBUG")

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


settings = Settings()

