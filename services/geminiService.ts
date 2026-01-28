
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiMathService {
  private ai: GoogleGenAI;

  constructor() {
    // Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async solveMathProblem(problem: string) {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Solve this mathematical problem step-by-step: "${problem}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              problem: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              finalAnswer: { type: Type.STRING }
            },
            required: ["problem", "steps", "finalAnswer"]
          }
        }
      });

      // The response.text property directly returns the string output.
      const text = response.text;
      if (!text) throw new Error("No response from AI");
      return JSON.parse(text.trim());
    } catch (error) {
      console.error("Gemini Error:", error);
      throw error;
    }
  }
}

export const mathService = new GeminiMathService();