import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI
// Note: API Key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getFocusMotivation = async (
  timeLeftMinutes: number, 
  appCount: number
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a strict, professional productivity coach. 
      The user is currently in a "Focus Session" with ${appCount} apps/links blocked.
      There are ${timeLeftMinutes} minutes remaining.
      
      Give them a short, punchy, 1-sentence motive to keep working. 
      Do not be polite. Be professional but firm. Use a "tough love" tone.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Stay focused. Motivation is key.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Discipline is doing what needs to be done, even if you don't want to do it.";
  }
};

export const getUnlockDeterrent = async (appName: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      The user is trying to unlock/unblock an app named "${appName}" BEFORE their timer is up.
      You need to stop them.
      Write a very short (max 20 words) guilt-tripping or stern message asking if it's really worth breaking their promise to themselves.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Are you sure you want to quit now?";
  } catch (error) {
    console.error("AI Error:", error);
    return "Don't give up on your goals now.";
  }
};