import { Agent } from '@/lib/types';
import { Activity, Zap, Target, TrendingUp } from 'lucide-react';

interface AgentDetailsProps {
  agent: Agent;
}

export default function AgentDetails({ agent }: AgentDetailsProps) {
  const getRoleEmoji = (role: string) => {
    const emojiMap: Record<string, string> = {
      'Юрист': '⚖️',
      'Бухгалтер': '📊',
      'Маркетолог': '📢',
      'Дизайнер': '🎨',
    };
    return emojiMap[role] || '⚙️';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center text-3xl">
            {getRoleEmoji(agent.role)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{agent.name}</h2>
            <p className="text-gray-600">{agent.role}</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Описание</h3>
          <p className="text-gray-600 leading-relaxed">{agent.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Инструменты</h3>
          <div className="flex flex-wrap gap-2">
            {agent.tools.map((tool) => (
              <span
                key={tool.id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg"
              >
                {tool.emoji && <span>{tool.emoji}</span>}
                {tool.name}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">System Prompt</h3>
          <div className="bg-gray-50 rounded-lg p-4 max-h-32 overflow-y-auto">
            <p className="text-sm text-gray-700 font-mono leading-relaxed whitespace-pre-wrap">
              {agent.system_prompt}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Запусков</p>
              <p className="text-2xl font-bold text-gray-900">{agent.run_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Успешность</p>
              <p className="text-2xl font-bold text-green-600">{agent.success_rate}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Модель</p>
              <p className="text-sm font-semibold text-gray-900">{agent.model}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Температура</p>
              <p className="text-sm font-semibold text-gray-900">{agent.temperature}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
