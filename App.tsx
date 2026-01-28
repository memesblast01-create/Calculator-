
import React, { useState } from 'react';
import { CalculatorMode } from './types';
import CalculatorUI from './components/CalculatorUI';
import AISolverUI from './components/AISolverUI';
import { Calculator as CalcIcon, BrainCircuit, History, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<CalculatorMode>(CalculatorMode.STANDARD);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <CalcIcon className="text-blue-500" />
          <span className="font-bold text-xl tracking-tight">NovaCalc</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar / Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 border-r border-slate-800 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="hidden md:flex items-center gap-2 mb-10">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/20">
              <CalcIcon size={24} />
            </div>
            <span className="font-bold text-2xl tracking-tight">NovaCalc</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => { setMode(CalculatorMode.STANDARD); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${mode === CalculatorMode.STANDARD ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'hover:bg-slate-800'}`}
            >
              <CalcIcon size={18} />
              <span className="font-medium">Standard</span>
            </button>
            <button
              onClick={() => { setMode(CalculatorMode.SCIENTIFIC); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${mode === CalculatorMode.SCIENTIFIC ? 'bg-blue-600/10 text-blue-400 border border-blue-600/20' : 'hover:bg-slate-800'}`}
            >
              <div className="flex items-center justify-center font-bold text-xs border-2 border-current rounded w-5 h-5">f(x)</div>
              <span className="font-medium">Scientific</span>
            </button>
            <button
              onClick={() => { setMode(CalculatorMode.AI_SOLVER); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${mode === CalculatorMode.AI_SOLVER ? 'bg-purple-600/10 text-purple-400 border border-purple-600/20' : 'hover:bg-slate-800'}`}
            >
              <BrainCircuit size={18} />
              <span className="font-medium">AI Math Solver</span>
            </button>
          </nav>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <History size={16} />
            <span>v1.2.0 Stable</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="flex-1 max-w-4xl mx-auto w-full p-4 md:p-8 flex items-center justify-center">
          {mode === CalculatorMode.AI_SOLVER ? (
            <AISolverUI />
          ) : (
            <CalculatorUI mode={mode} />
          )}
        </div>
      </main>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
