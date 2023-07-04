import {
  green,
  cyan,
  red,
  blue,
  yellow,
} from "https://deno.land/std@0.192.0/fmt/colors.ts";
import { format } from "https://deno.land/std@0.192.0/datetime/mod.ts";
import { Middleware } from "https://deno.land/x/oak@v12.5.0/mod.ts";

type LogLevel = "INFO" | "DEBUG" | "ERROR";

type LoggerOptions = {
  logLevel?: "INFO" | "DEBUG" | "ERROR";
  production?: boolean;
};

class Logger {
  logLevel: LogLevel;
  production: boolean;

  constructor({ logLevel = "INFO", production = false }: LoggerOptions) {
    this.logLevel = logLevel;
    this.production = production;
  }

  private log = (level: string, message: string) => {
    if (!this.shouldLog(level)) return;

    const timestamp = format(new Date(), "yyyy-MM-dd hh:mm:ss");
    switch (level) {
      case "INFO":
        console.log(green(`[INFO] ${timestamp} ${level} - ${message}`));
        break;
      case "DEBUG":
        console.log(cyan(`[DEBUG] ${timestamp} ${level} - ${message}`));
        break;
      case "ERROR":
        console.log(red(`[ERROR] ${timestamp} ${level} - ${message}`));
        break;
      default:
        console.log(yellow(`[WARN] ${timestamp} ${level} - ${message}`));
        break;
    }
  };

  info = (message: string) => {
    this.log("INFO", message);
  };

  debug = (message: string) => {
    this.log("DEBUG", message);
  };

  error = (message: string) => {
    this.log("ERROR", message);
  };

  warn = (message: string) => {
    this.log("WARN", message);
  };

  private getLevel = (logLevel: string): number => {
    switch (logLevel) {
      case "INFO":
        return 0;
      case "DEBUG":
        return 1;
      case "ERROR":
        return 2;
      default:
        return 3;
    }
  };

  private shouldLog = (level: string): boolean => {
    const logLevel = this.getLevel(this.logLevel);
    const currentLogLevel = this.getLevel(level);

    return logLevel >= currentLogLevel;
  };

  middleware: Middleware = async (ctx, next) => {
    const { method, url } = ctx.request;

    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    const { status } = ctx.response;

    console.log(
      `${blue(url.pathname)} - ${yellow(method)} - ${cyan(
        status.toString()
      )} - ${red(`${ms}ms`)}`
    );
  };
}
const production = Deno.env.get("PRODUCTION") === "true";
const logger = new Logger({ logLevel: "INFO", production });

export default logger;
