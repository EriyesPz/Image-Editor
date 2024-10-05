CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "Image";

CREATE TABLE "Image"."ImageRequests" (
	"UUID" UUID PRIMARY KEY DEFAULT "Image".uuid_generate_v4(),
	"User" VARCHAR(255),
	"ModelDallE" VARCHAR(10),
	"ResolutionDallE" VARCHAR(20),
	"QualityDallE" VARCHAR(10),
	"NumberOfImages" INT,
	"Prompt" TEXT,
	"Category" VARCHAR(255),
	"Style" VARCHAR(255),
	"RequestTime" TIMESTAMP
)

CREATE TABLE "Image"."GeneratedImages" (
	"UUID" UUID PRIMARY KEY DEFAULT "Image".uuid_generate_v4(),
	"RequestID" UUID REFERENCES "Image"."ImageRequests"("UUID"),
	"RevisedPrompt" TEXT,
	"ImageURL" TEXT,
	"TokenIn" NUMERIC,
	"TokenOut" NUMERIC,
	"TokenUsed" NUMERIC,
	"GeneratedAt" TIMESTAMP
)
