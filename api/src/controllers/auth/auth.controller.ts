import UserDatabaseGateway from "../../entitiesFamilies/User/databaseGateway/UserDatabaseGateway";

var nconf = require("nconf");
const jwt = require("jsonwebtoken");

//models
import * as bcrypt from "bcrypt";
import User from "../../entitiesFamilies/User/entities/User";

export default class SigningController {
  private static userDatabaseGateway: UserDatabaseGateway;

  public static injectDependencies(userDatabaseGateway: UserDatabaseGateway) {
    SigningController.userDatabaseGateway = userDatabaseGateway;
  }

  public static async signingLocal(req, res) {
    let userDb = SigningController.userDatabaseGateway;

    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
      return res.status(401).json("signin fail !");
    }

    const user: User = await userDb.findUserByEmail(email);
    if (!user) {
      return res.status(401).json("signin fail !");
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).json("signin fail !");
    }

    delete user.password;
    // delete user.RoleId;

    let rsa_key_private = nconf.get("rsaKeyPrivate");
    let timeRefresh = nconf.get("jwt_refresh_token_expires");
    const signingToken = jwtSignId(user.id, rsa_key_private, timeRefresh);

    return res.status(200).json({
      user: user,
      token: signingToken,
    });
  }

  public static async refreshToken(req, res, next) {
    let userDb = SigningController.userDatabaseGateway;

    let rsaPrivateKey = nconf.get("rsaKeyPrivate");
    let rsaPublicKey = nconf.get("rsaKeyPublic");

    const token = req.headers.authorization;
    if (!token) {
      return res.status(403).json("no token to refresh !");
    }

    return await jwt.verify(token, rsaPublicKey, async (err, decoded) => {
      if (err) {
        return res.status(403).json("wrong token");
      }
      const newToken = jwt.sign({}, rsaPrivateKey, {
        algorithm: "RS256",
        expiresIn: nconf.get("jwt_refresh_token_expires"),
        subject: decoded.sub,
      });
      const user: User = await userDb.findUserById(decoded.sub);
      if (!user) {
        return res.status(403).json("no token to refresh !");
      }
      delete user.password;
      // delete user.RoleId;

      return res.status(200).json({
        user: user,
        token: newToken,
      });
    });
  }
}
