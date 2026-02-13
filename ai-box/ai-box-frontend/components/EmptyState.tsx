import { Bot, Plus } from 'lucide-react';
import Link from 'next/link';

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mb-6">
        <Bot className="w-12 h-12 text-blue-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">Агентов пока нет</h3>
      <p className="text-gray-600 text-center mb-6 max-w-md">
        Создайте первого ИИ-агента, чтобы автоматизировать рутинные задачи и повысить эффективность работы
      </p>
      <Link
        href="/agents/create"
        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md hover:shadow-lg"
      >
        <Plus className="w-5 h-5" />
        Создать первого агента
      </Link>
    </div>
  );
}
