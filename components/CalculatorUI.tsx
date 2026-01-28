
import React, { useState, useEffect, useCallback } from 'react';
import { CalculatorMode, CalculationHistory } from '../types';
import { Delete, RotateCcw, Equal, Percent, Divide, X, Minus, Plus, History } from 'lucide-react';

interface CalculatorUIProps {
  mode: CalculatorMode;
}

const CalculatorUI: React.FC<CalculatorUIProps> = ({ mode }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<CalculationHistory[]>([]);
  const [lastResult, setLastResult] = useState<string | null>(null);

  const isScientific = mode === CalculatorMode.SCIENTIFIC;

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setLastResult(null);
  };

  const handleDelete = () => {
    if (display.length === 1) {
      setDisplay('0');
    } else {
      setDisplay(display.slice(0, -1));
    }
  };

  const handleDigit = (digit: string) => {
    if (lastResult !== null) {
      setDisplay(digit);
      setLastResult(null);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const handleOperator = (op: string) => {
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
    setLastResult(null);
  };

  const calculate = useCallback(() => {
    try {
      const fullExpression = expression + display;
      // Basic math parsing
      // Using a safer evaluation for basic arithmetic
      const sanitized = fullExpression.replace(/×/g, '*').replace(/÷/g, '/');
      
      // Basic implementation of calculation
      // eslint-disable-next-line no-eval
      const resultValue = eval(sanitized);
      const resultString = String(Number(resultValue.toFixed(8)));
      
      const newHistoryItem: CalculationHistory = {
        id: Math.random().toString(36).substr(2, 9),
        expression: fullExpression,
        result: resultString,
        timestamp: Date.now()
      };

      setHistory(prev => [newHistoryItem, ...prev].slice(0, 5));
      setDisplay(resultString);
      setExpression('');
      setLastResult(resultString);
    } catch (e) {
      setDisplay('Error');
      setLastResult('Error');
    }
  }, [display, expression]);

  const handleScientific = (func: string) => {
    let val = parseFloat(display);
    let result = 0;
    switch(func) {
      case 'sin': result = Math.sin(val); break;
      case 'cos': result = Math.cos(val); break;
      case 'tan': result = Math.tan(val); break;
      case 'sqrt': result = Math.sqrt(val); break;
      case 'log': result = Math.log10(val); break;
      case 'ln': result = Math.log(val); break;
      case 'pow2': result = Math.pow(val, 2); break;
      case 'pi': result = Math.PI; break;
      case 'e': result = Math.E; break;
      default: return;
    }
    const resultStr = String(Number(result.toFixed(8)));
    setDisplay(resultStr);
    setLastResult(resultStr);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Fix: Ensure /[0-9]/.test(e.key) is used correctly on the RegExp object
      if (/[0-9]/.test(e.key)) handleDigit(e.key);
      
      // Fix: Check if the key is one of the supported operators using includes
      if (['+', '-', '*', '/'].includes(e.key)) {
        const opMap: {[key: string]: string} = {'*': '×', '/': '÷', '+': '+', '-': '-'};
        handleOperator(opMap[e.key]);
      }
      if (e.key === 'Enter' || e.key === '=') calculate();
      if (e.key === 'Backspace') handleDelete();
      if (e.key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, expression, calculate]);

  const Button = ({ children, onClick, className = "", variant = "secondary" }: any) => {
    const variants: any = {
      primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20",
      secondary: "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/50",
      operator: "bg-slate-700/50 hover:bg-slate-600 text-blue-400 border border-blue-500/20",
      danger: "bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20",
      special: "bg-slate-900/50 hover:bg-slate-800 text-emerald-400 border border-emerald-500/20"
    };

    return (
      <button
        onClick={onClick}
        className={`flex items-center justify-center rounded-2xl p-4 md:p-6 text-lg md:text-xl font-semibold transition-all active:scale-95 ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden">
        {/* Display Area */}
        <div className="p-8 pb-4 flex flex-col items-end justify-end min-h-[160px] bg-gradient-to-b from-slate-900/50 to-transparent">
          <div className="text-slate-500 text-sm md:text-base font-mono mb-2 h-6 overflow-hidden text-right w-full">
            {expression}
          </div>
          <div className="text-white text-5xl md:text-6xl font-bold tracking-tighter overflow-hidden text-right w-full break-all">
            {display}
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="p-6 grid grid-cols-4 gap-3">
          {isScientific && (
            <>
              <Button onClick={() => handleScientific('sin')} variant="special" className="text-sm">sin</Button>
              <Button onClick={() => handleScientific('cos')} variant="special" className="text-sm">cos</Button>
              <Button onClick={() => handleScientific('tan')} variant="special" className="text-sm">tan</Button>
              <Button onClick={() => handleScientific('sqrt')} variant="special" className="text-sm">√</Button>
              <Button onClick={() => handleScientific('log')} variant="special" className="text-sm">log</Button>
              <Button onClick={() => handleScientific('pow2')} variant="special" className="text-sm">x²</Button>
              <Button onClick={() => handleScientific('pi')} variant="special" className="text-sm">π</Button>
              <Button onClick={() => handleScientific('e')} variant="special" className="text-sm">e</Button>
            </>
          )}

          <Button onClick={handleClear} variant="danger" className="col-span-1"><RotateCcw size={20} /></Button>
          <Button onClick={handleDelete} variant="secondary"><Delete size={20} /></Button>
          <Button onClick={() => handleOperator('%')} variant="operator"><Percent size={20} /></Button>
          <Button onClick={() => handleOperator('÷')} variant="operator"><Divide size={24} /></Button>

          <Button onClick={() => handleDigit('7')}>7</Button>
          <Button onClick={() => handleDigit('8')}>8</Button>
          <Button onClick={() => handleDigit('9')}>9</Button>
          <Button onClick={() => handleOperator('×')} variant="operator"><X size={24} /></Button>

          <Button onClick={() => handleDigit('4')}>4</Button>
          <Button onClick={() => handleDigit('5')}>5</Button>
          <Button onClick={() => handleDigit('6')}>6</Button>
          <Button onClick={() => handleOperator('-')} variant="operator"><Minus size={24} /></Button>

          <Button onClick={() => handleDigit('1')}>1</Button>
          <Button onClick={() => handleDigit('2')}>2</Button>
          <Button onClick={() => handleDigit('3')}>3</Button>
          <Button onClick={() => handleOperator('+')} variant="operator"><Plus size={24} /></Button>

          <Button onClick={() => handleDigit('0')} className="col-span-2">0</Button>
          <Button onClick={() => handleDigit('.')}>.</Button>
          <Button onClick={calculate} variant="primary"><Equal size={24} /></Button>
        </div>
      </div>

      {/* Mini History */}
      {history.length > 0 && (
        <div className="mt-6 p-4 bg-slate-900/50 rounded-2xl border border-slate-800">
          <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
            <History size={14} /> Recent History
          </h3>
          <div className="space-y-2">
            {history.map(item => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-slate-400 font-mono truncate mr-4">{item.expression}</span>
                <span className="text-blue-400 font-bold">= {item.result}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorUI;