import DiscordOAuth2 from "discord-oauth2";
import { Request, Response } from "express";

export default function (id: string, secret: string) {
  return async function (req: Request, res: Response) {
    try {
      res.status(200).json(
        await new DiscordOAuth2().tokenRequest({
          clientId: id,
          clientSecret: secret,
          code: req.body["code"],
          scope: "identify",
          grantType: "authorization_code",
          redirectUri: req.body["redirect_uri"],
        })
      );
    } catch (e) {
      // If the catch block fires the code is invalid
      return res.status(401).json({
        message: "Authentication Failed",
      });
    }
  };
}
