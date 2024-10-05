/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { sendMessage } from "./assistant";
import { rateLimiterMiddleware } from "@/routes/v1/middlewares/rateLimiter";
import { Image } from "@/routes/v1/database/image";
import { logger } from "@/logger";
import { generateImageVariation } from "@/routes/v1/openAI/dallE/variation";
import { generateImageEdit } from "@/routes/v1/openAI/dallE/edit";

export const generaImage = [
  rateLimiterMiddleware,
  async (req: Request, res: Response) => {
    const { prompt, category, style, resolution, n, quality, user } = req.body;
    const imageService = new Image();
    try {
      if (!prompt || !category || !style) {
        return res
          .status(400)
          .json({ error: "Prompt, category, and style are required." });
      }

      const imageResolution = resolution || "1024x1024";
      const imageQuality = quality || "hd";
      const numberOfImages = n || 1;

      const requestTime = new Date();
      const imageResponse = await sendMessage(
        prompt,
        category,
        style,
        imageResolution,
        numberOfImages,
        imageQuality,
        user
      );

      logger.info("Image Response:", imageResponse);

      let generatedImages;
      if (imageResponse.imageUrl) {
        generatedImages = [
          {
            revisedPrompt: imageResponse.revised_prompt,
            imageUrl: imageResponse.imageUrl,
            tokenIn: imageResponse.tokens_in,
            tokenOut: imageResponse.token_out,
            tokenUsed: imageResponse.tokens_used,
            generatedAt: new Date(),
          },
        ];
      } else if (imageResponse.images && Array.isArray(imageResponse.images)) {
        generatedImages = imageResponse.images.map((img: any) => ({
          revisedPrompt: img.revised_prompt,
          imageUrl: img.imageUrl,
          tokenIn: img.tokens_in,
          tokenOut: img.token_out,
          tokenUsed: img.tokens_used,
          generatedAt: new Date(),
        }));
      } else {
        throw new Error("No images generated.");
      }

      const result = await imageService.insertRequestAndImages(
        user,
        imageResolution,
        imageQuality,
        numberOfImages,
        prompt,
        category,
        style,
        requestTime,
        generatedImages
      );

      return res
        .status(200)
        .json({ requestId: result.requestId, images: generatedImages });
    } catch (error) {
      logger.error("Error while generating image:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      return res.status(500).json({ error: errorMessage });
    }
  },
];

export const generateVariation = [
  rateLimiterMiddleware,
  (req: Request, res: Response) => {
    const { imagePath } = req.body;
    if (!imagePath) {
      return res.status(400).json({ error: "Image path is required." });
    }

    generateImageVariation(imagePath)
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        logger.error("Error while generating image variation:", error);
        return res
          .status(500)
          .json({ error: "Failed to generate image variation." });
      });
  },
];

export const generateEdit = [
  rateLimiterMiddleware,
  (req: Request, res: Response) => {
    const { imagePath, maskPath, prompt } = req.body;
    if (!imagePath || !maskPath || !prompt) {
      return res
        .status(400)
        .json({ error: "Image path, mask path, and prompt are required." });
    }

    generateImageEdit(imagePath, maskPath, prompt)
      .then((response) => {
        return res.status(200).json(response);
      })
      .catch((error) => {
        logger.error("Error while generating image edit:", error);
        return res
          .status(500)
          .json({ error: "Failed to generate image edit." });
      });
  },
];
