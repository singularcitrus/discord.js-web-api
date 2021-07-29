import { Request } from "express";

export interface ExtendedRequest extends Request {
  user?: any;
}

export interface AppOptions {
  port?: number;
  autoStartup?: boolean;
  rootPath?: string;
  noAuth?: boolean;
}
