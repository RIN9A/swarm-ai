import { Tool } from '@/lib/types';
import { Check, X } from 'lucide-react';

interface Step3ToolsProps {
  availableTools: Tool[];
  selectedTools: Tool[];
  onToggleTool: (tool: Tool) => void;
}

export default function Step3Tools({
  availableTools,
  selectedTools,
  onToggleTool,
}: Step3ToolsProps) {
  const isSelected = (toolId: string) => {
    return selectedTools.some((t) => t.id === toolId);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Выберите инструменты</h2>
        <p className="text-gray-600">
          Определите, какие инструменты будет использовать агент в работе
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {availableTools.map((tool) => {
          const selected = isSelected(tool.id);
          return (
            <button
              key={tool.id}
              onClick={() => onToggleTool(tool)}
              className={`relative p-4 bg-white rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                selected
                  ? 'border-blue-500 shadow-md shadow-blue-100'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {selected && (
                <div className="absolute top-3 right-3 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}

              <div className="text-2xl mb-2">{tool.emoji}</div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{tool.name}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">{tool.description}</p>
            </button>
          );
        })}
      </div>

      {selectedTools.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Выбранные инструменты ({selectedTools.length})
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTools.map((tool) => (
              <span
                key={tool.id}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-sm font-medium rounded-lg"
              >
                {tool.emoji && <span>{tool.emoji}</span>}
                {tool.name}
                <button
                  onClick={() => onToggleTool(tool)}
                  className="ml-1 hover:bg-blue-100 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
