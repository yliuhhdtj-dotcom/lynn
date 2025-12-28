
import { GoogleGenAI, Type } from "@google/genai";
import { ArchitectureInfo } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeArchitecture = async (base64Image: string): Promise<ArchitectureInfo> => {
  const model = 'gemini-3-flash-preview';

  const systemInstruction = `
    You are an expert architectural historian, urban planner, and architecture critic.
    Your task is to identify the building or urban scene in the provided image.
    Provide highly accurate and professional information.
    If the image is not a building or urban scene, return an error-like structure or the most likely architectural context.
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image.split(',')[1],
          },
        },
        {
          text: "Identify this location and provide details in the specified JSON format."
        }
      ]
    },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          locationName: { type: Type.STRING, description: "Name of the building or site" },
          country: { type: Type.STRING },
          city: { type: Type.STRING },
          designer: { type: Type.STRING, description: "Architect, landscape architect, urban designer, or firm" },
          constructionYear: { type: Type.STRING },
          area: { type: Type.STRING, description: "Relevant area, GFA, or plot size" },
          function: { type: Type.STRING, description: "Current and/or original use" },
          designPhilosophy: { type: Type.STRING, description: "The core design logic or conceptual idea" },
          background: { type: Type.STRING, description: "Historical and construction context" },
          interestingFacts: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: [
          "locationName", "country", "city", "designer", 
          "constructionYear", "area", "function", 
          "designPhilosophy", "background", "interestingFacts"
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("No response received from the model.");
  }

  return JSON.parse(response.text) as ArchitectureInfo;
};
