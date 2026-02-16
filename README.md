# swarm-ai

## AI Box Monorepo

Scaffold for `ai-box` with FastAPI backend, LangGraph agents package, and Next.js + Tailwind frontend.

### Structure
- `ai-box-backend`: FastAPI + SQLAlchemy + PostgreSQL + Redis + LangGraph/LangChain skeleton.
- `ai-box-frontend`: Next.js (App Router) + TypeScript + Tailwind.

### Quick start (dev)
Backend:
1. `cd ai-box-backend`
2. `python -m venv venv && source venv/bin/activate`
3. `pip install -r requirements.txt`
4. `docker-compose up` (postgres/redis/ollama)
5. `uvicorn app.main:app --reload`

Frontend:
1. `cd ai-box-frontend`
2. `npm install`
3. `npm run dev`

### Env
Copy `.env.example` / `.env.local.example` to configure API, DB, Redis, and model endpoints.
