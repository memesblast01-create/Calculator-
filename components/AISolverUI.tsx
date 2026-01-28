
import React, { useState } from 'react';
import { mathService } from '../services/geminiService';
import { AISolution } from '../types';
import { Send, Loader2, BrainCircuit, CheckCircle2, AlertCircle } from 'lucide-react';

const AISolverUI: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<AISolution | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSolve = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim() || loading) return;

    setLoading(true);
    setError(null);
    setSolution(null);

    try {
      const result = await mathService.solveMathProblem(query);
      setSolution(result);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Nova AI. Please check your network or API key.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-purple-600/20 text-purple-400 rounded-2xl mb-4">
          <BrainCircuit size={32} />
        </div>
        <h2 className="text-3xl font-bold mb-2">AI Math Solver</h2>
        <p className="text-slate-400">Describe any math problem in plain text and get a step-by-step solution.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSolve} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. Find the integral of x^2 from 0 to 5..."
          className="w-full bg-slate-900 border border-slate-800 rounded-3xl py-5 px-6 pr-16 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all text-lg shadow-xl"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-2xl transition-all shadow-lg shadow-purple-500/20"
        >
          {loading ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
        </button>
      </form>

      {/* Error State */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3 text-red-400">
          <AlertCircle className="shrink-0 mt-1" />
          <p>{error}</p>
        </div>
      )}

      {/* Solution Display */}
      {solution && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-6 border-b border-slate-800 bg-slate-900/50">
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-2">Problem Statement</h3>
            <p className="text-lg font-medium text-white">{solution.problem}</p>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-4">
                {solution.steps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 group">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-sm font-bold text-purple-400 group-hover:border-purple-500 transition-colors">
                        {idx + 1}
                      </div>
                      {idx !== solution.steps.length - 1 && <div className="w-px h-full bg-slate-800 mt-2" />}
                    </div>
                    <div className="pb-6">
                      <p className="text-slate-200 leading-relaxed pt-1">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 flex items-center gap-4">
                <div className="p-2 bg-emerald-500 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-500 mb-1">Final Answer</h3>
                  <p className="text-2xl font-bold text-white tracking-tight">{solution.finalAnswer}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State / Suggestions */}
      {!solution && !loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 opacity-60">
          {[
            "Solve 3x + 5 = 20",
            "What is 15% of 1250?",
            "Derive sin(x)",
            "Area of a circle with radius 7"
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => { setQuery(suggestion); }}
              className="text-left p-4 bg-slate-900/50 border border-slate-800 rounded-2xl hover:bg-slate-800 hover:border-slate-700 transition-all text-sm text-slate-400"
            >
              "{suggestion}"
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AISolverUI;
