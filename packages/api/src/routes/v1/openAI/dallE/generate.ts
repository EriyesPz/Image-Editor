/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAI } from "openai";
import { Keys } from "@/keys";
import { logger } from "@/logger";

const openai = new OpenAI({
  apiKey: Keys.OpenAI.Key,
});

export const generateImage = async (
  prompt: string,
  category: string,
  style: string,
  size: "1024x1024" | "1024x1792" | "1792x1024" = "1024x1024",
  n: number = 1 || 2 || 3 || 4 || 5,
  quality: "standard" | "hd" = "standard",
  response_format: "b64_json" | "url" = "url",
  user?: string
): Promise<any> => {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}, category: ${category}, style: ${style}`,
      size,
      n,
      response_format,
      quality,
      user: user,
    });

    const currentTimestamp = Math.floor(Date.now() / 1000);
    const readableDate = new Date(currentTimestamp * 1000).toLocaleString();

    const metadata = {
      model: "dall-e-3",
      prompt,
      category,
      style,
      size,
      n,
      response_format,
      quality,
      created: readableDate,
      user: user,
    };

    if (n === 1 && Array.isArray(response.data) && response.data[0]) {
      const imageData = response.data[0];
      return {
        ...metadata,
        revised_prompt: imageData.revised_prompt || "N/A",
        imageUrl: imageData.url || "",
      };
    }

    return {
      ...metadata,
      images: response.data.map((img: any) => ({
        revised_prompt: img.revised_prompt || "N/A",
        url: img.url || "",
      })),
    };
  } catch (error) {
    logger.error("Error during image generation:", error);
    throw new Error(`Image generation failed: ${error}`);
  }
};
