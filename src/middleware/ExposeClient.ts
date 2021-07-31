import { Client } from "../classes/Client";
import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../types";

export default function (client: Client) {
  return function (req: ExtendedRequest, res: Response, next: NextFunction) {
    req.client = client;
    next();
  };
}
