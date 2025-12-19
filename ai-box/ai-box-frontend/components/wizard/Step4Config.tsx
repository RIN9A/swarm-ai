import { AVAILABLE_MODELS } from '@/lib/types';

interface Step4ConfigProps {
  model: string;
  temperature: number;
  maxIterations: number;
  onModelChange: (value: string) => void;
  onTemperatureChange: (value: number) => void;
  onMaxIterationsChange: (value: number) => void;
  agentConfig: any;
}

export default function Step4Config({
  model,
  temperature,
  maxIterations,
  onModelChange,
  onTemperatureChange,
  onMaxIterationsChange,
  agentConfig,
}: Step4ConfigProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Параметры модели</h2>
        <p className="text-gray-600">Настройте поведение языковой модели</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Модель
            </label>
            <select
              value={model}
              onChange={(e) => onModelChange(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Выберите языковую модель для работы агента
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Температура: {temperature.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={temperature}
              onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Точный (0.0)</span>
              <span>Креативный (1.0)</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Низкие значения делают ответы более предсказуемыми, высокие - более креативными
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Максимум итераций: {maxIterations}
            </label>
            <input
              type="range"
              min="1"
              max="20"
              step="1"
              value={maxIterations}
              onChange={(e) => onMaxIterationsChange(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>1</span>
              <span>20</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Максимальное количество шагов для решения задачи
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Предпросмотр конфигурации
          </label>
          <div className="bg-gray-900 rounded-xl p-4 h-[400px] overflow-auto">
            <pre className="text-xs text-green-400 font-mono leading-relaxed">
              {JSON.stringify(agentConfig, null, 2)}
            </pre>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Финальная конфигурация агента в формате JSON
          </p>
        </div>
      </div>
    </div>
  );
}
