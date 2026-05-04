/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";
import { SlideContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateSlidesFromText(text: string, title?: string): Promise<SlideContent[]> {
  const prompt = `
    Based on the following extracted text from a PDF, create a structured PowerPoint presentation.
    The presentation should have a logical flow:
    1. A Title Slide (layout: 'title')
    2. Section Header Slides for major parts (layout: 'section')
    3. Content Slides with bullet points (layout: 'content')
    4. Optional: Two-column slides for comparisons (layout: 'twoColumn')
    
    Current Document Title: ${title || 'Untitled Document'}
    
    Extracted Text:
    ${text.substring(0, 30000)} // Truncate to avoid token limits, but 30k is usually enough for a few pages.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            bullets: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            notes: { type: Type.STRING },
            layout: { 
              type: Type.STRING,
              enum: ['title', 'content', 'section', 'twoColumn']
            }
          },
          required: ["title", "bullets", "layout"]
        }
      }
    }
  });

  try {
    const jsonStr = response.text.trim();
    return JSON.parse(jsonStr) as SlideContent[];
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Failed to generate slides. Please try again.");
  }
}
