import { Router } from "express";
import {
  generaImage,
  generateVariation,
  generateEdit,
} from "@/routes/v1/openAI/controller";

const routerImage = Router();

routerImage.post("/generate-image", generaImage);
routerImage.post("/generate-variation", generateVariation);
routerImage.post("/generate-edit", generateEdit);

export { routerImage };
