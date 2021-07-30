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

    // Create default router
    this.express.defaultRouter = Router();
    // Add default router to express
    this.express.use(this.appOptions.rootPath, this.express.defaultRouter);

    // Load default routes
    this._defaultRoutes();

    // Proceed to lock users from modifying default express router
    this._lockExpress();

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

  private _lockExpress() {
    // @ts-ignore
    this.express.all = _expressLocked;
    // @ts-ignore
    this.express.use = _expressLocked;
    // @ts-ignore
    this.express.get = _expressLocked;
    // @ts-ignore
    this.express.post = _expressLocked;
    // @ts-ignore
    this.express.put = _expressLocked;
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

function _expressLocked(): void {
  throw Error(
    "Trying to modify root express router use `express.defaultRouter` instead"
  );
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
  };
}

interface _CompleteOptions extends AppOptions {
  port: number;
  autoStartup: boolean;
  rootPath: string;
  noAuth: boolean;
}
