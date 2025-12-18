
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getCalculusInsight(
  formula: string, 
  f1: string, 
  f2: string, 
  f3: string
): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `
        You are an expert mathematics professor. 
        Explain the relationship between this function and its derivatives:
        f(x) = ${formula}
        f'(x) = ${f1}
        f''(x) = ${f2}
        f'''(x) = ${f3}

        Keep the explanation concise but insightful. Focus on:
        1. Critical points and slope (f').
        2. Concavity and inflection points (f'').
        3. The 'jerk' or rate of change of concavity (f''').
        Use professional LaTeX formatting for math where appropriate (wrapped in $).
        Limit the response to 3 short paragraphs.
      `,
    });
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The professor is currently busy. Please try again later.";
  }
}
