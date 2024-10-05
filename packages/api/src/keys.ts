import { config } from "dotenv";
import { resolve } from "path";

const EnvFilePath = resolve(process.cwd(), ".env");

config({ path: EnvFilePath });

function getEnvVar(name: string, fallback?: string): string {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is not set.`);
  }

  return value;
}

const Keys = {
  OpenAI: {
    Key: getEnvVar("OPENAI_KEY"),
    Organization: getEnvVar("OPENAI_ORG"),
    Project: getEnvVar("OPENAI_PROJECT"),
    ImageAssistantId: getEnvVar("OPENAI_ASSISTANT_IMAGE"),
  },
  VectorizerAI: {
    User: getEnvVar("VECTORIZER_API_USER"),
    Password: getEnvVar("VECTORIZER_API_PASS"),
  },
  Database: {
    Host: getEnvVar("DB_HOST"),
    User: getEnvVar("DB_USER"),
    Password: getEnvVar("DB_PASSWORD"),
    Name: getEnvVar("DB_NAME"),
    Port: getEnvVar("DB_PORT"),
  },
  Gmail: {
    Gmail_User: getEnvVar("GMAIL_USER"),
    Gmail_Password: getEnvVar("GMAIL_PASSWORD"),
  },
  PORT: getEnvVar("PORT"),
} as const;

export { Keys };
