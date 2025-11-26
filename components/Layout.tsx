
import React from 'react';
import { ViewState, ToastMessage } from '../types';
import { Home, Heart, CheckCircle, MessageSquareMore, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewState;
  onNavigate: (view: ViewState) => void;
  title?: string;
  toasts: ToastMessage[];
  onDismissToast: (id: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentView,
  onNavigate,
  title = 'CampusSpot',
  toasts,
  onDismissToast,
}) => {
  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900 max-w-md mx-auto shadow-2xl overflow-hidden relative border-x border-gray-200 font-sans">
      {/* Toast Container - Floating absolute to ensure visibility */}
      <div className="absolute top-16 left-0 right-0 z-50 flex flex-col items-center pointer-events-none px-4 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between w-full max-w-sm p-4 rounded-xl shadow-lg border animate-in slide-in-from-top-5 fade-in duration-300 ${
              toast.type === 'success' 
                ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
                : 'bg-white border-gray-200 text-gray-800'
            }`}
          >
            <span className="font-medium text-sm">{toast.message}</span>
            <button 
              onClick={() => onDismissToast(toast.id)}
              className="ml-4 p-1 rounded-full hover:bg-black/5 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md px-5 py-4 shadow-sm z-10 flex items-center justify-between sticky top-0 border-b border-gray-100">
        <h1 className="text-xl font-extrabold text-indigo-600 tracking-tight flex items-center gap-2">
          <span>{title}</span>
        </h1>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="absolute bottom-0 w-full bg-white/90 backdrop-blur-lg border-t border-gray-200 py-3 px-6 flex justify-between items-center z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${
            currentView === 'home' || currentView === 'details'
              ? 'text-indigo-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Home size={24} strokeWidth={currentView === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wide">Explore</span>
        </button>

        <button
          onClick={() => onNavigate('favorites')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${
            currentView === 'favorites'
              ? 'text-indigo-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <Heart size={24} strokeWidth={currentView === 'favorites' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wide">Saved</span>
        </button>

        <button
          onClick={() => onNavigate('visited')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${
            currentView === 'visited'
              ? 'text-indigo-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <CheckCircle size={24} strokeWidth={currentView === 'visited' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wide">Visited</span>
        </button>

        <button
          onClick={() => onNavigate('ai-assistant')}
          className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${
            currentView === 'ai-assistant'
              ? 'text-indigo-600'
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          <MessageSquareMore size={24} strokeWidth={currentView === 'ai-assistant' ? 2.5 : 2} />
          <span className="text-[10px] font-bold uppercase tracking-wide">Assistant</span>
        </button>
      </nav>
    </div>
  );
};
