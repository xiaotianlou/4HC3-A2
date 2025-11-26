import React, { useState } from 'react';
import { Send, Bot, Sparkles } from 'lucide-react';
import { getGeminiRecommendation } from '../services/geminiService';
import { StudySpot } from '../types';

interface AIAssistantProps {
  availableSpots: StudySpot[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ availableSpots }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hi! I\'m your Campus Study Buddy. Tell me what kind of environment you\'re looking for (e.g., "quiet place with outlets" or "busy cafe").' }
  ]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    const recommendation = await getGeminiRecommendation(userMessage, availableSpots);

    setMessages(prev => [...prev, { role: 'assistant', content: recommendation }]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="p-4 bg-indigo-600 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-full">
            <Sparkles size={20} className="text-yellow-300" />
          </div>
          <div>
            <h2 className="font-bold text-lg">AI Assistant</h2>
            <p className="text-indigo-100 text-xs">Powered by Gemini</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
              }`}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-1 text-indigo-600 font-bold text-xs uppercase tracking-wide">
                  <Bot size={12} />
                  CampusBot
                </div>
              )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 flex gap-1.5 items-center">
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-gray-200 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for a recommendation..."
            className="flex-1 bg-transparent outline-none text-sm py-1"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="text-indigo-600 p-1.5 rounded-full hover:bg-indigo-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
};
