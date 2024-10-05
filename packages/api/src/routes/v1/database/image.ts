import { Database } from "./services";

class Image {
  private db: Database;

  constructor() {
    this.db = new Database();
  }

  public async getAllRequest() {
    try {
      const query = `SELECT "UUID", "User", "ModelDallE", "ResolutionDallE", "QualityDallE", "NumberOfImages", 
      "Prompt", "Category", "Style", "RequestTime" FROM "Image"."ImageRequests"`;
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      console.log(error);
      throw new Error("Error in getAllRequest: " + error);
    }
  }

  public async getGeneratedImages() {
    try {
      const query = `SELECT "UUID", "RequestID", "RevisedPrompt", "ImageURL", "TokenIn", "TokenOut", 
      "TokenUsed", "GeneratedAt" FROM "Image"."GeneratedImages"`;
      const result = await this.db.query(query);
      return result.rows;
    } catch (error) {
      console.log(error);
      throw new Error("Error in getGeneratedImages: " + error);
    }
  }

  public async insertRequestAndImages(
    user: string | null,
    resolution: string,
    quality: string,
    numberOfImages: number,
    prompt: string,
    category: string,
    style: string,
    requestTime: Date,
    generatedImages: Array<{
      revisedPrompt: string;
      imageUrl: string;
      tokenIn: number;
      tokenOut: number;
      tokenUsed: number;
      generatedAt: Date;
    }>
  ) {
    const client = await this.db.getClient();
    try {
      await this.db.beginTransaction(client);
      const requestQuery = `
        INSERT INTO "Image"."ImageRequests" 
        ("User", "ModelDallE", "ResolutionDallE", "QualityDallE", "NumberOfImages", "Prompt", "Category", "Style", "RequestTime")
        VALUES ($1, 'dall-e-3', $2, $3, $4, $5, $6, $7, $8)
        RETURNING "UUID";
      `;
      const requestValues = [
        user,
        resolution,
        quality,
        numberOfImages,
        prompt,
        category,
        style,
        requestTime,
      ];
      const requestResult = await client.query(requestQuery, requestValues);
      const requestId = requestResult.rows[0].UUID;

      if (generatedImages.length === 0) {
        await this.db.commitTransaction(client);
        return { requestId };
      }

      const imageInsertPromises = generatedImages.map((img) => {
        const imageQuery = `
          INSERT INTO "Image"."GeneratedImages" 
          ("RequestID", "RevisedPrompt", "ImageURL", "TokenIn", "TokenOut", "TokenUsed", "GeneratedAt") 
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `;
        const imageValues = [
          requestId,
          img.revisedPrompt,
          img.imageUrl,
          img.tokenIn,
          img.tokenOut,
          img.tokenUsed,
          img.generatedAt,
        ];
        return client.query(imageQuery, imageValues);
      });

      await Promise.all(imageInsertPromises);

      await this.db.commitTransaction(client);

      return { requestId, imagesGenerated: true };
    } catch (error) {
      if (client) {
        await this.db.rollbackTransaction(client);
      }
      console.log(error);
      throw new Error("Error inserting request and images: " + error);
    } finally {
      if (client) {
        client.release();
      }
    }
  }
}

export { Image };
