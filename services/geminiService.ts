import { GoogleGenAI } from "@google/genai";
import { StudySpot } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getGeminiRecommendation = async (
  query: string,
  availableSpots: StudySpot[]
): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please check your configuration.";
  }

  const spotsContext = JSON.stringify(
    availableSpots.map((s) => ({
      name: s.name,
      type: s.type,
      noise: s.noiseLevel,
      crowd: s.crowdLevel,
      features: [
        s.hasFood ? "food" : "",
        s.hasOutlets ? "power outlets" : "",
        s.hasWifi ? "wifi" : "",
      ].filter(Boolean),
      rating: s.rating,
      location: s.location,
    }))
  );

  const systemInstruction = `
    You are CampusBot, a helpful assistant for university students looking for study spots.
    You have access to a list of study spots on campus (provided in JSON).
    
    Your goal is to recommend the best spot based on the user's natural language query.
    
    Rules:
    1. Only recommend spots from the provided list.
    2. Be concise and friendly.
    3. Explain WHY you recommended a spot (e.g., "because you asked for coffee...").
    4. If no spot perfectly matches, suggest the closest alternative.
    5. Format the response as a short paragraph.
    
    Data: ${spotsContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: query,
      config: {
        systemInstruction: systemInstruction,
      },
    });

    return response.text || "I couldn't find a recommendation at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble connecting to the campus network right now. Please try again later.";
  }
};
