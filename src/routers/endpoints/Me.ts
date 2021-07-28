import { ExtendedRequest } from "../../types";
import { Response } from "express";

export default async function (req: ExtendedRequest, res: Response) {
  await res.json(req.user);
}
