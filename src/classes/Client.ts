import Discord, { ClientOptions } from "discord.js";
import express, { Express, Router } from "express";
import BodyParser from "body-parser";
import Cors from "cors";
import { defaultLogger } from "../";

export class Client extends Discord.Client {
  private appOptions: _CompleteOptions;
  public express: _extendedExpress;

  constructor(discordOptions: ClientOptions, appOptions: AppOptions) {
    super(discordOptions);

    this.appOptions = completeOptions(appOptions);
    this.express = express();
    this.express.defaultRouter = Router();
    this.express.defaultRouter.all("/lib", (req, res) =>
      res.send("discord.js-web-api")
    );
    this.express.use(this.appOptions.rootPath, this.express.defaultRouter);

    // Load middlewares required
    this.express.use(Cors());
    this.express.use(BodyParser.urlencoded({ extended: false }));
    this.express.use(BodyParser.json());

    // Set up auto startup if required
    if (this.appOptions.autoStartup) {
      this.on("ready", () => {
        // Startup express instance
        this.spawnExpressProcess();
      });
    }
  }

  // A function to start up express
  spawnExpressProcess() {
    this.express.listen(this.appOptions.port, () => {
      defaultLogger.log(
        `Express started on http://localhost:${this.appOptions.port}${this.appOptions.rootPath}`
      );
    });
  }
}

export interface AppOptions {
  port?: number;
  autoStartup?: boolean;
  rootPath?: string;
}

// Internal function to complete all the provided options with their default values
function completeOptions(options: AppOptions): _CompleteOptions {
  return {
    port: options.port ? options.port : 8080,
    autoStartup: !!options.autoStartup,
    rootPath: options.rootPath
      ? `${options.rootPath.startsWith("/") ? "" : "/"}${options.rootPath}`
      : "",
  };
}

interface _CompleteOptions extends AppOptions {
  port: number;
  autoStartup: boolean;
  rootPath: string;
}

interface _extendedExpress extends Express {
  defaultRouter?: Router;
}
