import { Response, NextFunction } from "express";
import { ExtendedRequest } from "../types";
import DiscordOAuth2 from "discord-oauth2";

export default async function (
  req: ExtendedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization;

    if (token) {
      req.user = await new DiscordOAuth2().getUser(token);
      next();
    } else {
      // Throw local error to bounce down to "Authentication Failed"
      // noinspection ExceptionCaughtLocallyJS
      throw Error("No Token");
    }
  } catch (err) {
    // If the catch block fires the token is not valid, so we must return a 401 and do nothing else
    return res.status(401).json({
      error: "Authentication Failed",
      message: err.message,
    });
  }
}
