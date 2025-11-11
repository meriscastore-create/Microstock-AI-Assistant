import { GoogleGenAI, Type } from "@google/genai";
import type { AspectRatio, JsonPromptStructure } from '../types';

export const generateTitle = async (apiKey: string, keywords: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Based on these keywords: "${keywords}", generate a single, highly descriptive, SEO-friendly title for a microstock photo or vector. The title should be structured to maximize searchability, clearly defining the subject, action, and environment. The total length of the title must not exceed 150 characters. Pay close attention to punctuation, using commas to separate distinct descriptive clauses.

Here are examples of the desired style and structure:
- "New Year 2026 Countdown Luxury Gold Clock with Confetti, Roman Numerals and Digital Year Display"
- "Golden 2026 Year Splash on Marble Background, Exquisite Golden Numbers with Fluid Splash for a Luxurious 2026 Celebration"
- "Glittering 2026 in vibrant blue and orange new year celebration. Happy New Year 2026"

Do not add any extra text, labels, or quotation marks around the generated title. Return only the pure title text.`,
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating title:", error);
        throw new Error("Failed to generate title from AI. Check your API Key and network connection.");
    }
};

const promptSchemaProperties = {
    type: { type: Type.STRING, description: "e.g., stock photo, vector illustration" },
    purpose: { type: Type.STRING, description: "e.g., commercial image designed for microstock platforms" },
    subject_core: { type: Type.STRING, description: "Describe the main subject clearly." },
    subject_details: { type: Type.STRING, description: "Include appearance, clothing, posture, etc." },
    context_environment: { type: Type.STRING, description: "Describe the location and background." },
    lighting_description: { type: Type.STRING, description: "Detail the direction and tone of light." },
    composition_structure: { type: Type.STRING, description: "Arrangement and framing." },
    camera_viewpoint: { type: Type.STRING, description: "Describe the perspective." },
    mood_and_tone: { type: Type.STRING, description: "Emotional tone and energy." },
    color_palette: { type: Type.STRING, description: "Overall tones and visual balance." },
    style_and_approach: { type: Type.STRING, description: "Photographic style." },
    focus_and_depth: { type: Type.STRING, description: "Depth of field behavior." },
    texture_and_material_detail: { type: Type.STRING, description: "Highlight tactile quality." },
    supporting_elements: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List secondary items." },
    interaction_or_action: { type: Type.STRING, description: "Describe any movement or gesture." },
    facial_expression_and_body_language: { type: Type.STRING, description: "Describe emotion and pose." },
    clothing_and_accessory_style: { type: Type.STRING, description: "Describe the outfit." },
    cultural_and_temporal_context: { type: Type.STRING, description: "Add cues like festive lights, summer vibe, etc." },
    spatial_layout: { type: Type.STRING, description: "Define breathing space and balance." },
    negative_space_usage: { type: Type.STRING, description: "Describe areas for copy placement." },
    authenticity_and_postprocessing: { type: Type.STRING, description: "Visual quality description." },
    image_quality_description: { type: Type.STRING, description: "e.g., extremely clear, detailed, and visually balanced." },
    story_intent: { type: Type.STRING, description: "Summarize the concept." },
    keywords_focus: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List relevant SEO keywords from the title." },
    possible_commercial_uses: { type: Type.ARRAY, items: { type: Type.STRING }, description: "e.g., marketing campaign, banner." },
    target_market: { type: Type.STRING, description: "e.g., business, lifestyle, corporate." },
};

// Define only the CORE required properties. This gives the model more flexibility
// and prevents failures if some non-essential fields (like 'facial_expression') aren't applicable.
const requiredProperties = [
    "type",
    "purpose",
    "subject_core",
    "context_environment",
    "lighting_description",
    "composition_structure",
    "camera_viewpoint",
    "mood_and_tone",
    "style_and_approach",
    "image_quality_description",
    "story_intent",
    "keywords_focus",
];

const promptSchema: any = {
    type: Type.OBJECT,
    properties: promptSchemaProperties,
    required: requiredProperties,
};


export const generateJsonPrompt = async (apiKey: string, title: string): Promise<string> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-pro",
            contents: `Based on the following microstock title, generate a detailed JSON prompt for an AI image generator. The resulting image must be strictly photorealistic, suitable for a high-quality stock photo library. Fill out all fields of the provided schema with this photorealistic goal in mind.

Specifically:
- Set 'type' to 'stock photo'.
- Set 'style_and_approach' to a realistic photographic style (e.g., 'realistic lifestyle', 'modern product photography', 'natural editorial').
- Ensure 'authenticity_and_postprocessing' describes a natural, lifelike image with subtle retouching only.
- Emphasize realism, high detail, and professional lighting throughout the entire JSON structure.

For each generation, introduce creative variations in fields like 'camera_viewpoint', 'mood_and_tone', 'color_palette', and 'lighting_description' to inspire diverse image results, while ensuring the 'subject_core' and 'subject_details' remain faithful to the title. Title: "${title}"`,
            config: {
                responseMimeType: "application/json",
                responseSchema: promptSchema,
            },
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error generating JSON prompt:", error);
        throw new Error("Failed to generate JSON prompt from AI. Check your API Key and network connection.");
    }
};

export const generateImages = async (
    apiKey: string,
    prompt: string,
    numberOfImages: number,
    aspectRatio: AspectRatio
): Promise<string[]> => {
    try {
        const ai = new GoogleGenAI({ apiKey });
        const enhancedPrompt = `${prompt}, pure photorealism, lifelike, natural lighting, ultra-high detail, sharp focus, professional photography, no digital artifacts`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: enhancedPrompt,
            config: {
                numberOfImages,
                aspectRatio,
                outputMimeType: 'image/jpeg',
            },
        });

        return response.generatedImages.map(img => `data:image/jpeg;base64,${img.image.imageBytes}`);
    } catch (error) {
        console.error("Error generating images:", error);
        throw new Error("Failed to generate images from AI. Check your API Key and network connection.");
    }
};