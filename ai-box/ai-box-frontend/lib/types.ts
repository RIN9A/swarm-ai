export interface Tool {
  id: string;
  name: string;
  description?: string;
  emoji?: string;
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  system_prompt: string;
  model: string;
  temperature: number;
  max_iterations: number;
  tools: Tool[];
  is_active: boolean;
  run_count: number;
  success_rate: number;
  created_at: string;
  updated_at: string;
}

export interface AgentExecution {
  id: string;
  agent_id: string;
  input: string;
  output: string;
  status: 'pending' | 'running' | 'success' | 'error';
  logs: ExecutionLog[];
  execution_time: number;
  created_at: string;
}

export interface ExecutionLog {
  timestamp: string;
  message: string;
  level: 'info' | 'success' | 'error' | 'warning';
}

export interface AgentTemplate {
  id: string;
  name: string;
  role: string;
  emoji: string;
  description: string;
  defaultPrompt: string;
  defaultTools: string[];
}

export interface CreateAgentDTO {
  name: string;
  role: string;
  description: string;
  system_prompt: string;
  model: string;
  temperature: number;
  max_iterations: number;
  tools: Tool[];
}

export const AVAILABLE_MODELS = [
  { value: 'llama3.1-8b', label: 'Llama 3.1 8B' },
  { value: 'llama3.1-70b', label: 'Llama 3.1 70B' },
  { value: 'mistral-7b', label: 'Mistral 7B' },
  { value: 'mixtral-8x7b', label: 'Mixtral 8x7B' },
] as const;

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    id: 'lawyer',
    name: 'Юрист',
    role: 'Юрист',
    emoji: '⚖️',
    description: 'Анализирует договоры, проверяет документы на соответствие законодательству',
    defaultPrompt: 'Ты опытный юрист с глубокими знаниями российского законодательства. Твоя задача - анализировать юридические документы, выявлять риски и давать практические рекомендации.',
    defaultTools: ['pdf-parser', 'doc-generator'],
  },
  {
    id: 'accountant',
    name: 'Бухгалтер',
    role: 'Бухгалтер',
    emoji: '📊',
    description: 'Автоматизирует учет, формирует отчеты, интегрируется с 1C',
    defaultPrompt: 'Ты профессиональный бухгалтер. Помогаешь вести учет, формировать отчетность, работать с первичными документами.',
    defaultTools: ['1c-api', 'excel', 'doc-generator'],
  },
  {
    id: 'marketer',
    name: 'Маркетолог',
    role: 'Маркетолог',
    emoji: '📢',
    description: 'Создает контент для соцсетей, анализирует аудиторию, планирует посты',
    defaultPrompt: 'Ты креативный SMM-специалист. Создаешь вовлекающий контент, знаешь тренды, умеешь работать с аудиторией.',
    defaultTools: ['image-gen', 'web-search'],
  },
  {
    id: 'designer',
    name: 'Дизайнер',
    role: 'Дизайнер',
    emoji: '🎨',
    description: 'Создает графику, баннеры, презентации и другие визуальные материалы',
    defaultPrompt: 'Ты талантливый дизайнер. Создаешь визуально привлекательные материалы, понимаешь композицию, цвет и типографику.',
    defaultTools: ['image-gen'],
  },
  {
    id: 'custom',
    name: 'Свой агент',
    role: 'Custom',
    emoji: '⚙️',
    description: 'Настройте агента под свои задачи с нуля',
    defaultPrompt: '',
    defaultTools: [],
  },
];

export const AVAILABLE_TOOLS: Tool[] = [
  {
    id: 'pdf-parser',
    name: 'PDF парсер',
    description: 'Извлекает текст и данные из PDF документов',
    emoji: '📄',
  },
  {
    id: 'email',
    name: 'Email',
    description: 'Отправляет электронные письма',
    emoji: '📧',
  },
  {
    id: 'excel',
    name: 'Таблицы',
    description: 'Работает с Excel и Google Sheets',
    emoji: '📊',
  },
  {
    id: '1c-api',
    name: '1C API',
    description: 'Интеграция с системой 1С',
    emoji: '💼',
  },
  {
    id: 'doc-generator',
    name: 'Генератор документов',
    description: 'Создает документы в различных форматах',
    emoji: '📝',
  },
  {
    id: 'image-gen',
    name: 'Генератор изображений',
    description: 'Создает изображения по текстовому описанию',
    emoji: '🎨',
  },
  {
    id: 'web-search',
    name: 'Web search',
    description: 'Поиск информации в интернете',
    emoji: '🔍',
  },
  {
    id: 'database',
    name: 'База данных',
    description: 'Запросы к базе данных компании',
    emoji: '🗄️',
  },
];
