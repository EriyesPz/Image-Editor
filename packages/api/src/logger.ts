import * as winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

// Transport for error logs
const errorTransport = new DailyRotateFile({
  filename: "./logs/error-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  level: "error",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "7d",
});

// Transport for general logs
const generalTransport = new DailyRotateFile({
  filename: "./logs/general-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "7d",
});

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.json()
  ),
  transports: [errorTransport, generalTransport],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

export { logger };
