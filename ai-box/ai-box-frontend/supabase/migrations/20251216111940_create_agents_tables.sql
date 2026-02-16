
CREATE TABLE IF NOT EXISTS agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  description text DEFAULT '',
  system_prompt text NOT NULL,
  model text NOT NULL DEFAULT 'llama3.1-8b',
  temperature numeric(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 1),
  max_iterations integer DEFAULT 10 CHECK (max_iterations > 0),
  tools jsonb DEFAULT '[]'::jsonb,
  is_active boolean DEFAULT true,
  run_count integer DEFAULT 0,
  success_rate numeric(5,2) DEFAULT 0 CHECK (success_rate >= 0 AND success_rate <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Создаем таблицу выполнений
CREATE TABLE IF NOT EXISTS agent_executions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id uuid NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  input text NOT NULL,
  output text DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'success', 'error')),
  logs jsonb DEFAULT '[]'::jsonb,
  execution_time integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_agents_created_at ON agents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_agent_executions_agent_id ON agent_executions(agent_id);
CREATE INDEX IF NOT EXISTS idx_agent_executions_created_at ON agent_executions(created_at DESC);

-- Функция для автоматического обновления updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Триггер для обновления updated_at
DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON agents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Включаем RLS
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_executions ENABLE ROW LEVEL SECURITY;

-- Политики для agents
CREATE POLICY "Users can view all agents"
  ON agents FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create agents"
  ON agents FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update agents"
  ON agents FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete agents"
  ON agents FOR DELETE
  TO authenticated
  USING (true);

-- Политики для agent_executions
CREATE POLICY "Users can view all executions"
  ON agent_executions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create executions"
  ON agent_executions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update executions"
  ON agent_executions FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Вставляем примеры агентов для демонстрации
INSERT INTO agents (name, role, description, system_prompt, model, temperature, max_iterations, tools, is_active, run_count, success_rate)
VALUES 
  (
    'Юридический консультант',
    'Юрист',
    'Помогает анализировать договоры, проверять документы на соответствие законодательству',
    'Ты опытный юрист с глубокими знаниями российского законодательства. Твоя задача - анализировать юридические документы, выявлять риски и давать практические рекомендации.',
    'llama3.1-8b',
    0.3,
    5,
    '[{"id": "pdf-parser", "name": "PDF парсер"}, {"id": "doc-generator", "name": "Генератор документов"}]'::jsonb,
    true,
    127,
    94.5
  ),
  (
    'Бухгалтер-помощник',
    'Бухгалтер',
    'Автоматизирует учет, формирует отчеты, интегрируется с 1C',
    'Ты профессиональный бухгалтер. Помогаешь вести учет, формировать отчетность, работать с первичными документами.',
    'mistral-7b',
    0.2,
    10,
    '[{"id": "1c-api", "name": "1C API"}, {"id": "excel", "name": "Таблицы"}, {"id": "doc-generator", "name": "Генератор документов"}]'::jsonb,
    true,
    89,
    97.2
  ),
  (
    'SMM-менеджер',
    'Маркетолог',
    'Создает контент для соцсетей, анализирует аудиторию, планирует посты',
    'Ты креативный SMM-специалист. Создаешь вовлекающий контент, знаешь тренды, умеешь работать с аудиторией.',
    'llama3.1-8b',
    0.8,
    8,
    '[{"id": "image-gen", "name": "Генератор изображений"}, {"id": "web-search", "name": "Web search"}]'::jsonb,
    true,
    234,
    91.8
  )
ON CONFLICT DO NOTHING;
