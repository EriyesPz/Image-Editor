/* eslint-disable @typescript-eslint/no-explicit-any */
import { OpenAI } from "openai";
import { Keys } from "@/keys";
import fs from "fs";

const openai = new OpenAI({
  apiKey: Keys.OpenAI.Key,
});

const generateImageVariation = async (imagePath: string): Promise<any> => {
  try {
    const response = await openai.images.createVariation({
      model: "dall-e-2",
      image: fs.createReadStream(imagePath),
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    return {
      imageUrl,
    };
  } catch (error) {
    console.error("Error during image variation generation:", error);
    throw new Error(`Image variation generation failed: ${error}`);
  }
};

export { generateImageVariation };
