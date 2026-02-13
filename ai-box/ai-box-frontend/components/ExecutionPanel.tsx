'use client';

import { useState } from 'react';
import { Play, Clock, CheckCircle, XCircle, Info } from 'lucide-react';
import { AgentExecution, ExecutionLog } from '@/lib/types';

interface ExecutionPanelProps {
  agentId: string;
  onExecute?: (input: string) => Promise<void>;
}

export default function ExecutionPanel({ agentId, onExecute }: ExecutionPanelProps) {
  const [input, setInput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [execution, setExecution] = useState<AgentExecution | null>(null);

  const handleExecute = async () => {
    if (!input.trim() || isExecuting) return;

    setIsExecuting(true);
    try {
      const mockExecution: AgentExecution = {
        id: Math.random().toString(),
        agent_id: agentId,
        input,
        output: '',
        status: 'running',
        logs: [],
        execution_time: 0,
        created_at: new Date().toISOString(),
      };

      setExecution(mockExecution);

      const mockLogs: ExecutionLog[] = [
        { timestamp: new Date().toISOString(), message: 'Инициализация агента...', level: 'info' },
        { timestamp: new Date().toISOString(), message: 'Загрузка контекста и инструментов', level: 'info' },
        { timestamp: new Date().toISOString(), message: 'Обработка запроса...', level: 'info' },
      ];

      for (let i = 0; i < mockLogs.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 800));
        setExecution((prev) => prev ? { ...prev, logs: [...prev.logs, mockLogs[i]] } : null);
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const mockOutput = `Обработал ваш запрос: "${input}"\n\nВыполнены следующие действия:\n1. Анализ требований\n2. Поиск релевантной информации\n3. Формирование ответа\n\nРезультат: Задача выполнена успешно.`;

      setExecution((prev) => prev ? {
        ...prev,
        output: mockOutput,
        status: 'success',
        execution_time: 3200,
        logs: [
          ...prev.logs,
          { timestamp: new Date().toISOString(), message: 'Задача выполнена успешно', level: 'success' },
        ],
      } : null);

      if (onExecute) {
        await onExecute(input);
      }
    } catch (error) {
      setExecution((prev) => prev ? {
        ...prev,
        status: 'error',
        logs: [
          ...prev.logs,
          { timestamp: new Date().toISOString(), message: 'Ошибка выполнения', level: 'error' },
        ],
      } : null);
    } finally {
      setIsExecuting(false);
    }
  };

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <Info className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Запуск агента</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Что нужно сделать агенту?
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Например: Проверь этот контракт на наличие рисков"
              rows={4}
              disabled={isExecuting}
              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none disabled:bg-gray-50"
            />
          </div>

          <button
            onClick={handleExecute}
            disabled={!input.trim() || isExecuting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {isExecuting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Выполняется...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Запустить агента
              </>
            )}
          </button>
        </div>
      </div>

      {execution && (
        <>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Результат</h3>
            {execution.output ? (
              <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-800 whitespace-pre-wrap">
                {execution.output}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
                Агент работает...
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Логи выполнения</h3>
              {execution.execution_time > 0 && (
                <span className="text-sm text-gray-500">
                  Время: {(execution.execution_time / 1000).toFixed(2)}с
                </span>
              )}
            </div>
            <div className="space-y-2">
              {execution.logs.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-lg ${
                    log.level === 'error'
                      ? 'bg-red-50'
                      : log.level === 'success'
                      ? 'bg-green-50'
                      : log.level === 'warning'
                      ? 'bg-yellow-50'
                      : 'bg-blue-50'
                  }`}
                >
                  {getLogIcon(log.level)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800">{log.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString('ru-RU')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
