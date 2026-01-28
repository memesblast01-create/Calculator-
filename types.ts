
export enum CalculatorMode {
  STANDARD = 'STANDARD',
  SCIENTIFIC = 'SCIENTIFIC',
  AI_SOLVER = 'AI_SOLVER'
}

export interface CalculationHistory {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface AISolution {
  problem: string;
  steps: string[];
  finalAnswer: string;
}
