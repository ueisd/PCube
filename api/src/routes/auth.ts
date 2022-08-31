import * as express from "express";

const router = express.Router();
const {
  googleAuth,
  generateOAuth2UserToken,
  googleAuthCb,
} = require("../controllers/auth/auth.google.controller");

export default class AuthController {
  public static initRouters() {
    // auth google
    router.get("/google", googleAuth);
    router.get("/google/cb", googleAuthCb, generateOAuth2UserToken);

    return router;
  }
}
