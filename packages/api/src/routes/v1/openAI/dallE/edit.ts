/* eslint-disable @typescript-eslint/no-explicit-any */
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { OpenAI } from "openai";
import { Keys } from "@/keys";

const openai = new OpenAI({
  apiKey: Keys.OpenAI.Key,
});

const resizeImage = async (
  inputPath: string,
  outputPath: string,
  width: number,
  height: number
) => {
  await sharp(inputPath).resize(width, height).toFile(outputPath);
};

const generateImageEdit = async (
  imagePath: string,
  maskPath: string,
  prompt: string
): Promise<any> => {
  try {
    const imageFullPath = path.resolve(imagePath);
    const maskFullPath = path.resolve(maskPath);

    const { width, height } = await sharp(imageFullPath).metadata();

    const resizedMaskPath = path.resolve("resized_mask.png");
    await resizeImage(maskFullPath, resizedMaskPath, width!, height!);

    const response = await openai.images.edit({
      model: "dall-e-2",
      image: fs.createReadStream(imageFullPath),
      mask: fs.createReadStream(resizedMaskPath),
      prompt,
      n: 1,
      size: "1024x1024",
    });

    const imageUrl = response.data[0].url;
    return {
      imageUrl,
    };
  } catch (error) {
    console.error("Error during image edit generation:", error);
    throw new Error(`Image edit generation failed: ${error}`);
  }
};

export { generateImageEdit };
