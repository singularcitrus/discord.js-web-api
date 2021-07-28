import { Router } from "express";
import AccessToken from "./endpoints/AccessToken";
import Authenticated from "../middleware/Authenticated";
import Me from "./endpoints/Me";

export default function (id: string, secret: string) {
  const router = Router();

  router.use("/token", AccessToken(id, secret));

  router.use("/me", Authenticated, Me);

  return router;
}
