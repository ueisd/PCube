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

    //@todo mettre en place
    /*router.post('/signup', (req, res) => {
    const newUser = new UserImpl({
      email: req.body.email,
      name: req.body.name,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(8))
    });

    newUser.save( (err) => {
      if (err) { res.status(500).json('erreur signup') }
      res.status(200).json('signup ok !');
    })

  });*/
    return router;
  }
}
