import { ExtendedRequest } from "../../types";
import { Response } from "express";
import DiscordOAuth2 from "discord-oauth2";

export default function (id: string, secret: string) {
  return async function (req: ExtendedRequest, res: Response) {
    try {
      const credentials = Buffer.from(`${id}:${secret}`).toString("base64");
      await new DiscordOAuth2().revokeToken(req.user.token, credentials);

      res.status(200).json({});
    } catch (e) {
      res.status(200).json({});
    }
  };
}
