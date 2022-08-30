"use strict";
import jwt = require("jsonwebtoken");

export class JwtHelper {
  public static async tryExtractUserIdFromToken(token, rsaPublicKey) {
    let id;
    await jwt.verify(token, rsaPublicKey, (err, decoded) => {
      if (err) {
        throw new Error("Mauvais token");
      }
      id = decoded.sub;
    });

    if (!id) {
      throw new Error("Pas d'id dans le token");
    }

    return id;
  }
}
