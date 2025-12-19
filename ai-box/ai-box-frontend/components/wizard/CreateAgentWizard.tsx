'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import { AGENT_TEMPLATES, AVAILABLE_TOOLS, AgentTemplate, Tool } from '@/lib/types';
import { createAgent } from '@/lib/api';
import StepIndicator from './StepIndicator';
import Step1Role from './Step1Role';
import Step2Info from './Step2Info';
import Step3Tools from './Step3Tools';
import Step4Config from './Step4Config';

const STEPS = [
  { number: 1, title: 'Роль', description: 'Выберите специализацию' },
  { number: 2, title: 'Информация', description: 'Основные данные' },
  { number: 3, title: 'Инструменты', description: 'Функционал агента' },
  { number: 4, title: 'Параметры', description: 'Настройка модели' },
];

export default function CreateAgentWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [selectedTools, setSelectedTools] = useState<Tool[]>([]);
  const [model, setModel] = useState('llama3.1-8b');
  const [temperature, setTemperature] = useState(0.7);
  const [maxIterations, setMaxIterations] = useState(10);

  const handleTemplateSelect = (template: AgentTemplate) => {
    setSelectedTemplate(template);
    setName(template.name === 'Свой агент' ? '' : template.name);
    setDescription(template.description);
    setSystemPrompt(template.defaultPrompt);

    const defaultTools = AVAILABLE_TOOLS.filter((tool) =>
      template.defaultTools.includes(tool.id)
    );
    setSelectedTools(defaultTools);
  };

  const handleToggleTool = (tool: Tool) => {
    setSelectedTools((prev) =>
      prev.some((t) => t.id === tool.id)
        ? prev.filter((t) => t.id !== tool.id)
        : [...prev, tool]
    );
  };

  const canGoNext = () => {
    if (currentStep === 1) return selectedTemplate !== null;
    if (currentStep === 2) return name.trim() !== '' && systemPrompt.trim() !== '';
    return true;
  };

  const handleNext = () => {
    if (canGoNext() && currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = async () => {
    if (!canGoNext()) return;

    setIsLoading(true);
    try {
      const agent = await createAgent({
        name,
        // передаем технический id шаблона (lawyer, accountant, ...) для маппинга в backend enum роли
        role: selectedTemplate?.id || 'custom',
        description,
        system_prompt: systemPrompt,
        model,
        temperature,
        max_iterations: maxIterations,
        tools: selectedTools,
      });

      router.push(`/agents/${agent.id}`);
    } catch (error) {
      console.error('Failed to create agent:', error);
      alert('Не удалось создать агента. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const agentConfig = {
    name,
    role: selectedTemplate?.role || 'Custom',
    description,
    system_prompt: systemPrompt,
    model,
    temperature,
    max_iterations: maxIterations,
    tools: selectedTools.map((t) => ({ id: t.id, name: t.name })),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StepIndicator currentStep={currentStep} steps={STEPS} />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
          {currentStep === 1 && (
            <Step1Role
              templates={AGENT_TEMPLATES}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={handleTemplateSelect}
            />
          )}

          {currentStep === 2 && (
            <Step2Info
              name={name}
              description={description}
              systemPrompt={systemPrompt}
              onNameChange={setName}
              onDescriptionChange={setDescription}
              onSystemPromptChange={setSystemPrompt}
            />
          )}

          {currentStep === 3 && (
            <Step3Tools
              availableTools={AVAILABLE_TOOLS}
              selectedTools={selectedTools}
              onToggleTool={handleToggleTool}
            />
          )}

          {currentStep === 4 && (
            <Step4Config
              model={model}
              temperature={temperature}
              maxIterations={maxIterations}
              onModelChange={setModel}
              onTemperatureChange={setTemperature}
              onMaxIterationsChange={setMaxIterations}
              agentConfig={agentConfig}
            />
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 rounded-t-2xl shadow-lg p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>

            <div className="text-sm text-gray-600">
              Шаг {currentStep} из {STEPS.length}
            </div>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                disabled={!canGoNext()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                Далее
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleCreate}
                disabled={!canGoNext() || isLoading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Создание...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    Создать агента
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
