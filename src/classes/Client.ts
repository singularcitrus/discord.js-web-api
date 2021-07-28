import Discord, { ClientOptions } from "discord.js";
import express, { Express } from "express";
import { defaultLogger } from "../";

export class Client extends Discord.Client {
  private appOptions: _CompleteOptions;
  public express: Express;

  constructor(discordOptions: ClientOptions, appOptions: AppOptions) {
    super(discordOptions);

    this.appOptions = completeOptions(appOptions);
    this.express = express();

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
      defaultLogger.log(`Express started on port ${this.appOptions.port}`);
    });
  }
}

export interface AppOptions {
  port?: number;
  autoStartup?: boolean;
}

// Internal function to complete all the provided options with their default values
function completeOptions(options: AppOptions): _CompleteOptions {
  return {
    port: options.port ? options.port : 8080,
    autoStartup: !!options.autoStartup,
  };
}

interface _CompleteOptions extends AppOptions {
  port: number;
  autoStartup: boolean;
}
