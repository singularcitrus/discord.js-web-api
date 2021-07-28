import { Router } from "express";
import AccessToken from "./endpoints/AccessToken";

export default function (id: string, secret: string) {
  const router = Router();

  router.use("/token", AccessToken(id, secret));

  return router;
}
