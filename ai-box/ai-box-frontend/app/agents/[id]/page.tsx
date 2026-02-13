'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import AgentDetails from '@/components/AgentDetails';
import ExecutionPanel from '@/components/ExecutionPanel';
import { Agent } from '@/lib/types';
import { getAgent } from '@/lib/api';

export default function AgentPage() {
  const params = useParams();
  const router = useRouter();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAgent();
  }, [params.id]);

  const loadAgent = async () => {
    setIsLoading(true);
    try {
      const id = params.id as string;
      const data = await getAgent(id);
      if (!data) {
        router.push('/');
        return;
      }
      setAgent(data);
    } catch (error) {
      console.error('Failed to load agent:', error);
      router.push('/');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Назад к списку агентов
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <AgentDetails agent={agent} />
          </div>

          <div>
            <ExecutionPanel agentId={agent.id} />
          </div>
        </div>
      </main>
    </div>
  );
}
