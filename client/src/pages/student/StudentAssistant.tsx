import React from 'react';
import { AIChatInterface } from '../../components/ai/AIChatInterface';

export const StudentAssistant: React.FC = () => {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">AI Campus Intelligence</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Ask questions about institutional policies, exam schedules, attendance requirements, and course topics.
        </p>
      </div>

      <AIChatInterface />
    </div>
  );
};

