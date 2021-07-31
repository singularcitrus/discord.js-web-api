import Discord, { ClientOptions } from "discord.js";
import express, { Router } from "express";
import BodyParser from "body-parser";
import Cors from "cors";
import {
  AppOptions,
  defaultLogger,
  ExtendedExpress,
  OAuthCredentials,
} from "../";
import auth from "../routers/auth";
import ExposeClient from "../middleware/ExposeClient";

export class Client extends Discord.Client {
  private appOptions: _CompleteOptions;
  private credentials: OAuthCredentials;
  public express: ExtendedExpress;

  constructor(
    discordOptions: ClientOptions,
    credentials: OAuthCredentials,
    appOptions: AppOptions
  ) {
    super(discordOptions);

    // Make sure credentials are set
    if (!credentials) {
      throw Error("Credentials is undefined");
    }
    if (!credentials.id) {
      throw Error("ID is undefined");
    }
    if (!credentials.secret) {
      throw Error("Client Secret is undefined");
    }
    this.credentials = credentials;

    this.appOptions = completeOptions(appOptions);
    this.express = express();

    // Load middlewares required
    this.express.use(Cors());
    this.express.use(BodyParser.urlencoded({ extended: false }));
    this.express.use(BodyParser.json());
    this.express.use(ExposeClient(this));

    // Create default router
    this.express.defaultRouter = Router();
    // Add default router to express
    this.express.use(this.appOptions.rootPath, this.express.defaultRouter);

    this.appOptions.middleware.forEach((handler: any) => {
      this.express.use(handler);
    });

    // Load default routes
    this._defaultRoutes();

    // Set up auto startup if required
    if (this.appOptions.autoStartup) {
      this.on("ready", () => {
        // Startup express instance
        this.spawnExpressProcess();
      });
    }
  }

  private _defaultRoutes() {
    this.express.defaultRouter?.all("/lib", (req, res) =>
      res.send("discord.js-web-api")
    );

    if (!this.appOptions.noAuth) {
      this.express.defaultRouter?.use(
        "/auth",
        auth(this.credentials.id, this.credentials.secret)
      );
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

// Internal function to complete all the provided options with their default values
function completeOptions(options: AppOptions): _CompleteOptions {
  return {
    port: options.port ? options.port : 8080,
    autoStartup: !!options.autoStartup,
    rootPath: options.rootPath
      ? `${options.rootPath.startsWith("/") ? "" : "/"}${options.rootPath}`
      : "",
    noAuth: !!options.noAuth,
    middleware: options.middleware || [],
  };
}

interface _CompleteOptions extends AppOptions {
  port: number;
  autoStartup: boolean;
  rootPath: string;
  noAuth: boolean;
  middleware: any[];
}
