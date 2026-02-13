import { AGENT_TEMPLATES, AVAILABLE_TOOLS, Agent, CreateAgentDTO, Tool } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api/v1";

type BackendAgentSummary = {
  id: string;
  name: string;
  role: string;
  description?: string;
  tools?: string[];
};

type BackendAgentDetail = BackendAgentSummary & {
  config?: any;
  is_active?: boolean;
  execution_count?: number;
  created_at?: string;
  updated_at?: string;
};

type BackendStats = {
  total: number;
  completed: number;
  failed: number;
  success_rate: number;
  avg_time_ms: number;
};

// соответствие id шаблонов (wizard) и enum ролей в бэкенде
const ROLE_MAP: Record<string, string> = {
  lawyer: "legal_advisor",
  accountant: "accountant",
  marketer: "marketer",
  designer: "artist",
  custom: "custom",
};

// соответствие id инструментов в wizard и имени тулов в бэкенде
const TOOL_TO_BACKEND_ID: Record<string, string> = {
  "pdf-parser": "pdf_parser",
  email: "email_sender",
  excel: "spreadsheet_reader",
  "1c-api": "c1_api_call",
  "doc-generator": "document_generator",
  "image-gen": "image_generator",
  "web-search": "web_search",
  database: "database_query",
};

const BACKEND_TO_TOOL_ID: Record<string, string> = Object.fromEntries(
  Object.entries(TOOL_TO_BACKEND_ID).map(([frontendId, backendId]) => [
    backendId,
    frontendId,
  ])
);

function mapToolsFromBackendIds(ids: string[] | undefined): Tool[] {
  if (!ids) return [];
  return ids
    .map((backendId) => {
      const frontendId = BACKEND_TO_TOOL_ID[backendId] || backendId;
      return AVAILABLE_TOOLS.find((t) => t.id === frontendId);
    })
    .filter(Boolean) as Tool[];
}

function mapRoleToDisplay(backendRole: string): string {
  const template = AGENT_TEMPLATES.find(
    (t) => ROLE_MAP[t.id] === backendRole
  );
  return template?.role || backendRole;
}

function mapAgentFromBackend(
  backend: BackendAgentDetail,
  stats?: BackendStats
): Agent {
  const config = backend.config || {};
  const toolsFromConfig: string[] = config.tools || backend.tools || [];

  return {
    id: backend.id,
    name: backend.name,
    role: mapRoleToDisplay(backend.role),
    description: backend.description || "",
    system_prompt: config.system_prompt || "",
    model: config.model || "llama3.1-8b",
    temperature: config.temperature ?? 0.7,
    max_iterations: config.max_iterations ?? 10,
    tools: mapToolsFromBackendIds(toolsFromConfig),
    is_active: backend.is_active ?? true,
    run_count: stats?.total ?? backend.execution_count ?? 0,
    success_rate: stats?.success_rate ?? 0,
    created_at: backend.created_at || "",
    updated_at: backend.updated_at || "",
  };
}

export async function getAgents(): Promise<Agent[]> {
  const res = await fetch(`${API_BASE}/agents`);
  if (!res.ok) {
    throw new Error("Failed to fetch agents");
  }
  const data: BackendAgentSummary[] = await res.json();

  return data.map((item) =>
    mapAgentFromBackend({
      ...item,
      config: {},
      is_active: true,
      execution_count: 0,
    })
  );
}

export async function getAgent(id: string): Promise<Agent | null> {
  const [agentRes, statsRes] = await Promise.all([
    fetch(`${API_BASE}/agents/${id}`),
    fetch(`${API_BASE}/agents/${id}/stats`),
  ]);

  if (agentRes.status === 404) return null;
  if (!agentRes.ok) {
    throw new Error("Failed to fetch agent");
  }

  const backend: BackendAgentDetail = await agentRes.json();
  let stats: BackendStats | undefined;
  if (statsRes.ok) {
    stats = (await statsRes.json()) as BackendStats;
  }

  return mapAgentFromBackend(backend, stats);
}

export async function createAgent(agent: CreateAgentDTO): Promise<Agent> {
  const body = {
    name: agent.name,
    role: ROLE_MAP[agent.role] || "custom",
    description: agent.description,
    system_prompt: agent.system_prompt,
    tools: agent.tools
      .map((t) => TOOL_TO_BACKEND_ID[t.id])
      .filter(Boolean),
    triggers: ["manual"],
    integrations: [],
    model: agent.model,
    max_iterations: agent.max_iterations,
    temperature: agent.temperature,
  };

  const res = await fetch(`${API_BASE}/agents/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error("Failed to create agent");
  }

  const created = await res.json();
  return (await getAgent(created.id)) as Agent;
}

export async function deleteAgent(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/agents/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Failed to delete agent");
  }
}
