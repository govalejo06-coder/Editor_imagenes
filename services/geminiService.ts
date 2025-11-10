
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const editImageWithPrompt = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return null;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
};

export const summarizeChanges = async (prompt: string): Promise<string> => {
  try {
    const fullPrompt = `Basado en el siguiente prompt de usuario para editar una imagen, resume el cambio solicitado en una frase corta y en lenguaje natural en español. Responde solo con el resumen. Prompt del usuario: "${prompt}"`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error summarizing changes with Gemini:", error);
    return "No se pudo generar un resumen del cambio.";
  }
};
