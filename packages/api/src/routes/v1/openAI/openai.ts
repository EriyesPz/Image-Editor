import OpenAI from "openai";
import { Keys } from "@/keys";

const openai = new OpenAI({
  apiKey: Keys.OpenAI.Key,
  organization: Keys.OpenAI.Organization,
  project: Keys.OpenAI.Project,
});

export default openai;
