import Discord, { ClientOptions } from "discord.js";
import express, { Express, Router } from "express";
import BodyParser from "body-parser";
import Cors from "cors";
import { defaultLogger } from "../";
import auth from "../routers/auth";

export class Client extends Discord.Client {
  private appOptions: _CompleteOptions;
  private credentials: _Credentials;
  public express: _extendedExpress;

  constructor(
    discordOptions: ClientOptions,
    credentials: _Credentials,
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
    this.express.defaultRouter = Router();
    this.express.use(this.appOptions.rootPath, this.express.defaultRouter);

    // Load middlewares required
    this.express.use(Cors());
    this.express.use(BodyParser.urlencoded({ extended: false }));
    this.express.use(BodyParser.json());

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

interface _Credentials {
  id: string;
  secret: string;
}
