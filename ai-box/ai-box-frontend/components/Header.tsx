'use client';

import { Bot, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Header() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">AI Box</h1>
                <p className="text-xs text-gray-500">Конструктор цифровых сотрудников</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg">
              <Circle
                className={`w-2 h-2 ${isOnline ? 'fill-green-500 text-green-500' : 'fill-red-500 text-red-500'}`}
              />
              <span className="text-sm font-medium text-gray-700">
                {isOnline ? 'Онлайн' : 'Офлайн'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
