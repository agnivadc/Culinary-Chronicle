
import { GoogleGenAI, Type } from "@google/genai";
import { FoodData } from "../types";

// Initialize the Gemini API client exactly as specified in the guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const foodSchema = {
  type: Type.OBJECT,
  properties: {
    foodName: { type: Type.STRING },
    origin: {
      type: Type.OBJECT,
      properties: {
        location: { type: Type.STRING },
        era: { type: Type.STRING },
        coordinates: {
          type: Type.OBJECT,
          properties: {
            lat: { type: Type.NUMBER },
            lng: { type: Type.NUMBER }
          },
          required: ["lat", "lng"]
        },
        summary: { type: Type.STRING }
      },
      required: ["location", "era", "coordinates", "summary"]
    },
    evolutionSteps: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          year: { type: Type.STRING },
          location: { type: Type.STRING },
          event: { type: Type.STRING },
          description: { type: Type.STRING },
          coordinates: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER }
            },
            required: ["lat", "lng"]
          }
        },
        required: ["year", "location", "event", "description", "coordinates"]
      }
    },
    consumptionHubs: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          country: { type: Type.STRING },
          percentage: { type: Type.NUMBER },
          coordinates: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER }
            },
            required: ["lat", "lng"]
          }
        },
        required: ["country", "percentage", "coordinates"]
      }
    },
    ingredientEvolution: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          modern: { type: Type.STRING },
          reason: { type: Type.STRING }
        },
        required: ["original", "modern", "reason"]
      }
    },
    flavorProfile: {
      type: Type.OBJECT,
      properties: {
        sweet: { type: Type.NUMBER },
        savory: { type: Type.NUMBER },
        spicy: { type: Type.NUMBER },
        sour: { type: Type.NUMBER },
        bitter: { type: Type.NUMBER }
      },
      required: ["sweet", "savory", "spicy", "sour", "bitter"]
    },
    culturalSignificance: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          region: { type: Type.STRING },
          meaning: { type: Type.STRING },
          tradition: { type: Type.STRING }
        },
        required: ["region", "meaning", "tradition"]
      }
    },
    regionalVariations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          region: { type: Type.STRING },
          keyDifference: { type: Type.STRING },
          popularity: { type: Type.STRING }
        },
        required: ["name", "region", "keyDifference", "popularity"]
      }
    }
  },
  required: ["foodName", "origin", "evolutionSteps", "consumptionHubs", "ingredientEvolution", "flavorProfile", "culturalSignificance", "regionalVariations"]
};

export async function fetchFoodHistory(query: string): Promise<FoodData> {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the detailed historical evolution, global impact, and cultural significance of: "${query}". 
    Provide coordinates for all geographical locations mentioned. 
    Detail how the dish is perceived culturally in its origin regions.
    Research and present 3-5 notable modern adaptations or fusion variations found in different parts of the world.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: foodSchema as any,
    },
  });

  // Correctly access the .text property and trim for parsing
  const text = response.text?.trim();
  if (!text) throw new Error("No data received from AI");
  
  return JSON.parse(text) as FoodData;
}
