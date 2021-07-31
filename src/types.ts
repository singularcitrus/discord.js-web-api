import { Express, Request, Router } from "express";
import { Client } from "./classes/Client";

export interface ExtendedRequest extends Request {
  user?: any;
  client?: Client;
}

export interface AppOptions {
  port?: number;
  autoStartup?: boolean;
  rootPath?: string;
  noAuth?: boolean;
  middleware?: any[];
}

export interface ExtendedExpress extends Express {
  defaultRouter?: Router;
}

export interface OAuthCredentials {
  id: string;
  secret: string;
}
