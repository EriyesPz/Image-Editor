import { NextFunction, Request, Response } from "express";
import { RateLimiterMemory } from "rate-limiter-flexible";

const rateLimiter = new RateLimiterMemory({
  points: 2,
  duration: 1,
});

const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await rateLimiter.consume(req.ip || "unknown-ip");
    next();
  } catch (error) {
    return res.status(500).json({ error: error });
  }
};

export { rateLimiterMiddleware };
