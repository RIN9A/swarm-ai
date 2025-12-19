'use client';

import { Agent } from '@/lib/types';
import { Edit, Play, Trash2, Circle } from 'lucide-react';
import Link from 'next/link';

interface AgentCardProps {
  agent: Agent;
  onDelete?: (id: string) => void;
  onToggleStatus?: (id: string, isActive: boolean) => void;
}

export default function AgentCard({ agent, onDelete, onToggleStatus }: AgentCardProps) {
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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl flex items-center justify-center text-2xl">
              {getRoleEmoji(agent.role)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{agent.name}</h3>
              <p className="text-sm text-gray-500">{agent.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Circle
              className={`w-2 h-2 ${agent.is_active ? 'fill-green-500 text-green-500' : 'fill-gray-400 text-gray-400'}`}
            />
            <span className="text-xs text-gray-600">
              {agent.is_active ? 'Активен' : 'Неактивен'}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2 min-h-[40px]">
          {agent.description}
        </p>

        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {agent.tools.slice(0, 4).map((tool) => (
              <span
                key={tool.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg"
              >
                {tool.emoji && <span>{tool.emoji}</span>}
                {tool.name}
              </span>
            ))}
            {agent.tools.length > 4 && (
              <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg">
                +{agent.tools.length - 4}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mb-4 pt-4 border-t border-gray-100">
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Запусков</div>
            <div className="text-lg font-semibold text-gray-900">{agent.run_count}</div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1">Успешность</div>
            <div className="text-lg font-semibold text-green-600">{agent.success_rate}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/agents/${agent.id}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-sm hover:shadow"
          >
            <Play className="w-4 h-4" />
            Запустить
          </Link>

          <Link
            href={`/agents/${agent.id}/edit`}
            className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Edit className="w-4 h-4" />
          </Link>

          <button
            onClick={() => onDelete?.(agent.id)}
            className="flex items-center justify-center w-10 h-10 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
