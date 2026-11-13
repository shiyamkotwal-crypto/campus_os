import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  Info,
  CheckCircle2,
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { apiRequest } from '../../lib/api';
import { AIChatMessage, AICitation } from '../../types';

const SUGGESTED_PROMPTS = [
  "What is the minimum attendance required for semester exams?",
  "When are the Mid-Semester Examinations scheduled?",
  "Where is the Alan Turing Computing Lab located?",
  "Generate a 5-day study plan for Distributed Systems and AI"
];

export const AIChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "Hello! I am your CAMPUS OS AI Assistant. I have direct, verified access to official college handbooks, timetables, circulars, and departmental guidelines. What can I help you with today?",
      created_at: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || loading) return;

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      created_at: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setLoading(true);

    try {
      const res = await apiRequest<{
        sessionId: string;
        answer: string;
        confidence: string;
        answer_type: string;
        sources: AICitation[];
        follow_up_question?: string | null;
      }>('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({
          message: textToSend,
          sessionId: sessionId || undefined
        })
      });

      if (res.sessionId && !sessionId) {
        setSessionId(res.sessionId);
      }

      const botMessage: AIChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: res.answer,
        citations: res.sources,
        created_at: new Date().toISOString()
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: "I encountered an error retrieving verified institutional records. Please ensure the backend is connected to the database.",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-campus-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              Campus Intelligence Assistant
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
                Grounded via pgvector
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Verified answers derived exclusively from institutional handbooks and circulars
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([
              {
                id: 'welcome',
                role: 'assistant',
                content: "Conversation reset. How may I assist you with your academic responsibilities?",
                created_at: new Date().toISOString()
              }
            ]);
            setSessionId(null);
          }}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          title="New conversation"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-3xl ${
              msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            {msg.role === 'assistant' ? (
              <div className="w-7 h-7 rounded-lg bg-campus-600 flex items-center justify-center text-white text-xs shrink-0 mt-0.5 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
            ) : (
              <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-white text-xs shrink-0 mt-0.5 shadow-xs">
                U
              </div>
            )}

            <div className={`space-y-2 ${msg.role === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block text-left text-xs md:text-sm px-4 py-3 rounded-2xl ${
                  msg.role === 'user'
                    ? 'bg-campus-600 text-white shadow-xs rounded-tr-none'
                    : 'bg-slate-100 text-slate-800 rounded-tl-none border border-slate-200/60'
                }`}
              >
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>

              {/* Citations Box for Assistant messages */}
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 text-left bg-campus-50/70 border border-campus-200/80 rounded-xl p-3 max-w-xl">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-campus-800 mb-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-campus-600" />
                    Verified Institutional Sources ({msg.citations.length})
                  </div>
                  <div className="space-y-1.5">
                    {msg.citations.map((cite, cIdx) => (
                      <div key={cIdx} className="text-[11px] bg-white rounded-lg p-2 border border-campus-100 shadow-2xs">
                        <div className="font-semibold text-slate-800">
                          {cite.document_title} {cite.page_number ? `(Page ${cite.page_number})` : ''}
                        </div>
                        <p className="text-slate-600 italic mt-0.5 line-clamp-2">
                          "{cite.supporting_excerpt}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-campus-600 flex items-center justify-center text-white text-xs shadow-xs">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-100 border border-slate-200 text-slate-600 text-xs px-4 py-2.5 rounded-2xl rounded-tl-none flex items-center gap-2">
              <span>Searching institutional knowledge base & synthesizing answer...</span>
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-campus-600 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-campus-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-campus-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions (Pills) */}
      <div className="px-4 py-2 bg-slate-50/50 border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Info className="w-3 h-3" /> Prompts:
        </span>
        {SUGGESTED_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] bg-white border border-slate-200 hover:border-campus-400 hover:text-campus-600 text-slate-600 px-3 py-1 rounded-full shrink-0 transition shadow-2xs"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about academic policies, exam rules, timetables, or course requirements..."
            className="flex-1 bg-slate-100/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs md:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-campus-500/20 focus:border-campus-500 transition"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-4 py-2.5 bg-campus-600 hover:bg-campus-700 disabled:opacity-50 text-white rounded-xl text-xs md:text-sm font-semibold flex items-center gap-1.5 transition shadow-sm"
          >
            <span>Ask AI</span>
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

