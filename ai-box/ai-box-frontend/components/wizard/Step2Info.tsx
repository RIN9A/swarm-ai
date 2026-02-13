interface Step2InfoProps {
  name: string;
  description: string;
  systemPrompt: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSystemPromptChange: (value: string) => void;
}

export default function Step2Info({
  name,
  description,
  systemPrompt,
  onNameChange,
  onDescriptionChange,
  onSystemPromptChange,
}: Step2InfoProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Основная информация</h2>
        <p className="text-gray-600">Настройте базовые параметры вашего агента</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Имя агента <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Например: Бухгалтер-помощник"
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-sm text-gray-500 mt-2">
            Краткое название, которое будет отображаться в списке агентов
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание агента
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Чем этот агент помогает бизнесу?"
            rows={3}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          />
          <p className="text-sm text-gray-500 mt-2">
            Краткое описание функций и возможностей агента
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            System Prompt <span className="text-red-500">*</span>
          </label>
          <textarea
            value={systemPrompt}
            onChange={(e) => onSystemPromptChange(e.target.value)}
            placeholder="Опишите роль и поведение агента для языковой модели..."
            rows={8}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none font-mono text-sm"
          />
          <p className="text-sm text-gray-500 mt-2">
            Подробная инструкция для ИИ: какую роль он играет, как должен отвечать, какие знания использовать
          </p>
        </div>
      </div>
    </div>
  );
}
