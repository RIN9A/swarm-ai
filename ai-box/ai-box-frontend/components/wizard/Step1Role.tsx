import { AgentTemplate } from '@/lib/types';
import { Check } from 'lucide-react';

interface Step1RoleProps {
  templates: AgentTemplate[];
  selectedTemplate: AgentTemplate | null;
  onSelectTemplate: (template: AgentTemplate) => void;
}

export default function Step1Role({
  templates,
  selectedTemplate,
  onSelectTemplate,
}: Step1RoleProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Выберите роль агента</h2>
        <p className="text-gray-600">
          Выберите готовый шаблон или создайте своего агента с нуля
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className={`relative p-6 bg-white rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${
              selectedTemplate?.id === template.id
                ? 'border-blue-500 shadow-lg shadow-blue-100'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            {selectedTemplate?.id === template.id && (
              <div className="absolute top-4 right-4 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="text-4xl mb-3">{template.emoji}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
