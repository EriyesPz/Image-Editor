/* eslint-disable @typescript-eslint/no-explicit-any */
import openai from "./openai";
import { Keys } from "@/keys";
import { generateImage } from "./dallE/generate";
import { logger } from "@/logger";

async function sendMessage(
  userPrompt: string,
  userCategory: string,
  userStyle: string,
  resolution: "1024x1024" | "1024x1792" | "1792x1024",
  n: number,
  quality: "standard" | "hd",
  user?: string
) {
  const assistant = await openai.beta.assistants.retrieve(
    Keys.OpenAI.ImageAssistantId
  );

  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: "user",
    content: userPrompt,
  });

  const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
    assistant_id: assistant.id,
  });

  const messages = await openai.beta.threads.messages.list(thread.id);
  const response = messages.data[0].content[0];

  const usage = run.usage;

  const tokenUsed = usage?.total_tokens;
  const tokenIn = usage?.prompt_tokens;
  const tokenOut = usage?.completion_tokens;

  logger.info(response);

  if (response.type === "text") {
    const revisedPrompt = response.text.value;

    if (n === 1) {
      const imageResponse = await generateImage(
        revisedPrompt,
        userCategory,
        userStyle,
        resolution,
        1,
        quality,
        "url",
        user
      );

      return {
        ...imageResponse,
        tokens_used: tokenUsed,
        tokens_in: tokenIn,
        token_out: tokenOut,
      };
    }

    const imagePromises = Array(n)
      .fill(null)
      .map(() =>
        generateImage(
          revisedPrompt,
          userCategory,
          userStyle,
          resolution,
          1,
          quality,
          "url",
          user
        )
      );

    const imageResponses = await Promise.all(imagePromises);

    return {
      images: imageResponses.map((imageResponse) => ({
        revisedPrompt: imageResponse.revised_prompt,
        imageUrl: imageResponse.imageUrl,
        tokens_used: tokenUsed,
        tokens_in: tokenIn,
        token_out: tokenOut,
        generatedAt: new Date().toISOString(),
      })),
    };
  }

  throw new Error("Failed to generate image or invalid input.");
}

export { sendMessage };
